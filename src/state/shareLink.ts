import type { UserInputs } from "../calc/types";
import { DEFAULT_INPUTS } from "./useInputs";

/**
 * URL-encode/decode a scenario to a short base64url string.
 *
 * Keep this conservative: only keys that actually differ from defaults are
 * serialised, so shared links stay short and only carry what the user chose.
 */

const KEY_MAP: Record<string, keyof UserInputs> = {
  a: "age",
  s: "grossAnnualSalary",
  e: "employerType",
  gp: "currentGeneralPackaging",
  mp: "currentMEPackaging",
  ss: "currentSuperSacrifice",
  sg: "employerSGRate",
  dp: "deductiblePersonalSuperContributions",
  ph: "hasPrivateHospitalCover",
  pp: "privateHealthPremium",
  pr: "privateHealthPremiumPeriod",
  pt: "privateHealthRebateTreatment",
  fl: "netFinancialInvestmentLosses",
  rl: "netRentalPropertyLosses",
  h: "hasHECS",
  hb: "hecsBalance",
  zr: "zoneTaxResidency",
  pg: "propertyGoal",
};

const INV_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([short, full]) => [full, short]),
) as Record<keyof UserInputs, string>;

function b64urlEncode(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

export function encodeInputs(inputs: UserInputs): string {
  const diff: Record<string, unknown> = {};
  for (const k of Object.keys(inputs) as Array<keyof UserInputs>) {
    const defaultValue = DEFAULT_INPUTS[k];
    const value = inputs[k];
    if (value !== defaultValue) {
      diff[INV_KEY_MAP[k]] = value;
    }
  }
  if (Object.keys(diff).length === 0) return "";
  return b64urlEncode(JSON.stringify(diff));
}

export function decodeInputs(encoded: string): UserInputs | null {
  try {
    const json = b64urlDecode(encoded);
    const diff = JSON.parse(json) as Record<string, unknown>;
    const result: UserInputs = { ...DEFAULT_INPUTS };
    for (const [short, value] of Object.entries(diff)) {
      const fullKey = KEY_MAP[short];
      if (!fullKey) continue;
      (result as Record<string, unknown>)[fullKey] = value;
    }
    if (
      typeof result.grossAnnualSalary !== "number" ||
      result.grossAnnualSalary < 0
    ) {
      return null;
    }
    return result;
  } catch {
    return null;
  }
}

export function buildShareUrl(inputs: UserInputs): string {
  const encoded = encodeInputs(inputs);
  const base = `${window.location.origin}/map`;
  return encoded ? `${base}?s=${encoded}` : base;
}
