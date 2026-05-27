// AZIMUTH testbed — verdict / confidence extraction.
//
// Behavior is the live extraction logic shipped in main@3ed3eea
// (fix(verdict-extraction): prevent false PROCEED match from M4 interview text).
// This file exists so the harness can lock that behavior; do not modify the
// regexes without updating extraction.test.js in the same PR.

export function extractVerdict(text) {
  const labeled = text.match(/(?:verdict|recommended\s+decision)\s*:?\s*\**\s*(REJECT|PILOT FIRST|PROCEED WITH SAFEGUARDS|PROCEED|REDUCE SCOPE|DELAY PENDING EVIDENCE|INSUFFICIENT SIGNAL)\b/i)
  if (labeled) return labeled[1].toUpperCase()
  const standalone = text.match(/^(REJECT|PILOT FIRST|PROCEED WITH SAFEGUARDS|PROCEED|REDUCE SCOPE|DELAY PENDING EVIDENCE|INSUFFICIENT SIGNAL)$/im)
  if (standalone) return standalone[1].toUpperCase()
  return 'UNKNOWN'
}

export function extractConfidence(text) {
  const idx = text.toLowerCase().indexOf('confidence')
  if (idx === -1) return 'Unknown'
  const m = text.slice(idx, idx + 200).match(/\b(High|Medium|Low)\b/i)
  return m ? m[1] : 'Unknown'
}
