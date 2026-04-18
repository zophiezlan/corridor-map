import { CONCESSIONAL_CAP, SUPER_CONTRIBUTIONS_TAX } from '../../calc/constants';
import { CorridorFrame, MathRow, Section } from '../../components/CorridorFrame';
import { Money, Percent } from '../../components/Money';
import { ProgressBar } from '../../components/ProgressBar';
import { superCorridor } from '../../calc/corridors';
import { superTopUpPotentialSaving } from '../../calc/calculations';
import { useInputs } from '../../state/InputsContext';

export function SuperDetail() {
  const { inputs, derived } = useInputs();
  const summary = superCorridor(inputs, derived);
  const { additional, annualSaving } = superTopUpPotentialSaving(inputs, derived);
  const utilisation =
    derived.totalConcessionalContributions / CONCESSIONAL_CAP;
  const shortHorizon =
    inputs.propertyGoal === 'within-12m' || inputs.propertyGoal === '1-3y';

  return (
    <CorridorFrame
      title="Super — Concessional Cap"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="Where you are">
        <p>{summary.insight}</p>
        <ProgressBar
          utilisation={utilisation}
          status={summary.status}
          label={`Used ${Math.round(utilisation * 100)}% of $${CONCESSIONAL_CAP.toLocaleString('en-AU')} concessional cap`}
        />
      </Section>

      <Section title="The math">
        <div>
          <MathRow label="Concessional cap (2025-26)" value={<Money value={CONCESSIONAL_CAP} />} />
          <MathRow
            label="− Employer SG (gross × rate)"
            value={<Money value={derived.employerSgDollars} />}
          />
          {inputs.currentSuperSacrifice > 0 && (
            <MathRow
              label="− Voluntary salary sacrifice"
              value={<Money value={inputs.currentSuperSacrifice} />}
            />
          )}
          {inputs.deductiblePersonalSuperContributions > 0 && (
            <MathRow
              label="− Deductible personal contributions"
              value={<Money value={inputs.deductiblePersonalSuperContributions} />}
            />
          )}
          <MathRow label="= Room remaining" value={<Money value={additional} />} />
          <MathRow
            label="× Marginal rate (incl Medicare)"
            value={<Percent value={derived.marginalTaxRateWithMedicare} />}
            subtle
          />
          <MathRow
            label="− Super contributions tax"
            value={<Percent value={SUPER_CONTRIBUTIONS_TAX} />}
            subtle
          />
          <MathRow
            label="= Net saving per dollar"
            value={
              <Percent
                value={Math.max(0, derived.marginalTaxRateWithMedicare - SUPER_CONTRIBUTIONS_TAX)}
              />
            }
            subtle
          />
          <MathRow
            label="≈ Annual saving if topped up to cap"
            value={<Money value={annualSaving} round10 />}
          />
        </div>
      </Section>

      <Section title="What the tax system is steering">
        <p>
          Concessional contributions are taxed at 15% on the way in, instead of your
          marginal rate. For a PBI worker on ~$90k, that's a ~17c-in-the-dollar saving
          — the largest headline corridor after packaging, but the money is locked
          until preservation age (usually 60).
        </p>
      </Section>

      <Section title="Next actions">
        {shortHorizon && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            You flagged a first-home goal in the next 1–3 years. Super sacrifice locks
            money up until preservation age. FHSS is the one carve-out — up to $50k of
            voluntary contributions can be released for a first-home deposit.
          </div>
        )}
        {additional > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Ask payroll about setting up concessional (pre-tax) salary sacrifice. Any
              amount from <Money value={1000} />/yr up is fine — start small if unsure.
            </li>
            <li>
              Alternative: personal deductible contributions before 30 June, with a
              notice-of-intent-to-claim lodged with your super fund.
            </li>
            <li>
              Watch the unused-cap carry-forward rule: unused cap from the last 5 years
              can be used if your super balance was under $500k on 30 June of the prior
              FY.
            </li>
          </ul>
        )}
        {additional === 0 && (
          <p>You're at the concessional cap. Going over triggers excess-contributions tax — worth confirming with your fund.</p>
        )}
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700">
          <li>
            Voluntary salary sacrifice counts toward MLS income and HECS repayment
            income — the super corridor can push you up a tier in other corridors.
          </li>
          <li>
            Division 293 adds an extra 15% contributions tax when your total Division
            293 income exceeds $250k. Shouldn't bite at V1's target income range, but
            watch for it if multiple income streams land in the same year.
          </li>
          <li>
            The cap is per person per FY — if you change jobs mid-year, both employers'
            SG still counts.
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
