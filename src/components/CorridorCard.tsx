import { Link } from "react-router-dom";
import type { CorridorCardSummary } from "../calc/types";
import { StatusBadge, statusDotClass } from "./StatusBadge";

export function CorridorCard({ summary }: { summary: CorridorCardSummary }) {
  const dim = summary.status === "grey";
  return (
    <Link
      to={`/corridor/${summary.id}`}
      className={`block rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-stone-300 ${
        dim ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${statusDotClass(summary.status)}`}
            aria-hidden
          />
          <h2 className="font-semibold text-stone-900">{summary.name}</h2>
        </div>
        <StatusBadge status={summary.status} />
      </div>
      <p className="mt-3 font-mono tabular-nums text-xl text-stone-900">
        {summary.headline}
      </p>
      <p className="mt-2 text-sm text-stone-600 leading-snug">
        {summary.insight}
      </p>
      <p className="mt-3 text-xs text-stone-400">See details →</p>
    </Link>
  );
}
