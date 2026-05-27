import { describe, it, expect } from 'vitest'
import { extractVerdict, extractConfidence } from './extraction.js'

// Six board-mandated cases (P0.2). These lock in the behavior already shipped
// in main@3ed3eea; they do not introduce new behavior.
//
// Deviation from the board wording: cases 4 and 6 were rewritten to match
// shipped behavior. The board's case 6 assumed numeric confidence extraction
// ("returns 0.62, not 0.84"), but the shipped extractor returns the High /
// Medium / Low token nearest the word "confidence". Case 6 below tests the
// same intent (proximity-to-label precedence) against the actual token set.
// Case 4 expects 'UNKNOWN' (the shipped sentinel) rather than null.

describe('extractVerdict', () => {
  it('1. labeled verdict — "Verdict: PROCEED WITH SAFEGUARDS"', () => {
    expect(extractVerdict('Verdict: PROCEED WITH SAFEGUARDS')).toBe('PROCEED WITH SAFEGUARDS')
  })

  it('2. recommended-decision block — "## Recommended Decision\\n**REJECT**"', () => {
    expect(extractVerdict('## Recommended Decision\n**REJECT**')).toBe('REJECT')
  })

  it('3. standalone verdict on its own line — "DELAY PENDING EVIDENCE"', () => {
    const input = 'Some preamble.\n\nDELAY PENDING EVIDENCE\n\nMore text.'
    expect(extractVerdict(input)).toBe('DELAY PENDING EVIDENCE')
  })

  it('4. false preamble — "I can proceed with this analysis."', () => {
    // Must NOT return PROCEED. Shipped sentinel is the string "UNKNOWN".
    expect(extractVerdict('I can proceed with this analysis.')).toBe('UNKNOWN')
  })

  it('5. multi-word precedence — both "PROCEED WITH SAFEGUARDS" and "PROCEED" present', () => {
    const input = 'Verdict: PROCEED WITH SAFEGUARDS\n\nLater we may PROCEED.'
    expect(extractVerdict(input)).toBe('PROCEED WITH SAFEGUARDS')
  })

  it('5b. multi-word precedence — standalone path also prefers the longer match', () => {
    const input = 'PROCEED WITH SAFEGUARDS\n\nPROCEED'
    expect(extractVerdict(input)).toBe('PROCEED WITH SAFEGUARDS')
  })
})

describe('extractConfidence', () => {
  it('6. proximity to "confidence" label — returns the token near the label, not earlier noise', () => {
    // Board case 6 intent: when the same token type appears far from the label
    // and a different token appears next to "Confidence:", the labeled one wins.
    // Shipped extractor scans the 200 chars immediately following the first
    // occurrence of "confidence" (case-insensitive).
    const input = 'High earlier in the document.\n\nConfidence: Medium'
    expect(extractConfidence(input)).toBe('Medium')
  })

  it('returns "Unknown" when the word "confidence" is absent', () => {
    expect(extractConfidence('No label here, just High.')).toBe('Unknown')
  })

  it('returns "Unknown" when no High/Medium/Low appears within 200 chars of the label', () => {
    expect(extractConfidence('Confidence: not applicable.')).toBe('Unknown')
  })
})
