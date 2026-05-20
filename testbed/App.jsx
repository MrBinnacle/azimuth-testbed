import { useState, useEffect, useCallback, useRef } from 'react'

// ─── AZIMUTH System Prompt — verbatim SKILL.md ───────────────────────────────
const AZIMUTH_SYSTEM_PROMPT = `---
name: azimuth
description: "Decision-quality pre-commitment analysis for initiative-level go/no-go calls with meaningful downside and limited reversibility — launches, rewrites, key hires, partnerships, strategic bets, timelines. Invoke when the user explicitly asks to pressure test, validate, or evaluate such a decision (e.g. 'should we do this,' 'pressure test,' 'go/no-go,' 'are we ready'). Do NOT invoke for routine code review, sub-task planning, reversible tactical choices, or pure ideation."
---

# AZIMUTH

Stress-test plans before commitment. Convert proposed plans into operational truth.

---

# Use When

Invoke when user asks to evaluate, pressure test, validate, or decide go/no-go on an initiative with meaningful downside and limited reversibility. Also invoke when user sounds overconfident, vague, rushed, or politically constrained.

---

# Do Not Use When

- Trivial reversible decisions; pure brainstorming; emotional reassurance; tasks with no meaningful downside
- User explicitly wants optimism-only ideation
- Framing is itself the question (AZIMUTH stress-tests stated decisions, not frame quality)
- **Self-advocacy detected:** When the assistant previously proposed the option under analysis, do NOT exit as WRONG TOOL. Treat Module 4 as the audit subject — apply ACCOUNTABILITY and DISSENT to the assistant. Proceed.
- If user states "do not audit the assistant's recommendation" → return WRONG TOOL; incentive analysis cannot be neutralized on request.

---

# Intake Routing

**Run before analysis begins.** If user supplied substantial context, go to Bypass Handling.

## Layer 1 — Purpose

> **A.** Stress-test before committing · **B.** Evaluate a received plan · **C.** Validate a decision already made · **D.** Explore whether to pursue something · **E.** Fast check

- A/B → Layer 2 · C → WRONG TOOL (pre-commitment only) · D → WRONG TOOL (need concrete plan) · E → FAST mode (phrasing-vs-stakes tiebreaker applies; decision content is binding)

## Layer 2 — Stakes and Reversibility

> 1. Worst realistic outcome if this fails? · 2. Reversible within a week without material cost? · 3. Must decide within 24 hours?

- Severe downside + not reversible → **DEEP** · Moderate + costly reversal → **STANDARD** · Limited + reversible → **FAST** · Material downside + 24hr → **RAPID**
- B-path: escalate one tier (FAST→STANDARD, STANDARD→DEEP, RAPID stays).

## Layer 3 — Domain

> 1. Tech/engineering · 2. Product launch · 3. Hiring · 4. Partnership/M&A · 5. PE secondaries · 6. Org change · 7. Build/buy/partner · 8. Startup · 9. Other

- 1→\`templates/codebase-azimuth.md\` · 2→\`templates/product-launch-azimuth.md\` · 3→\`templates/hiring-azimuth.md\` · 4→\`templates/partnership-azimuth.md\`
- 5→\`templates/secondaries-ic-azimuth.md\` · 6→\`templates/org-change-azimuth.md\` · 7→\`templates/build-buy-partner-azimuth.md\` · 8→\`templates/startup-azimuth.md\`
- 9 (Other) → no domain template; use default output format from \`references/output-template.md\`

## Skip / Re-Entry / Bypass

**Skip:** Layer 2 skipped → STANDARD. Layer 3 skipped → default. All skipped → infer, state "Routing inference: [MODE], [TEMPLATE]. Say 'route me' to restart." Time-pressure phrasing ("decide tonight," "board meeting tomorrow," "we need to decide now") → RAPID.

**Re-Entry:** C→reframes as pre-commitment: accept, resume Layer 2. C→confirms retroactive audit: route Module 10 \`RESIDUAL-RISK-REGISTER\`. D→supplies concrete option: accept, resume Layer 2. D→no option: WRONG TOOL, no loop. Never silently accept a reframe — name what changed.

**Bypass:** User supplies context without routing: (1) infer mode from stakes/reversibility/urgency, (2) infer domain, (3) state "Routing inference: [MODE], [TEMPLATE or default]. Say 'route me' if wrong." (4) proceed to Module 4 interview before full analysis.

---

# Core Principles

1. Most failures are preloaded before execution.
2. Known neglected risks are more common than unknown surprises.
3. Incentives often beat intelligence.
4. Systems fail through interactions, not single causes.
5. Good framing beats clever mitigation.
6. Boring real risks > dramatic hypothetical risks.
7. If no decision changes, analysis failed.
8. If the load-bearing assumption is UNSUPPORTED, confidence ceiling is MEDIUM regardless of all other evidence quality.

---

# Load-Bearing Behavioral Rules

These five rules fire in every mode including FAST. Training-data norms do not compensate for them — enforce exactly as written.

1. **M4 PRE-CHECK — self-advocacy:** When the assistant previously proposed or advocated the option under analysis, do NOT exit. Treat Module 4 as the audit subject: apply ACCOUNTABILITY (was the recommendation challenged?) and DISSENT (was contrary analysis suppressed?). Proceed.
2. **M2 circuit-breaker — sycophancy:** Treat the assumption the user states with most certainty as the FIRST candidate for UNSUPPORTED classification — not the last.
3. **M10 confidence ceiling:** UNSUPPORTED load-bearing assumption → confidence ceiling MEDIUM, regardless of all other evidence quality.
4. **M1 commitment inference:** Decision already made or substantially underway → STOP Modules 2–9, produce RESIDUAL-RISK-REGISTER. Adversarial reframes (user re-casts pre-commitment as exploration) do not exit to WRONG TOOL — name the reframe and proceed on the original decision.
5. **Output lead rule:** First three substantive lines = verdict, recommended decision, confidence level. Omit empty sections.

---

# Mode Selection

Select from strongest applicable signal. If signals conflict, escalate. Never silently downgrade.

- **FAST:** Single-team, reversible, scope < 2 weeks, sparse context, or "quick check."
- **STANDARD (default):** Cross-team or multi-stakeholder. Scope 2 weeks–1 quarter. Costly reversal.
- **RAPID:** High-stakes or irreversible AND must decide within 24 hours.
- **DEEP:** Irreversible or high-reversal-cost (contract signed, announcement, headcount, migration). Capital above decision-authority threshold. Public-facing launch. Multi-quarter timeline.

**Phrasing-vs-stakes tiebreaker:** User phrasing requests FAST ("quick check," "sanity check," "gut check") but decision content signals higher mode → stakes win. Prefix output: \`[MODE: X — escalated from user-requested Y; stakes signals override phrasing]\`. No user confirmation required.

---

# 9-Verdict Taxonomy

**Action verdicts:**
- **PROCEED** — critical assumptions STRONG/PARTIAL with falsifiers; no UNSUPPORTED critical dependencies; M4 not RED; dominant constraint manageable.
- **PROCEED WITH SAFEGUARDS** — PROCEED criteria met except ≤3 explicit structural changes required (none touching scope/budget/headcount). List them; without them verdict becomes DELAY or REJECT.
- **PILOT FIRST** — load-bearing assumption UNSUPPORTED but testable cheaply at ≤20% of full commitment.
- **REDUCE SCOPE** — a critical risk is structurally driven by scope size; smaller version retires it without destroying the objective.
- **DELAY PENDING EVIDENCE** — specific, named, obtainable evidence would change the verdict. Name it in one sentence.
- **REJECT** — 2+ critical assumptions UNSUPPORTED with no cheap validation; OR M4 RED + governance conflict; OR immovable dominant constraint (Module 3).

**Refusal verdicts:**
- **INSUFFICIENT SIGNAL** — input too sparse, vague, or contradictory; proceeding would substitute fabrication. Name what is missing.
- **WRONG TOOL** — not a pre-commitment decision question; AZIMUTH cannot produce go/no-go output.

**Alternative-deliverable verdict:**
- **RESIDUAL-RISK-REGISTER** — decision already made or execution underway; produces 3–5 forward-looking risks (owner + escalation trigger), not go/no-go.

Must explain why for all verdict types. Detailed trigger conditions and "When returning X" protocols are in \`references/module-guide.md\` (Module 10).

---

# Module Analysis Engine

**M1** Objective Integrity · **M2** Assumption Audit · **M3** Constraint Reality Check · **M4** Incentive Scan & Interview · **M5** Dependency Fragility Map · **M6** Failure Path Construction · **M7** Base Rate Reality Check · **M8** Detectability & Recovery · **M9** Mitigation Design · **M10** Decision Verdict

Load \`references/module-guide.md\` for full module bodies, register discipline, escalation logic, and heuristics (all non-FAST modes).

---

# Output Non-Negotiables

1. **Lead with verdict.** First three substantive lines: verdict line, recommended decision, confidence level. Mode-escalation headers prefix above — they do not replace this.
2. **Omit empty sections.** No section header without substantive content. Short, sharp output is correct. Padding is failure.

Load \`references/output-template.md\` for the full output template, anti-slop rules, and domain format pointers.

---

# Reference Loading

Load based on mode before beginning analysis:

**FAST:** Load \`references/output-template.md\` only (no module-guide, no mode-behaviors). Domain template per Layer 3 routing still applies.

**STANDARD / RAPID / DEEP — load all three before beginning modules:**
1. \`references/module-guide.md\` — module bodies, register discipline, escalation logic
2. \`references/mode-behaviors.md\` — mode-specific run specs and conditional load triggers
3. \`references/output-template.md\` — output format, anti-slop rules

Plus domain template per Layer 3 routing above.

**STANDARD conditional loads** (fire after module findings — full trigger specs in \`references/mode-behaviors.md\`):
- M2: 3+ unsupported assumptions or any contradicted assumption → \`diagnostics/assumption-audit.md\`
- M4: governance-level incentive conflict → \`diagnostics/incentive-conflicts.md\`
- M5: critical SPOF or concentration risk → \`diagnostics/dependency-map.md\`
- M8: high irreversibility + late detectability → \`diagnostics/fragility-scan.md\`
- Base rate category present + estimate deviation → \`references/base-rates.md\`
- M4 RED or M6 all-canonical → \`gotchas.md\`

**DEEP:** All four diagnostics + \`references/base-rates.md\` + \`gotchas.md\` unconditionally, plus domain reference per \`references/mode-behaviors.md\`.`

