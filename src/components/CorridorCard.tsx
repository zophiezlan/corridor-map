import { Link } from "react-router-dom";
import type { CorridorCardSummary } from "../calc/types";
import { StatusBadge } from "./StatusBadge";
import { statusDotClass } from "./statusStyles";

export function CorridorCard({ summary }: { summary: CorridorCardSummary }) {
  const dim = summary.status === "grey";
  return (
    <Link
      to={`/corridor/${summary.id}`}
      className={`group relative block rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition duration-150 hover:-translate-y-px hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 focus-visible:ring-offset-2 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 ${
        dim ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`h-2 w-2 rounded-full flex-shrink-0 mt-[0.45rem] ${statusDotClass(summary.status)}`}
            aria-hidden
          />
          <h2 className="font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
            {summary.name}
          </h2>
        </div>
        <StatusBadge status={summary.status} />
      </div>
      <p className="mt-3 font-mono tabular-nums text-xl text-stone-900 dark:text-stone-100 tracking-tight">
        {summary.headline}
      </p>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-snug">
        {summary.insight}
      </p>
      <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
        See details &rarr;
      </p>
    </Link>
  );
}
