import {
  CONCESSIONAL_CAP,
  HECS_THRESHOLDS_2025_26,
  MEDICARE_LEVY,
  MLS_THRESHOLDS_SINGLE,
  PBI_GROSSUP_FACTOR,
  PERIOD_MULTIPLIERS,
  SUPER_CONTRIBUTIONS_TAX,
  TAX_BRACKETS,
  getAgeBasedDiscount,
  getCurrentPhiRebateRates,
  getPackagingCaps,
} from "./constants";
import type { MlsTier } from "./constants";
import type { DerivedValues, UserInputs } from "./types";

// ---------- Basic tax helpers ----------

/** Progressive income tax (residents) — does not include Medicare. */
export function incomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let remaining = taxable;
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    const { threshold, rate } = TAX_BRACKETS[i];
    if (remaining > threshold) {
      tax += (remaining - threshold) * rate;
      remaining = threshold;
    }
  }
  return tax;
}

/** Marginal income tax rate for the last dollar at `taxable` (excludes Medicare). */
export function marginalTaxRate(taxable: number): number {
  let rate = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxable >= bracket.threshold) rate = bracket.rate;
    else break;
  }
  return rate;
}

// ---------- MLS & rebate tiers ----------

export function mlsTierFor(mlsIncome: number): MlsTier {
  if (mlsIncome <= MLS_THRESHOLDS_SINGLE.Base.upTo) return "Base";
  if (mlsIncome <= MLS_THRESHOLDS_SINGLE.Tier1.upTo) return "Tier1";
  if (mlsIncome <= MLS_THRESHOLDS_SINGLE.Tier2.upTo) return "Tier2";
  return "Tier3";
}

export function mlsRateFor(tier: MlsTier): number {
  return MLS_THRESHOLDS_SINGLE[tier].rate;
}

// ---------- HECS ----------

/** Marginal HECS/STSL repayment rate for the next dollar at `repaymentIncome`. */
export function hecsMarginalRate(repaymentIncome: number): number {
  let rate = 0;
  for (const bracket of HECS_THRESHOLDS_2025_26) {
    if (repaymentIncome >= bracket.from) rate = bracket.rate;
    else break;
  }
  return rate;
}

/** Annualised HECS repayment using the 2025-26 marginal schedule. */
export function hecsRepaymentAnnual(repaymentIncome: number): number {
  if (repaymentIncome <= 0) return 0;
  let owing = 0;
  for (const bracket of HECS_THRESHOLDS_2025_26) {
    if (repaymentIncome > bracket.from && bracket.rate > 0) {
      const top = Math.min(repaymentIncome, bracket.upTo);
      owing += (top - bracket.from) * bracket.rate;
    }
  }
  return owing;
}

// ---------- Core derivation ----------

