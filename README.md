# Corridor Map

**A tax corridor map for Australian PBI workers.**

Australia's tax system builds differential treatment into certain behaviours — super concessions, PBI salary packaging, private health, first-home schemes, HECS. Most people don't see these corridors clearly. Those who do are usually wealthy enough to have professional advisors.

Corridor Map is a thinking tool for a specific cohort — workers at Public Benevolent Institutions, public hospitals, and rebatable NFPs — who can access FBT-exempt salary packaging and therefore see every corridor the system offers. It takes a handful of inputs and shows you where you sit inside each one.

- **Not financial advice.**
- **No accounts, no servers, no tracking** — your inputs never leave your browser.
- **Every number carries its formula** in a tooltip. Nothing is hidden.

---

## What it does

Seven corridors, each with its own detail page:

| Corridor                       | What it shows                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **MLS / Private Health**       | Your tier, MLS liability if uncovered, net PHI cost if covered, and the break-even premium between the two.           |
| **Salary Packaging — General** | Utilisation of your $15,900 (PBI) or $9,010 (public hospital) FBT-exempt cap and the tax saved at your marginal rate. |
| **Salary Packaging — M&E**     | Same for the $2,650 meal & entertainment cap.                                                                         |
| **Super Concessional Cap**     | Employer SG + your sacrifice vs. the $30k cap, plus the marginal value of topping up.                                 |
| **First Home Super Saver**     | Structured context and decision prompts — not a calculator (release-timing rules make precision misleading).          |
| **Work-related Deductions**    | Checklist of commonly under-claimed categories for sector workers.                                                    |
| **HECS / STSL**                | Your repayment income, marginal repayment rate, and how packaging interacts with the threshold.                       |

Each detail page follows the same frame:

1. **In plain terms** — what the corridor is, in a sentence.
2. **Where you are** — your position, visualised.
3. **The math** — every derivation, line by line.
4. **What the tax system is steering** — the policy intent.
5. **If you want to act on this** — not "next actions". You decide.
6. **Gotchas** — the things that trip people up.

---

## Who it's for

- Australian residents, employed by a PBI / public hospital / rebatable NFP
- Single filers (couples are deferred to V2)
- Under 65
- Roughly $60k–$180k — the range where these corridors bite

For-profit employees are welcome too. Every corridor except salary packaging applies identically; the packaging corridors show as "not available" and everything else still works.

