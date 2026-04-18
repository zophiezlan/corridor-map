# Corridor Map — V1 Specification

**For:** Claude Code handover
**Author context:** Clancy (they/them), Drug Checking Peer Service Lead at NUAA (PBI). Building this for self and a few sector friends, all at similar-sized Australian PBIs/NFPs.
**Status:** Greenfield, no code yet. This document is the starting context.

---

## 1. Purpose and framing

### What this is

A personal financial corridor map for Australian PBI/NFP workers. It takes a handful of inputs about someone's current financial situation and shows them where they sit within the tax-favourable mechanisms ("corridors") the Australian tax system provides. For simple, computable corridors, it calculates their position, utilisation, and marginal value of next actions. For complex or judgement-heavy corridors, it provides structured descriptions with decision prompts.

### What this is NOT

- Not financial advice
- Not a tax return preparation tool
- Not a budgeting or cash flow tool
- Not a wealth management platform
- Not trying to replace a real financial advisor

### The underlying model

Taxation is a social engineering mechanism. The government builds differential tax treatment into certain behaviours to nudge them (super concessions, PBI packaging, private health, first home buyer schemes, etc.). Most people don't see these corridors clearly, and those who do are usually wealthy enough to have professional advisors. This tool democratises that visibility for a specific cohort (PBI/NFP workers) who would benefit from it but typically don't have access to it.

**Design principle:** Make the corridors visible. Show the math. Respect the user's intelligence. Never pretend complexity doesn't exist.

---

## 2. Audience and assumptions

### Primary users

- Australian residents
- Employed by a PBI (Public Benevolent Institution) or similar NFP with FBT-exempt salary packaging
- Single (initially — couples/families are V2)
- Income roughly $60k–$180k (most relevant income range for the corridors in scope)
- Some but not total financial literacy — able to read a payslip, may not fully understand salary packaging implications
- Under 65 (simplifies rebate tier calculations)

### Known non-goals for V1

- Couples/family policies
- Retirees / over-65s
- Self-employed / sole traders
- Multiple employers
- Non-PBI NFP employees (slightly different rules — different FBT cap)
- Users on visas without Medicare access

These can be added in V2. For V1, flag them clearly at entry and redirect ("this tool isn't built for your situation yet").

---

## 3. Tech stack

- **Framework:** React + TypeScript
- **Hosting:** Vercel (author is familiar with this deployment)
- **Styling:** Tailwind CSS (standard and well-documented)
- **State:** Local React state only for V1. No accounts, no backend, no persistence across sessions. URL-encoded state for shareable/bookmarkable scenarios is a nice-to-have.
- **No database** for V1. If persistence becomes necessary in V2, Supabase is the author's preferred stack.
- **Build:** Vite

### Key technical constraints

- All calculations must be pure functions in TypeScript, separated from UI components, and unit tested.
- Financial year hard-coded as a constant at the top of the calculation module. V1 targets **FY 2025-26** (1 July 2025 – 30 June 2026). Next FY's update is a future task, not V1's concern.
- All rates, thresholds, and rebate percentages loaded from a single `constants.ts` file so they're easy to audit and update.

---

## 4. Data model

### User inputs

```typescript
type UserInputs = {
  // Basic
  age: number; // 18-64 for V1
  grossAnnualSalary: number; // pre-tax annual salary

  // Employer
  employerType:
    | "PBI"
    | "Public Hospital"
    | "Rebatable NFP"
    | "For-profit"
    | "Unknown";
  // PBI cap: $15,900 general + $2,650 M&E
  // Public hospital cap: $9,010 general + $2,650 M&E
  // Rebatable: no FBT-exempt cap but 47% rebate up to $30k grossed-up
  // For-profit / unknown: no packaging assumed

  // Current packaging status
  currentGeneralPackaging: number; // dollars per year, post-tax equivalent
  currentMEPackaging: number; // dollars per year

  // Super
  currentSuperSacrifice: number; // extra concessional contributions per year (beyond SG)
  employerSGRate: number; // default 0.12 for 2025-26, editable
  deductiblePersonalSuperContributions: number; // default 0 — non-concessional contributions the user has notified super fund of intent to claim as deduction

  // Private health
  hasPrivateHospitalCover: boolean;
  privateHealthPremiumAnnual: number | null; // if they have cover

  // Investment-related (for accurate MLS calculation)
  // V1 assumes these are 0 for most users — hide behind an "advanced" expand
  netFinancialInvestmentLosses: number; // default 0
  netRentalPropertyLosses: number; // default 0

  // Other
  hasHECS: boolean;
  hecsBalance: number | null;

  // Goals (affect corridor relevance, not calculations)
  propertyGoal: "none" | "within-12m" | "1-3y" | "3y-plus";
};
```

