# AZIMUTH — hosted testbed

Pressure-test a big decision before you commit to it. You describe the call you're about to make; AZIMUTH argues against your plan, names the assumption everything rests on, and returns a clear verdict — proceed, reject, or something in between — with the reasoning.

This repo is the **hosted testbed**: a browser version you can try with no install. It runs the real [AZIMUTH skill](https://github.com/MrBinnacle/azimuth) for Claude Code, 1:1 — see [How it works](#how-it-works) below.

**Try it → [azimuth-testbed.netlify.app](https://azimuth-testbed.netlify.app)**

## What makes it different

- **It commits to a verdict.** Most tools hand you a list of risks and leave the call to you. AZIMUTH leads with a recommendation and defends it.
- **It argues against your plan.** It's built to find what would have to be true for the plan to work, and to say plainly when those things aren't true. It won't soften the answer to keep you comfortable.
- **It can't be spun into "yes."** See the Boeing example below: the same decision described three ways — fully, stripped to bare facts, and pitched optimistically — and the verdict holds REJECT every time. Only the confidence moves.
- **Confidence reflects evidence, not framing.** Thin evidence lowers the confidence rating; an optimistic pitch doesn't raise it.

## The Boeing example (no key needed)

The testbed opens on a real decision with a known ending: Boeing's 2011 choice to re-engine the 737 rather than build a new plane, which led to the MAX crashes — 346 deaths, worldwide grounding, $20B+ in losses. We gave AZIMUTH that decision described three ways, using only what was knowable in 2011:

| Framing | Verdict | Confidence |
|---|---|---|
| Full brief | REJECT | High |
| Bare facts only | REJECT | Medium |
| Optimistic spin | REJECT | Medium |

Same decision, three tellings — the verdict doesn't move; only the confidence does. Optimistic framing doesn't soften the answer — it lowers what the model will claim to be sure of. Each run loads the full reference set the skill would pull in DEEP mode. (Generated on `claude-opus-4-7`; an earlier Sonnet run is kept in the log for comparison.)

This is a known-outcome illustration of how the verdict behaves — not a claim that AZIMUTH would have changed history.

It isn't a Boeing-specific tool. The testbed also ships example decisions across AZIMUTH's domains — a legacy-code rewrite, a VP hire, a paid-newsletter launch, and a build-vs-buy-vs-partner call — and your own decision is the primary surface.

## Run your own decision

No signup. Bring your own Anthropic API key:

1. Open [the testbed](https://azimuth-testbed.netlify.app).
2. Click **Add key** (top right) and paste your `sk-ant-…` key. It goes straight from your browser to Anthropic, never to us.
3. Type a decision and press **Run**.

You don't need a key to read the Boeing example or the other samples — only to run your own.

## How it works

The testbed doesn't fake the analysis. It runs the actual [AZIMUTH skill](https://github.com/MrBinnacle/azimuth): the model loads the skill's reference, diagnostics, and domain-policy files on demand — exactly as it would inside Claude Code — and works through a ten-step engine (objective integrity, assumption audit, constraint check, incentive scan, dependency map, failure paths, base rates, detectability, mitigation, verdict).

Verdicts come from a fixed set: PROCEED · PROCEED WITH SAFEGUARDS · PILOT FIRST · REDUCE SCOPE · DELAY PENDING EVIDENCE · REJECT · INSUFFICIENT SIGNAL · WRONG TOOL · RESIDUAL-RISK-REGISTER.

Pinned to skill [v1.5.0](https://github.com/MrBinnacle/azimuth/releases/tag/v1.5.0). The skill files are vendored into `testbed/skill-bundle.json`; the canonical rule set lives in [BEHAVIOR_SPEC.md](https://github.com/MrBinnacle/azimuth/blob/master/BEHAVIOR_SPEC.md) in the skill repo.

## Privacy

Your key goes directly from your browser to `api.anthropic.com`. There is no backend.

- Key held in memory only — cleared when you close the tab.
- Run log in memory only — nothing is persisted or transmitted.
- No analytics, no logging, no tracking.

You can verify all of this by reading the source.

## Run locally

```bash
git clone https://github.com/MrBinnacle/azimuth-testbed
cd azimuth-testbed/testbed
npm install
npm run dev
```

Open `http://localhost:5173`. Click **Add key** to run your own decision, or read the examples without one.

For development you can preset a key in `testbed/.env`:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

To refresh the vendored skill and regenerate the prestaged Boeing runs after a skill release (needs a local checkout of the skill repo and a key):

```bash
cd testbed
npm run bundle:skill                                  # re-vendor skill-bundle.json from ../../azimuth
ANTHROPIC_API_KEY=sk-ant-... npm run generate:runs    # regenerate prestaged-runs.json
```

## Stack

- React 18 + Vite 5 — no backend, no database, no auth
- Anthropic browser API (`anthropic-dangerous-direct-browser-access`), multi-turn tool-use loop that loads skill files on demand
- Models selectable: `claude-opus-4-7` (default), `claude-sonnet-4-6`, `claude-haiku-4-5`

## Links

- Hosted testbed — https://azimuth-testbed.netlify.app
- AZIMUTH skill (install for Claude Code) — https://github.com/MrBinnacle/azimuth
- Landing page — https://mrbinnacle.github.io/azimuth

## License

MIT — see [LICENSE](LICENSE)
