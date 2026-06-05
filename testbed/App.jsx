import { useState, useEffect, useCallback, useRef } from 'react'
import { extractVerdict, extractConfidence } from './extraction.js'
import { runAzimuth } from './azimuth-engine.js'
import { PROMPT_VARIANTS, MODELS, DEFAULT_MODEL } from './constants.js'
import skillBundle from './skill-bundle.json'
import prestagedRuns from './prestaged-runs.json'

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
// extractVerdict / extractConfidence live in ./extraction.js so the regression
// harness (extraction.test.js) can lock their behavior. See P0.2.

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
  label: 'Boeing — earlier run (for comparison)',
  tags: ['contaminated', 'full-framing'],
  prompt: PROMPT_VARIANTS[0].text,
  output: RUN_0_OUTPUT,
  verdict: 'REJECT',
  confidence: 'Medium',
  date: '2026-05-19',
  model: 'claude-sonnet-4-20250514',
  historical: true,
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ApiKeyModal({ onConfirm, onClose }) {
  const [val, setVal] = useState('')
  const valid = val.startsWith('sk-ant-')
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(12,12,14,0.94)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Enter your Anthropic API key to run AZIMUTH"
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, border: `1px solid ${C.border}`,
          padding: '32px', width: '400px', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ ...GHOST_BTN, position: 'absolute', top: '12px', right: '12px', padding: '3px 9px', fontSize: '11px' }}
        >
          ✕
        </button>
        <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', color: C.gold, marginBottom: '6px' }}>
          RUN YOUR OWN DECISION
        </div>
        <p style={{ fontFamily: MONO, fontSize: '11px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '10px' }}>
          To run a new analysis you bring your own Anthropic API key. It is sent straight from your
          browser to Anthropic, never to us — we store nothing, and it is cleared when you close the tab.{' '}
          <a href="https://github.com/MrBinnacle/azimuth-testbed" target="_blank" rel="noopener noreferrer"
             style={{ color: C.gold, textDecoration: 'none' }}>
            View source
          </a>
        </p>
        <p style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '16px', opacity: 0.75 }}>
          An Anthropic key carries billing access, so set a spend cap on it first. Browser extensions
          with access to this tab can read it.
        </p>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && valid && onConfirm(val)}
          placeholder="sk-ant-..."
          aria-label="Anthropic API key"
          autoFocus
          style={{
            width: '100%', background: C.elevated, border: `1px solid ${C.border}`,
            color: C.textPrimary, fontFamily: MONO, fontSize: '13px',
            padding: '10px 12px', marginBottom: '16px', display: 'block',
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
          CONFIRM &amp; RUN
        </button>
        <div style={{ marginTop: '14px', fontFamily: MONO, fontSize: '10px', color: C.textSecondary, opacity: 0.8 }}>
          No key? Close this and read the worked Boeing example below — no key needed.
        </div>
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

function RunCard({ run, isActive, onView, onExport }) {
  return (
    <div
      onClick={() => onView(run)}
      style={{
        background: isActive ? C.elevated : C.surface,
        border: `1px solid ${isActive ? C.borderMid : C.border}`,
        padding: '12px', marginBottom: '6px', cursor: 'pointer',
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: '11px', color: C.textPrimary, wordBreak: 'break-word', marginBottom: '8px' }}>
        {run.label}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <VerdictTag verdict={run.verdict} />
        <ConfTag conf={run.confidence} />
        <span style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary, marginLeft: 'auto' }}>
          {run.date}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textSecondary, letterSpacing: '0.06em', opacity: 0.7 }}>
          {run.model || ''}
        </span>
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

function loadedFileList(toolsLoaded) {
  const reads = (toolsLoaded || []).filter(p => p !== 'list_files')
  return Array.from(new Set(reads))
}

const INSTALL_CMD = 'npx skills add https://github.com/MrBinnacle/azimuth'

// On publish day, set SUBSTACK_URL to the published Substack article URL.
// While empty, the METHODOLOGY link below does not render — header is unchanged.
// Find/replace target: SUBSTACK_URL_PLACEHOLDER
const SUBSTACK_URL = '' /* SUBSTACK_URL_PLACEHOLDER */

