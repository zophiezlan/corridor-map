import type { CorridorStatus } from "../calc/types";
import { STATUS_STYLES } from "./statusStyles";

export function StatusBadge({ status }: { status: CorridorStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
