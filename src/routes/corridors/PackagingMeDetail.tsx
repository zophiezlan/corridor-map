import {
  CorridorFrame,
  MathRow,
  Section,
} from "../../components/CorridorFrame";
import { Money, Percent } from "../../components/Money";
import { ProgressBar } from "../../components/ProgressBar";
import { mePackagingCorridor } from "../../calc/corridors";
import { mePackagingPotentialSaving } from "../../calc/calculations";
import { useInputs } from "../../state/useInputs";

export function PackagingMeDetail() {
  const { inputs, derived } = useInputs();
  const summary = mePackagingCorridor(inputs, derived);
  const { additional, annualSaving } = mePackagingPotentialSaving(
    inputs,
    derived,
  );

  return (
    <CorridorFrame
      title="Salary Packaging — Meal & Entertainment"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="In plain terms">
        <p>
          <strong>Meal & entertainment (M&E) packaging</strong> is a separate
          FBT-exempt bucket on top of the general cap, capped at $2,650/yr. Same
          mechanism as general packaging &mdash; pre-tax dollars for eligible
          spending &mdash; but restricted to restaurant meals, catering, venue
          hire, and the like.
        </p>
        <p>
          This page shows how much of the M&E cap you&rsquo;re using and the
          saving if you topped up to it.
        </p>
      </Section>

      <Section title="Where you are">
        <p>{summary.insight}</p>
        {derived.mePackagingCap > 0 && (
          <ProgressBar
            utilisation={derived.mePackagingUtilisation}
            status={summary.status}
            label={`Used ${Math.round(derived.mePackagingUtilisation * 100)}% of $2,650 M&E cap`}
          />
        )}
      </Section>

      <Section title="The math">
        <div>
          <MathRow
            label="M&E cap"
            value={<Money value={derived.mePackagingCap} />}
          />
          <MathRow
            label="− Currently packaged"
            value={<Money value={inputs.currentMEPackaging} />}
          />
          <MathRow
            label="= Room remaining"
            value={<Money value={additional} />}
          />
          <MathRow
            label="× Your marginal rate (incl Medicare)"
            value={<Percent value={derived.marginalTaxRateWithMedicare} />}
            subtle
          />
          <MathRow
            label="≈ Annual tax saved by packaging that"
            value={<Money value={annualSaving} round10 />}
          />
        </div>
      </Section>

      <Section title="What the tax system is steering">
        <p>
          M&E packaging covers restaurant meals, venue hire, catering, etc. It's
          a narrower carve-out than the general cap, and only works if you
          actually spend that money on eligible items. The saving per dollar is
          the same as the general cap — but the eligible spending pool is
          smaller.
        </p>
      </Section>

      <Section title="If you want to act on this">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            Only worth using if you'd eat out / cater anyway. If your meal
            spending is already &gt;$2,650/yr, packaging it is free money.
          </li>
          <li>
            Most admins require receipts. Some support a "meal card" that
            handles this automatically — worth asking about.
          </li>
          <li>
            Don't manufacture spending to chase the cap. The saving is{" "}
            {Math.round(derived.marginalTaxRateWithMedicare * 100)}c on the
            dollar; you still pay the other
            {Math.round((1 - derived.marginalTaxRateWithMedicare) * 100)}c out
            of pocket.
          </li>
        </ul>
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            Counts toward RFBA alongside general packaging — inflates MLS and
            HECS repayment income the same way.
          </li>
          <li>
            Takeaway and alcohol-only spends usually don't qualify unless
            consumed on premises as part of a meal. Rules vary by admin.
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