### Derived values (calculated, not inputs)

```typescript
type DerivedValues = {
  // Taxable income after packaging
  taxableIncome: number;

  // Reportable Fringe Benefits Amount (grossed-up)
  rfba: number;

  // Income for MLS purposes
  mlsIncome: number;

  // Income for HECS repayment purposes
  hecsRepaymentIncome: number;

  // MLS tier
  mlsTier: "Base" | "Tier1" | "Tier2" | "Tier3";

  // Rebate tier (same thresholds, different purpose)
  rebateTier: "Base" | "Tier1" | "Tier2" | "Tier3";

  // MLS liability (if no private cover)
  mlsLiabilityAnnual: number;

  // Marginal tax rate
  marginalTaxRate: number;

  // Packaging utilisation
  generalPackagingUtilisation: number; // 0-1
  mePackagingUtilisation: number;

  // Super
  totalConcessionalContributions: number; // employer SG + sacrifice
  concessionalCapRemaining: number; // 30,000 - total
};
```

### Constants (all in `constants.ts`)

```typescript
export const FINANCIAL_YEAR = "2025-26";

// Tax brackets 2025-26 (resident, post Stage 3 cuts)
export const TAX_BRACKETS = [
  { threshold: 0, rate: 0 },
  { threshold: 18201, rate: 0.16 },
  { threshold: 45001, rate: 0.3 },
  { threshold: 135001, rate: 0.37 },
  { threshold: 190001, rate: 0.45 },
];

export const MEDICARE_LEVY = 0.02; // 2%

// MLS thresholds and rates (singles) - 2025-26
export const MLS_THRESHOLDS_SINGLE = {
  base: { upTo: 101000, rate: 0 },
  tier1: { from: 101001, upTo: 118000, rate: 0.01 },
  tier2: { from: 118001, upTo: 158000, rate: 0.0125 },
  tier3: { from: 158001, upTo: Infinity, rate: 0.015 },
};

// PHI rebate percentages (singles under 65) - 2025-26
// Rates change 1 April each year; code should select based on date at time of calc
export const PHI_REBATE_SINGLE_UNDER_65 = {
  preApril2026: {
    // 1 July 2025 - 31 March 2026
    base: 0.24288,
    tier1: 0.16193,
    tier2: 0.08095,
    tier3: 0,
  },
  fromApril2026: {
    // 1 April 2026 - 30 June 2026
    base: 0.24118,
    tier1: 0.16082,
    tier2: 0.08045,
    tier3: 0,
  },
};

// Age-Based Discount (ABD) for PHI hospital premiums
// Applies to hospital premiums only, not extras
// Only for ABD-eligible policies (most Bronze+ policies qualify)
export const AGE_BASED_DISCOUNT = {
  18: 0.1,
  19: 0.1,
  20: 0.1,
  21: 0.1,
  22: 0.1,
  23: 0.1,
  24: 0.1,
  25: 0.1,
  26: 0.08,
  27: 0.06,
  28: 0.04,
  29: 0.02,
  // 30+: 0
};

// Super
export const CONCESSIONAL_CAP = 30000;
export const SG_RATE_DEFAULT = 0.12; // 2025-26
export const SUPER_CONTRIBUTIONS_TAX = 0.15;

// Packaging caps
export const PBI_GENERAL_CAP = 15900;
export const PBI_ME_CAP = 2650;
export const PBI_GROSSUP_FACTOR = 1.8868; // for RFBA calculation
export const PUBLIC_HOSPITAL_GENERAL_CAP = 9010;
export const PUBLIC_HOSPITAL_ME_CAP = 2650;

// HECS thresholds 2025-26 (simplified — full tables elsewhere)
export const HECS_THRESHOLD_2025_26 = 56156; // below this, no repayment
```

### Helper function for rebate rate selection

