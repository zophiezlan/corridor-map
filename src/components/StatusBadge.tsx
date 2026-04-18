import type { CorridorStatus } from "../calc/types";

const STYLES: Record<CorridorStatus, { label: string; className: string }> = {
  green: {
    label: "Well-optimised",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  amber: {
    label: "Room to improve",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  red: {
    label: "Needs attention",
    className: "bg-rose-100 text-rose-900 border-rose-300",
  },
  grey: {
    label: "Not applicable",
    className: "bg-stone-100 text-stone-700 border-stone-300",
  },
};

export function StatusBadge({ status }: { status: CorridorStatus }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function statusDotClass(status: CorridorStatus): string {
  return {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-rose-500",
    grey: "bg-stone-400",
  }[status];
}
