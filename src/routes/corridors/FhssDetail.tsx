import { CorridorFrame, Section } from "../../components/CorridorFrame";
import { fhssCorridor } from "../../calc/corridors";
import { useInputs } from "../../state/useInputs";

export function FhssDetail() {
  const { inputs } = useInputs();
  const summary = fhssCorridor(inputs);

  return (
    <CorridorFrame
      title="First Home Super Saver (FHSS)"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="In plain terms">
        <p>
          <strong>FHSS</strong> (First Home Super Saver) is the one carve-out
          that lets you access super before preservation age. You make voluntary
          contributions into super, get the lower tax rate on the way in, and
          later release those dollars (plus deemed earnings) toward a first-home
          deposit. Employer contributions don&rsquo;t count &mdash; only
          voluntary ones.
        </p>
      </Section>

      <Section title="The specifics">
        <p>The mechanics, in a nutshell:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>
            Release limit: $15,000 per FY, $50,000 total across all years.
          </li>
          <li>Only voluntary contributions count — not employer SG.</li>
          <li>
            You apply to the ATO for a release determination, then your fund
            pays out.
          </li>
          <li>
            Must be a genuine first-home purchase (signed contract within 12
            months of release).
          </li>
        </ul>
      </Section>

      <Section title="Why it's separate from the super corridor">
        <p>
          The Super Concessional Cap corridor treats super as a retirement
          locked box. FHSS is the carve-out where some of that locked amount
          becomes accessible for a first-home deposit. Importantly, FHSS
          contributions still count toward your concessional cap — they're not
          extra room, they're a different destination for voluntary
          contributions you'd otherwise make.
        </p>
      </Section>

      <Section title="Example math">
        <p className="text-sm text-stone-700 dark:text-stone-300">
          On a $90k salary sacrificing $10k/yr into FHSS for 3 years.
          &ldquo;MTR&rdquo; means marginal tax rate &mdash; the rate on your
          next dollar of income.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            Tax saving: ~($10k × 32% MTR) − ($10k × 15% contributions tax) =
            ~$1,700/yr. The 15% is the flat rate super pays on concessional
            contributions going in; the saving is the difference vs your
            marginal rate.
          </li>
          <li>
            After 3 years: ~$30k contributed + small deemed earnings (the ATO
            applies a notional interest rate rather than actual returns).
          </li>
          <li>
            Released amount taxed at (marginal rate − 30%) &mdash; less than the
            same money would have been taxed as ordinary salary.
          </li>
          <li>
            Net: a meaningfully larger deposit than saving the same dollars
            post-tax.
          </li>
        </ul>
      </Section>

      <Section title="Why this page shows no numbers specific to you">
        <p>
          FHSS interacts with LMI, mortgage pre-approval, stamp duty concessions
          and state first-home grants. The math is worth doing with someone who
          can see the full picture. V1 keeps this corridor descriptive on
          purpose.
        </p>
      </Section>

      <Section title="Next steps">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Read the ATO FHSS guide: search "FHSS scheme ATO".</li>
          <li>Talk to a mortgage broker familiar with FHSS — many aren't.</li>
          <li>
            Ask your super fund whether they support FHSS releases (most large
            funds do).
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
