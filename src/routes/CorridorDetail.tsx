import { lazy, Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useInputs } from '../state/InputsContext';
import { PackagingGeneralDetail } from './corridors/PackagingGeneralDetail';
import { PackagingMeDetail } from './corridors/PackagingMeDetail';
import { SuperDetail } from './corridors/SuperDetail';
import { FhssDetail } from './corridors/FhssDetail';
import { DeductionsDetail } from './corridors/DeductionsDetail';
import { HecsDetail } from './corridors/HecsDetail';

// MLS detail pulls in Recharts — split it out so the rest of the app doesn't pay for it.
const MlsDetail = lazy(() =>
  import('./corridors/MlsDetail').then((m) => ({ default: m.MlsDetail })),
);

function ChartFallback() {
  return (
    <div className="py-16 text-center text-sm text-stone-500" role="status" aria-live="polite">
      Loading chart…
    </div>
  );
}

export function CorridorDetail() {
  const { name } = useParams<{ name: string }>();
  const { hasInputs } = useInputs();

  if (!hasInputs) return <Navigate to="/inputs" replace />;

  switch (name) {
    case 'mls':
      return (
        <Suspense fallback={<ChartFallback />}>
          <MlsDetail />
        </Suspense>
      );
    case 'packaging-general':
      return <PackagingGeneralDetail />;
    case 'packaging-me':
      return <PackagingMeDetail />;
    case 'super':
      return <SuperDetail />;
    case 'fhss':
      return <FhssDetail />;
    case 'deductions':
      return <DeductionsDetail />;
    case 'hecs':
      return <HecsDetail />;
    default:
      return <Navigate to="/map" replace />;
  }
}
