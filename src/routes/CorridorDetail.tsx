import { Navigate, useParams } from 'react-router-dom';
import { useInputs } from '../state/InputsContext';
import { MlsDetail } from './corridors/MlsDetail';
import { PackagingGeneralDetail } from './corridors/PackagingGeneralDetail';
import { PackagingMeDetail } from './corridors/PackagingMeDetail';
import { SuperDetail } from './corridors/SuperDetail';
import { FhssDetail } from './corridors/FhssDetail';
import { DeductionsDetail } from './corridors/DeductionsDetail';
import { HecsDetail } from './corridors/HecsDetail';

export function CorridorDetail() {
  const { name } = useParams<{ name: string }>();
  const { hasInputs } = useInputs();

  if (!hasInputs) return <Navigate to="/inputs" replace />;

  switch (name) {
    case 'mls':
      return <MlsDetail />;
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