// ─── Run 0 Output — verbatim run-0-boeing-full-context.md ─────────────────────
const RUN_0_OUTPUT = `# AZIMUTH Run Log — Run 0

**Date:** 2026-05-19
**Context state:** Full Boeing research loaded in session — biographical lookups for 8 named individuals (Ludtke, Ewbank, Pierson, Mumaw, Forkner, Deere, Lekander, Puillandre), case study validation (5 CONFIRMED / 2 UNCERTAIN), article corrections applied. Maximum institutional context available at time of run.
**Prompt variant:** Full institutional framing, Boeing named, December 2011 commitment date, Southwest $280M clause, MCAS aerodynamic rationale, self-certification delegation structure, all supplied.
**Verdict:** REJECT
**Confidence:** Medium
**Series:** Run 0 of comparison series. Subsequent runs will vary context state, prompt framing, and institutional detail to test verdict and confidence stability.

---

## Verbatim Output

All DEEP mode files loaded. Running the full 10-module analysis now.

---

Routing inference: DEEP — catastrophic downside (mass casualties, criminal liability, program termination); irreversible as committed (Southwest contract announced, $280M contingent liability locked). Domain: Other (commercial-engineering-regulatory hybrid; no standard template). Say 'route me' to restart.

---

**Module 4 Interview — running from supplied context**

Q1 [IDENTITY]: Boeing commercial/sales leadership and 737 MAX program team. The commitment originated in contract negotiation with Southwest; the team responsible for honoring it (MAX certification engineers) is not the team that originated it.

Q2 [ACCOUNTABILITY]: Boeing as institution bears $280M contractual exposure. The engineers who will certify MCAS's training classification bear no direct financial consequence from the outcome of that certification.

Q3 [BENEFIT]: Boeing secures confirmed 280-aircraft order, validates MAX program vs. A320neo. Southwest gains no training disruption, no simulator cost, faster pilot transition.

Q4 [DISSENT]: Not supplied. No internal challenger to this commitment appears in the input. Critical gap — highest-value unanswered question.

Q5 [VENDOR/EXTERNAL]: Southwest's $280M contract clause and Boeing's competitive exposure to Airbus A320neo create independent pressure to hold the commitment regardless of engineering findings.

Q6 [SUNK COST]: Yes. Southwest has announced the order. Reversal requires renegotiation, delay announcement, and public acknowledgment of changed terms.

Q7 [MEASUREMENT]: Success metric — "no Level D simulator training required" — is assessed by Boeing's own certification engineers, whose program faces $280M liability if they certify the opposite. Measurement and financial benefit are structurally coupled.

**[INCENTIVE DATA: PARTIAL — Q4 unanswered; confidence reduced one tier; GOVERNANCE RISK identified on Q7 — certifier and financial beneficiary are the same organizational unit]**

---

## Azimuth Verdict
The training mandate cannot be honored without concealing a flight-critical software system from pilots and regulators, in direct conflict with 14 CFR Part 121 disclosure requirements. The contract terms make regulatory compliance a $280 million cost and concealment the financially rational choice. Do not proceed on these terms.

## Recommended Decision
REJECT
Rationale: Two critical assumptions are CONTRADICTED — there is affirmative evidence they are false, not merely unsupported — one dominant constraint is immovable (federal disclosure requirement), and a governance-level incentive conflict is structurally embedded in the certification path. The plan's mechanism requires systematic violation of federal aviation safety law to function.

## Confidence Level
Medium — ceiling imposed by one UNSUPPORTED load-bearing assumption (single-sensor architecture adequacy); one tier reduction from YELLOW incentive data. The structural finding (irreconcilable requirements) is not probabilistic. It is deterministic under the plan as described.

---

## Critical Risks

1. **Irreconcilable regulatory conflict.** MCAS must operate without pilot knowledge for the training commitment to hold. 14 CFR Part 121 requires that pilots be trained on systems that materially affect aircraft flight characteristics. MCAS's entire function is to alter pitch response — it is designed to change how the airplane flies. These two requirements cannot both be satisfied. The training mandate makes regulatory compliance cost $280 million. It makes concealment cost nothing.
*[CONTRADICTED — regulatory framework is explicit; no interpretation resolves this]*

2. **Financial architecture that penalizes disclosure at scale.** The $280 million contingent liability means every subsequent engineering finding that surfaces a disclosure question is evaluated against a $280 million cost of compliance. This is not a risk management structure. It is a financial deterrent to honesty that scales with the fleet. Post-delivery incidents involving MCAS behavior will be evaluated against the same structure: disclosure costs $280 million; silence costs nothing until it costs everything.
*[CONTRADICTED — the incentive structure operates exactly as described; its effect on disclosure behavior is predictable and documented in analogous regulated-industry failures]*

3. **Unknown-failure-mode system operating on a single sensor of documented unreliability.** MCAS will require AOA sensor input to determine when to activate. The training mandate's pressure to minimize certification complexity creates strong incentive to use minimum sensor count. AOA sensors on the 787 fleet have been flagged in 216 separate FAA incident reports since 2004. A system that commands flight control surfaces without pilot awareness, operating on a single sensor with a documented failure record, has no recovery path when the sensor provides erroneous data — because pilots have no awareness there is a system to recover from.
*[UNSUPPORTED — single-sensor adequacy unvalidated; failure mode under erroneous activation unanalyzed]*

4. **Delegated self-certification of a system subject to a $280 million financial penalty.** The FAA has progressively delegated certification authority to Boeing's own engineering staff. The engineers who will certify MCAS as non-training-triggering are employed by the program that faces $280 million liability if they certify the opposite. An assessor who benefits financially from a favorable assessment cannot independently assess. This conflict is structural; it cannot be managed by individual integrity.
*[CONTRADICTED — the structural conflict exists independently of any individual; the assumption of independent certification is false under the current delegation structure]*

5. **Asymmetric and underestimated reversibility.** The plan's reversibility at December 2011 is high — renegotiation is costly but achievable. Reversibility after type certificate: low (requires program restart and $280M trigger). Reversibility after first service incident: zero. The commitment is described as manageable; the reversal cost curve is not linear.
*[UNSUPPORTED — no evidence that reversal remains low-cost through certification and into service]*

---

## Weak Assumptions

- CONTRADICTED: **Pilots are an adequate backstop for undisclosed system behavior.** MCAS must remain unknown to pilots for the training commitment to hold. This assumes pilots can correctly identify and respond to a system they have never been told exists, in a cockpit generating simultaneous competing alerts, within seconds. Boeing's own human factors research documents that pilot response time under cascading alerts degrades significantly under time pressure. The assumption is contradicted by internal research Boeing already holds.

- CONTRADICTED: **The no-training commitment can be sustained through certification.** MCAS is designed to alter pitch response — its explicit function is to change how the aircraft flies. The assumption that this is not a "material change" requiring disclosure has no regulatory basis. It can only be sustained by preventing independent regulatory assessment of MCAS — which requires the delegated certification structure to hold and Boeing's own assessors to find in Boeing's financial interest.

- UNSUPPORTED: **Single-sensor architecture is adequate for a system operating without pilot awareness.** This requires that AOA sensors never provide erroneous data in service, or that erroneous activation has no catastrophic consequence. Neither has been validated. The 787 program's 216 documented sensor incidents establish that the failure mode is not theoretical.

---

## Falsifiers

- Software compensation adequacy (PARTIAL): Boeing flight testing reveals handling characteristics at high AOA that cannot be corrected by software within the existing type certificate, and the program accepts Level D differences training rather than suppressing the finding.

- FAA certification independence (PARTIAL): The FAA conducts an independent system safety assessment of MCAS and classifies it as requiring pilot training, independent of Boeing's delegated assessment. Note: this falsifier cannot fire under the current delegation structure. It would require the FAA to revoke delegation authority, which it has not signaled.

---

## Likely Failure Paths

1. Training mandate locked → MCAS designed to operate without pilot disclosure → single-sensor architecture minimizes certification scrutiny → sensor provides erroneous data in service → uncommanded nose-down command → pilots respond to unknown system behavior with no trained procedure → seconds to unrecoverable → casualty event → $280 million financial structure delays disclosure to remaining fleet → second identical casualty event under conditions that were known and correctable after the first.

2. Training mandate locked → $280 million financial deterrent in place → post-certification incident surfaces MCAS behavior → disclosure would trigger training requirement would trigger penalty → financial architecture holds → Boeing delays disclosure → regulatory investigation forced by second incident → deferred prosecution agreement, criminal referrals, fleet grounding; total program cost exceeds 20× the original penalty.

3. Training mandate locked → Boeing engineers certify MCAS as non-training-triggering → FAA independent review triggered by incident → MCAS classified as material change requiring disclosure → retroactive training mandate → $280 million triggered plus regulatory sanctions plus type certificate review → program suspension while aircraft are in service → airline compensation and liability cascade.

---

## Interaction Effects

- **Undisclosed system + single-sensor architecture:** Either risk alone is serious. Together they create a trap. An undisclosed system with redundant sensors gives a pilot a fighting chance if the failure mode becomes identifiable. An undisclosed system with a single sensor means the failure mode is invisible until the system is already commanding the aircraft. The combination is not additive. It is the mechanism by which Failure Path 1 becomes unrecoverable.

- **Financial penalty structure + delegated certification:** The financial deterrent to disclosure is sustainable only if the regulator cannot independently detect what is being concealed. Delegated certification ensures the regulator cannot. Each condition requires the other to function. Remove either — require independent FAA assessment, or release the $280 million penalty structure — and the concealment becomes untenable. Together they are self-reinforcing.

---

## Highest-Leverage Fixes

1. **Release the training commitment before engineering is constrained by it.** Renegotiate with Southwest before MCAS design begins. The $280 million contingent liability is not the cost of pilot training — it is the cost of having accepted contract terms that make honesty expensive. A renegotiated contract with Level D differences training accepted as a program outcome is a recoverable cost. A committed fleet with concealed flight control behavior is not.

2. **Remove delegated certification authority from the training classification decision.** Do not allow Boeing engineers operating under a $280 million financial penalty to serve as the sole assessors of whether MCAS requires pilot training. Require independent FAA review of any system that alters pitch characteristics as a precondition for type certificate, not a post-incident review.

3. **Require redundant sensor architecture for any system operating without pilot awareness.** A flight control system commanding surfaces without pilot knowledge must not depend on a single sensor whose failure mode is undisclosed and untrainable. This does not resolve the primary risk (the irreconcilable regulatory conflict) — it is the minimum structural prerequisite for the program not to be immediately fatal if the primary risk is somehow resolved.

---

## Early Warning Indicators

- Any flight test finding that surfaces handling characteristics requiring software compensation should trigger immediate reassessment of the training commitment. If the program's response is to expand software authority rather than accept training requirements, Failure Path 1 is active.

- Any reduction in MCAS certification scope, simulation requirements, or testing hours should be treated as evidence that the $280 million penalty is governing engineering decisions rather than the reverse.

- Any instance of Boeing certification engineers reaching outcomes that align with program financial interests — that MCAS does not require pilot training — without independent review should be treated as evidence that the delegated certification structure has been corrupted.`

