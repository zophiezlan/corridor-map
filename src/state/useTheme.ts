import { useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "auto";

const STORAGE_KEY = "corridor-map:theme";

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  return "auto";
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(pref: ThemePreference) {
  if (typeof document === "undefined") return;
  const effectiveDark =
    pref === "dark" || (pref === "auto" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", effectiveDark);
  document.documentElement.style.colorScheme = effectiveDark ? "dark" : "light";
}

export function useTheme() {
  const [preference, setPreference] =
    useState<ThemePreference>(readStoredPreference);

  useEffect(() => {
    applyTheme(preference);
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== "auto") return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("auto");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [preference]);

  return { preference, setPreference };
}
