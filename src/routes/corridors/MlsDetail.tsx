import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MLS_THRESHOLDS_SINGLE,
  PERIOD_MULTIPLIERS,
} from "../../calc/constants";
import {
  CorridorFrame,
  MathRow,
  Section,
} from "../../components/CorridorFrame";
import { Money, Percent } from "../../components/Money";
import { mlsCorridor } from "../../calc/corridors";
import { useInputs } from "../../state/InputsContext";
import { formatAUD } from "../../calc/calculations";

export function MlsDetail() {
  const { inputs, derived } = useInputs();
  const summary = mlsCorridor(inputs, derived);

  const chartData = useMemo(
    () => [
      {
        name: "Base",
        floor: 0,
        ceiling: MLS_THRESHOLDS_SINGLE.Base.upTo,
        rate: 0,
      },
      {
        name: "Tier 1",
        floor: MLS_THRESHOLDS_SINGLE.Tier1.from,
        ceiling: MLS_THRESHOLDS_SINGLE.Tier1.upTo,
        rate: 1,
      },
      {
        name: "Tier 2",
        floor: MLS_THRESHOLDS_SINGLE.Tier2.from,
        ceiling: MLS_THRESHOLDS_SINGLE.Tier2.upTo,
        rate: 1.25,
      },
      {
        name: "Tier 3",
        floor: MLS_THRESHOLDS_SINGLE.Tier3.from,
        ceiling: MLS_THRESHOLDS_SINGLE.Tier3.from + 50_000, // visual ceiling only
        rate: 1.5,
      },
    ],
    [],
  );

  const userRatePercent =
    derived.mlsTier === "Base"
      ? 0
      : MLS_THRESHOLDS_SINGLE[derived.mlsTier].rate * 100;
  const chartAriaLabel = `Bar chart of MLS surcharge rates by income tier. You are in ${derived.mlsTier} at ${userRatePercent}% surcharge rate.`;

  return (
    <CorridorFrame
      title="MLS / Private Health"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="Where you are">
        <p>{summary.insight}</p>
        <div
          className="mt-4 h-52 w-full rounded-md border border-stone-200 bg-white p-3"
          role="img"
          aria-label={chartAriaLabel}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ left: 0, right: 16, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="name" tick={{ fill: "#57534e", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#57534e", fontSize: 12 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Surcharge rate"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="rate" fill="#a8a29e" radius={[3, 3, 0, 0]} />
              <ReferenceLine
                y={userRatePercent}
                stroke="#0f172a"
                strokeDasharray="4 2"
                label={{
                  value: `You — ${derived.mlsTier}`,
                  position: "insideTopRight",
                  fill: "#0f172a",
                  fontSize: 11,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="sr-only">
          MLS surcharge rates: Base 0%, Tier 1 1%, Tier 2 1.25%, Tier 3 1.5%.
          You are in {derived.mlsTier} at {userRatePercent}%.
        </p>
      </Section>

      <Section title="The math">
        <div>
          <MathRow
            label="Gross salary"
            value={<Money value={inputs.grossAnnualSalary} />}
          />
          <MathRow
            label="− Salary packaged"
            value={
              <Money
                value={
                  inputs.currentGeneralPackaging + inputs.currentMEPackaging
                }
              />
            }
          />
          <MathRow
            label="= Taxable income"
            value={<Money value={derived.taxableIncome} />}
          />
          <MathRow
            label="+ Reportable FB (packaging × 1.8868)"
            value={<Money value={derived.rfba} />}
          />
          {inputs.currentSuperSacrifice > 0 && (
            <MathRow
              label="+ Reportable super contributions"
              value={<Money value={inputs.currentSuperSacrifice} />}
            />
          )}
          <MathRow
            label="= Income for MLS purposes"
            value={<Money value={derived.mlsIncome} />}
          />
          <MathRow label="MLS tier" value={derived.mlsTier} />
          <MathRow
            label="× Surcharge rate"
            value={
              <Percent
                value={
                  { Base: 0, Tier1: 0.01, Tier2: 0.0125, Tier3: 0.015 }[
                    derived.mlsTier
                  ]
                }
                digits={2}
              />
            }
            subtle
          />
          <MathRow
            label="= MLS liability if no cover"
            value={
              <Money
                value={Math.round(
                  derived.mlsIncome *
                    { Base: 0, Tier1: 0.01, Tier2: 0.0125, Tier3: 0.015 }[
                      derived.mlsTier
                    ],
                )}
                round10
              />
            }
          />
          {inputs.hasPrivateHospitalCover && (
            <>
              <MathRow label="— Private hospital cover held" value="Yes" />
              <MathRow
                label={`Premium (${inputs.privateHealthPremiumPeriod})`}
                value={<Money value={inputs.privateHealthPremium} />}
              />
              <MathRow
                label={`× ${PERIOD_MULTIPLIERS[inputs.privateHealthPremiumPeriod]} periods/yr`}
                value={<Money value={derived.premiumPaidAnnual} />}
                subtle
              />
              {inputs.privateHealthRebateTreatment === "tax-refund" && (
                <>
                  <MathRow
                    label={`− Rebate refund (${derived.rebateTier}, ${(derived.phiRebatePercent * 100).toFixed(2)}%)`}
                    value={<Money value={-derived.rebateRefundAnnual} />}
                    subtle
                  />
                  <MathRow
                    label="= Net annual cost"
                    value={<Money value={derived.netPhiCostAnnual} round10 />}
                  />
                </>
              )}
              {inputs.privateHealthRebateTreatment !== "tax-refund" && (
                <MathRow
                  label="= Net annual cost (rebate already on bill)"
                  value={<Money value={derived.netPhiCostAnnual} round10 />}
                />
              )}
            </>
          )}
          {!inputs.hasPrivateHospitalCover &&
            derived.breakEvenNetCostAnnual != null && (
              <MathRow
                label="Break-even net cost (covers MLS saved)"
                value={<Money value={derived.breakEvenNetCostAnnual} round10 />}
              />
            )}
        </div>
      </Section>

      <Section title="What the tax system is steering">
        <p>
          MLS is the stick: the government wants higher-income earners to carry
          private hospital cover so public hospitals aren't the only option. The
          rebate is the carrot on the same policy — reducing the effective
          premium at lower incomes.
        </p>
      </Section>

      <Section title="Next actions">
        {!inputs.hasPrivateHospitalCover && derived.mlsTier !== "Base" && (
          <p>
            Compare compliant hospital policies with a net cost up to ~
            {formatAUD(derived.breakEvenNetCostAnnual ?? 0, { round10: true })}
            /yr. Below that, cover is cheaper than the MLS you avoid. Check
            waiting periods — LHC loading can also push premiums up if you take
            out cover later.
          </p>
        )}
        {inputs.hasPrivateHospitalCover && derived.mlsTier !== "Base" && (
          <p>
            Your current policy looks like a sensible choice at this income.
            Worth reviewing once a year — premiums creep, and rebate rates shift
            every 1 April.
          </p>
        )}
        {derived.mlsTier === "Base" && inputs.hasPrivateHospitalCover && (
          <p>
            MLS doesn't apply at your income, so the policy is optional from a
            tax standpoint. Keep it for the healthcare benefit, drop it for the
            premium — either way, the tax side doesn't drive the decision.
          </p>
        )}
        {derived.mlsTier === "Base" && !inputs.hasPrivateHospitalCover && (
          <p>No action needed from a tax standpoint.</p>
        )}
        <p className="text-xs text-stone-500">
          Verify with your payroll/advisor before acting.
        </p>
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700">
          <li>
            Salary packaging grosses up your income for MLS purposes via RFBA.
            Packaging $15,900 adds ~$30,000 to MLS income.
          </li>
          <li>
            Reportable super contributions (voluntary sacrifice) also count
            toward MLS income.
          </li>
          <li>
            Extras-only cover doesn't avoid MLS — you need hospital cover with
            an excess no greater than $750 (singles).
          </li>
          <li>
            Lifetime Health Cover loading: waiting past 1 July following your
            31st birthday to take out hospital cover adds 2% to premiums for
            each year of delay (up to 70%).
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
