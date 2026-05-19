# AZIMUTH

Decision-quality pre-commitment analysis. You put in a decision. You get a real analysis back.

AZIMUTH is a structured reasoning framework that stress-tests plans before commitment. It routes decisions through a ten-module engine — objective integrity, assumption audit, constraint reality check, incentive scan, dependency fragility, failure path construction, base rate analysis, detectability and recovery, mitigation design — and returns a verdict with confidence rating and explicit reasoning.

Nine possible verdicts: REJECT / PILOT FIRST / PROCEED / PROCEED WITH SAFEGUARDS / REDUCE SCOPE / DELAY PENDING EVIDENCE / INSUFFICIENT SIGNAL.

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

## The Boeing methodology runs

The tool ships with three pre-loaded Boeing 737 MAX prompt variants. All methodology runs on `claude-opus-4-5`.

| Run | Prompt | Context | Verdict | Confidence |
|---|---|---|---|---|
| 2 | Full framing | Clean | REJECT | HIGH |
| 3 | Thin (parameters only) | Clean | REJECT | HIGH |
| 4 | Adversarial (confident register) | Clean | DELAY PENDING EVIDENCE | LOW† |

Verdict stable across full-framing and thin-prompt conditions. The adversarial run produced DELAY rather than REJECT because the confident framing omitted the penalty clause — the tool identified the missing structural information and asked for it rather than proceeding.

The thin prompt produced explicit MCAS pattern recognition from a prompt containing no company name, no aircraft name, no historical reference: "Base rate for this exact strategy succeeding without training requirement: 0% in the post-MAX regulatory environment."

The irreconcilable structure is visible in the decision parameters alone.

† Opus 4.5 applied the M10 confidence ceiling more aggressively to sparse-evidence inputs; the verdict is stable, the confidence calibration is arguably more precise.

**Run 1 (full framing, contaminated context):** AZIMUTH paused at the M4 PRE-CHECK and issued a structured three-question interview rather than proceeding to verdict — a different protocol path from implicit session contamination in earlier Sonnet 4 runs. Methodologically significant as evidence that explicit context pre-loading and implicit session contamination trigger different protocol behavior; excluded from the main table because the finding is about protocol behavior, not the Boeing decision analysis.

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
