# Corridor Map — Specification (V1 Shipped)

**Status:** V1 shipped, FY 2025-26 live.
**Last reviewed:** 2026-04-18

This document is the reference spec for the tool as it currently exists. It describes the shipped behaviour, the design decisions that got baked in, and the boundaries that are intentionally _not_ crossed. It is not a roadmap — open items for V2 sit in [§12](#12-intentionally-deferred).

---

## 1. Purpose

A personal financial corridor map for Australian PBI / public hospital / rebatable NFP workers. It takes a handful of inputs about someone's situation and shows where they sit within the tax-favourable mechanisms ("corridors") the Australian tax system provides.

**Design principle:** Make the corridors visible. Show the math. Respect the user's intelligence. Never pretend complexity doesn't exist.

### What it is not

- Not financial advice
- Not a tax return preparation tool
- Not a budgeting or cash-flow tool
- Not a wealth management platform
- Not a replacement for a registered tax agent or financial advisor

### The underlying model

The Australian tax system embeds behaviour-shaping incentives (super concessions, PBI packaging, private health, first-home schemes, HECS). Most people don't see these corridors clearly; those who do are usually wealthy enough to have professional advisors. This tool democratises that visibility for a specific cohort (PBI / NFP workers) who would benefit from it but typically don't have access to it.

---

## 2. Audience and scope

### Primary users

- Australian residents
- Employed by a PBI (Public Benevolent Institution), public hospital, or rebatable NFP with FBT-exempt or FBT-rebatable salary packaging
- Single filer (no spouse for MLS purposes)
- Income roughly $60k–$180k (the range where the in-scope corridors bite)
- Under 65
- Some but not total financial literacy

### For-profit employees

Welcome. Every corridor except salary packaging applies identically. The packaging corridors surface as "not available" on the `for-profit` employer type.

### Explicitly out of scope for V1

- Couples / family policies (MLS family thresholds, spouse super splitting)
- Retirees / over-65s
- Self-employed / sole traders
- Multiple employers
- Users on visas without Medicare access

For any of these, the headline math is still directionally useful but should not be trusted without a registered tax agent in the loop. The About page says this plainly.

---

## 3. Tech stack

| Concern        | Choice                                                       |
| -------------- | ------------------------------------------------------------ |
| Framework      | React 19 + TypeScript                                        |
| Build          | Vite 8                                                       |
| Styling        | Tailwind CSS 4 (class-based dark mode via `@custom-variant`) |
| Routing        | React Router DOM 7                                           |
| Charting       | Recharts 3 (lazy-loaded on MLS detail page)                  |
| Testing        | Vitest 4, @testing-library/react, vitest-axe                 |
| Error handling | react-error-boundary                                         |
| Typography     | Inter (UI), JetBrains Mono (numbers), via @fontsource        |
| Hosting        | Vercel (SPA rewrite in [vercel.json](vercel.json))           |

### Key technical constraints

- **Pure functions.** All tax/super math is pure and unit-tested. `src/calc/` has no React dependency and can be audited standalone.
- **Single constants file.** `src/calc/constants.ts` holds every rate, threshold, and cap. Annual review is a single-file edit.
- **No backend.** No accounts, no server, no analytics, no tracking.
- **Client-side only.** Inputs live in sessionStorage (cleared on tab close); theme preference lives in localStorage. Scenarios are shareable via a base64url-encoded diff in the URL.

---

## 4. Financial year

V1 targets **FY 2025-26** (1 July 2025 – 30 June 2026). The financial year string is a single constant (`FINANCIAL_YEAR`, `FINANCIAL_YEAR_LABEL`) rendered in the About page and footer.

### Mid-year rate changes

PHI rebate percentages change every 1 April. Both halves of FY25-26 are baked into `constants.ts` and selected by `getCurrentPhiRebateRates(date)` based on `new Date()`. The date used shows in the MLS detail tooltip.

Annual upgrade is a constants-file edit plus a test refresh; no UI surgery expected.

---

## 5. Data model

### Inputs ([`UserInputs`](src/calc/types.ts))

```typescript
type UserInputs = {
  // Basics
  age: number; // 18-64
  grossAnnualSalary: number;

  // Employer / packaging
  employerType:
    | "PBI"
    | "Public Hospital"
    | "Rebatable NFP"
    | "For-profit"
    | "Unknown";
  currentGeneralPackaging: number;
  currentMEPackaging: number;

  // Super
  currentSuperSacrifice: number;
  employerSGRate: number; // default 0.12 for FY25-26
  deductiblePersonalSuperContributions: number;

  // Private health
  hasPrivateHospitalCover: boolean;
  privateHealthPremium: number | null;
  privateHealthPremiumPeriod: "weekly" | "fortnightly" | "monthly" | "annual";
  privateHealthRebateTreatment: "reduced-premium" | "tax-refund" | "unsure";

  // Investment (advanced, default 0)
  netFinancialInvestmentLosses: number;
  netRentalPropertyLosses: number;

  // Study loan
  hasHECS: boolean;
  hecsBalance: number | null;

  // Goals (affect corridor status thresholds, not raw math)
  propertyGoal: "none" | "within-12m" | "1-3y" | "3y-plus";
};
```

### Derived ([`DerivedValues`](src/calc/types.ts))

Computed from inputs by `deriveValues()` in a single pass. Covers taxable income, RFBA, MLS income, HECS repayment income, MLS/rebate tier, marginal tax rates (three flavours: income-only, +Medicare, +STSL), packaging utilisation, super cap remaining, PHI net cost, MLS break-even premium, HECS marginal rate and annual repayment.

### Constants ([`src/calc/constants.ts`](src/calc/constants.ts))

Tax brackets, Medicare levy, MLS thresholds, PHI rebate rates (pre- and post-1-April), age-based discount table, super cap, SG rate, contributions tax, packaging caps (PBI / public hospital / rebatable), RFBA gross-up factor, HECS threshold schedule.

Every constant carries a source comment pointing to the ATO or PrivateHealth.gov.au page it came from.

### Status thresholds ([`src/calc/thresholds.ts`](src/calc/thresholds.ts))

Separate module for the tuning knobs that decide when a corridor shows green / amber / red / grey. Keeping these out of the calculation module means UX tuning does not touch the math.

---

## 6. Calculation conventions

### Rounding

- Internal math is precise (no rounding until display).
- User-facing dollar figures round to the nearest $10 via `<Money round10>` to avoid false precision.
- Percentages display with 0–2 decimal places depending on context.

### MLS income

```text
mlsIncome =
  taxableIncome
  + rfba
  + netFinancialInvestmentLosses
  + netRentalPropertyLosses
  + currentSuperSacrifice
  + deductiblePersonalSuperContributions
```

The surcharge rate is applied to `mlsIncome` directly. This is a V1 simplification that is exact for users with no investment losses (the expected cohort) and slightly conservative otherwise.

### RFBA

Applies only to `PBI` and `Public Hospital` employers:

```text
rfba = (currentGeneralPackaging + currentMEPackaging) × 1.8868
```

The gross-up factor is the Type 2 FBT rate. `Rebatable NFP` packaging does not add to RFBA for MLS purposes but does carry a 47% FBT rebate — modelled descriptively on the packaging detail page rather than through a separate calculation path.

### HECS repayment income

```text
hecsRepaymentIncome =
  taxableIncome
  + rfba
  + currentSuperSacrifice
  + netFinancialInvestmentLosses
  + netRentalPropertyLosses
```

Applied against the marginal HECS schedule from `HECS_THRESHOLDS_2025_26`.

### PHI net cost

Depends on `privateHealthRebateTreatment`:

- `reduced-premium` — user already receives the rebate on their bill. Net cost = amount paid.
- `tax-refund` — user pays full premium, claims the rebate at tax time. Net cost = premium × (1 − rebate%).
- `unsure` — treated as `reduced-premium` (conservative) with a prompt to check.

The MLS corridor surfaces the **break-even net annual cost** — the premium under which buying cover is cheaper than paying the MLS.

---

## 7. Corridors (all shipped)

| #   | Corridor                         | Route                         | Type        | Headline                       |
| --- | -------------------------------- | ----------------------------- | ----------- | ------------------------------ |
| 1   | MLS / Private Health             | `/corridor/mls`               | Computed    | Net PHI cost or MLS liability  |
| 2   | Packaging — General Cap          | `/corridor/packaging-general` | Computed    | Utilisation % + tax saved      |
| 3   | Packaging — Meal & Entertainment | `/corridor/packaging-me`      | Computed    | Utilisation % + tax saved      |
| 4   | Super Concessional Cap           | `/corridor/super`             | Computed    | Cap headroom + top-up value    |
| 5   | First Home Super Saver (FHSS)    | `/corridor/fhss`              | Descriptive | Context + decision prompts     |
| 6   | Work-related Deductions          | `/corridor/deductions`        | Descriptive | Checklist of common categories |
| 7   | HECS / STSL                      | `/corridor/hecs`              | Computed    | Marginal repayment % + $/yr    |

**Computed** corridors produce numbers. **Descriptive** corridors produce structured context and decision prompts only — deductions and FHSS are judgement calls, and showing a number would imply precision the tool can't honour.

Every detail page follows the same frame: _In plain terms → Where you are → The math → What the tax system is steering → If you want to act on this → Gotchas_.

---

## 8. UI principles

### Non-hostile architecture

No celebration animations. No dark patterns. No gamification. No "you could have saved $X" guilt framing. The tool informs — it does not nudge.

- Plain language first, jargon second (with `<Term>` tooltips for every acronym).
- Every calculated number has a tooltip showing the formula.
- Status colours (green / amber / red / grey) are advisory, not judgemental. Copy softens the reds: _"room to improve"_, not _"you're losing money"_.
- "If you want to act on this" — not "Next actions". User is in charge.

### Information density over emotional nudging

Numbers are monospaced (JetBrains Mono). Math rows mirror what a payslip or ATO notice looks like. Tooltips reveal the formula, not a celebratory explainer.

### Accessibility

- WCAG AA as the floor, not the ceiling. Tested via `vitest-axe` on Home, Inputs, Map, and NotFound.
- ARIA: `role="progressbar"` with `aria-valuenow/min/max` on utilisation bars; `role="radiogroup"` + `role="radio"` on the theme toggle; `role="status"` + `aria-live="polite"` for the share-link copy confirmation; `aria-describedby` wiring every form hint to its input.
- Cognitive accessibility: progressive disclosure on Inputs, glossary tooltips everywhere, consistent page frame, no surprise state transitions.
- Trauma-informed copy: HECS page explicitly frames the loan as "not a debt in the ordinary sense" since nothing's owed beyond income and there's no interest.
- Light / dark / auto theme with localStorage persistence and `color-scheme` propagation.

### Visual design

- Stone-family neutrals with minimal chromatic accents (amber for warnings, emerald for well-optimised).
- Inter for UI, JetBrains Mono for numerals.
- No brand illustrations, no stock imagery.

---

## 9. Persistence and sharing

### Inputs

Stored in `sessionStorage` under `corridor-map.inputs.v2`. Cleared on tab close. Deliberately not persisted across sessions — the tool is a thinking space, not a financial dashboard.

### Theme

Stored in `localStorage` under `corridor-map:theme`. Persists across sessions. Valid values: `light | dark | auto`.

### Share links

`src/state/shareLink.ts` encodes a diff-from-defaults of `UserInputs` as base64url JSON and appends it as `?s=<blob>` to the `/map` URL. On load, `decodeInputs()` merges back over defaults. Only non-default fields are encoded, keeping URLs short.

**Warning shown in the copy-link confirmation:** the URL contains the user's financial inputs. The About page repeats this.

---

## 10. Build, test, deploy

```bash
npm run dev           # Vite dev server
npm run build         # tsc -b + vite build
npm run preview       # serve built dist
npm run typecheck     # tsc -b --noEmit
npm run lint          # eslint . --fix
npm run format        # prettier --write .
npm run test          # vitest run
npm run test:watch    # vitest in watch mode
npm run fix           # format + lint + typecheck + test
```

### Test coverage

Four suites, 71 passing tests:

- `src/calc/calculations.test.ts` — pure math (tax, Medicare, MLS, HECS, PHI, super)
- `src/calc/corridors.test.ts` — corridor summary generators (status + headline + insight logic)
- `src/state/shareLink.test.ts` — URL encode/decode round-trips
- `src/test/a11y.test.tsx` — axe-core checks on Home, Inputs, Map, NotFound

### Deploy

Vercel. [vercel.json](vercel.json) has a catch-all rewrite so client-side routes survive a refresh.

---

## 11. Disclaimers, baked in

- Footer on every page: FY label + "not financial advice".
- About page: who it's for (PBI / public hospital / rebatable NFP / for-profit), simplifying assumptions (single filer, no investment property, no trust distributions, no spouse for MLS), and the pointer to the ATO and registered agents when the scope doesn't fit.
- Every detail page carries "Verify with your payroll/advisor before acting" under the "If you want to act on this" section.
- No corridor claims precision it doesn't have. Break-even premium is the only "hard" optimisation recommendation; everything else is framed as headroom or context.

---

## 12. Intentionally deferred

Not planned for near-term V1 updates. Order is roughly suggestive priority, not commitment.

- **Couples / family policies.** MLS has different thresholds; super splitting and spouse contributions open new corridors.
- **FHSS calculator.** Currently descriptive only. A full calculator needs deposit modelling, release-timing rules, and FHSS-released-income interactions with MLS/HECS.
- **Retirees / over-65s.** Different PHI rebate tables, transition-to-retirement rules.
- **Multiple employers.** Concessional cap sharing, reportable super handling.
- **Scenario comparison.** "What if I packaged more?" A/B view.
- **Year-over-year history.** Would imply persistence and an account system; currently rejected.
- **Investment / capital gains modelling.** Genuinely complex; needs its own design pass.
- **State-specific considerations** (e.g. first-home buyer stamp duty).

---

## 13. Maintenance touchpoints

When rates change (usually annually on 1 July, plus PHI on 1 April):

1. Edit [`src/calc/constants.ts`](src/calc/constants.ts) — every rate has a source comment.
2. Update `FINANCIAL_YEAR` and `FINANCIAL_YEAR_LABEL`.
3. Refresh test fixtures in `calculations.test.ts` and `corridors.test.ts`.
4. Update the changelog paragraph on the About page if any logic changed (not just rates).
5. `npm run fix` — if it's green, ship.

---

## End of spec
