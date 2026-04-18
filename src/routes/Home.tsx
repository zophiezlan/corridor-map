import { Link } from 'react-router-dom';
import { FINANCIAL_YEAR_LABEL } from '../calc/constants';
import { useDocumentTitle } from '../components/DocumentTitle';

export function Home() {
  useDocumentTitle();
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">A tax corridor map for PBI workers.</h1>
      <p className="mt-6 text-lg text-stone-700 leading-relaxed">
        Australia's tax system builds differential treatment into certain behaviours — super
        concessions, PBI salary packaging, private health, first home schemes. Most people
        don't see these corridors clearly.
      </p>
      <p className="mt-4 text-stone-700 leading-relaxed">
        This tool takes a handful of inputs about your situation and shows where you sit
        within those corridors. It shows the math, respects your intelligence, and doesn't
        pretend complexity doesn't exist.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/inputs"
          className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Start the map →
        </Link>
        <Link to="/about" className="text-sm text-stone-600 hover:text-stone-900">
          About / methodology
        </Link>
      </div>

      <div className="mt-12 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 leading-relaxed">
        <p className="font-medium text-stone-900">Built for — and only for — this specific situation:</p>
        <ul className="mt-3 space-y-1 list-disc list-inside">
          <li>Australian resident, under 65</li>
          <li>Employed by a PBI / public hospital / rebatable NFP</li>
          <li>Single (couples/families are a future version)</li>
          <li>Income roughly $60k–$180k</li>
        </ul>
        <p className="mt-3">
          If that isn't you, the numbers here will be wrong. All calculations apply to {FINANCIAL_YEAR_LABEL}.
        </p>
      </div>
    </div>
  );
}
