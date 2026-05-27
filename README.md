# AZIMUTH

Decision-quality pre-commitment analysis. You put in a decision. You get a real analysis back.

AZIMUTH is a structured reasoning framework that stress-tests plans before commitment. It routes decisions through a ten-module engine — objective integrity, assumption audit, constraint reality check, incentive scan, dependency fragility, failure path construction, base rate analysis, detectability and recovery, mitigation design — and returns a verdict with confidence rating and explicit reasoning.

Verdicts are drawn from a fixed taxonomy: PROCEED · PROCEED WITH SAFEGUARDS · PILOT FIRST · REDUCE SCOPE · DELAY PENDING EVIDENCE · REJECT · INSUFFICIENT SIGNAL · WRONG TOOL · RESIDUAL-RISK-REGISTER. See the skill repo for when each fires.

---

## Use the hosted version

No installation. No signup. Bring your own Anthropic API key, load a prompt, run it.

**[https://azimuth-testbed.netlify.app](https://azimuth-testbed.netlify.app)**

---

## Privacy

Your key goes directly to Anthropic from your browser. Nothing touches our servers. There is no backend.

- API key is held in memory only — cleared when you close the tab
- Run log is in memory only — nothing is persisted or transmitted
- No analytics, no logging, no tracking

This is a static React app. The Anthropic API call goes from your browser to `api.anthropic.com` directly. You can verify this by reading the source.

---

## Methodology calibration — two cases

The testbed ships with two known-outcome decisions pre-loaded: Boeing's 2011 retrofit choice (the 737 MAX) and the October 2013 Healthcare.gov launch. AZIMUTH is applied retroactively to briefs constructed only from pre-decision public evidence. The goal isn't to claim AZIMUTH would have prevented either outcome — it's to show how the verdict and confidence track the evidence across hostile prompts.

### Boeing 737 MAX

Three prompt variants. All methodology runs on `claude-opus-4-5`.

| Run | Prompt | Context | Verdict | Confidence |
|---|---|---|---|---|
| 2 | Full framing | Clean | REJECT | HIGH |
| 3 | Thin (parameters only) | Clean | REJECT | HIGH |
| 4 | Adversarial (confident register) | Clean | DELAY PENDING EVIDENCE | LOW† |

Across these conditions: stable verdicts where evidence supports them; calibrated confidence when evidence is missing. The adversarial run produced DELAY rather than REJECT because the confident framing omitted the penalty clause — the tool identified the missing structural information and asked for it rather than proceeding.

The thin prompt produced explicit MCAS pattern recognition from a prompt containing no company name, no aircraft name, no historical reference: "Base rate for this exact strategy succeeding without training requirement: 0% in the post-MAX regulatory environment."

The irreconcilable structure is visible in the decision parameters alone.

† Opus 4.5 applied the M10 confidence ceiling more aggressively to sparse-evidence inputs; the verdict is stable, the confidence calibration is arguably more precise.

**Run 1 (full framing, contaminated context):** AZIMUTH paused at the M4 PRE-CHECK and issued a structured three-question interview rather than proceeding to verdict — a different protocol path from implicit session contamination in earlier Sonnet 4 runs. Methodologically significant as evidence that explicit context pre-loading and implicit session contamination trigger different protocol behavior; excluded from the main table because the finding is about protocol behavior, not the Boeing decision analysis.

### Healthcare.gov

A single pre-launch decision brief, built entirely from pre-October-2013 public documentation (the September 2013 OIG audit, GAO findings, CBO projections). AZIMUTH returns `DELAY PENDING EVIDENCE`. Calibration against the documented post-mortem: **5/6 documented failure causes surfaced; 0 false positives across 4 Critical Risks; 1 miss honestly disclosed** in the case study appendix (`examples/case-study-healthcare-gov.md` in the skill repo).

The miss matters more than the hits — over-claiming "AZIMUTH caught Healthcare.gov" would be a credibility tax that the artifact pays for. The honest disclosure is the point.

---

## Run locally

```bash
git clone https://github.com/MrBinnacle/azimuth-testbed
cd azimuth-testbed/testbed
npm install
npm run dev
```

Open `http://localhost:5173`. Enter your Anthropic API key when prompted.

To skip the modal during development, create `testbed/.env` with:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## Stack

- React 18 + Vite 5
- No backend, no database, no auth
- Anthropic direct browser API (`anthropic-dangerous-direct-browser-access`)
- Model: `claude-opus-4-5`, max_tokens 4000

---

## License

MIT — see [LICENSE](LICENSE)
