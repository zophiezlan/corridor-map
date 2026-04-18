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
    <div>
      <div className="mb-6">
        <Link to="/map" className="text-sm text-stone-500 hover:text-stone-900">
          ← Back to map
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 font-mono tabular-nums text-2xl text-stone-900">
            {headline}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-8 space-y-8">{children}</div>

      <p className="mt-12 text-xs text-stone-400">
        All figures apply to {FINANCIAL_YEAR_LABEL}.
      </p>
    </div>
  );
}

type SectionProps = { title: string; children: ReactNode };

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        {title}
      </h2>
      <div className="mt-2 text-stone-800 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

type MathRowProps = { label: string; value: ReactNode; subtle?: boolean };

export function MathRow({ label, value, subtle }: MathRowProps) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-dashed border-stone-200 py-1.5 ${
        subtle ? "text-stone-500" : "text-stone-900"
      }`}
    >
      <span className="text-sm">{label}</span>
      <span className="font-mono tabular-nums text-sm">{value}</span>
    </div>
  );
}
