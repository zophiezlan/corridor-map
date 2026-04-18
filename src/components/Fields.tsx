import { useId } from "react";
import type { ChangeEvent, ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: ReactNode;
  /**
   * Render-prop: receives the id for the control and the id of the hint
   * (or undefined when there's no hint). Wire describedBy into the control
   * so screen readers announce the hint alongside the label.
   */
  children: (id: string, describedBy: string | undefined) => ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const describedBy = hint ? hintId : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-900 dark:text-stone-100"
      >
        {label}
      </label>
      {hint && (
        <span
          id={hintId}
          className="mt-0.5 block text-xs text-stone-600 dark:text-stone-400"
        >
          {hint}
        </span>
      )}
      <div className="mt-1.5">{children(id, describedBy)}</div>
    </div>
  );
}

type NumberInputProps = {
  id?: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

const intFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

function formatDisplay(value: number | null, isCurrency: boolean): string {
  if (value == null || Number.isNaN(value)) return "";
  if (isCurrency) return intFormatter.format(value);
  return String(value);
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  prefix,
  suffix,
  className,
  ariaLabel,
  ariaDescribedBy,
}: NumberInputProps) {
  const isCurrency = prefix === "$";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      onChange(0);
      return;
    }
    // strip any grouping chars (commas, spaces) and parse
    const cleaned = raw.replace(/[\s,]/g, "");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) onChange(parsed);
  };

  return (
    <div className={`relative flex items-stretch ${className ?? ""}`}>
      {prefix && (
        <span
          className="inline-flex items-center rounded-l-md border border-r-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          aria-hidden
        >
          {prefix}
        </span>
      )}
      <input
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        type="text"
        inputMode={isCurrency ? "numeric" : "decimal"}
        autoComplete="off"
        enterKeyHint="done"
        value={formatDisplay(value, isCurrency)}
        data-min={min}
        data-max={max}
        data-step={step}
        placeholder={placeholder}
        onChange={handleChange}
        className={`block w-full border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 px-3 py-2 min-h-[44px] text-sm font-mono tabular-nums shadow-sm focus:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-400 dark:focus:ring-stone-300/30 ${
          prefix ? "" : "rounded-l-md"
        } ${suffix ? "" : "rounded-r-md"}`}
      />
      {suffix && (
        <span
          className="inline-flex items-center rounded-r-md border border-l-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          aria-hidden
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

type SelectProps<T extends string> = {
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  ariaDescribedBy?: string;
};

export function Select<T extends string>({
  id,
  value,
  onChange,
  options,
  ariaDescribedBy,
}: SelectProps<T>) {
  return (
    <select
      id={id}
      aria-describedby={ariaDescribedBy}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="block w-full rounded-md border border-stone-300 bg-white text-stone-900 px-3 py-2 min-h-[44px] text-sm shadow-sm focus:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-400 dark:focus:ring-stone-300/30"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: ReactNode;
};

export function Toggle({ checked, onChange, label, hint }: ToggleProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={hint ? hintId : undefined}
        className="mt-1 h-5 w-5 rounded border-stone-300 text-stone-900 focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-1 dark:border-stone-600 dark:bg-stone-900 dark:focus:ring-offset-stone-950"
      />
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">
          {label}
        </span>
        {hint && (
          <span
            id={hintId}
            className="mt-0.5 block text-xs text-stone-600 dark:text-stone-400"
          >
            {hint}
          </span>
        )}
      </label>
    </div>
  );
}
