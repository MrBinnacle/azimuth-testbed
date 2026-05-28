import { describe, it, expect } from 'vitest'
import { runAzimuth, buildSystemPrompt, RUNTIME_HARNESS_SUFFIX, TOOLS } from './azimuth-engine.js'

const bundle = {
  version: 'v-test',
  files: {
    'SKILL.md': '# AZIMUTH\nSystem prompt body.',
    'references/module-guide.md': 'MODULE GUIDE CONTENT',
    'references/output-template.md': 'OUTPUT TEMPLATE CONTENT',
  },
}

// Build a fake Anthropic endpoint from a queue of scripted responses. Each
// queued item is the JSON body the API would return; the mock records every
// request body it received.
function mockFetch(responses) {
  const calls = []
  const fn = async (_url, opts) => {
    calls.push(JSON.parse(opts.body))
    const next = responses.shift()
    return {
      ok: next.ok !== false,
      status: next.status || 200,
      json: async () => next.body,
    }
  }
  fn.calls = calls
  return fn
}

const textResponse = text => ({ body: { stop_reason: 'end_turn', content: [{ type: 'text', text }] } })
const toolResponse = (name, input, id = 'tu_1') => ({
  body: { stop_reason: 'tool_use', content: [{ type: 'tool_use', id, name, input }] },
})

describe('buildSystemPrompt', () => {
  it('appends the runtime harness to SKILL.md', () => {
    const sys = buildSystemPrompt(bundle)
    expect(sys.startsWith('# AZIMUTH')).toBe(true)
    expect(sys.endsWith(RUNTIME_HARNESS_SUFFIX)).toBe(true)
  })
  it('throws if SKILL.md is missing', () => {
    expect(() => buildSystemPrompt({ files: {} })).toThrow(/SKILL\.md/)
  })
})

describe('runAzimuth — single turn', () => {
  it('returns the model text when no tools are called', async () => {
    const fetchImpl = mockFetch([textResponse('Verdict: REJECT')])
    const r = await runAzimuth({ apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl })
    expect(r.output).toBe('Verdict: REJECT')
    expect(r.iterations).toBe(1)
    expect(r.toolCalls).toEqual([])
    expect(r.stoppedReason).toBe('end_turn')
  })

  it('sends SKILL.md as system, the prompt as the first message, and both tools', async () => {
    const fetchImpl = mockFetch([textResponse('done')])
    await runAzimuth({ apiKey: 'k', model: 'claude-x', prompt: 'hello', skillBundle: bundle, fetchImpl })
    const body = fetchImpl.calls[0]
    expect(body.model).toBe('claude-x')
    expect(body.system[0].text.startsWith('# AZIMUTH')).toBe(true)
    expect(body.tools.map(t => t.name)).toEqual(TOOLS.map(t => t.name))
    // first message carries the prompt (string is converted to a text block by caching)
    const firstUser = body.messages[0]
    const promptText = typeof firstUser.content === 'string' ? firstUser.content : firstUser.content[0].text
    expect(promptText).toBe('hello')
  })
})

describe('runAzimuth — file-loading loop', () => {
  it('resolves read_file against the bundle and feeds it back, then completes', async () => {
    const fetchImpl = mockFetch([
      toolResponse('read_file', { path: 'references/module-guide.md' }),
      textResponse('Verdict: REJECT\nConfidence: High'),
    ])
    const progress = []
    const r = await runAzimuth({
      apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl,
      onProgress: e => progress.push(e),
    })
    expect(r.iterations).toBe(2)
    expect(r.toolCalls).toEqual(['references/module-guide.md'])
    expect(r.output).toContain('REJECT')
    // the second request must contain the file content as a tool_result
    const secondBody = fetchImpl.calls[1]
    const toolResultMsg = secondBody.messages.find(
      m => Array.isArray(m.content) && m.content.some(b => b.type === 'tool_result'),
    )
    const tr = toolResultMsg.content.find(b => b.type === 'tool_result')
    expect(tr.content).toBe('MODULE GUIDE CONTENT')
    expect(tr.tool_use_id).toBe('tu_1')
    expect(progress.some(e => e.type === 'tool' && e.path === 'references/module-guide.md')).toBe(true)
  })

  it('normalizes leading ./ and / in paths', async () => {
    const fetchImpl = mockFetch([
      toolResponse('read_file', { path: '/references/output-template.md' }),
      textResponse('ok'),
    ])
    const r = await runAzimuth({ apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl })
    expect(r.toolCalls).toEqual(['references/output-template.md'])
    const tr = fetchImpl.calls[1].messages.at(-1).content.find(b => b.type === 'tool_result')
    expect(tr.content).toBe('OUTPUT TEMPLATE CONTENT')
  })

  it('returns a not-found error (not a throw) for an unknown path', async () => {
    const fetchImpl = mockFetch([
      toolResponse('read_file', { path: 'references/nope.md' }),
      textResponse('handled'),
    ])
    const r = await runAzimuth({ apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl })
    const tr = fetchImpl.calls[1].messages.at(-1).content.find(b => b.type === 'tool_result')
    expect(tr.content).toContain('ERROR: file not found: references/nope.md')
    expect(tr.content).toContain('Available files:')
    expect(r.output).toBe('handled')
  })

  it('list_files returns the sorted path list', async () => {
    const fetchImpl = mockFetch([toolResponse('list_files', {}), textResponse('ok')])
    await runAzimuth({ apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl })
    const tr = fetchImpl.calls[1].messages.at(-1).content.find(b => b.type === 'tool_result')
    expect(tr.content).toBe(Object.keys(bundle.files).sort().join('\n'))
  })
})

describe('runAzimuth — caching breakpoints', () => {
  it('keeps system cached and exactly one rolling message breakpoint', async () => {
    const fetchImpl = mockFetch([
      toolResponse('read_file', { path: 'references/module-guide.md' }),
      toolResponse('read_file', { path: 'references/output-template.md' }, 'tu_2'),
      textResponse('done'),
    ])
    await runAzimuth({ apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl })
    // last request: system has a breakpoint, last tool has one, and the message
    // history carries no more than one cache_control marker.
    const last = fetchImpl.calls.at(-1)
    expect(last.system[0].cache_control).toEqual({ type: 'ephemeral' })
    expect(last.tools.at(-1).cache_control).toEqual({ type: 'ephemeral' })
    const msgBreakpoints = last.messages.flatMap(m =>
      Array.isArray(m.content) ? m.content.filter(b => b && b.cache_control) : [],
    )
    expect(msgBreakpoints.length).toBe(1)
  })
})

describe('runAzimuth — limits and errors', () => {
  it('stops at the iteration cap if the model never finishes', async () => {
    const loop = Array.from({ length: 5 }, (_, i) => toolResponse('read_file', { path: 'references/module-guide.md' }, `tu_${i}`))
    const fetchImpl = mockFetch(loop)
    const r = await runAzimuth({
      apiKey: 'k', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl, maxIterations: 3,
    })
    expect(r.iterations).toBe(3)
    expect(r.stoppedReason).toBe('max_iterations')
  })

  it('throws with the API error message on a non-ok response', async () => {
    const fetchImpl = mockFetch([{ ok: false, status: 401, body: { error: { message: 'invalid x-api-key' } } }])
    await expect(
      runAzimuth({ apiKey: 'bad', model: 'm', prompt: 'p', skillBundle: bundle, fetchImpl }),
    ).rejects.toThrow('invalid x-api-key')
  })
})
