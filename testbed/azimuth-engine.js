// AZIMUTH run engine — an agentic file-loading loop that reproduces how the
// skill runs inside Claude Code: SKILL.md is the system prompt, and the
// reference / diagnostics / domain-policy files it instructs the model to load
// are served on demand through a read_file tool backed by the vendored
// skill-bundle.json. The model itself picks the mode and loads exactly the
// files that mode requires — so a browser run is 1:1 with a real skill run.
//
// Pure JS (no React, no DOM) so the app and the generation script share one
// code path. Works with global fetch in both the browser and Node 18+.

const API_URL = 'https://api.anthropic.com/v1/messages'

export const RUNTIME_HARNESS_SUFFIX = `

---

# Runtime harness

You are running as a standalone skill via a direct API call. The reference,
diagnostics, and domain-policy files this skill instructs you to load are NOT
included in this prompt — they are available through tools:

- \`read_file(path)\` — returns the full contents of a skill file. Use the exact
  relative paths named above (e.g. \`references/module-guide.md\`,
  \`references/mode-behaviors.md\`, \`references/output-template.md\`,
  \`diagnostics/incentive-conflicts.md\`, \`domain-policies/product-launch-azimuth.md\`).
- \`list_files()\` — lists every skill file available to read_file.

Follow the Reference Loading rules above exactly: before producing analysis,
load the files your selected mode requires (plus any conditional diagnostics
that fire) via \`read_file\`. Then output your analysis as normal text. Do not
describe the files you would load — actually load them.`

export const TOOLS = [
  {
    name: 'read_file',
    description:
      "Read a file from the AZIMUTH skill directory by relative path (e.g. 'references/module-guide.md'). Returns the file's full text, or an error listing the available files if the path is not found.",
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: "Relative path of the skill file, e.g. 'references/output-template.md'.",
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_files',
    description: 'List every AZIMUTH skill file (relative paths) that read_file can load.',
    input_schema: { type: 'object', properties: {} },
  },
]

export function buildSystemPrompt(skillBundle) {
  const skillMd = skillBundle?.files?.['SKILL.md']
  if (!skillMd) throw new Error('skill bundle missing SKILL.md')
  return skillMd + RUNTIME_HARNESS_SUFFIX
}

function normalizePath(p) {
  return String(p ?? '').trim().replace(/^\.?\//, '')
}

function resolveTool(name, input, skillBundle) {
  const files = skillBundle.files
  if (name === 'list_files') {
    return Object.keys(files).sort().join('\n')
  }
  if (name === 'read_file') {
    const path = normalizePath(input?.path)
    if (Object.prototype.hasOwnProperty.call(files, path)) return files[path]
    return `ERROR: file not found: ${path}\nAvailable files:\n${Object.keys(files).sort().join('\n')}`
  }
  return `ERROR: unknown tool: ${name}`
}

// Keep exactly one rolling cache breakpoint in the message history (the latest
// turn), so the growing tool-result prefix is cached without exceeding the
// 4-breakpoint limit (system + last tool already take two).
function applyRollingCache(messages) {
  for (const m of messages) {
    if (Array.isArray(m.content)) {
      for (const b of m.content) {
        if (b && typeof b === 'object' && 'cache_control' in b) delete b.cache_control
      }
    }
  }
  const last = messages[messages.length - 1]
  if (typeof last.content === 'string') {
    last.content = [{ type: 'text', text: last.content }]
  }
  if (Array.isArray(last.content) && last.content.length) {
    last.content[last.content.length - 1].cache_control = { type: 'ephemeral' }
  }
}

// Run one AZIMUTH analysis to completion. Returns
// { output, model, toolCalls, iterations, stoppedReason }.
export async function runAzimuth({
  apiKey,
  model,
  prompt,
  skillBundle,
  maxTokens = 8000,
  maxIterations = 16,
  signal,
  onProgress,
  fetchImpl,
  apiUrl = API_URL,
}) {
  const doFetch = fetchImpl || fetch
  const system = [
    { type: 'text', text: buildSystemPrompt(skillBundle), cache_control: { type: 'ephemeral' } },
  ]
  const tools = TOOLS.map((t, i) =>
    i === TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t,
  )

  const messages = [{ role: 'user', content: prompt }]
  const toolCalls = []
  let iterations = 0
  let finalText = ''

  while (iterations < maxIterations) {
    iterations++
    applyRollingCache(messages)

    const res = await doFetch(apiUrl, {
      method: 'POST',
      signal,
      referrerPolicy: 'no-referrer',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, tools, messages }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)

    const content = data.content || []
    const textBlocks = content.filter(b => b.type === 'text').map(b => b.text)
    if (textBlocks.length) finalText = textBlocks.join('\n')

    if (data.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content })
      const toolResults = []
      for (const block of content) {
        if (block.type !== 'tool_use') continue
        const result = resolveTool(block.name, block.input, skillBundle)
        const label = block.name === 'read_file' ? normalizePath(block.input?.path) : block.name
        toolCalls.push(label)
        onProgress?.({ type: 'tool', name: block.name, path: label, iteration: iterations })
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
      }
      messages.push({ role: 'user', content: toolResults })
      continue
    }

    onProgress?.({ type: 'done', iteration: iterations })
    return { output: finalText, model, toolCalls, iterations, stoppedReason: data.stop_reason || 'end_turn' }
  }

  onProgress?.({ type: 'done', iteration: iterations, capped: true })
  return {
    output: finalText || '(no final analysis — reached the file-loading iteration cap)',
    model,
    toolCalls,
    iterations,
    stoppedReason: 'max_iterations',
  }
}