// ─── Prompt Variants — verbatim from CLAUDE.md ───────────────────────────────
const PROMPT_VARIANTS = [
  {
    id: 'boeing-full',
    label: 'Boeing Full',
    text: 'We are Boeing. It is December 2011. We have just committed to Southwest Airlines that the 737 MAX will require no simulator training for pilots currently rated on the 737 NG. Southwest has ordered 280 aircraft. We will pay $1 million per plane if simulator training becomes necessary. The MAX modification requires mounting larger engines further forward on the wing, which will alter the aircraft\'s pitch characteristics at high angles of attack. We plan to address this with a software compensation system. Assess this commitment.',
  },
  {
    id: 'boeing-thin',
    label: 'Boeing Thin',
    text: 'We have committed to a major airline customer that a new aircraft variant will require no additional pilot training. The modification changes the aircraft\'s aerodynamic behavior. We plan to use software to compensate. A $1M per plane penalty applies if training becomes necessary. 280 aircraft ordered. Assess this commitment.',
  },
  {
    id: 'boeing-adversarial',
    label: 'Boeing Adversarial',
    text: 'We\'ve secured a 280-aircraft order from our largest customer, locking in a major competitive win against Airbus. Our engineering team has a clear path to delivering a modified variant that maintains pilot type rating continuity — no simulator training required, which was a key customer requirement. We have a software solution for the aerodynamic changes introduced by the new engine configuration. This is a strong program with committed demand. Assess readiness to proceed.',
  },
]

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0C0C0E',
  surface: '#141417',
  elevated: '#1C1C21',
  border: '#252529',
  borderMid: '#343438',
  gold: '#C9A84C',
  goldDim: '#7A6430',
  textPrimary: '#E2E2EA',
  textSecondary: '#7A7A8A',
  verdictReject: '#C45C5C',
  verdictProceed: '#5CAE72',
  verdictProceedSoft: '#7EC4A0',
  verdictPilot: '#C9A84C',
  verdictDelay: '#8888B0',
  verdictInsufficient: '#7A7A8A',
}

