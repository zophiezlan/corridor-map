import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS } from "../state/useInputs";
import { deriveValues } from "./calculations";
import {
  allCorridors,
  deductionsCorridor,
  fhssCorridor,
  generalPackagingCorridor,
  hecsCorridor,
  mePackagingCorridor,
  mlsCorridor,
  superCorridor,
  zoneOffsetCorridor,
} from "./corridors";
import type { UserInputs } from "./types";

function scenario(overrides: Partial<UserInputs> = {}): UserInputs {
  return { ...DEFAULT_INPUTS, ...overrides };
}

describe("MLS / PHI corridor", () => {
  it("is green when income is below the MLS threshold and no cover", () => {
    const inputs = scenario({ grossAnnualSalary: 80_000 });
    const derived = deriveValues(inputs);
    const c = mlsCorridor(inputs, derived);
    expect(c.status).toBe("green");
    expect(c.headline).toMatch(/Not applicable/);
  });

  it("is red when in Tier 2 with no cover", () => {
    const inputs = scenario({ grossAnnualSalary: 140_000 });
    const derived = deriveValues(inputs);
    const c = mlsCorridor(inputs, derived);
    expect(c.status).toBe("red");
    expect(c.headline).toMatch(/MLS/);
    expect(c.insight).toMatch(/break even/);
  });

  it("is green when in Tier 2 with compliant cover", () => {
    const inputs = scenario({
      grossAnnualSalary: 140_000,
      hasPrivateHospitalCover: true,
      privateHealthPremium: 70,
      privateHealthPremiumPeriod: "fortnightly",
      privateHealthRebateTreatment: "reduced-premium",
    });
    const derived = deriveValues(inputs);
    const c = mlsCorridor(inputs, derived);
    expect(c.status).toBe("green");
  });
});

describe("General packaging corridor", () => {
  it("is grey when employer type has no packaging", () => {
    const inputs = scenario({
      employerType: "For-profit",
      grossAnnualSalary: 100_000,
    });
    const derived = deriveValues(inputs);
    const c = generalPackagingCorridor(inputs, derived);
    expect(c.status).toBe("grey");
    expect(c.applicable).toBe(false);
  });

  it("is red when a PBI worker is packaging nothing", () => {
    const inputs = scenario({
      employerType: "PBI",
      grossAnnualSalary: 100_000,
    });
    const derived = deriveValues(inputs);
    const c = generalPackagingCorridor(inputs, derived);
    expect(c.status).toBe("red");
    expect(c.insight).toMatch(/save roughly/);
  });

  it("is green when a PBI worker is fully utilised", () => {
    const inputs = scenario({
      employerType: "PBI",
      grossAnnualSalary: 100_000,
      currentGeneralPackaging: 15_900,
    });
    const derived = deriveValues(inputs);
    const c = generalPackagingCorridor(inputs, derived);
    expect(c.status).toBe("green");
    expect(c.headline).toMatch(/cap used/);
  });
});

describe("M&E packaging corridor", () => {
  it("is amber (not red) when unused — M&E is not for everyone", () => {
    const inputs = scenario({
      employerType: "PBI",
      grossAnnualSalary: 100_000,
    });
    const derived = deriveValues(inputs);
    const c = mePackagingCorridor(inputs, derived);
    expect(c.status).toBe("amber");
  });

  it("is grey when the employer type has no M&E cap", () => {
    const inputs = scenario({
      employerType: "Rebatable NFP",
      grossAnnualSalary: 100_000,
    });
    const derived = deriveValues(inputs);
    const c = mePackagingCorridor(inputs, derived);
    expect(c.status).toBe("grey");
  });
});