function InstallCommandBox({ size = 'md' }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(INSTALL_CMD)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }
  const fs = size === 'sm' ? '11px' : '12px'
  const pad = size === 'sm' ? '5px 10px' : '9px 14px'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', border: `1px solid ${C.borderMid}`, background: C.elevated, maxWidth: '100%' }}>
      <code style={{ fontFamily: MONO, fontSize: fs, color: C.textPrimary, padding: pad, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <span style={{ color: C.gold, userSelect: 'none' }}>$ </span>{INSTALL_CMD}
      </code>
      <button
        onClick={copy}
        aria-label="Copy install command"
        style={{ background: C.elevated, border: 'none', borderLeft: `1px solid ${C.border}`, color: copied ? C.verdictProceed : C.textSecondary, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.08em', padding: '0 12px', cursor: 'pointer', flexShrink: 0 }}
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
    </div>
  )
}

function InstallCTA() {
  return (
    <div style={{ marginTop: '28px', border: `1px solid ${C.goldDim}`, background: C.surface, padding: '16px 18px' }}>
      <div style={{ fontFamily: SANS, fontSize: '10px', color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
        That was the real skill, running live
      </div>
      <div style={{ fontFamily: MONO, fontSize: '12px', color: C.textPrimary, lineHeight: 1.6, marginBottom: '12px' }}>
        Install AZIMUTH in Claude Code to run it on every decision you make, not just here.
      </div>
      <InstallCommandBox />
      <div style={{ marginTop: '10px', fontFamily: MONO, fontSize: '10px', color: C.textSecondary }}>
        Runs in Claude Code and Claude.ai.{' '}
        <a href="https://github.com/MrBinnacle/azimuth" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>
          github.com/MrBinnacle/azimuth
        </a>
      </div>
    </div>
  )
}

function OutputDisplay({ run, loading, progress }) {
  if (loading) {
    const loaded = loadedFileList((progress || []).map(e => e.path))
    return (
      <div role="status" aria-live="polite" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px' }}>
        <span style={{ fontFamily: MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.12em' }}>
          {loaded.length ? 'RUNNING — MODEL LOADING SKILL FILES' : 'RUNNING — ROUTING'}
        </span>
        {loaded.length > 0 && (
          <div style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary, lineHeight: 1.7, textAlign: 'left', maxWidth: '460px' }}>
            {loaded.map((p, i) => (
              <div key={i}>✓ loaded {p}</div>
            ))}
          </div>
        )}
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
          {run.label} · {run.date}{run.model ? ` · ${run.model}` : ''}
        </div>
        {loadedFileList(run.toolsLoaded).length > 0 && (
          <div style={{ marginTop: '8px', fontFamily: MONO, fontSize: '10px', color: C.textSecondary, lineHeight: 1.5 }}>
            Loaded {loadedFileList(run.toolsLoaded).length} skill file{loadedFileList(run.toolsLoaded).length !== 1 ? 's' : ''} on demand ({run.iterations} turn{run.iterations !== 1 ? 's' : ''}): {loadedFileList(run.toolsLoaded).join(' · ')}
          </div>
        )}
        {run.historical && (
          <div style={{
            marginTop: '10px', padding: '8px 10px',
            border: `1px solid ${C.goldDim}`, background: C.elevated,
            fontFamily: MONO, fontSize: '10.5px', color: C.gold,
            letterSpacing: '0.06em', lineHeight: 1.5,
          }}>
            Historical reference run (Sonnet, pre-v1.5.0), kept for comparison. New runs execute the {skillBundle.version} skill 1:1 on the model shown.
          </div>
        )}
      </div>
      {/* SECURITY: text node only — model output is untrusted; do not switch to dangerouslySetInnerHTML */}
      <pre style={{
        fontFamily: MONO, fontSize: '13px', color: C.textPrimary,
        lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
      }}>
        {run.output}
      </pre>
      {run.userRun && <InstallCTA />}
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

function PromptVariantRow({ variant, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em',
        color: active ? C.textPrimary : C.textSecondary,
        padding: '7px 10px', cursor: 'pointer',
        border: `1px solid ${active ? C.borderMid : C.border}`,
        background: active ? C.elevated : 'transparent',
      }}
    >
      {variant.label}
    </div>
  )
}

// ─── Orientation banner (P1.7 cold-read context) ─────────────────────────────
// Renders blocks 1 (orientation), 3 (how to read), and 6 (footer / what next)
// from the external-facing copy bundle. Dismissible per-session.
function OrientationBanner({ onClose }) {
  const card = {
    border: `1px solid ${C.border}`, background: C.surface,
    padding: '12px 14px', fontFamily: MONO, fontSize: '11px',
    color: C.textPrimary, lineHeight: 1.65, letterSpacing: '0.02em',
  }
  const h = {
    fontFamily: SANS, fontSize: '10px', color: C.gold,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    marginBottom: '6px',
  }
  return (
    <div style={{
      flexShrink: 0, padding: '12px 20px', borderBottom: `1px solid ${C.border}`,
      background: C.bg, maxHeight: '38vh', overflowY: 'auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '10px',
      }}>
        <div style={card}>
          <div style={h}>What AZIMUTH does</div>
          <strong style={{ color: C.gold }}>AZIMUTH</strong> pressure-tests a big decision before you commit to it. You describe the call you're about to make; it argues against your plan, names the one assumption everything rests on, and gives you a clear verdict — proceed, reject, or something in between — with the reasoning. Built for the person who owns a decision that's expensive to reverse.
        </div>

        <div style={card}>
          <div style={h}>Why it's different</div>
          Most tools hand you a list of risks and leave the call to you. AZIMUTH <strong style={{ color: C.gold }}>commits to a verdict and leads with it.</strong> It's built to argue against your plan, not flatter it, and it won't soften the answer to keep you comfortable. When the evidence is thin, it lowers its confidence instead of faking certainty.
        </div>

        <div style={card}>
          <div style={h}>See it, then try it</div>
          Below is a real decision with a known ending: Boeing's 2011 choice to re-engine the 737, which led to the MAX crashes. We gave AZIMUTH that decision described three ways — in full, stripped to bare facts, and spun the way a team that already wants a yes would pitch it — using only what was knowable in 2011. <strong style={{ color: C.gold }}>The verdict holds: REJECT, all three times.</strong> Optimistic spin doesn't move it.
          <div style={{ marginTop: '8px', color: C.textSecondary, fontSize: '10.5px' }}>
            Test your own decision: add your Anthropic key (top right) and run it. The key stays in your browser; nothing is stored. This runs the real skill, not a canned demo — install it for Claude Code from{' '}
            <a href="https://github.com/MrBinnacle/azimuth" target="_blank" rel="noopener noreferrer"
               style={{ color: C.gold, textDecoration: 'underline' }}>
              github.com/MrBinnacle/azimuth
            </a>.
          </div>
        </div>
      </div>
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <button
          onClick={onClose}
          style={{ ...GHOST_BTN, fontSize: '9px', padding: '4px 12px' }}
        >
          ✕ HIDE
        </button>
      </div>
    </div>
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
  const [runs, setRuns] = useState([...prestagedRuns, RUN_0])
  const [activeRun, setActiveRun] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState([])
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const runCounterRef = useRef(1)
  const pendingRunRef = useRef(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [orientationOpen, setOrientationOpen] = useState(true)
  const [flashExamples, setFlashExamples] = useState(false)

  const windowWidth = useWindowWidth()
  const isNarrow = windowWidth < 1200
  const abortRef = useRef(null)
  const textareaRef = useRef(null)
  const examplesRef = useRef(null)

  const executeRun = useCallback(async (key) => {
    if (!prompt.trim()) return
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = setTimeout(() => controller.abort(), 180_000)
    setProgress([])
    setLoading(true)
    try {
      const result = await runAzimuth({
        apiKey: key,
        model: selectedModel,
        prompt,
        skillBundle,
        signal: controller.signal,
        onProgress: e => { if (e.type === 'tool') setProgress(prev => [...prev, e]) },
      })
      const now = new Date()
      const run = {
        id: now.toISOString(),
        label: `Your run ${runCounterRef.current}`,
        prompt,
        output: result.output,
        verdict: extractVerdict(result.output),
        confidence: extractConfidence(result.output),
        date: now.toISOString().slice(0, 10),
        model: selectedModel,
        toolsLoaded: result.toolCalls,
        iterations: result.iterations,
        userRun: true,
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
  }, [prompt, selectedModel])

  const handleRun = useCallback(() => {
    if (!prompt.trim()) {
      // Never a dead click: guide the user to give it a decision.
      textareaRef.current?.focus()
      examplesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setFlashExamples(true)
      setTimeout(() => setFlashExamples(false), 900)
      return
    }
    if (!apiKey) { pendingRunRef.current = true; setKeyModalOpen(true); return }
    executeRun(apiKey)
  }, [prompt, apiKey, executeRun])

  const handleKeyConfirm = useCallback((k) => {
    setApiKey(k)
    setKeyModalOpen(false)
    if (pendingRunRef.current && prompt.trim()) {
      pendingRunRef.current = false
      executeRun(k)
    }
  }, [prompt, executeRun])

  const handleClearRuns = useCallback(() => {
    setRuns([...prestagedRuns, RUN_0])
    setActiveRun(null)
  }, [])

  const hasUserRuns = runs.some(r => r.userRun)
  const displayRun = activeRun ?? runs[0] ?? null

  const isRunDisabled = !prompt.trim()

  return (
    <>
      {keyModalOpen && <ApiKeyModal onConfirm={handleKeyConfirm} onClose={() => setKeyModalOpen(false)} />}

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
          background: C.surface,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <a href="https://mrbinnacle.github.io/azimuth/" target="_blank" rel="noopener noreferrer"
               style={{ fontFamily: MONO, fontSize: '13px', color: C.gold, letterSpacing: '0.14em', textDecoration: 'none' }}>
              AZIMUTH
            </a>
            <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textSecondary, letterSpacing: '0.08em', border: `1px solid ${C.border}`, padding: '1px 5px' }}>
              {skillBundle.version}
            </span>
          </div>
          {!isNarrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textSecondary, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Install in Claude Code
              </span>
              <InstallCommandBox size="sm" />
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!orientationOpen && (
              <button
                onClick={() => setOrientationOpen(true)}
                style={{ ...GHOST_BTN, fontSize: '9px', padding: '4px 10px' }}
              >
                ABOUT
              </button>
            )}
            {SUBSTACK_URL && (
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...GHOST_BTN, fontSize: '9px', padding: '4px 10px', textDecoration: 'none', display: 'inline-block' }}
              >
                METHODOLOGY
              </a>
            )}
            <span style={{ fontFamily: MONO, fontSize: '10px', color: C.textSecondary }}>
              {runs.length} run{runs.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { if (apiKey) { setApiKey('') } else { pendingRunRef.current = false; setKeyModalOpen(true) } }}
              title={apiKey ? 'Your key is set for this session. Click to clear it.' : 'Add your Anthropic key to run your own decisions.'}
              style={{ ...GHOST_BTN, padding: '4px 12px', color: apiKey ? C.gold : C.textSecondary, borderColor: apiKey ? C.goldDim : C.border }}
            >
              {apiKey ? 'KEY SET ✓' : 'ADD KEY'}
            </button>
            <button
              onClick={() => exportLog(runs)}
              style={{ ...GHOST_BTN, padding: '4px 12px' }}
            >
              EXPORT LOG
            </button>
          </div>
        </div>

        {orientationOpen && <OrientationBanner onClose={() => setOrientationOpen(false)} />}

        {/* ── Main ───────────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: isNarrow ? 'column' : 'row',
          overflow: 'hidden',
        }}>

          {/* LEFT — variants + input + run */}
          <div style={{
            width: isNarrow ? '100%' : '300px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',
            background: C.surface, ...PANEL_BORDER,
          }}>
            {/* Boeing case preamble (P1.7) */}
            <div style={{
              padding: '12px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
              background: C.bg,
            }}>
              <div style={{
                fontFamily: SANS, fontSize: '9.5px', color: C.gold,
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px',
              }}>
                Case: Boeing 737 MAX
              </div>
              <div style={{ fontFamily: MONO, fontSize: '10.5px', color: C.textPrimary, lineHeight: 1.55 }}>
                <strong style={{ color: C.gold }}>Decision:</strong> In 2011, Boeing chose to re-engine the existing 737 rather than build a new plane, to keep pace with Airbus. The fix leaned on new flight-control software (MCAS) and was sold as needing no new pilot training.
                <div style={{ marginTop: '6px' }}>
                  <strong style={{ color: C.gold }}>Outcome:</strong> Two crashes (2018, 2019). 346 deaths. Worldwide grounding. $20B+ in losses.
                </div>
                <div style={{ marginTop: '6px', color: C.textSecondary, fontSize: '10px' }}>
                  The three Boeing runs in the log are the same decision told three ways — full brief, bare facts, and optimistic spin — using only what was knowable in 2011. The verdict holds REJECT across all three.
                </div>
              </div>
            </div>

            {/* Input — the primary surface, kept above the examples */}
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <SectionLabel text="YOUR DECISION" />
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: '10px' }}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleRun() }}
                placeholder="Describe a decision you're about to commit to, then press Run. (Or load an example below.)"
                style={{
                  resize: 'vertical', minHeight: '150px', background: C.elevated,
                  border: `1px solid ${C.border}`, color: C.textPrimary,
                  fontFamily: MONO, fontSize: '13px', lineHeight: 1.7,
                  padding: '12px',
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
                    padding: '5px 8px', cursor: 'pointer',
                  }}
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRun}
                title={isRunDisabled ? 'Load an example or type a decision first.' : (!apiKey ? 'Add your Anthropic key when prompted, then it runs.' : undefined)}
                style={{
                  background: isRunDisabled ? C.elevated : C.gold,
                  color: isRunDisabled ? C.textSecondary : '#0C0C0E',
                  border: `1px solid ${isRunDisabled ? C.border : C.gold}`,
                  fontFamily: MONO, fontSize: '11px',
                  letterSpacing: '0.1em', padding: '11px',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                {loading ? 'ANALYZING — click to restart' : (isRunDisabled ? 'RUN — load or type a decision' : (apiKey ? 'RUN — ⌃↵' : 'RUN — adds your key first'))}
              </button>
            </div>

            {/* Examples — secondary, below the input */}
            <div
              ref={examplesRef}
              style={{
                padding: '10px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
                background: flashExamples ? 'rgba(201,168,76,0.10)' : 'transparent',
                transition: 'background 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <SectionLabel text="EXAMPLES — BOEING, THREE FRAMINGS" />
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {PROMPT_VARIANTS.filter(v => v.category === 'calibration').map(v => (
                  <PromptVariantRow key={v.id} variant={v} active={prompt === v.text} onClick={() => setPrompt(v.text)} />
                ))}
              </div>
              <div style={{ marginTop: '16px' }}>
                <SectionLabel text="EXAMPLES — OTHER DOMAINS" />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {PROMPT_VARIANTS.filter(v => v.category === 'domain').map(v => (
                  <PromptVariantRow key={v.id} variant={v} active={prompt === v.text} onClick={() => setPrompt(v.text)} />
                ))}
              </div>
              <div style={{ marginTop: '10px', fontFamily: MONO, fontSize: '10px', color: C.textSecondary, lineHeight: 1.55 }}>
                Click any example to load it into the field above. Your own decision is the point.
              </div>
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
              <OutputDisplay run={displayRun} loading={loading} progress={progress} />
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
              <SectionLabel text="RUNS" />
              {hasUserRuns && (
                <button
                  onClick={handleClearRuns}
                  title="Remove your runs and return to the example set. Your key stays."
                  style={{ ...GHOST_BTN, padding: '3px 10px' }}
                >
                  CLEAR MY RUNS
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {runs.map(run => (
                <RunCard
                  key={run.id}
                  run={run}
                  isActive={displayRun?.id === run.id}
                  onView={r => setActiveRun(r)}
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