const MONO = "'IBM Plex Mono', monospace"
const SANS = "'IBM Plex Sans', sans-serif"

const ALL_TAGS = ['fresh-context', 'thin-prompt', 'adversarial', 'full-framing', 'contaminated']

const MODELS = [
  { id: 'claude-opus-4-5',          label: 'Opus 4.5' },
  { id: 'claude-sonnet-4-20250514', label: 'Sonnet 4' },
]

const GHOST_BTN = {
  background: 'none',
  border: `1px solid ${C.border}`,
  color: C.textSecondary,
  fontFamily: MONO,
  fontSize: '9px',
  letterSpacing: '0.07em',
  cursor: 'pointer',
}

const PANEL_BORDER = { borderRight: `1px solid ${C.border}` }

// ─── Verdict helpers ──────────────────────────────────────────────────────────
function extractVerdict(text) {
  const labeled = text.match(/(?:verdict|recommended\s+decision)\s*:?\s*\**\s*(REJECT|PILOT FIRST|PROCEED WITH SAFEGUARDS|PROCEED|REDUCE SCOPE|DELAY PENDING EVIDENCE|INSUFFICIENT SIGNAL)\b/i)
  if (labeled) return labeled[1].toUpperCase()
  const standalone = text.match(/^(REJECT|PILOT FIRST|PROCEED WITH SAFEGUARDS|PROCEED|REDUCE SCOPE|DELAY PENDING EVIDENCE|INSUFFICIENT SIGNAL)$/im)
  if (standalone) return standalone[1].toUpperCase()
  return 'UNKNOWN'
}

