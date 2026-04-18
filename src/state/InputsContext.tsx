import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { SG_RATE_DEFAULT } from "../calc/constants";
import { deriveValues } from "../calc/calculations";
import type { DerivedValues, UserInputs } from "../calc/types";

const STORAGE_KEY = "corridor-map.inputs.v2";

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
  propertyGoal: "none",
};

function loadFromStorage(): UserInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserInputs;
    return { ...DEFAULT_INPUTS, ...parsed };
  } catch {
    return null;
  }
}

type InputsContextValue = {
  inputs: UserInputs;
  derived: DerivedValues;
  setInput: <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => void;
  setInputs: (inputs: UserInputs) => void;
  reset: () => void;
  hasInputs: boolean; // has user meaningfully filled anything in?
};

const InputsContext = createContext<InputsContextValue | null>(null);

export function InputsProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<UserInputs>(
    () => loadFromStorage() ?? DEFAULT_INPUTS,
  );

  const persist = useCallback((next: UserInputs) => {
    setInputsState(next);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const setInput = useCallback<InputsContextValue["setInput"]>(
    (key, value) => {
      persist({ ...inputs, [key]: value });
    },
    [inputs, persist],
  );

  const setInputs = useCallback((next: UserInputs) => persist(next), [persist]);

  const reset = useCallback(() => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setInputsState(DEFAULT_INPUTS);
  }, []);

  const derived = useMemo(() => deriveValues(inputs), [inputs]);

  const hasInputs = inputs.grossAnnualSalary > 0;

  const value = useMemo<InputsContextValue>(
    () => ({ inputs, derived, setInput, setInputs, reset, hasInputs }),
    [inputs, derived, setInput, setInputs, reset, hasInputs],
  );

  return (
    <InputsContext.Provider value={value}>{children}</InputsContext.Provider>
  );
}

export function useInputs(): InputsContextValue {
  const ctx = useContext(InputsContext);
  if (!ctx) throw new Error("useInputs must be used inside <InputsProvider>");
  return ctx;
}
