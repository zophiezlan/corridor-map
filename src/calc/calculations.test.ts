import { describe, expect, it } from "vitest";
import {
  deriveValues,
  formatAUD,
  hecsMarginalRate,
  hecsRepaymentAnnual,
  incomeTax,
  marginalTaxRate,
  mePackagingPotentialSaving,
  mlsTierFor,
  packagingPotentialSaving,
  roundNearest10,
  superTopUpPotentialSaving,
} from "./calculations";
import {
  MLS_THRESHOLDS_SINGLE,
  PBI_GENERAL_CAP,
  PBI_GROSSUP_FACTOR,
} from "./constants";
import type { UserInputs } from "./types";

const PRE_APRIL_2026 = new Date("2025-10-01T00:00:00+10:00");
const POST_APRIL_2026 = new Date("2026-05-01T00:00:00+10:00");

function baseInputs(overrides: Partial<UserInputs> = {}): UserInputs {
  return {
    age: 35,
    grossAnnualSalary: 100_000,
    employerType: "PBI",
    currentGeneralPackaging: 0,
    currentMEPackaging: 0,
    currentSuperSacrifice: 0,
    employerSGRate: 0.12,
    deductiblePersonalSuperContributions: 0,
    hasPrivateHospitalCover: false,
    privateHealthPremium: null,
    privateHealthPremiumPeriod: "annual",
    privateHealthRebateTreatment: "reduced-premium",
    netFinancialInvestmentLosses: 0,
    netRentalPropertyLosses: 0,
    hasHECS: false,
    hecsBalance: null,
    propertyGoal: "none",
    ...overrides,
  };
}

describe("incomeTax (resident, FY 2025-26)", () => {
  it("returns 0 at or below the tax-free threshold", () => {
    expect(incomeTax(0)).toBe(0);
    expect(incomeTax(18_200)).toBe(0);
  });

  it("matches ATO example at $45,000 ($4,288)", () => {
    expect(incomeTax(45_000)).toBeCloseTo(4_288, 2);
  });

  it("matches ATO example at $100,000 ($20,788)", () => {
    expect(incomeTax(100_000)).toBeCloseTo(20_788, 2);
  });

  it("matches ATO example at $135,000 ($31,288)", () => {
    expect(incomeTax(135_000)).toBeCloseTo(31_288, 2);
  });

  it("matches ATO example at $190,000 ($51,638)", () => {
    expect(incomeTax(190_000)).toBeCloseTo(51_638, 2);
  });
});

describe("marginalTaxRate", () => {
  it("is 0 in the tax-free band", () => {
    expect(marginalTaxRate(10_000)).toBe(0);
  });
  it("is 0.16 in the second band", () => {
    expect(marginalTaxRate(30_000)).toBe(0.16);
  });
  it("is 0.30 in the middle band", () => {
    expect(marginalTaxRate(100_000)).toBe(0.3);
  });
  it("is 0.37 above 135k", () => {
    expect(marginalTaxRate(150_000)).toBe(0.37);
  });
  it("is 0.45 above 190k", () => {
    expect(marginalTaxRate(250_000)).toBe(0.45);
  });
});

describe("mlsTierFor", () => {
  it("puts income at $101,000 in Base (boundary is inclusive upTo)", () => {
    expect(mlsTierFor(MLS_THRESHOLDS_SINGLE.Base.upTo)).toBe("Base");
  });
  it("puts $101,001 in Tier1", () => {
    expect(mlsTierFor(101_001)).toBe("Tier1");
  });
  it("puts $158,001 in Tier3", () => {
    expect(mlsTierFor(158_001)).toBe("Tier3");
  });
});

describe("HECS", () => {
  it("no repayment below the floor", () => {
    expect(hecsRepaymentAnnual(50_000)).toBe(0);
    expect(hecsMarginalRate(50_000)).toBe(0);
  });
  it("marginal 15% just above the floor", () => {
    expect(hecsMarginalRate(60_000)).toBe(0.15);
  });
  it("marginal 17% above the second threshold", () => {
    expect(hecsMarginalRate(80_000)).toBe(0.17);
  });
  it("computes annual repayment using the marginal schedule", () => {
    // At $70,000: 15% on (67,086 - 56,156) + 17% on (70,000 - 67,086)
    const expected = (67_086 - 56_156) * 0.15 + (70_000 - 67_086) * 0.17;
    expect(hecsRepaymentAnnual(70_000)).toBeCloseTo(expected, 1);
  });
});

