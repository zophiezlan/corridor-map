import { useTheme } from "../state/useTheme";
import type { ThemePreference } from "../state/useTheme";

const OPTIONS: Array<{ value: ThemePreference; label: string; glyph: string }> =
  [
    { value: "light", label: "Light theme", glyph: "☀" },
    { value: "auto", label: "Match system theme", glyph: "◐" },
    { value: "dark", label: "Dark theme", glyph: "☾" },
  ];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center rounded-md border border-stone-200 bg-white p-0.5 dark:border-stone-700 dark:bg-stone-900"
    >
      {OPTIONS.map((opt) => {
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setPreference(opt.value)}
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 dark:focus-visible:ring-stone-300/40 " +
              (active
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100")
            }
          >
            <span aria-hidden>{opt.glyph}</span>
          </button>
        );
      })}
    </div>
  );
}
