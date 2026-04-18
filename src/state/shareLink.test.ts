import { describe, expect, it } from "vitest";
import { decodeInputs, encodeInputs } from "./shareLink";
import { DEFAULT_INPUTS } from "./InputsContext";
import type { UserInputs } from "../calc/types";

function full(overrides: Partial<UserInputs> = {}): UserInputs {
  return { ...DEFAULT_INPUTS, ...overrides };
}

describe("shareLink encode/decode", () => {
  it("returns empty string for defaults (nothing to share)", () => {
    expect(encodeInputs(DEFAULT_INPUTS)).toBe("");
  });

  it("round-trips a realistic scenario", () => {
    const original = full({
      age: 28,
      grossAnnualSalary: 140_000,
      employerType: "PBI",
      currentGeneralPackaging: 15_900,
      currentMEPackaging: 2_650,
      currentSuperSacrifice: 5_000,
      hasPrivateHospitalCover: true,
      privateHealthPremium: 82.5,
      privateHealthPremiumPeriod: "fortnightly",
      privateHealthRebateTreatment: "tax-refund",
      hasHECS: true,
      hecsBalance: 22_000,
      propertyGoal: "1-3y",
    });
    const encoded = encodeInputs(original);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    const decoded = decodeInputs(encoded);
    expect(decoded).toEqual(original);
  });

  it("only serialises non-default fields (link stays short)", () => {
    const onlySalary = full({ grossAnnualSalary: 95_000 });
    const encoded = encodeInputs(onlySalary);
    expect(encoded.length).toBeLessThan(30);
    const decoded = decodeInputs(encoded)!;
    expect(decoded.grossAnnualSalary).toBe(95_000);
    expect(decoded.age).toBe(DEFAULT_INPUTS.age);
    expect(decoded.employerType).toBe(DEFAULT_INPUTS.employerType);
  });

  it("decodes garbage to null without throwing", () => {
    expect(decodeInputs("not-valid-base64!!!")).toBeNull();
    expect(decodeInputs("")).toBeNull();
  });

  it("rejects a payload with a negative salary", () => {
    // Manually craft a bad payload
    const bad = btoa(JSON.stringify({ s: -100 })).replace(/=/g, "");
    expect(decodeInputs(bad)).toBeNull();
  });
});