describe("deriveValues — PBI worker, no packaging, no private cover", () => {
  const d = deriveValues(baseInputs(), PRE_APRIL_2026);

  it("taxable income equals gross salary when no packaging", () => {
    expect(d.taxableIncome).toBe(100_000);
  });

  it("RFBA is 0 with no packaging", () => {
    expect(d.rfba).toBe(0);
  });

  it("MLS income equals taxable income + RFBA (no super sacrifice)", () => {
    expect(d.mlsIncome).toBe(100_000);
  });

  it("is in MLS Base tier (no surcharge) below $101k", () => {
    expect(d.mlsTier).toBe("Base");
    expect(d.mlsLiabilityAnnual).toBe(0);
  });

  it("employer SG dollars is 12% of gross", () => {
    expect(d.employerSgDollars).toBe(12_000);
  });

  it("concessional cap remaining is cap minus SG", () => {
    expect(d.concessionalCapRemaining).toBe(30_000 - 12_000);
  });
});

describe("deriveValues — PBI worker with full general packaging", () => {
  const inputs = baseInputs({
    grossAnnualSalary: 100_000,
    currentGeneralPackaging: PBI_GENERAL_CAP,
  });
  const d = deriveValues(inputs, PRE_APRIL_2026);

  it("taxable income is gross minus packaged amount", () => {
    expect(d.taxableIncome).toBe(100_000 - PBI_GENERAL_CAP);
  });

  it("RFBA is packaged × grossup factor", () => {
    expect(d.rfba).toBe(Math.round(PBI_GENERAL_CAP * PBI_GROSSUP_FACTOR));
  });

  it("MLS income = taxable + RFBA (no investment losses / super sacrifice)", () => {
    expect(d.mlsIncome).toBe(d.taxableIncome + d.rfba);
  });

  it("general packaging utilisation is 1.0", () => {
    expect(d.generalPackagingUtilisation).toBe(1);
  });
});

describe("deriveValues — MLS triggers when MLS income crosses threshold", () => {
  const inputs = baseInputs({
    grossAnnualSalary: 115_000,
    hasPrivateHospitalCover: false,
  });
  const d = deriveValues(inputs, PRE_APRIL_2026);

  it("is in Tier1 when MLS income is $115k", () => {
    expect(d.mlsTier).toBe("Tier1");
  });

  it("MLS liability is 1% of MLS income", () => {
    expect(d.mlsLiabilityAnnual).toBe(Math.round(115_000 * 0.01));
  });

  it("crosses into Tier2 at $120k", () => {
    const d2 = deriveValues(
      baseInputs({ grossAnnualSalary: 120_000 }),
      PRE_APRIL_2026,
    );
    expect(d2.mlsTier).toBe("Tier2");
    expect(d2.mlsLiabilityAnnual).toBe(Math.round(120_000 * 0.0125));
  });

  it("private cover zeroes the MLS liability", () => {
    const withCover = deriveValues(
      baseInputs({
        grossAnnualSalary: 120_000,
        hasPrivateHospitalCover: true,
        privateHealthPremium: 1_500,
      }),
      PRE_APRIL_2026,
    );
    expect(withCover.mlsLiabilityAnnual).toBe(0);
  });
});

describe("PHI rebate picks the rate for the date", () => {
  it("uses pre-April 2026 base rate for an October 2025 calc", () => {
    const d = deriveValues(
      baseInputs({
        hasPrivateHospitalCover: true,
        privateHealthPremium: 2_000,
      }),
      PRE_APRIL_2026,
    );
    expect(d.phiRebatePercent).toBeCloseTo(0.24288, 5);
  });

  it("uses from-April 2026 base rate for a May 2026 calc", () => {
    const d = deriveValues(
      baseInputs({
        hasPrivateHospitalCover: true,
        privateHealthPremium: 2_000,
      }),
      POST_APRIL_2026,
    );
    expect(d.phiRebatePercent).toBeCloseTo(0.24118, 5);
  });
});

describe("age-based discount applies to under-30s", () => {
  it("is 10% at age 25", () => {
    const d = deriveValues(baseInputs({ age: 25 }), PRE_APRIL_2026);
    expect(d.ageBasedDiscount).toBe(0.1);
  });
  it("is 0% at age 30+", () => {
    const d = deriveValues(baseInputs({ age: 35 }), PRE_APRIL_2026);
    expect(d.ageBasedDiscount).toBe(0);
  });
});

