import { createContext, useContext } from "react";
import { SG_RATE_DEFAULT } from "../calc/constants";
import type { DerivedValues, UserInputs } from "../calc/types";

export const DEFAULT_INPUTS: UserInputs = {
  age: 30,
  grossAnnualSalary: 0,
  employerType: "PBI",
  currentGeneralPackaging: 0,
  currentMEPackaging: 0,
  currentSuperSacrifice: 0,
  employerSGRate: SG_RATE_DEFAULT,
  deductiblePersonalSuperContributions: 0,
  hasPrivateHospitalCover: false,
  privateHealthPremium: null,
  privateHealthPremiumPeriod: "fortnightly",
  privateHealthRebateTreatment: "reduced-premium",
  netFinancialInvestmentLosses: 0,
  netRentalPropertyLosses: 0,
  hasHECS: false,
  hecsBalance: null,
  zoneTaxResidency: "none",
  propertyGoal: "none",
};

export type InputsContextValue = {
  inputs: UserInputs;
  derived: DerivedValues;
  setInput: <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => void;
  setInputs: (inputs: UserInputs) => void;
  reset: () => void;
  hasInputs: boolean;
};

export const InputsContext = createContext<InputsContextValue | null>(null);

export function useInputs(): InputsContextValue {
  const ctx = useContext(InputsContext);
  if (!ctx) throw new Error("useInputs must be used inside <InputsProvider>");
  return ctx;
}
