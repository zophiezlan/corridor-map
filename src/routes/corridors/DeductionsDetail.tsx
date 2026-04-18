import { CorridorFrame, Section } from "../../components/CorridorFrame";
import { deductionsCorridor } from "../../calc/corridors";

export function DeductionsDetail() {
  const summary = deductionsCorridor();

  return (
    <CorridorFrame
      title="Work-related Deductions"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="In plain terms">
        <p>
          A <strong>deduction</strong> is an expense the ATO lets you subtract
          from your taxable income at tax-return time. Each dollar deducted
          saves you your marginal rate on that dollar &mdash; roughly 32c per $1
          at $90k income. Deductions aren&rsquo;t a corridor in the same
          structural sense as packaging or MLS (they&rsquo;re claimed after the
          year, not arranged with payroll), but PBI/NFP workers often
          under-claim the common ones, so this page is a checklist rather than a
          calculator.
        </p>
      </Section>

      <Section title="The three golden rules">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>You spent the money yourself and weren&rsquo;t reimbursed.</li>
          <li>The expense directly relates to earning your income.</li>
          <li>
            You have a record to prove it &mdash; usually a receipt. The ATO
            app&rsquo;s <em>myDeductions</em> tool tracks receipts through the
            year.
          </li>
        </ol>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          You can only claim the work-related portion of an expense. If an item
          is part-work, part-private, apportion it.
        </p>
      </Section>

      <Section title="Common categories for sector workers">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Union / professional association fees.</strong> ASU, HSU,
            ANMF, PSA, AASW &mdash; fully deductible.
          </li>
          <li>
            <strong>Working-from-home running costs.</strong> Fixed-rate (70c/hr
            for 2024-25 onward) covers electricity, internet, phone, stationery;
            or the actual-cost method if you can substantiate.
          </li>
          <li>
            <strong>Phone &amp; internet (for client/team contact).</strong>{" "}
            Work-related portion only, with a 4-week representative log if the
            line is shared.
          </li>
          <li>
            <strong>Personal protective equipment.</strong> Gloves, masks,
            sanitiser, anti-bacterial spray, non-slip footwear &mdash; if your
            role requires them and your employer didn&rsquo;t supply or
            reimburse.
          </li>
          <li>
            <strong>Compulsory or protective uniforms.</strong> Embroidered
            logo-ed shirts required by policy, or genuinely protective clothing.
            Everyday clothes don&rsquo;t qualify even if mandated.
          </li>
          <li>
            <strong>Professional development.</strong> Conferences, training,
            subscriptions &mdash; deductible if directly related to your current
            role (e.g. Cert IV in Ageing Support for an aged-care worker).
          </li>
          <li>
            <strong>Subscriptions and journals.</strong> Professional-only;
            general news isn&rsquo;t deductible.
          </li>
          <li>
            <strong>Donations to DGRs.</strong> $2+ to a registered
            deductible-gift recipient. Keep receipts.
          </li>
          <li>
            <strong>Tax agent fees.</strong> Deductible in the FY paid.
          </li>
          <li>
            <strong>Home office furniture / equipment.</strong> Up to $300
            immediate deduction per item; over $300 depreciated.
          </li>
          <li>
            <strong>Travel between workplaces.</strong> Driving from one job to
            another the same day, or between clients&rsquo; homes for the same
            employer &mdash; deductible (logbook or cents-per-km).
          </li>
        </ul>
      </Section>

      <Section title="Commonly claimed wrongly">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            <strong>Commute.</strong> Normal home-to-work travel isn&rsquo;t
            deductible, even for weekend or early-morning shifts, and even if
            you carry work items.
          </li>
          <li>
            <strong>Everyday clothing.</strong> Jeans, t-shirts, sneakers,
            business attire &mdash; not deductible even if the employer requires
            them.
          </li>
          <li>
            <strong>Meals during normal shifts.</strong> Including meals on
            overtime unless you receive an overtime meal allowance under an
            industrial instrument.
          </li>
          <li>
            <strong>Client-care costs you front.</strong> Coffees, lunches, or
            outings you pay for while supporting a client &mdash; not
            deductible.
          </li>
          <li>
            <strong>Flu shots and vaccinations.</strong> Private expense even
            when work effectively requires them.
          </li>
          <li>
            <strong>Gym, fitness, prescription glasses.</strong> Private
            regardless of work demands.
          </li>
          <li>
            <strong>General self-education.</strong> Must relate to your current
            role, not a future-career change (e.g. a Bachelor of Business
            isn&rsquo;t deductible for an office assistant).
          </li>
        </ul>
      </Section>

      <Section title="Find your occupation's ATO guide">
        <p>
          The ATO publishes occupation-specific guides with worked examples of
          what&rsquo;s in and out for each role. Worth a 5-minute skim before
          tax time &mdash; sector workers most commonly miss:
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1 text-sm">
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/a-d/community-workers-and-direct-carers-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Community support workers and direct carers
            </a>
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/l-q/nurses-and-midwives-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Nurses and midwives
            </a>
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/l-q/paramedics-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Paramedics
            </a>
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/a-d/doctor-specialist-and-other-medical-professionals-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Doctors, specialists and other medical professionals
            </a>
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/r-z/teachers-and-education-professionals-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Teachers and education professionals
            </a>
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/l-q/office-workers-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Office workers
            </a>{" "}
            (admin and support staff at PBIs)
          </li>
          <li>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/a-d/cleaners-income-and-work-related-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              Cleaners
            </a>
          </li>
        </ul>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          The full list of ~40 occupations is at the ATO&rsquo;s{" "}
          <a
            href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries/occupation-and-industry-specific-guides"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
          >
            occupation and industry guides
          </a>
          .
        </p>
      </Section>

      <Section title="Why this tool won't calculate for you">
        <p>
          Deductions shift your taxable income &mdash; which shifts your
          packaging savings, your MLS tier, your HECS repayment, your super cap
          room. Plugging in a specific deduction figure here would push false
          precision. Your tax agent or myTax handles this part; think of this
          page as a reminder list.
        </p>
      </Section>
    </CorridorFrame>
  );
}
