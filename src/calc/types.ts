import type { EmployerType, MlsTier, ZoneTaxResidency } from "./constants";

export type PropertyGoal = "none" | "within-12m" | "1-3y" | "3y-plus";

export type PremiumPeriod = "weekly" | "fortnightly" | "monthly" | "annual";

/**
 * How the user is currently receiving the government PHI rebate:
 *   - reduced-premium: rebate is already applied to their bill (the amount they
 *     enter is what they actually pay the fund — no further discount)
 *   - tax-refund: they pay the full premium now and receive the rebate at tax
 *     time, so net cost is premium × (1 − rebate%)
 *   - unsure: treat as reduced-premium (conservative) and prompt them to check
 */
export type RebateTreatment = "reduced-premium" | "tax-refund" | "unsure";

export type UserInputs = {
  // Basic
  age: number; // 18-64 for V1
  grossAnnualSalary: number;

  // Employer / packaging
  employerType: EmployerType;
  currentGeneralPackaging: number;
  currentMEPackaging: number;

  // Super
  currentSuperSacrifice: number;
  employerSGRate: number;
  deductiblePersonalSuperContributions: number;

  // Private health
  hasPrivateHospitalCover: boolean;
  privateHealthPremium: number | null; // amount paid per the chosen period
  privateHealthPremiumPeriod: PremiumPeriod;
  privateHealthRebateTreatment: RebateTreatment;

  // Investment-related (advanced)
  netFinancialInvestmentLosses: number;
  netRentalPropertyLosses: number;

  // Other
  hasHECS: boolean;
  hecsBalance: number | null;

  // Residence (zone tax offset — remote/isolated area residents)
  zoneTaxResidency: ZoneTaxResidency;

  // Goals
  propertyGoal: PropertyGoal;
};

export type DerivedValues = {
  taxableIncome: number;
  rfba: number;

  mlsIncome: number;
  hecsRepaymentIncome: number;

  mlsTier: MlsTier;
  rebateTier: MlsTier;

  mlsLiabilityAnnual: number;
  marginalTaxRate: number; // income tax marginal rate
  marginalTaxRateWithMedicare: number; // + Medicare levy
  marginalTaxRateWithStsl: number; // + STSL marginal repayment rate if applicable

  // Packaging utilisation
  generalPackagingUtilisation: number; // 0-1
  mePackagingUtilisation: number;
  generalPackagingCap: number;
  mePackagingCap: number;

  // Super
  totalConcessionalContributions: number;
  concessionalCapRemaining: number;
  employerSgDollars: number;

  // PHI
  phiRebatePercent: number;
  ageBasedDiscount: number;
  premiumPaidAnnual: number | null; // what the user actually pays the fund per year
  rebateRefundAnnual: number; // rebate value at tax time (0 if already reduced)
  netPhiCostAnnual: number | null; // true cost after any rebate; null if no cover
  breakEvenNetCostAnnual: number | null; // max net cost that still beats MLS

  // HECS
  hecsMarginalRate: number;
  hecsRepaymentAnnual: number;

  // Zone tax offset (base only — modifiers surfaced descriptively)
  zoneOffsetBase: number;
};

export type CorridorStatus = "green" | "amber" | "red" | "grey";

export type CorridorCardSummary = {
  id: string;
  name: string;
  status: CorridorStatus;
  headline: string;
  insight: string;
  applicable: boolean;
};