```typescript
function getCurrentPhiRebateRates(asOf: Date = new Date()) {
  const april1_2026 = new Date("2026-04-01");
  return asOf >= april1_2026
    ? PHI_REBATE_SINGLE_UNDER_65.fromApril2026
    : PHI_REBATE_SINGLE_UNDER_65.preApril2026;
}
```

---

## 5. Calculation logic (the core)

### Step 1: Taxable income

```text
taxableIncome = grossAnnualSalary - (currentGeneralPackaging + currentMEPackaging)
```

### Step 2: RFBA

Only applies if employer is PBI or Public Hospital:

```text
rfba = (currentGeneralPackaging + currentMEPackaging) × PBI_GROSSUP_FACTOR
```

(Rounded to nearest dollar.)

### Step 3: MLS income

Per ATO definition:

```text
mlsIncome =
  taxableIncome
  + rfba
  + netFinancialInvestmentLosses
  + netRentalPropertyLosses
  + currentSuperSacrifice          // reportable employer super contributions
  + deductiblePersonalSuperContributions
```

For the typical V1 user (no investment losses, no personal deductible super contributions):

```text
mlsIncome = taxableIncome + rfba + currentSuperSacrifice
```

### Step 4: MLS tier and liability

Lookup `mlsIncome` against `MLS_THRESHOLDS_SINGLE` to determine the tier rate.

If no private hospital cover:

```text
mlsLiabilityAnnual = mlsIncome × tierRate
```

(V1 simplification: applying the rate to `mlsIncome` rather than the slightly-different-but-usually-identical "taxable income + RFBA + reportable super" figure. For V1 users without investment losses these are the same number.)

### Step 5: Rebate tier

Same income lookup as MLS tier, but maps to rebate percentages instead.

### Step 6: Marginal tax rate (including Medicare)

Lookup taxable income against `TAX_BRACKETS`, add Medicare levy (2%), add STSL repayment rate if applicable.

### Step 7: Utilisation calcs

```text
generalPackagingUtilisation = currentGeneralPackaging / cap (based on employerType)
mePackagingUtilisation = currentMEPackaging / mePackagingCap
concessionalCapRemaining = CONCESSIONAL_CAP - (grossSalary × SG_RATE) - currentSuperSacrifice
```

---

## 6. UI structure

### Page structure

```text
/ (home) — Intro + "Start the map" button
/inputs — Single-page form collecting user inputs (progressive disclosure)
/map — The corridor map dashboard
/corridor/[name] — Detail page per corridor
/about — Who built this, disclaimers, methodology
```

### The map page (the main output)

Layout: grid of "corridor cards." Each card shows:

- Corridor name (e.g., "MLS / Private Health")
- Status indicator (well-optimised / room to improve / not applicable / needs decision)
- Headline number (e.g., "$1,583/year MLS liability" or "$2,443/year net PHI cost")
- One-line insight (e.g., "You're paying more in MLS than a compliant policy would cost")
- "See details" link → detail page

### Corridor cards for V1

**Computed corridors (full math):**

1. **MLS / Private Health Insurance**
   - Input dependencies: income, packaging, private health status
   - Calculates: MLS tier, MLS liability, rebate tier, break-even premium

2. **Salary Packaging (General Cap)**
   - Input dependencies: employer type, current packaging amount
   - Calculates: utilisation %, remaining cap, annual tax saved, potential additional saving

3. **Salary Packaging (Meal & Entertainment Cap)**
   - Same as above but for the M&E cap
   - Separate card because it's a separate decision

4. **Super Concessional Cap**
   - Input dependencies: salary, SG rate, current sacrifice amount
   - Calculates: total contributions, remaining cap headroom, tax saving of maxing out

**Described corridors (no math, just context):**

1. **First Home Super Saver Scheme (FHSS)**
   - Shows: description, who it's for, example math, "ask your advisor" prompt
   - Only surfaces prominently if user set property goal as "within-12m" or "1-3y"

2. **Work-related deductions**
   - Shows: list of common deductible categories (union, WFH, memberships, donations)
   - No user input needed — just a checklist reminder