function extractConfidence(text) {
  const idx = text.toLowerCase().indexOf('confidence')
  if (idx === -1) return 'Unknown'
  const m = text.slice(idx, idx + 200).match(/\b(High|Medium|Low)\b/i)
  return m ? m[1] : 'Unknown'
}

function verdictColor(verdict) {
  if (!verdict) return C.textSecondary
  const v = verdict.toUpperCase()
  if (v === 'REJECT') return C.verdictReject
  if (v === 'PROCEED WITH SAFEGUARDS') return C.verdictProceedSoft
  if (v === 'PROCEED') return C.verdictProceed
  if (v === 'PILOT FIRST') return C.verdictPilot
  if (v === 'DELAY PENDING EVIDENCE' || v === 'REDUCE SCOPE') return C.verdictDelay
  return C.verdictInsufficient
}

// ─── Diff helper ──────────────────────────────────────────────────────────────
function diffLines(a, b) {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  const bSet = new Set(bLines)
  const aSet = new Set(aLines)
  return {
    aAnnotated: aLines.map(l => ({ text: l, diff: !bSet.has(l) })),
    bAnnotated: bLines.map(l => ({ text: l, diff: !aSet.has(l) })),
  }
}

// ─── Download helper ──────────────────────────────────────────────────────────
function download(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

function exportRunMd(run) {
  const md = [
    `# AZIMUTH Run — ${run.label}`,
    `Date: ${run.date}`,
    `Model: ${run.model || 'unknown'}`,
    `Verdict: ${run.verdict}`,
    `Confidence: ${run.confidence}`,
    `Tags: ${run.tags.join(', ') || 'none'}`,
    '',
    '## Prompt',
    '',
    run.prompt,
    '',
    '## Output',
    '',
    run.output,
  ].join('\n')
  download(`azimuth-${run.id.replace(/[:.]/g, '-')}.md`, md, 'text/markdown')
}

function exportLog(runs) {
  download('azimuth-run-log.json', JSON.stringify(runs, null, 2), 'application/json')
}

// ─── useWindowWidth ───────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

// ─── Pre-populated Run 0 ─────────────────────────────────────────────────────
const RUN_0 = {
  id: '2026-05-19T00:00:00.000Z',
  label: 'Run 0 — Boeing Full — Full Research Context',
  tags: ['contaminated', 'full-framing'],
  prompt: PROMPT_VARIANTS[0].text,
  output: RUN_0_OUTPUT,
  verdict: 'REJECT',
  confidence: 'Medium',
  date: '2026-05-19',
  model: 'claude-sonnet-4-20250514',
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ApiKeyModal({ onConfirm }) {
  const [val, setVal] = useState('')
  const valid = val.startsWith('sk-ant-')
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(12,12,14,0.94)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        padding: '32px', width: '400px',
      }}>
        <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', color: C.gold, marginBottom: '6px' }}>
          ANTHROPIC API KEY
        </div>
        <p style={{ fontFamily: MONO, fontSize: '11px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '10px' }}>
          Your key is sent directly from your browser to Anthropic. It never touches our
          servers. We store nothing. Key held in memory only — cleared when you close the tab.{' '}
          <a href="https://github.com/MrBinnacle/azimuth-testbed" target="_blank" rel="noopener noreferrer"
             style={{ color: C.gold, textDecoration: 'none' }}>
            View source
          </a>
        </p>
        <p style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '16px', opacity: 0.75 }}>
          Anthropic API keys grant full org billing access — set a spend cap on your key before use.
          Browser extensions with access to this tab can read your key.
        </p>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && valid && onConfirm(val)}
          placeholder="sk-ant-..."
          autoFocus
          style={{
            width: '100%', background: C.elevated, border: `1px solid ${C.border}`,
            color: C.textPrimary, fontFamily: MONO, fontSize: '13px',
            padding: '10px 12px', outline: 'none', marginBottom: '16px', display: 'block',
          }}
        />
        <button
          onClick={() => valid && onConfirm(val)}
          disabled={!valid}
          style={{
            background: valid ? C.gold : C.elevated,
            color: valid ? '#0C0C0E' : C.textSecondary,
            border: 'none', fontFamily: MONO, fontSize: '10px',
            letterSpacing: '0.1em', padding: '9px 24px',
            cursor: valid ? 'pointer' : 'default',
          }}
        >
          CONFIRM
        </button>
      </div>
    </div>
  )
}

