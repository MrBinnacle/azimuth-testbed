// Shared constants for the app and the run-generation script.

// Two groups: the Boeing calibration set (same decision, three framings) and a
// domain-breadth set drawn from AZIMUTH's Layer-3 scope, so the testbed reads as
// a general decision tool, not a Boeing-specific one.
export const PROMPT_VARIANTS = [
  {
    id: 'boeing-full',
    label: 'Boeing — full brief',
    category: 'calibration',
    text: 'We are Boeing. It is December 2011. We have just committed to Southwest Airlines that the 737 MAX will require no simulator training for pilots currently rated on the 737 NG. Southwest has ordered 280 aircraft. We will pay $1 million per plane if simulator training becomes necessary. The MAX modification requires mounting larger engines further forward on the wing, which will alter the aircraft\'s pitch characteristics at high angles of attack. We plan to address this with a software compensation system. Assess this commitment.',
  },
  {
    id: 'boeing-thin',
    label: 'Boeing — bare facts',
    category: 'calibration',
    text: 'We have committed to a major airline customer that a new aircraft variant will require no additional pilot training. The modification changes the aircraft\'s aerodynamic behavior. We plan to use software to compensate. A $1M per plane penalty applies if training becomes necessary. 280 aircraft ordered. Assess this commitment.',
  },
  {
    id: 'boeing-adversarial',
    label: 'Boeing — optimistic spin',
    category: 'calibration',
    text: 'We\'ve secured a 280-aircraft order from our largest customer, locking in a major competitive win against Airbus. Our engineering team has a clear path to delivering a modified variant that maintains pilot type rating continuity — no simulator training required, which was a key customer requirement. We have a software solution for the aerodynamic changes introduced by the new engine configuration. This is a strong program with committed demand. Assess readiness to proceed.',
  },
  {
    id: 'legacy-rewrite',
    label: 'Legacy rewrite — codebase',
    category: 'domain',
    text: 'We\'re planning to rewrite our legacy billing service in Q3. 8 weeks, 2 engineers. The service has 12 years of accumulated edge cases and a known single-engineer domain-knowledge SPOF. Customer-facing; downstream of every order. We have rollback infrastructure but it hasn\'t been tested in 6 months. Goal: ship clean billing for the EU expansion in Q4.',
  },
  {
    id: 'vp-sales-hire',
    label: 'VP of Sales hire — hiring',
    category: 'domain',
    text: 'We\'re about to extend an offer to a VP of Sales. The candidate has strong network in our target segment but no formal background check has been completed. Our hiring manager has not done structured interviews — assessment was three social meetings. Comp band is at the top of our budget. The seat is open because the prior VP was fired for performance; replacement urgency is high. The candidate\'s references are all from the candidate\'s own list.',
  },
  {
    id: 'newsletter-launch',
    label: 'Paid newsletter launch — product launch',
    category: 'domain',
    text: 'We\'re launching a paid newsletter for indie game developers. Beta opens November 15; public launch December 1. Target: 500 paid subscribers at $8/month within 90 days. Scope: weekly newsletter, members-only Discord, annual industry trends report. Owner: me, full-time. Dependencies: Substack platform, my existing 3,200-person email list, three established game-dev voices as occasional guest writers. Subscription model can be paused; content can stay free. $2K marketing already committed. 6 months opportunity cost if wrong.',
  },
  {
    id: 'iot-anomaly-bbp',
    label: 'IoT anomaly detection — build vs buy vs partner',
    category: 'domain',
    text: 'We need real-time anomaly detection for our IoT fleet (10K devices). Three paths under evaluation: (1) Build internally — 6 months, two engineers, custom model trained on our data; (2) Buy from Datadog/Splunk — $180K/year, 4-week integration, generic models; (3) Partner with a startup — 6-week pilot, equity component, joint roadmap. Capability is core to our SLA promises and customer-visible. Anomaly detection accuracy is the primary success metric. Engineering team has prior ML experience but no production time-series experience.',
  },
]

// Current, non-retired model IDs. Opus 4.7 is the default for live runs and
// for regenerating the prestaged Boeing series.
export const MODELS = [
  { id: 'claude-opus-4-7', label: 'Opus 4.7' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6' },
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5' },
]

export const DEFAULT_MODEL = MODELS[0].id

export const ALL_TAGS = ['fresh-context', 'thin-prompt', 'adversarial', 'full-framing', 'contaminated']
