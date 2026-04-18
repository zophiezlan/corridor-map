import type { CorridorStatus } from "../calc/types";

export const STATUS_STYLES: Record<
  CorridorStatus,
  { label: string; className: string }
> = {
  green: {
    label: "Well-optimised",
    className:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800",
  },
  amber: {
    label: "Some headroom",
    className:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800",
  },
  red: {
    label: "Worth reviewing",
    className:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800",
  },
  grey: {
    label: "Not applicable",
    className:
      "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
  },
};

export function statusDotClass(status: CorridorStatus): string {
  return {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-rose-500",
    grey: "bg-stone-400",
  }[status];
}