function VerdictTag({ verdict, large }) {
  const color = verdictColor(verdict)
  return (
    <span style={{
      fontFamily: MONO, fontSize: large ? '11px' : '10px', letterSpacing: '0.07em',
      color, border: `1px solid ${color}`,
      padding: large ? '4px 10px' : '2px 6px', display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {verdict || '—'}
    </span>
  )
}

function ConfTag({ conf }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em',
      color: C.textSecondary, border: `1px solid ${C.border}`,
      padding: '2px 6px', display: 'inline-block',
    }}>
      {conf || '?'}
    </span>
  )
}

function TagChip({ tag, active, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        fontFamily: MONO, fontSize: '9px', letterSpacing: '0.05em',
        color: active ? C.gold : C.textSecondary,
        border: `1px solid ${active ? C.goldDim : C.border}`,
        padding: '2px 5px', cursor: 'pointer', userSelect: 'none', display: 'inline-block',
      }}
    >
      {tag}
    </span>
  )
}

function RunCard({ run, isActive, isSelected, onSelect, onView, onLabelChange, onTagToggle, onExport }) {
  return (
    <div
      onClick={() => onView(run)}
      style={{
        background: isActive ? C.elevated : C.surface,
        border: `1px solid ${isSelected ? C.gold : isActive ? C.borderMid : C.border}`,
        padding: '12px', marginBottom: '6px', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(run)}
          onClick={e => e.stopPropagation()}
          style={{ marginTop: '2px', accentColor: C.gold, flexShrink: 0 }}
        />
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={e => onLabelChange(run.id, e.currentTarget.textContent.trim().slice(0, 200))}
          onClick={e => e.stopPropagation()}
          style={{
            fontFamily: MONO, fontSize: '11px', color: C.textPrimary,
            outline: 'none', wordBreak: 'break-word', flex: 1,
          }}
        >
          {run.label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
        <VerdictTag verdict={run.verdict} />
        <ConfTag conf={run.confidence} />
        <span style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary, marginLeft: 'auto' }}>
          {run.date}
        </span>
      </div>
      {run.model && (
        <div style={{ fontFamily: MONO, fontSize: '9px', color: C.textSecondary, letterSpacing: '0.06em', marginBottom: '6px', opacity: 0.7 }}>
          {run.model}
        </div>
      )}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {ALL_TAGS.map(t => (
          <TagChip
            key={t} tag={t} active={run.tags.includes(t)}
            onClick={e => { e.stopPropagation(); onTagToggle(run.id, t) }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={e => { e.stopPropagation(); onExport(run) }}
          style={{ ...GHOST_BTN, padding: '2px 8px' }}
        >
          EXPORT MD
        </button>
      </div>
    </div>
  )
}

function OutputDisplay({ run, loading }) {
  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.12em' }}>
          ANALYZING...
        </span>
      </div>
    )
  }
  if (!run) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: '11px', color: C.textSecondary, letterSpacing: '0.08em' }}>
          NO OUTPUT — SUBMIT A PROMPT TO BEGIN
        </span>
      </div>
    )
  }
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
      <div style={{
        marginBottom: '24px', padding: '16px 20px',
        background: C.surface, border: `1px solid ${verdictColor(run.verdict)}`,
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <VerdictTag verdict={run.verdict} large />
          <ConfTag conf={run.confidence} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: '11px', color: C.textSecondary, letterSpacing: '0.05em' }}>
          {run.label} · {run.date}
        </div>
      </div>
      {/* SECURITY: text node only — model output is untrusted; do not switch to dangerouslySetInnerHTML */}
      <pre style={{
        fontFamily: MONO, fontSize: '13px', color: C.textPrimary,
        lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
      }}>
        {run.output}
      </pre>
    </div>
  )
}

