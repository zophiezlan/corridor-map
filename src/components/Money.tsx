import { formatAUD, formatPercent } from '../calc/calculations';

type MoneyProps = {
  value: number | null | undefined;
  round10?: boolean;
  className?: string;
};

/** Monospaced dollar display per spec §6 ("Visual design"). */
export function Money({ value, round10, className }: MoneyProps) {
  return (
    <span className={`font-mono tabular-nums ${className ?? ''}`}>
      {formatAUD(value, { round10 })}
    </span>
  );
}

type PercentProps = { value: number; digits?: number; className?: string };

export function Percent({ value, digits = 1, className }: PercentProps) {
  return (
    <span className={`font-mono tabular-nums ${className ?? ''}`}>
      {formatPercent(value, digits)}
    </span>
  );
}