export function deriveValues(
  inputs: UserInputs,
  asOf: Date = new Date(),
): DerivedValues {
  const caps = getPackagingCaps(inputs.employerType);
  const packagedTotal =
    (inputs.currentGeneralPackaging || 0) + (inputs.currentMEPackaging || 0);

  const taxableIncome = Math.max(0, inputs.grossAnnualSalary - packagedTotal);

  const rfba = caps.packagingAvailable
    ? Math.round(packagedTotal * PBI_GROSSUP_FACTOR)
    : 0;

  const mlsIncome =
    taxableIncome +
    rfba +
    (inputs.netFinancialInvestmentLosses || 0) +
    (inputs.netRentalPropertyLosses || 0) +
    (inputs.currentSuperSacrifice || 0) +
    (inputs.deductiblePersonalSuperContributions || 0);

  // HECS repayment income per ATO: taxable income + RFBA + reportable super + net investment losses.
  const hecsRepaymentIncome =
    taxableIncome +
    rfba +
    (inputs.currentSuperSacrifice || 0) +
    (inputs.deductiblePersonalSuperContributions || 0) +
    (inputs.netFinancialInvestmentLosses || 0) +
    (inputs.netRentalPropertyLosses || 0);

  const mlsTier = mlsTierFor(mlsIncome);
  const mlsRate = mlsRateFor(mlsTier);
  const mlsLiabilityAnnual = inputs.hasPrivateHospitalCover
    ? 0
    : Math.round(mlsIncome * mlsRate);

  // Rebate tier uses the same income lookup.
  const rebateTier = mlsTier;
  const phiRates = getCurrentPhiRebateRates(asOf);
  const phiRebatePercent = phiRates[rebateTier];
  const ageBasedDiscount = getAgeBasedDiscount(inputs.age);

  // PHI cost model. The fund's quoted premium already bakes in ABD (if the
  // policy is ABD-eligible). The rebate is either applied as a reduced premium
  // (bill is smaller) or claimed at tax time (refund arrives later).
  const premiumPaidAnnual =
    inputs.hasPrivateHospitalCover && inputs.privateHealthPremium != null
      ? Math.round(
          inputs.privateHealthPremium *
            PERIOD_MULTIPLIERS[inputs.privateHealthPremiumPeriod],
        )
      : null;

  let netPhiCostAnnual: number | null = null;
  let rebateRefundAnnual = 0;
  if (premiumPaidAnnual != null) {
    if (inputs.privateHealthRebateTreatment === "tax-refund") {
      rebateRefundAnnual = Math.round(premiumPaidAnnual * phiRebatePercent);
      netPhiCostAnnual = premiumPaidAnnual - rebateRefundAnnual;
    } else {
      // 'reduced-premium' or 'unsure' — the bill already reflects the rebate
      // (or we conservatively assume so). No further discount here.
      netPhiCostAnnual = premiumPaidAnnual;
    }
  }

  // Break-even net cost: the most a user should be willing to pay (net of any
  // rebate) for cover before it's cheaper to just wear the MLS.
  const hypotheticalMls = Math.round(mlsIncome * mlsRate);
  const breakEvenNetCostAnnual = mlsRate > 0 ? hypotheticalMls : null;

  const mtr = marginalTaxRate(taxableIncome);
  const hecsRate = inputs.hasHECS ? hecsMarginalRate(hecsRepaymentIncome) : 0;
  const hecsRepayment = inputs.hasHECS
    ? hecsRepaymentAnnual(hecsRepaymentIncome)
    : 0;

  const generalCap = caps.general;
  const meCap = caps.me;
  const generalPackagingUtilisation =
    generalCap > 0
      ? Math.min(1, (inputs.currentGeneralPackaging || 0) / generalCap)
      : 0;
  const mePackagingUtilisation =
    meCap > 0 ? Math.min(1, (inputs.currentMEPackaging || 0) / meCap) : 0;

  const employerSgDollars = Math.round(
    inputs.grossAnnualSalary * inputs.employerSGRate,
  );
  const totalConcessionalContributions =
    employerSgDollars +
    (inputs.currentSuperSacrifice || 0) +
    (inputs.deductiblePersonalSuperContributions || 0);
  const concessionalCapRemaining = Math.max(
    0,
    CONCESSIONAL_CAP - totalConcessionalContributions,
  );

  return {
    taxableIncome,
    rfba,
    mlsIncome,
    hecsRepaymentIncome,
    mlsTier,
    rebateTier,
    mlsLiabilityAnnual,
    marginalTaxRate: mtr,
    marginalTaxRateWithMedicare: mtr + MEDICARE_LEVY,
    marginalTaxRateWithStsl: mtr + MEDICARE_LEVY + hecsRate,
    generalPackagingUtilisation,
    mePackagingUtilisation,
    generalPackagingCap: generalCap,
    mePackagingCap: meCap,
    totalConcessionalContributions,
    concessionalCapRemaining,
    employerSgDollars,
    phiRebatePercent,
    ageBasedDiscount,
    premiumPaidAnnual,
    rebateRefundAnnual,
    netPhiCostAnnual,
    breakEvenNetCostAnnual,
    hecsMarginalRate: hecsRate,
    hecsRepaymentAnnual: Math.round(hecsRepayment),
  };
}

// ---------- Packaging marginal-value helper ----------

/**
 * Approximate annual tax saving if the user fully used the general packaging cap.
 * Packaging converts gross salary into FBT-exempt benefits, so the saving is
 * roughly (additional packaged amount) × (marginal tax rate + Medicare).
 * This ignores the knock-on effect of packaging shifting the user down a bracket
 * — fine for the "room to improve" ballpark shown on the corridor card.
 */
export function packagingPotentialSaving(
  inputs: UserInputs,
  derived: DerivedValues,
): { additional: number; annualSaving: number } {
  const additional = Math.max(
    0,
    derived.generalPackagingCap - (inputs.currentGeneralPackaging || 0),
  );
  const annualSaving = Math.round(
    additional * derived.marginalTaxRateWithMedicare,
  );
  return { additional, annualSaving };
}

/** Same idea for M&E cap. */
export function mePackagingPotentialSaving(
  inputs: UserInputs,
  derived: DerivedValues,
): { additional: number; annualSaving: number } {
  const additional = Math.max(
    0,
    derived.mePackagingCap - (inputs.currentMEPackaging || 0),
  );
  const annualSaving = Math.round(
    additional * derived.marginalTaxRateWithMedicare,
  );
  return { additional, annualSaving };
}

/**
 * Tax saving from topping super sacrifice up to the concessional cap.
 * Saving per dollar = marginal rate (+ Medicare) − 15% contributions tax.
 */
export function superTopUpPotentialSaving(
  _inputs: UserInputs,
  derived: DerivedValues,
): { additional: number; annualSaving: number } {
  const additional = derived.concessionalCapRemaining;
  const savingRate = Math.max(
    0,
    derived.marginalTaxRateWithMedicare - SUPER_CONTRIBUTIONS_TAX,
  );
  const annualSaving = Math.round(additional * savingRate);
  return { additional, annualSaving };
}

// ---------- Display helpers ----------

/** Round to nearest $10 for user-facing display (spec §7 "no false precision"). */
export function roundNearest10(n: number): number {
  return Math.round(n / 10) * 10;
}

export function formatAUD(
  n: number | null | undefined,
  opts?: { round10?: boolean },
): string {
  if (n == null) return "—";
  const value = opts?.round10 ? roundNearest10(n) : Math.round(n);
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value).toLocaleString("en-AU");
  return `${sign}$${abs}`;
}

export function formatPercent(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}
