import {
  PBI_GENERAL_CAP,
  PBI_GROSSUP_FACTOR,
  PUBLIC_HOSPITAL_GENERAL_CAP,
} from "../../calc/constants";
import {
  CorridorFrame,
  MathRow,
  Section,
} from "../../components/CorridorFrame";
import { Money, Percent } from "../../components/Money";
import { ProgressBar } from "../../components/ProgressBar";
import { generalPackagingCorridor } from "../../calc/corridors";
import { packagingPotentialSaving } from "../../calc/calculations";
import { useInputs } from "../../state/InputsContext";

export function PackagingGeneralDetail() {
  const { inputs, derived } = useInputs();
  const summary = generalPackagingCorridor(inputs, derived);
  const { additional, annualSaving } = packagingPotentialSaving(
    inputs,
    derived,
  );

  return (
    <CorridorFrame
      title="Salary Packaging — General Cap"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="Where you are">
        <p>{summary.insight}</p>
        {derived.generalPackagingCap > 0 && (
          <ProgressBar
            utilisation={derived.generalPackagingUtilisation}
            status={summary.status}
            label={`Used ${Math.round(derived.generalPackagingUtilisation * 100)}% of ${derived.generalPackagingCap === PBI_GENERAL_CAP ? "PBI" : "public-hospital"} cap`}
          />
        )}
      </Section>

      <Section title="The math">
        <div>
          <MathRow label="Your employer type" value={inputs.employerType} />
          <MathRow
            label="Your general cap"
            value={<Money value={derived.generalPackagingCap} />}
          />
          <MathRow
            label="− Currently packaged"
            value={<Money value={inputs.currentGeneralPackaging} />}
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
          Salary packaging is a deliberate perk. PBIs and public hospitals can't
          pay market wages, so the government lets them sacrifice salary into
          FBT-exempt benefits (mortgage/rent payments, credit card bills). It
          effectively raises your after-tax pay by the marginal rate on the
          packaged amount.
        </p>
        <p>
          PBI cap is <Money value={PBI_GENERAL_CAP} />
          /yr. Public hospital cap is{" "}
          <Money value={PUBLIC_HOSPITAL_GENERAL_CAP} />. The gross-up factor{" "}
          <span className="font-mono tabular-nums">× {PBI_GROSSUP_FACTOR}</span>{" "}
          converts packaged dollars into a "grossed-up" taxable amount that
          appears as RFBA on your payment summary.
        </p>
      </Section>

      <Section title="Next actions">
        {additional > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Talk to your payroll provider or packaging administrator (Maxxia,
              Smart, AccessPay, etc.) about lifting your packaged amount by{" "}
              <Money value={additional} round10 />.
            </li>
            <li>
              The saving is approximate — packaging pushes you down a tax
              bracket in some cases, which changes the marginal rate. The{" "}
              <Money value={annualSaving} round10 /> figure is a lower-bound
              ballpark.
            </li>
            <li>
              Know what you're packaging into. Rent/mortgage/general card are
              the most common. Some providers charge admin fees; the fee is
              usually trivial relative to the saving.
            </li>
          </ul>
        )}
        {additional === 0 && derived.generalPackagingCap > 0 && (
          <p>Cap fully used. No further action on this corridor.</p>
        )}
        {derived.generalPackagingCap === 0 && (
          <p>
            Your employer type doesn't offer FBT-exempt packaging. If you're
            unsure, ask HR — sometimes an NFP qualifies as a PBI without the
            employer marketing it strongly.
          </p>
        )}
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700">
          <li>
            The packaged amount grosses up into your <em>MLS income</em> and{" "}
            <em>HECS repayment income</em> — check both corridors before
            increasing your packaging.
          </li>
          <li>
            Packaging doesn't reduce your Super Guarantee base unless your
            employer calculates SG on post-packaged wages. Most PBIs don't;
            confirm with payroll.
          </li>
          <li>
            The cap is a <em>financial-year</em> cap (1 July – 30 June), not a
            calendar-year one. Arrive mid-year → you only have a pro-rata amount
            practically left.
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
