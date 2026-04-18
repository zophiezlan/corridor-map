import { Link, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { CorridorCard } from '../components/CorridorCard';
import { Money } from '../components/Money';
import { allCorridors } from '../calc/corridors';
import { useInputs } from '../state/InputsContext';

export function Map() {
  const { inputs, derived, hasInputs } = useInputs();

  const corridors = useMemo(() => allCorridors(inputs, derived), [inputs, derived]);

  if (!hasInputs) return <Navigate to="/inputs" replace />;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your corridor map</h1>
          <p className="mt-2 text-stone-600">
            Based on a gross salary of <Money value={inputs.grossAnnualSalary} />{' '}
            ({inputs.employerType}).
          </p>
        </div>
        <Link
          to="/inputs"
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:border-stone-500"
        >
          Edit inputs
        </Link>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Taxable income" value={derived.taxableIncome} />
        <Summary label="Reportable FB amount" value={derived.rfba} />
        <Summary label="Marginal rate (incl Medicare)" value={derived.marginalTaxRateWithMedicare} isPercent />
        <Summary label="MLS tier" text={derived.mlsTier} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {corridors.map((c) => (
          <CorridorCard key={c.id} summary={c} />
        ))}
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  isPercent,
  text,
}: {
  label: string;
  value?: number;
  isPercent?: boolean;
  text?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 font-mono tabular-nums text-lg text-stone-900">
        {text ? text : isPercent ? `${((value ?? 0) * 100).toFixed(1)}%` : <Money value={value} />}
      </p>
    </div>
  );
}
