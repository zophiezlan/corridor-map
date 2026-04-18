import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { deriveValues } from "../calc/calculations";
import type { UserInputs } from "../calc/types";
import {
  DEFAULT_INPUTS,
  InputsContext,
  type InputsContextValue,
} from "./useInputs";

const STORAGE_KEY = "corridor-map.inputs.v2";

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