3. **HECS/STSL optimisation**
   - Shows: current repayment income estimate, note on voluntary repayments (no discount, so don't bother unless strategic reason)

### Corridor detail page

When user clicks into a computed corridor, show:

- **Where you are:** visual of position within the corridor (e.g., progress bar for cap utilisation, threshold chart for MLS tier)
- **The math:** transparent calculation showing the numbers going in
- **What the tax system is steering:** one paragraph on the behaviour being incentivised
- **Next actions:** ranked by ROI, with caveat "verify with your payroll/advisor before acting"
- **Gotchas:** things that might surprise the user (e.g., "Packaging grosses up your income for MLS and HECS purposes")

### Visual design

Keep it simple. No dark patterns, no celebratory animations when you "save money" — this is a thinking tool, not a casino.

- Monospaced numbers where they represent dollar amounts (readable)
- Clear use of colour to indicate status (green = optimised, amber = could improve, grey = not applicable/parked)
- Plain language first, expandable details for complexity
- Every calculated number has a tooltip showing the formula used

---

## 7. Disclaimers and safety

### Mandatory content

- Footer on every page: "Not financial advice. Tax rules change annually; numbers shown are for [FY]. Always verify with a qualified professional before acting."
- At the end of input collection: "These calculations are estimates based on the inputs you've provided. They don't account for all edge cases. If any number here would drive a significant decision, confirm with your payroll provider, accountant, or a financial advisor."
- On any corridor detail page: show the financial year the calculation applies to, visibly.

### Data safety

- No data leaves the user's browser in V1. All calculations client-side.
- No cookies, no analytics, no tracking.
- If URL-encoded state is implemented for sharing, warn users that the URL contains their financial details — don't share publicly.

### Failure modes to prevent

- **Don't present recommendations that conflict with someone's stated goals.** If someone says "property in 12 months," don't recommend maxing super sacrifice (which locks money up).
- **Don't show false precision.** Numbers should round to the nearest $10 on user-facing display, even if internal calcs are precise.
- **Don't hide the assumptions.** Every output should be traceable to the inputs that produced it.

---

## 8. Out of scope for V1

Explicitly deferring:

- Property / mortgage / negative gearing modelling (genuinely complex, needs its own design pass)
- Couples and families
- FHSS calculator (just describe for V1)
- ETF / investment projections
- Capital gains tax modelling
- State-specific considerations (other than NSW being user's home)
- Retirement modelling
- Multiple employers
- Scenario comparison (e.g., "what if I packaged more?")
- Historical / year-over-year tracking
- Any form of account system, login, or persistence

Some of these are V2, some are V3, some are never. Don't build them into V1 speculatively.

---

## 9. Resolved design decisions

### 9.1 MLS calculation (confirmed against ATO source)

**Income for MLS purposes** is the sum of:

- Taxable income
- Reportable fringe benefits
- Total net investment losses (net financial investment losses + net rental property losses)
- Reportable super contributions (reportable employer super contributions + deductible personal super contributions)

For V1, assume:

- No family trust distributions
- No FHSS released amounts
- No spouse (V1 is singles only)
- No exempt foreign employment income
- No super lump sums (the aged 55-59 edge case)

So the V1-simplified calculation is:

```typescript
mlsIncome =
  taxableIncome +
  rfba +
  netFinancialInvestmentLosses +
  netRentalPropertyLosses +
  reportableEmployerSuperContributions +
  deductiblePersonalSuperContributions;
```

For most V1 users (PBI workers, no investment property, salary sacrificing through employer):

```typescript
mlsIncome = taxableIncome + rfba + reportableEmployerSuperContributions;
```

**How the surcharge is applied:**

- MLS income determines the _tier_ (rate: 0%, 1%, 1.25%, or 1.5%)
- The surcharge rate is applied to **taxable income + RFBA + reportable super contributions** (essentially MLS income minus investment losses)
- For V1 users, this effectively means the surcharge is calculated on MLS income itself

**V1 simplification:** apply the tier rate to `mlsIncome` directly. This is conservative (slightly overestimates the surcharge for users with investment losses, which V1 assumes none of). Document this assumption in the tooltip on the MLS corridor card.

### 9.2 Age-based discount — INCLUDED

Include in V1. Hide behind a single question: "Are you under 30?" If yes, collect exact age and apply the age-based discount to the PHI premium calculation.

**Age-Based Discount rates (for eligible policies):**

- Age 18-25: 10% discount
- Age 26: 8% discount
- Age 27: 6% discount
- Age 28: 4% discount
- Age 29: 2% discount
- Age 30+: 0%

The discount applies to hospital premiums only (not extras), and only for policies that are ABD-eligible (most Bronze and above). For V1 simplicity, assume the user's policy is ABD-eligible and show the discount applied.

### 9.3 PHI rebate rate — use rate at time of calculation

PHI rebate rates change 1 April each year. V1 approach:

- Use `new Date()` at time of calculation
- If date is before 1 April of current FY, use pre-April rate
- If date is on or after 1 April, use post-April rate
- Show the date used in the calculation tooltip for transparency

Constants file should include both rates with their effective dates:

```typescript
export const PHI_REBATE_SINGLE_UNDER_65 = {
  preApril2026: {
    base: 0.24288,
    tier1: 0.16193,
    tier2: 0.08095,
    tier3: 0,
  },
  fromApril2026: {
    base: 0.24118,
    tier1: 0.16082,
    tier2: 0.08045,
    tier3: 0,
  },
};
```

Add comments in the code warning that these need annual review.

### 9.4 "Done correctly" thresholds — build, iterate, adjust

Start with these defaults. Adjust once the author has a feel for real usage:

**Packaging (general cap):**

- ≥95% utilisation → green (well-optimised)
- 50-94% → amber (room to improve)
- <50% → red (significant money on the table)
- 0% when employer is PBI/public hospital → red flag with explainer

**Packaging (M&E cap):**

- Same thresholds as general
- But defaults to amber rather than red when 0%, since M&E is genuinely not useful for everyone

**MLS:**

- Has private hospital cover → green, regardless of income
- No cover, income below Base tier threshold → green (doesn't apply)
- No cover, income at Tier 1+ → red (you're paying tax you could avoid)

**Super:**

- If property goal is "within-12m" or "1-3y": any utilisation is fine, show as amber only if >50% cap used (may be locking up money you'll want)
- If property goal is "none" or "3y-plus": <30% of cap → amber, <10% of cap → red
- Employer SG alone (no voluntary sacrifice) is the baseline — not "wrong," just not optimised

Document these thresholds in a single `thresholds.ts` file so they're easy to tune without hunting through UI code.

---

## 9a. Additional open questions to confirm in first Claude Code session

These aren't blockers but should be decided early:

- **Visual library:** Use Recharts for the position-within-corridor visualisations? (Author has used it before.)
- **Unit test framework:** Vitest (fits the Vite stack naturally).
- **Formatting conventions:** Prettier + ESLint defaults, or author's existing config?

---

## 10. Development order

If prioritising for fastest useful output:

1. **Setup:** Vite + React + TypeScript + Tailwind, deployed to Vercel with placeholder content
2. **Constants file:** all thresholds, rates, caps for FY 2025-26
3. **Calculation module:** pure functions with unit tests (author has Jest/Vitest familiarity)
4. **Input form:** simple single-page form, no validation beyond basics
5. **Map page:** grid of corridor cards using derived values
6. **One corridor detail page (MLS):** as the pattern
7. **Other corridor detail pages:** duplicate the pattern
8. **Described corridors:** add FHSS, deductions, HECS pages
9. **Polish:** disclaimers, tooltips, edge case handling
10. **Deploy:** share link with 2-3 trusted friends for feedback

Estimate: a focused weekend for 1-5, another weekend for 6-9, ongoing iteration for 10.

---

## 11. Author-relevant context

- Prefers NFP / open-source tooling where possible. If this gets shared beyond close circle, consider MIT license and GitHub repo.
- Aligned to harm reduction values: autonomy, non-paternalism, informed consent. The tool should embody these — user makes their own decisions, tool informs rather than prescribes.
- Existing workflow: Vite + React + TypeScript for frontend (StageParity, Policy Companion). Comfortable with Supabase for backend if needed in V2. Uses Claude Code for spec-driven development.
- Existing design sensibility: dislikes dark patterns, celebration animations, gamification. Prefers information density over emotional nudging.

---

## 12. Naming

Working title: **Corridor Map**

Alternative names to consider:

- "Legibility" (Scottian nod, probably too on-the-nose)
- "Tax corridors"
- "The PBI Playbook"
- Not "Money Map" or "Wealth Tracker" (connote financial industry)

Final naming can wait until V1 works.

---

## End of spec
