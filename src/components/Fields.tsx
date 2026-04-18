import { useId } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

type FieldProps = {
  label: string;
  hint?: ReactNode;
  /** A render-prop: receives the id/htmlFor to attach to the control. */
  children: (id: string) => ReactNode;
};

/**
 * Field is a render-prop component so the label's htmlFor and the input's id
 * always line up. Pass `(id) => <NumberInput id={id} .../>`.
 */
export function Field({ label, hint, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900">
        {label}
      </label>
      {hint && (
        <span id={hintId} className="mt-0.5 block text-xs text-stone-600">
          {hint}
        </span>
      )}
      <div className="mt-1.5">
        {/* Render-prop receives id; children pass aria-describedby in hint mode. */}
        {children(id)}
      </div>
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
};

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
}: NumberInputProps) {
  return (
    <div className={`relative flex items-stretch ${className ?? ''}`}>
      {prefix && (
        <span
          className="inline-flex items-center rounded-l-md border border-r-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-600"
          aria-hidden
        >
          {prefix}
        </span>
      )}
      <input
        id={id}
        aria-label={ariaLabel}
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          onChange(v === '' ? 0 : Number(v));
        }}
        className={`block w-full border border-stone-300 px-3 py-2 text-sm font-mono tabular-nums shadow-sm focus:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700/30 ${
          prefix ? '' : 'rounded-l-md'
        } ${suffix ? '' : 'rounded-r-md'}`}
      />
      {suffix && (
        <span
          className="inline-flex items-center rounded-r-md border border-l-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-600"
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
};

export function Select<T extends string>({ id, value, onChange, options }: SelectProps<T>) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700/30"
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
        className="mt-0.5 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-1"
      />
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium text-stone-900">{label}</span>
        {hint && (
          <span id={hintId} className="mt-0.5 block text-xs text-stone-600">
            {hint}
          </span>
        )}
      </label>
    </div>
  );
}
