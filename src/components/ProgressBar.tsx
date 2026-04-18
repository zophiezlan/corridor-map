import type { CorridorStatus } from "../calc/types";

type Props = {
  utilisation: number; // 0-1
  status: CorridorStatus;
  label?: string;
};

const FILL: Record<CorridorStatus, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-rose-500",
  grey: "bg-stone-400",
};

export function ProgressBar({ utilisation, status, label }: Props) {
  const pct = Math.min(1, Math.max(0, utilisation));
  const valuePercent = Math.round(pct * 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-stone-500 mb-1">
          <span>{label}</span>
          <span className="font-mono tabular-nums" aria-hidden="true">
            {valuePercent}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={valuePercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Utilisation"}
        className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden"
      >
        <div
          className={`h-full rounded-full ${FILL[status]}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
