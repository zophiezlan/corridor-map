import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { FINANCIAL_YEAR_LABEL } from "../calc/constants";
import { StatusBadge } from "./StatusBadge";
import { useDocumentTitle } from "./DocumentTitle";
import type { CorridorStatus } from "../calc/types";

type Props = {
  title: string;
  status: CorridorStatus;
  headline: ReactNode;
  children: ReactNode;
};

export function CorridorFrame({ title, status, headline, children }: Props) {
  useDocumentTitle(title);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          to="/map"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
        >
          &larr; Back to map
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            {title}
          </h1>
          <p className="mt-3 font-mono tabular-nums text-2xl text-stone-900 dark:text-stone-100 tracking-tight">
            {headline}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-10 space-y-10">{children}</div>

      <p className="mt-12 text-[11px] font-mono uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
        All figures apply to {FINANCIAL_YEAR_LABEL}
      </p>
    </div>
  );
}

type SectionProps = { title: string; children: ReactNode };

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
        {title}
      </h2>
      <div className="mt-3 text-stone-800 dark:text-stone-200 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

type MathRowProps = { label: string; value: ReactNode; subtle?: boolean };

export function MathRow({ label, value, subtle }: MathRowProps) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-dashed border-stone-200 dark:border-stone-800 py-1.5 ${
        subtle
          ? "text-stone-500 dark:text-stone-400"
          : "text-stone-900 dark:text-stone-100"
      }`}
    >
      <span className="text-sm">{label}</span>
      <span className="font-mono tabular-nums text-sm">{value}</span>
    </div>
  );
}
