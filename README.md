# AZIMUTH

Decision-quality pre-commitment analysis. You put in a decision. You get a real analysis back.

AZIMUTH is a structured reasoning framework that stress-tests plans before commitment. It routes decisions through a ten-module engine — objective integrity, assumption audit, constraint reality check, incentive scan, dependency fragility, failure path construction, base rate analysis, detectability and recovery, mitigation design — and returns a verdict with confidence rating and explicit reasoning.

Nine possible verdicts: REJECT / PILOT FIRST / PROCEED / PROCEED WITH SAFEGUARDS / REDUCE SCOPE / DELAY PENDING EVIDENCE / INSUFFICIENT SIGNAL.

---

## Use the hosted version

No installation. No account. Enter your Anthropic API key, load a prompt, run it.

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

The tool ships with three pre-loaded Boeing 737 MAX prompt variants used in a four-run methodology test:

| Run | Prompt | Context | Verdict | Confidence |
|---|---|---|---|---|
| 0 | Full framing | Contaminated (research pre-loaded) | REJECT | Medium |
| 1 | Full framing | Clean | REJECT | HIGH |
| 2 | Thin (parameters only) | Clean | REJECT | HIGH |
| 3 | Adversarial (confident register) | Clean | DELAY PENDING EVIDENCE | HIGH |

Verdict stable across full-framing and thin-prompt conditions. The adversarial run produced DELAY rather than REJECT because the confident framing omitted the penalty clause — the tool identified the missing structural information and asked for it rather than proceeding.

The irreconcilable structure is visible in the decision parameters alone.

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
- Model: `claude-sonnet-4-20250514`, max_tokens 4000

---

## License

MIT — see [LICENSE](LICENSE)
