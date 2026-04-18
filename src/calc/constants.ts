/**
 * Corridor Map — FY 2025-26 constants.
 *
 * All rates, thresholds, and caps that drive the calculation module live here.
 * Annual review required — ATO/PHI rates are updated each financial year.
 *
 * Sources:
 *   - Tax brackets:      ATO individual income tax rates (resident, post Stage 3)
 *   - MLS thresholds:    ATO Medicare Levy Surcharge income thresholds
 *   - PHI rebate rates:  PrivateHealth.gov.au (rates adjust each 1 April)
 *   - Super caps:        ATO concessional contribution cap
 *   - Packaging caps:    ATO FBT-exempt caps for PBI / public hospital
 *   - HECS thresholds:   ATO study and training loan repayment rates
 */

export const FINANCIAL_YEAR = "2025-26";
export const FINANCIAL_YEAR_LABEL = "FY 2025-26 (1 July 2025 – 30 June 2026)";

// ---------- Income tax (resident, post Stage 3 cuts) ----------

export type TaxBracket = { threshold: number; rate: number };

// `threshold` is the previous bracket's ceiling; the rate applies to each
// dollar ABOVE threshold up to the next row's threshold. ATO phrases this as
// e.g. "45,001 – 135,000: $4,288 plus 30c for each $1 over $45,000", so
// threshold = 45000 here.
export const TAX_BRACKETS: TaxBracket[] = [
  { threshold: 0, rate: 0 },
  { threshold: 18_200, rate: 0.16 },
  { threshold: 45_000, rate: 0.3 },
  { threshold: 135_000, rate: 0.37 },
  { threshold: 190_000, rate: 0.45 },
];

export const MEDICARE_LEVY = 0.02;

// ---------- Medicare Levy Surcharge (singles, under 65) ----------

export type MlsTier = "Base" | "Tier1" | "Tier2" | "Tier3";

export const MLS_THRESHOLDS_SINGLE: Record<
  MlsTier,
  { from: number; upTo: number; rate: number }
> = {
  Base: { from: 0, upTo: 101_000, rate: 0 },
  Tier1: { from: 101_001, upTo: 118_000, rate: 0.01 },
  Tier2: { from: 118_001, upTo: 158_000, rate: 0.0125 },
  Tier3: { from: 158_001, upTo: Infinity, rate: 0.015 },
};

// ---------- PHI rebate (singles, under 65) ----------

export type PhiRebateRates = {
  Base: number;
  Tier1: number;
  Tier2: number;
  Tier3: number;
};

// Rates change 1 April each year. Both halves of FY25-26 included.
// Use getCurrentPhiRebateRates(date) to pick the applicable set.
export const PHI_REBATE_SINGLE_UNDER_65: {
  preApril2026: PhiRebateRates;
  fromApril2026: PhiRebateRates;
} = {
  preApril2026: {
    Base: 0.24288,
    Tier1: 0.16193,
    Tier2: 0.08095,
    Tier3: 0,
  },
  fromApril2026: {
    Base: 0.24118,
    Tier1: 0.16082,
    Tier2: 0.08045,
    Tier3: 0,
  },
};

// ---------- Age-based discount (PHI hospital cover, ABD-eligible policies) ----------

export const AGE_BASED_DISCOUNT: Record<number, number> = {
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
};

// ---------- Super ----------

export const CONCESSIONAL_CAP = 30_000;
export const SG_RATE_DEFAULT = 0.12;
export const SUPER_CONTRIBUTIONS_TAX = 0.15;

// ---------- Salary packaging caps ----------

export const PBI_GENERAL_CAP = 15_900;
export const PBI_ME_CAP = 2_650;
export const PBI_GROSSUP_FACTOR = 1.8868; // Type 2 gross-up for RFBA

export const PUBLIC_HOSPITAL_GENERAL_CAP = 9_010;
export const PUBLIC_HOSPITAL_ME_CAP = 2_650;

export type EmployerType =
  | "PBI"
  | "Public Hospital"
  | "Rebatable NFP"
  | "For-profit"
  | "Unknown";

export function getPackagingCaps(employer: EmployerType): {
  general: number;
  me: number;
  packagingAvailable: boolean;
} {
  switch (employer) {
    case "PBI":
      return {
        general: PBI_GENERAL_CAP,
        me: PBI_ME_CAP,
        packagingAvailable: true,
      };
    case "Public Hospital":
      return {
        general: PUBLIC_HOSPITAL_GENERAL_CAP,
        me: PUBLIC_HOSPITAL_ME_CAP,
        packagingAvailable: true,
      };
    case "Rebatable NFP":
    case "For-profit":
    case "Unknown":
    default:
      return { general: 0, me: 0, packagingAvailable: false };
  }
}

// ---------- HECS / STSL repayment schedule (2025-26) ----------

export type HecsBracket = { from: number; upTo: number; rate: number };

// Marginal repayment thresholds for 2025-26. The current ATO regime is marginal
// (repayments apply only to income above each threshold, not the whole lot).
export const HECS_THRESHOLDS_2025_26: HecsBracket[] = [
  { from: 0, upTo: 56_156, rate: 0 },
  { from: 56_156, upTo: 67_086, rate: 0.15 },
  { from: 67_086, upTo: 124_705, rate: 0.17 },
  { from: 124_705, upTo: Infinity, rate: 0.17 },
];

export const HECS_REPAYMENT_THRESHOLD_FLOOR = 56_156;

// ---------- Helpers ----------

export function getCurrentPhiRebateRates(
  asOf: Date = new Date(),
): PhiRebateRates {
  const april1_2026 = new Date("2026-04-01T00:00:00+10:00");
  return asOf >= april1_2026
    ? PHI_REBATE_SINGLE_UNDER_65.fromApril2026
    : PHI_REBATE_SINGLE_UNDER_65.preApril2026;
}

export function getAgeBasedDiscount(age: number): number {
  if (age < 18 || age >= 30) return 0;
  return AGE_BASED_DISCOUNT[age] ?? 0;
}

// ---------- Premium period multipliers ----------

export const PERIOD_MULTIPLIERS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annual: 1,
} as const;