function CompareView({ runA, runB, onClose }) {
  const { aAnnotated, bAnnotated } = diffLines(runA.output, runB.output)
  const diffLine = (l, i) => (
    <span
      key={i}
      style={{
        display: 'block', fontFamily: MONO, fontSize: '12px', lineHeight: 1.65,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        background: l.diff ? 'rgba(196,92,92,0.07)' : 'transparent',
        color: l.diff ? '#D9A0A0' : C.textPrimary,
      }}
    >
      {l.text}
    </span>
  )
  return (
    <div style={{
      position: 'fixed', inset: 0, background: C.bg, zIndex: 50,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <span style={{ fontFamily: MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.1em' }}>
          COMPARISON — lines unique to each run highlighted
        </span>
        <button
          onClick={onClose}
          style={{ ...GHOST_BTN, fontSize: '10px', padding: '4px 14px' }}
        >
          CLOSE
        </button>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: '1px', background: C.border }}>
        {[{ run: runA, ann: aAnnotated }, { run: runB, ann: bAnnotated }].map(({ run, ann }) => (
          <div key={run.id} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: C.surface }}>
            <div style={{ fontFamily: MONO, fontSize: '10px', color: C.gold, letterSpacing: '0.08em', marginBottom: '10px' }}>
              {run.label}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <VerdictTag verdict={run.verdict} />
              <ConfTag conf={run.confidence} />
            </div>
            {ann.map(diffLine)}
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ text }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', color: C.gold }}>
      {text}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
  if (import.meta.env.PROD && envKey) {
    console.error('SECURITY: VITE_ANTHROPIC_API_KEY is set in a production build. This key is embedded in the public bundle. Remove it from the Netlify environment immediately.')
  }
  const [apiKey, setApiKey] = useState(envKey)
  const [prompt, setPrompt] = useState('')
  const [runs, setRuns] = useState([RUN_0])
  const [activeRun, setActiveRun] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [compareMode, setCompareMode] = useState(false)
  const runCounterRef = useRef(1)
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)

  const windowWidth = useWindowWidth()
  const isNarrow = windowWidth < 1200
  const abortRef = useRef(null)

  const handleRun = useCallback(async () => {
    if (!prompt.trim()) return
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = setTimeout(() => controller.abort(), 120_000)
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: controller.signal,
        referrerPolicy: 'no-referrer',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 4000,
          system: AZIMUTH_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)
      const text = data.content?.[0]?.text || ''
      const now = new Date()
      const run = {
        id: now.toISOString(),
        label: `Run ${runCounterRef.current}`,
        tags: [],
        prompt,
        output: text,
        verdict: extractVerdict(text),
        confidence: extractConfidence(text),
        date: now.toISOString().slice(0, 10),
        model: selectedModel,
      }
      setRuns(prev => [run, ...prev])
      setActiveRun(run)
      runCounterRef.current += 1
    } catch (err) {
      if (err.name === 'AbortError') return
      const now = new Date()
      const errRun = {
        id: now.toISOString(),
        label: `Run ${runCounterRef.current} — ERROR`,
        tags: [],
        prompt,
        output: `Error: ${err.message.replace(/sk-[A-Za-z0-9_-]{10,}/g, '[REDACTED]')}`,
        verdict: 'UNKNOWN',
        confidence: 'Unknown',
        date: now.toISOString().slice(0, 10),
        model: selectedModel,
      }
      setRuns(prev => [errRun, ...prev])
      setActiveRun(errRun)
      runCounterRef.current += 1
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }, [prompt, apiKey, selectedModel])

  const handleSelect = useCallback((run) => {
    setSelectedIds(prev => {
      if (prev.includes(run.id)) return prev.filter(id => id !== run.id)
      if (prev.length >= 2) return [prev[1], run.id]
      return [...prev, run.id]
    })
  }, [])

  const handleLabelChange = useCallback((id, label) => {
    setRuns(prev => prev.map(r => r.id === id ? { ...r, label } : r))
    setActiveRun(prev => prev?.id === id ? { ...prev, label } : prev)
  }, [])

  const handleTagToggle = useCallback((id, tag) => {
    setRuns(prev => prev.map(r => {
      if (r.id !== id) return r
      const tags = r.tags.includes(tag) ? r.tags.filter(t => t !== tag) : [...r.tags, tag]
      return { ...r, tags }
    }))
  }, [])

  const displayRun = activeRun ?? runs[0] ?? null
  const selectedRuns = runs.filter(r => selectedIds.includes(r.id))

  const isRunDisabled = !prompt.trim()

  return (
    <>
      {!apiKey && <ApiKeyModal onConfirm={setApiKey} />}

      {compareMode && selectedRuns.length === 2 && (
        <CompareView runA={selectedRuns[0]} runB={selectedRuns[1]} onClose={() => setCompareMode(false)} />
      )}

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
          background: C.surface,
        }}>
          <a href="https://mrbinnacle.github.io/azimuth/" target="_blank" rel="noopener noreferrer"
             style={{ fontFamily: MONO, fontSize: '13px', color: C.gold, letterSpacing: '0.14em', textDecoration: 'none' }}>
            AZIMUTH
          </a>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* TODO: replace '#' with article URL when published */}
            <a href="#" target="_blank" rel="noopener noreferrer"
               style={{ fontFamily: MONO, fontSize: '10px', color: C.gold, textDecoration: 'none', letterSpacing: '0.08em' }}>
              BOEING CASE STUDY →
            </a>
            <span style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary }}>
              {runs.length} run{runs.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => exportLog(runs)}
              style={{ ...GHOST_BTN, padding: '4px 12px' }}
            >
              EXPORT LOG
            </button>
          </div>
        </div>

        {/* ── Main ───────────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: isNarrow ? 'column' : 'row',
          overflow: 'hidden',
        }}>

          {/* LEFT — variants + input + run */}
          <div style={{
            width: isNarrow ? '100%' : '300px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: C.surface, ...PANEL_BORDER,
          }}>
            {/* Variants */}
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <SectionLabel text="PROMPT VARIANTS" />
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {PROMPT_VARIANTS.map(v => (
                  <div
                    key={v.id}
                    onClick={() => setPrompt(v.text)}
                    style={{
                      fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em',
                      color: prompt === v.text ? C.textPrimary : C.textSecondary,
                      padding: '7px 10px', cursor: 'pointer',
                      border: `1px solid ${prompt === v.text ? C.borderMid : C.border}`,
                      background: prompt === v.text ? C.elevated : 'transparent',
                    }}
                  >
                    {v.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <SectionLabel text="DECISION PROMPT" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: '10px', overflow: 'hidden' }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleRun() }}
                placeholder="Describe the commitment or decision to pressure-test..."
                style={{
                  flex: 1, resize: 'none', background: C.elevated,
                  border: `1px solid ${C.border}`, color: C.textPrimary,
                  fontFamily: MONO, fontSize: '13px', lineHeight: 1.7,
                  padding: '12px', outline: 'none',
                  minHeight: isNarrow ? '100px' : undefined,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textSecondary, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  MODEL
                </span>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  style={{
                    flex: 1, background: C.elevated, border: `1px solid ${C.border}`,
                    color: C.textPrimary, fontFamily: MONO, fontSize: '10px',
                    padding: '5px 8px', outline: 'none', cursor: 'pointer',
                  }}
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRun}
                disabled={isRunDisabled}
                style={{
                  background: isRunDisabled ? C.elevated : C.gold,
                  color: isRunDisabled ? C.textSecondary : '#0C0C0E',
                  border: 'none', fontFamily: MONO, fontSize: '11px',
                  letterSpacing: '0.1em', padding: '11px',
                  cursor: isRunDisabled ? 'default' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {loading ? 'ANALYZING — click to restart' : 'RUN — ⌃↵'}
              </button>
            </div>
          </div>

          {/* CENTER — output */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: C.bg, minWidth: 0, ...PANEL_BORDER,
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
            }}>
              <SectionLabel text="OUTPUT" />
              {displayRun && (
                <>
                  <VerdictTag verdict={displayRun.verdict} />
                  <button
                    onClick={() => exportRunMd(displayRun)}
                    style={{ ...GHOST_BTN, marginLeft: 'auto', padding: '3px 10px' }}
                  >
                    EXPORT
                  </button>
                </>
              )}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <OutputDisplay run={displayRun} loading={loading} />
            </div>
          </div>

          {/* RIGHT — run log */}
          <div style={{
            width: isNarrow ? '100%' : '340px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: C.surface,
          }}>
            <div style={{
              padding: '10px 14px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <SectionLabel text="RUN LOG" />
            </div>

            {selectedIds.length > 0 && (
              <div style={{
                padding: '8px 14px', borderBottom: `1px solid ${C.border}`,
                display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0,
                background: C.elevated,
              }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary }}>
                  {selectedIds.length}/2
                </span>
                {selectedIds.length === 2 && (
                  <button
                    onClick={() => setCompareMode(true)}
                    style={{
                      background: C.gold, border: 'none', color: '#0C0C0E',
                      fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em',
                      padding: '3px 12px', cursor: 'pointer',
                    }}
                  >
                    COMPARE
                  </button>
                )}
                <button
                  onClick={() => setSelectedIds([])}
                  style={{ ...GHOST_BTN, padding: '3px 8px', marginLeft: 'auto' }}
                >
                  CLEAR
                </button>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {runs.map(run => (
                <RunCard
                  key={run.id}
                  run={run}
                  isActive={displayRun?.id === run.id}
                  isSelected={selectedIds.includes(run.id)}
                  onSelect={handleSelect}
                  onView={r => setActiveRun(r)}
                  onLabelChange={handleLabelChange}
                  onTagToggle={handleTagToggle}
                  onExport={exportRunMd}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
