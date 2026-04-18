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
import { useInputs } from "../../state/useInputs";

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
      <Section title="In plain terms">
        <p>
          <strong>Salary packaging</strong> is an arrangement with payroll where
          part of your gross pay goes out as non-cash benefits (mortgage, rent,
          card spending) instead of as taxed salary. For PBI and public-hospital
          workers, up to a yearly cap is exempt from <strong>FBT</strong>{" "}
          (Fringe Benefits Tax) &mdash; so those dollars effectively skip income
          tax entirely, saving you your marginal rate on each one.
        </p>
        <p>
          This page shows how much of your cap you&rsquo;re using and the tax
          saving if you topped up to the cap.
        </p>
      </Section>

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

      <Section title="If you want to act on this">
        {additional > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Your payroll team or packaging administrator (Maxxia, Smart,
              AccessPay, etc.) is the starting point for lifting your packaged
              amount by up to <Money value={additional} round10 />.
            </li>
            <li>
              The saving above is approximate &mdash; packaging sometimes pushes
              you down a tax bracket, which changes your marginal rate, so{" "}
              <Money value={annualSaving} round10 /> is a lower-bound ballpark.
            </li>
            <li>
              Packaging only makes sense if you have eligible spending anyway
              (rent/mortgage/general card are the common buckets). Most
              providers charge a small admin fee &mdash; usually trivial
              compared with the tax saving, but worth checking.
            </li>
          </ul>
        )}
        {additional === 0 && derived.generalPackagingCap > 0 && (
          <p>Your cap is fully used &mdash; nothing to do on this corridor.</p>
        )}
        {derived.generalPackagingCap === 0 && (
          <p>
            Your employer type doesn&rsquo;t offer FBT-exempt packaging. If
            you&rsquo;re unsure, HR is worth asking &mdash; some NFPs qualify as
            a PBI without the employer marketing it strongly.
          </p>
        )}
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
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
