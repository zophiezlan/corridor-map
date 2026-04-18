import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CorridorCard } from "../components/CorridorCard";
import { useDocumentTitle } from "../components/DocumentTitle";
import { Money } from "../components/Money";
import { Term } from "../components/Glossary";
import { allCorridors } from "../calc/corridors";
import { useInputs } from "../state/useInputs";
import { buildShareUrl, decodeInputs } from "../state/shareLink";

export function Map() {
  useDocumentTitle("Your map");
  const { inputs, derived, hasInputs, setInputs } = useInputs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // If the URL has ?s=<encoded>, adopt that scenario once on mount, then
  // clear the query string so later edits don't write back into it.
  useEffect(() => {
    const s = searchParams.get("s");
    if (!s) return;
    const decoded = decodeInputs(s);
    if (decoded) setInputs(decoded);
    searchParams.delete("s");
    setSearchParams(searchParams, { replace: true });
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warm the Recharts/MLS chunk while the user looks at the map, so clicking
  // into the MLS detail feels instant. Fire-and-forget.
  useEffect(() => {
    void import("./corridors/MlsDetail");
  }, []);

  const corridors = useMemo(
    () => allCorridors(inputs, derived),
    [inputs, derived],
  );

  const hasEncodedLink = searchParams.has("s");
  if (!hasInputs && !hasEncodedLink) return <Navigate to="/inputs" replace />;

  async function handleCopyLink() {
    try {
      const url = buildShareUrl(inputs);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — fall back to prompt
      window.prompt("Copy this link:", buildShareUrl(inputs));
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            Your corridor map
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            Based on a gross salary of{" "}
            <Money value={inputs.grossAnnualSalary} /> ({inputs.employerType}).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end" data-print-hide>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 min-h-[36px] text-sm transition-colors hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 focus-visible:ring-offset-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-500"
          >
            {copied ? "Link copied \u2713" : "Copy link"}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 min-h-[36px] text-sm transition-colors hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 focus-visible:ring-offset-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-500"
          >
            Print
          </button>
          <Link
            to="/inputs"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 min-h-[36px] text-sm transition-colors hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 focus-visible:ring-offset-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-500"
          >
            Edit inputs
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-stone-800 dark:bg-stone-900">
        <Summary label="Taxable income" value={derived.taxableIncome} />
        <Summary
          label={
            <>
              <Term term="RFBA">Reportable FB</Term> amount
            </>
          }
          value={derived.rfba}
        />
        <Summary
          label="Marginal rate (incl Medicare)"
          value={derived.marginalTaxRateWithMedicare}
          isPercent
        />
        <Summary
          label={
            <>
              <Term term="MLS" /> tier
            </>
          }
          text={derived.mlsTier}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {corridors.map((c) => (
          <CorridorCard key={c.id} summary={c} />
        ))}
      </div>

      <p className="mt-8 text-xs text-stone-500 dark:text-stone-500">
        <strong>Tip:</strong> Copy link gives you a shareable URL that
        re-creates this exact scenario. Inputs travel in the URL — nothing is
        sent anywhere.
      </p>
    </div>
  );
}

function Summary({
  label,
  value,
  isPercent,
  text,
}: {
  label: ReactNode;
  value?: number;
  isPercent?: boolean;
  text?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <p className="mt-1.5 font-mono tabular-nums text-lg text-stone-900 dark:text-stone-100 tracking-tight">
        {text ? (
          text
        ) : isPercent ? (
          `${((value ?? 0) * 100).toFixed(1)}%`
        ) : (
          <Money value={value} />
        )}
      </p>
    </div>
  );
}
