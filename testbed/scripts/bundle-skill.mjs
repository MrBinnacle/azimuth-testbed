// Vendors the AZIMUTH skill runtime files into testbed/skill-bundle.json.
//
// Netlify builds only from this repo and cannot see the sibling `azimuth`
// repo, so the runtime files the skill loads on demand must be snapshotted
// here and committed. Re-run this on each skill release, then commit the
// regenerated skill-bundle.json.
//
// Usage:  node scripts/bundle-skill.mjs
//         AZIMUTH_REPO=/path/to/azimuth node scripts/bundle-skill.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const testbedDir = resolve(__dirname, '..')
const azimuthRepo = resolve(process.env.AZIMUTH_REPO || resolve(testbedDir, '../../azimuth'))

if (!existsSync(azimuthRepo)) {
  console.error(`AZIMUTH repo not found at: ${azimuthRepo}`)
  console.error('Set AZIMUTH_REPO to the local azimuth repo path.')
  process.exit(1)
}

// Runtime files the skill can load on demand. Top-level anchors plus every
// markdown file under the three on-demand directories.
const TOP_LEVEL = ['SKILL.md', 'BEHAVIOR_SPEC.md', 'gotchas.md']
const DIRS = ['references', 'diagnostics', 'domain-policies']

function mdFilesIn(dir) {
  const abs = join(azimuthRepo, dir)
  if (!existsSync(abs)) return []
  return readdirSync(abs)
    .filter(f => f.endsWith('.md'))
    .map(f => `${dir}/${f}`)
    .sort()
}

const relPaths = [
  ...TOP_LEVEL.filter(f => existsSync(join(azimuthRepo, f))),
  ...DIRS.flatMap(mdFilesIn),
]

const files = {}
for (const rel of relPaths) {
  files[rel] = readFileSync(join(azimuthRepo, rel), 'utf8')
}

function changelogVersion() {
  try {
    const cl = readFileSync(join(azimuthRepo, 'CHANGELOG.md'), 'utf8')
    // First "## [x.y.z]" heading that is not [Unreleased].
    const m = cl.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m)
    return m ? `v${m[1]}` : 'unknown'
  } catch {
    return 'unknown'
  }
}

function sourceCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: azimuthRepo }).toString().trim()
  } catch {
    return 'unknown'
  }
}

const bundle = {
  version: changelogVersion(),
  sourceCommit: sourceCommit(),
  sourceRepo: 'github.com/MrBinnacle/azimuth',
  generatedAt: new Date().toISOString(),
  files,
}

const outPath = join(testbedDir, 'skill-bundle.json')
writeFileSync(outPath, JSON.stringify(bundle, null, 2) + '\n', 'utf8')

console.log(`Wrote ${relative(testbedDir, outPath)}`)
console.log(`  version:      ${bundle.version}`)
console.log(`  sourceCommit: ${bundle.sourceCommit.slice(0, 12)}`)
console.log(`  files:        ${relPaths.length}`)
for (const p of relPaths) console.log(`    - ${p}`)
