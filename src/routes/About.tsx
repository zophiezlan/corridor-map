import { FINANCIAL_YEAR_LABEL } from '../calc/constants';
import { useDocumentTitle } from '../components/DocumentTitle';

export function About() {
  useDocumentTitle('About');
  return (
    <div className="max-w-2xl prose-stone">
      <h1 className="text-3xl font-semibold tracking-tight">About Corridor Map</h1>

      <section className="mt-6 space-y-3 text-stone-700 leading-relaxed">
        <h2 className="text-lg font-semibold text-stone-900 mt-6">Who this is for</h2>
        <p>
          Workers at Australian PBIs and similar not-for-profits who can access
          FBT-exempt salary packaging. Built by someone in that cohort for people
          in that cohort.
        </p>

        <h2 className="text-lg font-semibold text-stone-900 mt-6">What this is</h2>
        <p>
          A personal financial corridor map. It takes a handful of inputs about
          your situation and shows where you sit within the tax-favourable
          mechanisms the Australian tax system provides. For computable corridors
          (MLS, packaging, super cap) it calculates your position, utilisation,
          and the marginal value of your next actions. For judgement-heavy
          corridors (first-home schemes, deductions) it provides structured
          context and decision prompts.
        </p>

        <h2 className="text-lg font-semibold text-stone-900 mt-6">What this is NOT</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Not financial advice</li>
          <li>Not a tax return preparation tool</li>
          <li>Not a budgeting or cash flow tool</li>
          <li>Not a replacement for a real financial advisor</li>
        </ul>

        <h2 className="text-lg font-semibold text-stone-900 mt-6">Methodology</h2>
        <p>
          All rates, thresholds, and caps used in the calculations apply to{' '}
          <strong>{FINANCIAL_YEAR_LABEL}</strong>. Sources: ATO (income tax brackets,
          MLS thresholds, super caps, HECS schedule) and PrivateHealth.gov.au
          (rebate rates, age-based discount). Every calculated number has a
          tooltip showing the formula used.
        </p>
        <p>
          The tool makes simplifying assumptions suited to a typical PBI worker:
          single filer, no investment property, no family trust distributions, no
          spouse for MLS purposes. If any of those don't match your situation,
          treat the numbers as directional and confirm with payroll or an
          accountant before acting.
        </p>

        <h2 className="text-lg font-semibold text-stone-900 mt-6">Privacy</h2>
        <p>
          Your inputs never leave your browser. There is no account, no server,
          no analytics, no tracking. Inputs are held in your browser's session
          storage so you don't lose them on refresh — they're cleared when you
          close the tab.
        </p>

        <h2 className="text-lg font-semibold text-stone-900 mt-6">Colophon</h2>
        <p>
          Built by Clancy. React + TypeScript + Tailwind + Vite, deployed on
          Vercel. Calculations live in a single module of pure functions with
          unit tests — audit the math by reading{' '}
          <code className="text-sm">src/calc/</code>.
        </p>
      </section>
    </div>
  );
}
