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

      <Section title="Common categories for sector workers">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Union / professional association fees.</strong> ASU, HSU,
            ANMF, PSA, AASW — fully deductible.
          </li>
          <li>
            <strong>Working-from-home running costs.</strong> Fixed-rate (70c/hr
            for 2024-25 onward) covers electricity, internet, phone, stationery;
            or the actual-cost method if you can substantiate.
          </li>
          <li>
            <strong>Professional development.</strong> Conferences, training,
            subscriptions — deductible if directly related to your current role.
          </li>
          <li>
            <strong>Subscriptions and journals.</strong> Professional-only;
            general news isn't deductible.
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
        </ul>
      </Section>

      <Section title="Categories often claimed wrongly">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            <strong>Commute.</strong> Normal home-to-work travel isn't
            deductible, even if you carry work items.
          </li>
          <li>
            <strong>Everyday clothing.</strong> Only uniforms with a registered
            logo or protective clothing (steel-caps, high-vis) count.
          </li>
          <li>
            <strong>General self-education.</strong> Must relate to your current
            role, not a future-career change.
          </li>
        </ul>
      </Section>

      <Section title="Why this tool won't calculate for you">
        <p>
          Deductions shift your taxable income — which shifts your packaging
          savings, your MLS tier, your HECS repayment, your super cap room.
          Plugging in a specific deduction figure here would push false
          precision. Your tax agent or myTax handles this part; think of this
          page as a reminder list.
        </p>
      </Section>
    </CorridorFrame>
  );
}
