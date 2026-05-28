// Regenerates the prestaged Boeing case-study runs against the vendored
// v1.5.0 skill, using the exact same engine the live app uses — so the
// prestaged runs are produced by the identical 1:1 code path a visitor hits.
//
// Requires a real key (the agent never handles one):
//   cd testbed
//   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-boeing-runs.mjs
//   # optional: MODEL=claude-sonnet-4-6 node scripts/generate-boeing-runs.mjs
//
// Writes prestaged-runs.json (commit it). The live app loads it on startup.

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runAzimuth } from '../azimuth-engine.js'
import { extractVerdict, extractConfidence } from '../extraction.js'
import { PROMPT_VARIANTS, DEFAULT_MODEL } from '../constants.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const testbedDir = resolve(__dirname, '..')

const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set. Set it and re-run:')
  console.error('  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-boeing-runs.mjs')
  process.exit(1)
}

const model = process.env.MODEL || DEFAULT_MODEL
const skillBundle = JSON.parse(readFileSync(join(testbedDir, 'skill-bundle.json'), 'utf8'))

const TAGS = {
  'boeing-full': ['full-framing', 'fresh-context'],
  'boeing-thin': ['thin-prompt', 'fresh-context'],
  'boeing-adversarial': ['adversarial', 'fresh-context'],
}

const runs = []
for (const variant of PROMPT_VARIANTS) {
  console.log(`\n▶ ${variant.label} (${model})`)
  const started = Date.now()
  const r = await runAzimuth({
    apiKey,
    model,
    prompt: variant.text,
    skillBundle,
    onProgress: e => {
      if (e.type === 'tool' && e.name === 'read_file') console.log(`    loaded ${e.path}`)
      else if (e.type === 'tool') console.log(`    ${e.name}()`)
    },
  })
  const verdict = extractVerdict(r.output)
  const confidence = extractConfidence(r.output)
  const now = new Date()
  runs.push({
    id: now.toISOString(),
    label: `${variant.label} — clean context (${skillBundle.version})`,
    tags: TAGS[variant.id] || ['fresh-context'],
    prompt: variant.text,
    output: r.output,
    verdict,
    confidence,
    date: now.toISOString().slice(0, 10),
    model: r.model,
    fresh: true,
    skillVersion: skillBundle.version,
    skillCommit: skillBundle.sourceCommit,
    toolsLoaded: r.toolCalls,
    iterations: r.iterations,
  })
  const secs = ((Date.now() - started) / 1000).toFixed(0)
  console.log(`  → ${verdict} / ${confidence}  (${r.iterations} turns, ${r.toolCalls.length} files, ${secs}s)`)
}

const outPath = join(testbedDir, 'prestaged-runs.json')
writeFileSync(outPath, JSON.stringify(runs, null, 2) + '\n', 'utf8')
console.log(`\nWrote prestaged-runs.json (${runs.length} runs). Commit it, then deploy.`)