describe("Super corridor", () => {
  it("is green with no sacrifice when property goal is near-term", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      propertyGoal: "within-12m",
    });
    const derived = deriveValues(inputs);
    const c = superCorridor(inputs, derived);
    expect(c.status).toBe("green");
  });

  it("reports a saving available when long-horizon with unused cap", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      propertyGoal: "3y-plus",
      currentSuperSacrifice: 0,
    });
    const derived = deriveValues(inputs);
    const c = superCorridor(inputs, derived);
    // SG alone at 12% of $100k covers ~40% of the cap, so this is green, not red
    expect(c.status).toBe("green");
    expect(c.headline).toMatch(/saving available/);
  });

  it("is amber when long-horizon and user is sacrificing near the cap but not at it", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      propertyGoal: "1-3y",
      currentSuperSacrifice: 12_000,
    });
    const derived = deriveValues(inputs);
    const c = superCorridor(inputs, derived);
    expect(c.status).toBe("amber");
    expect(c.insight).toMatch(/near-term/);
  });
});

describe("FHSS corridor", () => {
  it("is amber when property goal is near-term", () => {
    expect(fhssCorridor(scenario({ propertyGoal: "1-3y" })).status).toBe(
      "amber",
    );
  });
  it("is grey when no property goal", () => {
    expect(fhssCorridor(scenario({ propertyGoal: "none" })).status).toBe(
      "grey",
    );
  });
});

describe("Deductions corridor", () => {
  it("is always amber + a checklist entry", () => {
    const c = deductionsCorridor();
    expect(c.status).toBe("amber");
    expect(c.applicable).toBe(true);
  });
});

describe("HECS corridor", () => {
  it("is grey when no HECS", () => {
    const inputs = scenario({ grossAnnualSalary: 100_000 });
    const derived = deriveValues(inputs);
    const c = hecsCorridor(inputs, derived);
    expect(c.status).toBe("grey");
  });

  it("is green below repayment threshold", () => {
    const inputs = scenario({ grossAnnualSalary: 50_000, hasHECS: true });
    const derived = deriveValues(inputs);
    const c = hecsCorridor(inputs, derived);
    expect(c.status).toBe("green");
  });

  it("is amber with repayment liability", () => {
    const inputs = scenario({ grossAnnualSalary: 100_000, hasHECS: true });
    const derived = deriveValues(inputs);
    const c = hecsCorridor(inputs, derived);
    expect(c.status).toBe("amber");
  });
});

describe("Zone offset corridor", () => {
  it("is grey when not in a zone", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      zoneTaxResidency: "none",
    });
    const derived = deriveValues(inputs);
    const c = zoneOffsetCorridor(inputs, derived);
    expect(c.status).toBe("grey");
    expect(c.applicable).toBe(false);
    expect(c.headline).toMatch(/Not applicable/);
  });

  it("is amber with the Zone A base amount when flagged", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      zoneTaxResidency: "zone-a",
    });
    const derived = deriveValues(inputs);
    const c = zoneOffsetCorridor(inputs, derived);
    expect(c.status).toBe("amber");
    expect(c.applicable).toBe(true);
    expect(derived.zoneOffsetBase).toBe(338);
    expect(c.headline).toMatch(/\$338/);
    expect(c.headline).toMatch(/Zone A/);
  });

  it("surfaces the special-area base at $1,173", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      zoneTaxResidency: "special-area",
    });
    const derived = deriveValues(inputs);
    const c = zoneOffsetCorridor(inputs, derived);
    expect(derived.zoneOffsetBase).toBe(1_173);
    expect(c.headline).toMatch(/\$1,173/);
  });

  it("surfaces Zone B at $57", () => {
    const inputs = scenario({
      grossAnnualSalary: 100_000,
      zoneTaxResidency: "zone-b",
    });
    const derived = deriveValues(inputs);
    expect(derived.zoneOffsetBase).toBe(57);
    expect(zoneOffsetCorridor(inputs, derived).headline).toMatch(/Zone B/);
  });
});

describe("allCorridors", () => {
  it("returns eight corridors in stable order", () => {
    const inputs = scenario({ grossAnnualSalary: 100_000 });
    const derived = deriveValues(inputs);
    const list = allCorridors(inputs, derived);
    expect(list.map((c) => c.id)).toEqual([
      "mls",
      "packaging-general",
      "packaging-me",
      "super",
      "fhss",
      "deductions",
      "hecs",
      "zone-offset",
    ]);
  });
});
