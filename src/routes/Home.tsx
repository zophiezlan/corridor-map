import { Link, useNavigate } from "react-router-dom";
import { FINANCIAL_YEAR_LABEL } from "../calc/constants";
import { useDocumentTitle } from "../components/DocumentTitle";
import { useInputs } from "../state/InputsContext";
import { PRESETS } from "../state/presets";

export function Home() {
  useDocumentTitle();
  const { setInputs } = useInputs();
  const navigate = useNavigate();

  function loadPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setInputs(p.inputs);
    navigate("/map");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">
        A tax corridor map for PBI workers.
      </h1>
      <p className="mt-6 text-lg text-stone-700 leading-relaxed">
        Australia's tax system builds differential treatment into certain
        behaviours — super concessions, PBI salary packaging, private health,
        first home schemes. Most people don't see these corridors clearly.
      </p>
      <p className="mt-4 text-stone-700 leading-relaxed">
        This tool takes a handful of inputs about your situation and shows where
        you sit within those corridors. It shows the math, respects your
        intelligence, and doesn't pretend complexity doesn't exist.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/inputs"
          className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 min-h-[44px] text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
        >
          Start the map →
        </Link>
        <Link
          to="/about"
          className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-2"
        >
          About / methodology
        </Link>
      </div>

      <section className="mt-12" aria-labelledby="presets-heading">
        <h2
          id="presets-heading"
          className="text-sm font-semibold uppercase tracking-wide text-stone-500"
        >
          Or try a preset scenario
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Load a realistic starting point, then tweak the inputs from there.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className="group flex h-full flex-col rounded-md border border-stone-300 bg-white p-4 text-left min-h-[44px] hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-2"
            >
              <span className="text-sm font-medium text-stone-900">
                {p.label}
              </span>
              <span className="mt-1 text-xs text-stone-600 leading-relaxed">
                {p.description}
              </span>
              <span
                className="mt-3 text-xs text-stone-700 group-hover:text-stone-900"
                aria-hidden
              >
                Load scenario →
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 leading-relaxed">
        <p className="font-medium text-stone-900">
          Built for — and only for — this specific situation:
        </p>
        <ul className="mt-3 space-y-1 list-disc list-inside">
          <li>Australian resident, under 65</li>
          <li>Employed by a PBI / public hospital / rebatable NFP</li>
          <li>Single (couples/families are a future version)</li>
          <li>Income roughly $60k–$180k</li>
        </ul>
        <p className="mt-3">
          If that isn't you, the numbers here will be wrong. All calculations
          apply to {FINANCIAL_YEAR_LABEL}.
        </p>
      </div>
    </div>
  );
}
