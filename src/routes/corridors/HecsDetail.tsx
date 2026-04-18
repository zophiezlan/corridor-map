import { HECS_THRESHOLDS_2025_26 } from "../../calc/constants";
import {
  CorridorFrame,
  MathRow,
  Section,
} from "../../components/CorridorFrame";
import { Money, Percent } from "../../components/Money";
import { hecsCorridor } from "../../calc/corridors";
import { useInputs } from "../../state/useInputs";

export function HecsDetail() {
  const { inputs, derived } = useInputs();
  const summary = hecsCorridor(inputs, derived);

  if (!inputs.hasHECS) {
    return (
      <CorridorFrame
        title="HECS / STSL"
        status={summary.status}
        headline={summary.headline}
      >
        <Section title="Not applicable">
          <p>
            You haven&rsquo;t indicated a HECS/HELP/STSL balance, so this
            corridor doesn&rsquo;t apply. If you do have one, head back to{" "}
            <a
              href="/inputs"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900"
            >
              inputs
            </a>{" "}
            and switch it on.
          </p>
        </Section>
      </CorridorFrame>
    );
  }

  return (
    <CorridorFrame
      title="HECS / STSL"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="In plain terms">
        <p>
          HECS/HELP/STSL are Australia&rsquo;s study-loan schemes, repaid
          through payroll once your income crosses a threshold. There&rsquo;s no
          interest; the balance is indexed to inflation each year. Nothing is
          owed while you&rsquo;re below the threshold, and nothing&rsquo;s ever
          owed beyond your income &mdash; it&rsquo;s not a debt in the ordinary
          sense.
        </p>
        <p>
          This page shows the percentage of your pay going to compulsory
          repayment this year, and how packaging / super sacrifice interacts
          with the threshold calculation.
        </p>
      </Section>

      <Section title="Your repayment income">
        <div>
          <MathRow
            label="Taxable income"
            value={<Money value={derived.taxableIncome} />}
          />
          <MathRow
            label="+ Reportable fringe benefits"
            value={<Money value={derived.rfba} />}
          />
          {inputs.currentSuperSacrifice > 0 && (
            <MathRow
              label="+ Reportable super contributions"
              value={<Money value={inputs.currentSuperSacrifice} />}
            />
          )}
          {inputs.netFinancialInvestmentLosses +
            inputs.netRentalPropertyLosses >
            0 && (
            <MathRow
              label="+ Net investment losses"
              value={
                <Money
                  value={
                    inputs.netFinancialInvestmentLosses +
                    inputs.netRentalPropertyLosses
                  }
                />
              }
            />
          )}
          <MathRow
            label="= HECS repayment income"
            value={<Money value={derived.hecsRepaymentIncome} />}
          />
          <MathRow
            label="Marginal repayment rate"
            value={<Percent value={derived.hecsMarginalRate} digits={0} />}
          />
          <MathRow
            label="Estimated annual repayment"
            value={<Money value={derived.hecsRepaymentAnnual} round10 />}
          />
        </div>
      </Section>

      <Section title="2025-26 repayment schedule (marginal)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500">
              <th className="py-1 font-normal">Income above</th>
              <th className="py-1 font-normal">Marginal rate</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {HECS_THRESHOLDS_2025_26.filter((b) => b.rate > 0).map((b) => (
              <tr key={b.from} className="border-t border-stone-200">
                <td className="py-1.5">${b.from.toLocaleString("en-AU")}</td>
                <td className="py-1.5">{(b.rate * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-stone-500 mt-2">
          "Marginal" means the rate applies only to the income above each
          threshold, not to your whole repayment income. This is the regime from
          2025-26 onward.
        </p>
      </Section>

      <Section title="What the tax system is steering">
        <p>
          Since the 2024 reforms, voluntary extra repayments no longer attract a
          discount &mdash; there&rsquo;s no tax-side incentive to pay faster
          than the schedule. Paying extra might still make sense for reasons
          outside the tax system: you want the balance gone for peace of mind,
          you&rsquo;re leaving Australia for an extended period, or you&rsquo;re
          applying for a mortgage (some lenders treat HELP as an ongoing
          commitment that reduces borrowing capacity).
        </p>
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            Salary packaging inflates your HECS repayment income. Packaging
            $15,900 adds ~$30,000 to the income used to calculate your
            compulsory repayment — which can push you into a higher marginal
            repayment bracket.
          </li>
          <li>
            The balance indexes each 1 June using CPI (capped at WPI under the
            2024 reforms). Indexation isn't interest — you can't deduct it.
          </li>
          <li>
            Your employer withholds based on estimated income; any mismatch is
            settled at tax time.
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
