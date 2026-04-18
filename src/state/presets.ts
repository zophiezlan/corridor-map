import type { UserInputs } from "../calc/types";
import { DEFAULT_INPUTS } from "./useInputs";

export type Preset = {
  id: string;
  label: string;
  description: string;
  inputs: UserInputs;
};

/**
 * Preset scenarios for Home. Each is a realistic-ish starting point for a
 * PBI worker — users can load one to see the map immediately, then tweak.
 */
export const PRESETS: Preset[] = [
  {
    id: "early-career",
    label: "Early-career PBI",
    description:
      "Under 30, $75k gross, not packaging yet. First-home goal in 1–3 years.",
    inputs: {
      ...DEFAULT_INPUTS,
      age: 27,
      grossAnnualSalary: 75_000,
      employerType: "PBI",
      propertyGoal: "1-3y",
      hasHECS: true,
      hecsBalance: 22_000,
    },
  },
  {
    id: "mid-career",
    label: "Mid-career PBI",
    description:
      "$110k gross, already packaging the full cap, private hospital cover.",
    inputs: {
      ...DEFAULT_INPUTS,
      age: 36,
      grossAnnualSalary: 110_000,
      employerType: "PBI",
      currentGeneralPackaging: 15_900,
      hasPrivateHospitalCover: true,
      privateHealthPremium: 80,
      privateHealthPremiumPeriod: "fortnightly",
      privateHealthRebateTreatment: "reduced-premium",
    },
  },
  {
    id: "senior-public-hospital",
    label: "Senior public-hospital",
    description:
      "$150k gross, public hospital cap ($9,010), modest super sacrifice.",
    inputs: {
      ...DEFAULT_INPUTS,
      age: 42,
      grossAnnualSalary: 150_000,
      employerType: "Public Hospital",
      currentGeneralPackaging: 9_010,
      currentSuperSacrifice: 5_000,
      hasPrivateHospitalCover: true,
      privateHealthPremium: 95,
      privateHealthPremiumPeriod: "fortnightly",
      privateHealthRebateTreatment: "reduced-premium",
    },
  },
];
