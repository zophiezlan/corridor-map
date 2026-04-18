import type { EmployerType, MlsTier } from './constants';

export type PropertyGoal = 'none' | 'within-12m' | '1-3y' | '3y-plus';

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
  privateHealthPremiumAnnual: number | null;

  // Investment-related (advanced)
  netFinancialInvestmentLosses: number;
  netRentalPropertyLosses: number;

  // Other
  hasHECS: boolean;
  hecsBalance: number | null;

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
  marginalTaxRate: number;          // income tax marginal rate
  marginalTaxRateWithMedicare: number; // + Medicare levy
  marginalTaxRateWithStsl: number;     // + STSL marginal repayment rate if applicable

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
  netPhiCostAnnual: number | null;   // null if no cover
  breakEvenPremiumAnnual: number | null; // premium at which net cost == MLS liability

  // HECS
  hecsMarginalRate: number;
  hecsRepaymentAnnual: number;
};

export type CorridorStatus = 'green' | 'amber' | 'red' | 'grey';

export type CorridorCardSummary = {
  id: string;
  name: string;
  status: CorridorStatus;
  headline: string;
  insight: string;
  applicable: boolean;
};