For situations that sit outside this scope (partnered, retired, contractor-heavy, very high or low income), the mechanisms still apply but the specific numbers may not match. The [ATO](https://www.ato.gov.au) or a registered agent is the right next stop.

---

## Design principles

**Make the corridors visible.** The tax system's incentives are legible once you see the structure. This tool draws the structure.

**Show the math.** Every calculated number has a tooltip revealing the formula. The calculation module is a single directory of pure functions — you can audit the arithmetic by reading [`src/calc/`](src/calc/).

**Respect the user's intelligence.** No celebration animations. No guilt framing. No dark patterns. No gamification. Information density over emotional nudging.

**Accessibility is broader than WCAG.** The tool aims for WCAG AA as a floor, and the pass goes further — cognitive accessibility (progressive disclosure, consistent frames, inline glossary), trauma-informed copy (HECS page frames the loan as "not a debt in the ordinary sense"), non-hostile architecture (no dark patterns, softened status language), sensory (light/dark/auto theme, monospaced numbers for scannability), and customisation.

**Privacy by construction.** No backend. No analytics. No cookies. Inputs live in sessionStorage and clear on tab close. Theme preference is the only thing that persists across sessions. Share links encode a diff of your inputs in the URL fragment — the warning is shown with the copy-link action.

---

## Quick start

```bash
git clone <this-repo>
cd corridor-map
npm install
npm run dev
```

Open `http://localhost:5173`.

### Scripts

```bash
npm run dev           # Vite dev server (HMR)
npm run build         # tsc -b + vite build
npm run preview       # serve the built dist locally
npm run test          # vitest run — 71 passing tests
npm run test:watch    # vitest in watch mode
npm run typecheck     # tsc -b --noEmit
npm run lint          # eslint . --fix
npm run format        # prettier --write .
npm run fix           # format + lint + typecheck + test, in sequence
```

`npm run fix` is the pre-commit / pre-PR gate.

---

## Architecture

```text
src/
├── calc/                  pure functions, zero React dependency
│   ├── constants.ts       every rate, threshold, cap — single source of truth
│   ├── calculations.ts    tax / Medicare / MLS / HECS / PHI / super math
│   ├── corridors.ts       corridor summary generators (status + headline + insight)
│   ├── thresholds.ts      green / amber / red tuning knobs
│   ├── types.ts           UserInputs, DerivedValues, CorridorCardSummary
│   └── *.test.ts          Vitest suites
│
├── state/
│   ├── InputsContext.tsx  provider + sessionStorage persistence
│   ├── useInputs.ts       hook: { inputs, derived, setInput, reset }
│   ├── useTheme.ts        light / dark / auto with localStorage
│   ├── shareLink.ts       base64url diff encoding for /map?s=...
│   └── presets.ts         three PBI persona scenarios
│
├── components/            layout primitives: CorridorCard, CorridorFrame,
│                          Money, Percent, ProgressBar, StatusBadge,
│                          Fields, Glossary, ThemeToggle, Layout, ...
│
└── routes/
    ├── Home.tsx           intro + presets
    ├── Inputs.tsx         progressive-disclosure form
    ├── Map.tsx            corridor card grid + share link
    ├── About.tsx          scope, methodology, privacy, colophon
    ├── NotFound.tsx
    └── corridors/
        ├── MlsDetail.tsx
        ├── PackagingGeneralDetail.tsx
        ├── PackagingMeDetail.tsx
        ├── SuperDetail.tsx
        ├── FhssDetail.tsx
        ├── DeductionsDetail.tsx
        └── HecsDetail.tsx
```

### Key architectural choices

- **Pure calculation layer.** `src/calc/` has no React dependency and can be unit-tested against known ATO figures. All UI derives from `deriveValues(inputs)` — one function, one place to audit.
- **Constants in one file.** [`src/calc/constants.ts`](src/calc/constants.ts) holds every rate and threshold with a source comment. Annual rate update is a single-file edit.
- **Status tuning is separate from math.** `thresholds.ts` decides when a corridor reads green / amber / red. UX tuning never touches the calculation module.
- **Diff-based share links.** Only non-default inputs are encoded, keeping URLs short.
- **Lazy charts.** Recharts is loaded only when a user opens the MLS detail page.

---

## Financial year

V1 targets **FY 2025-26 (1 July 2025 – 30 June 2026)**.

PHI rebate rates change every 1 April. Both halves of FY25-26 are baked in; the applicable rate is picked at calculation time based on the system date.

Annual update checklist is in [corridor-map-spec.md §13](corridor-map-spec.md#13-maintenance-touchpoints).

---

## Testing

```bash
npm run test
```

71 passing tests across four suites:

- `calculations.test.ts` — tax, Medicare, MLS, HECS, PHI, super
- `corridors.test.ts` — corridor summary generators (green / amber / red / grey)
- `shareLink.test.ts` — URL round-trips
- `a11y.test.tsx` — axe-core checks on Home, Inputs, Map, NotFound

---

## Tech stack

React 19 · TypeScript · Vite 8 · Tailwind 4 · React Router 7 · Recharts 3 · Vitest · axe-core · deployed on Vercel.

No CSS-in-JS. No state management library beyond React Context. No tracking, analytics, or external API calls.

---

## Deploying

Push to a Vercel project. [`vercel.json`](vercel.json) contains a catch-all rewrite so client-side routes (e.g. `/corridor/mls`) survive a page refresh.

For any other host: configure SPA-style routing to serve `dist/index.html` for unknown paths.

---

## Contributing

This is a personal tool built for a small sector cohort, but issues and PRs are welcome — especially corrections to the tax/super math or the rate tables. Before opening a PR, run `npm run fix` and make sure the 71 tests still pass.

If you spot a number that disagrees with the ATO, open an issue with the ATO reference. Rate corrections take priority over feature requests.

---

## Authoritative References

- [ATO](https://www.ato.gov.au)
- [PrivateHealth.gov.au](https://www.privatehealth.gov.au).

---

## License

MIT. See [LICENSE](LICENSE) if present, or add one before forking.

---

**Not financial advice.** Tax rules change annually. Numbers shown are for FY 2025-26. Always verify with a qualified professional before acting.