describe("net PHI cost respects rebate treatment", () => {
  it("reduced-premium: the bill already reflects the rebate (no further discount)", () => {
    const d = deriveValues(
      baseInputs({
        age: 25,
        hasPrivateHospitalCover: true,
        privateHealthPremium: 1_800,
        privateHealthPremiumPeriod: "annual",
        privateHealthRebateTreatment: "reduced-premium",
      }),
      PRE_APRIL_2026,
    );
    expect(d.premiumPaidAnnual).toBe(1_800);
    expect(d.rebateRefundAnnual).toBe(0);
    expect(d.netPhiCostAnnual).toBe(1_800);
  });

  it("tax-refund: subtracts rebate% of premium as refund", () => {
    const d = deriveValues(
      baseInputs({
        age: 25,
        hasPrivateHospitalCover: true,
        privateHealthPremium: 2_000,
        privateHealthPremiumPeriod: "annual",
        privateHealthRebateTreatment: "tax-refund",
      }),
      PRE_APRIL_2026,
    );
    expect(d.premiumPaidAnnual).toBe(2_000);
    expect(d.rebateRefundAnnual).toBe(Math.round(2_000 * 0.24288));
    expect(d.netPhiCostAnnual).toBe(2_000 - Math.round(2_000 * 0.24288));
  });

  it("multiplies fortnightly premium by 26", () => {
    const d = deriveValues(
      baseInputs({
        hasPrivateHospitalCover: true,
        privateHealthPremium: 80,
        privateHealthPremiumPeriod: "fortnightly",
        privateHealthRebateTreatment: "reduced-premium",
      }),
      PRE_APRIL_2026,
    );
    expect(d.premiumPaidAnnual).toBe(80 * 26);
  });
});

describe("packagingPotentialSaving", () => {
  it("returns the remaining cap × marginal rate (incl Medicare)", () => {
    const inputs = baseInputs({ grossAnnualSalary: 100_000 });
    const d = deriveValues(inputs, PRE_APRIL_2026);
    const saving = packagingPotentialSaving(inputs, d);
    expect(saving.additional).toBe(PBI_GENERAL_CAP);
    // taxable = 100000 → MTR 30% + 2% Medicare = 32%
    expect(saving.annualSaving).toBe(Math.round(PBI_GENERAL_CAP * 0.32));
  });

  it("M&E potential saving uses the M&E cap", () => {
    const inputs = baseInputs({ grossAnnualSalary: 100_000 });
    const d = deriveValues(inputs, PRE_APRIL_2026);
    const saving = mePackagingPotentialSaving(inputs, d);
    expect(saving.additional).toBe(d.mePackagingCap);
    expect(saving.annualSaving).toBe(Math.round(d.mePackagingCap * 0.32));
  });
});

describe("superTopUpPotentialSaving", () => {
  it("saves the marginal-rate minus 15% on the remaining cap", () => {
    const inputs = baseInputs({ grossAnnualSalary: 100_000 });
    const d = deriveValues(inputs, PRE_APRIL_2026);
    const s = superTopUpPotentialSaving(inputs, d);
    // 30% + 2% − 15% = 17%
    expect(s.annualSaving).toBe(Math.round(d.concessionalCapRemaining * 0.17));
  });
});

describe("HECS repayment uses grossed-up income", () => {
  it("counts RFBA in HECS repayment income", () => {
    const d = deriveValues(
      baseInputs({
        grossAnnualSalary: 80_000,
        hasHECS: true,
        hecsBalance: 30_000,
        currentGeneralPackaging: PBI_GENERAL_CAP,
      }),
      PRE_APRIL_2026,
    );
    // taxable = 80000 − 15900 = 64100
    // rfba = 15900 × 1.8868 ≈ 29,999.7 → 30,000
    // repayment income = 64100 + 30000 = 94100
    expect(d.hecsRepaymentIncome).toBeGreaterThan(d.taxableIncome);
  });
});

describe("formatters", () => {
  it("roundNearest10 rounds to the nearest $10", () => {
    expect(roundNearest10(1_583)).toBe(1_580);
    expect(roundNearest10(1_585)).toBe(1_590);
  });

  it("formatAUD renders with $ and thousands separators", () => {
    expect(formatAUD(1_583)).toBe("$1,583");
    expect(formatAUD(1_583, { round10: true })).toBe("$1,580");
    expect(formatAUD(null)).toBe("—");
    expect(formatAUD(-250)).toBe("-$250");
  });
});
