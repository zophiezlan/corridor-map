import { Link, useNavigate } from "react-router-dom";
import { FINANCIAL_YEAR_LABEL } from "../calc/constants";
import { useDocumentTitle } from "../components/DocumentTitle";
import { useInputs } from "../state/useInputs";
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
      <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-stone-500">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
        />
        {FINANCIAL_YEAR_LABEL} · Australia · PBI workers
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
        A tax corridor map
        <br />
        for PBI workers.
      </h1>
      <p className="mt-6 text-lg text-stone-700 leading-relaxed">
        Australia&rsquo;s tax system builds differential treatment into certain
        behaviours&thinsp;&mdash;&thinsp;super concessions, PBI salary
        packaging, private health, first-home schemes. Most people don&rsquo;t
        see these corridors clearly.
      </p>
      <p className="mt-4 text-stone-700 leading-relaxed">
        This tool takes a handful of inputs and shows where you sit within those
        corridors. It shows the math, respects your intelligence, and
        doesn&rsquo;t pretend complexity doesn&rsquo;t exist.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/inputs"
          className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 min-h-[44px] text-sm font-medium text-white shadow-sm hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2"
        >
          Start the map &rarr;
        </Link>
        <Link
          to="/about"
          className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-4 decoration-stone-300"
        >
          About &amp; methodology
        </Link>
      </div>

      <section className="mt-14" aria-labelledby="presets-heading">
        <h2
          id="presets-heading"
          className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-stone-500"
        >
          Or try a preset scenario
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Load a realistic starting point, then tweak the inputs from there.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className="group relative flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4 text-left min-h-[44px] shadow-sm transition hover:border-stone-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700/40 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-medium text-stone-900 tracking-tight">
                {p.label}
              </span>
              <span className="mt-1 text-xs text-stone-600 leading-relaxed">
                {p.description}
              </span>
              <span
                className="mt-3 text-xs font-medium text-stone-500 group-hover:text-stone-900 transition-colors"
                aria-hidden
              >
                Load scenario &rarr;
              </span>
            </button>
          ))}
        </div>
      </section>

      <aside
        className="mt-14 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 leading-relaxed"
        aria-label="Scope of this tool"
      >
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-stone-500">
          Scope
        </p>
        <p className="mt-2 font-medium text-stone-900">
          Built for &mdash; and only for &mdash; this specific situation:
        </p>
        <ul className="mt-3 space-y-1 list-disc list-inside marker:text-stone-400">
          <li>Australian resident, under 65</li>
          <li>Employed by a PBI, public hospital, or rebatable NFP</li>
          <li>Single (couples and families are a future version)</li>
          <li>Income roughly $60k&ndash;$180k</li>
        </ul>
        <p className="mt-3">
          If that isn&rsquo;t you, the numbers here will be wrong. All
          calculations apply to {FINANCIAL_YEAR_LABEL}.
        </p>
      </aside>
    </div>
  );
}
