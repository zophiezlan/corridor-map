import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, NumberInput, Select, Toggle } from '../components/Fields';
import { useInputs } from '../state/InputsContext';
import type { EmployerType } from '../calc/constants';
import type { PropertyGoal } from '../calc/types';

const EMPLOYER_OPTIONS: Array<{ value: EmployerType; label: string }> = [
  { value: 'PBI', label: 'PBI (charity, DGR-endorsed NFP) — $15,900 cap' },
  { value: 'Public Hospital', label: 'Public hospital / ambulance — $9,010 cap' },
  { value: 'Rebatable NFP', label: 'Rebatable NFP (no FBT-exempt packaging)' },
  { value: 'For-profit', label: 'For-profit employer' },
  { value: 'Unknown', label: "I'm not sure" },
];

const PROPERTY_GOAL_OPTIONS: Array<{ value: PropertyGoal; label: string }> = [
  { value: 'none', label: 'Not a current goal' },
  { value: 'within-12m', label: 'Within the next 12 months' },
  { value: '1-3y', label: 'In 1–3 years' },
  { value: '3y-plus', label: '3+ years away' },
];

export function Inputs() {
  const { inputs, setInput } = useInputs();
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(
    inputs.netFinancialInvestmentLosses > 0 ||
      inputs.netRentalPropertyLosses > 0 ||
      inputs.deductiblePersonalSuperContributions > 0,
  );
  const [showAge, setShowAge] = useState(inputs.age < 30);

  const canSubmit = inputs.grossAnnualSalary > 0;

  const packagingAvailable =
    inputs.employerType === 'PBI' || inputs.employerType === 'Public Hospital';

  function handleSubmit() {
    if (!canSubmit) return;
    navigate('/map');
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Your situation</h1>
      <p className="mt-2 text-stone-600">
        All fields stay on your device. Nothing is sent anywhere. You can change any of
        these later.
      </p>

      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Basics</h2>

          <Field
            label="Gross annual salary"
            hint="Before tax, before salary packaging. Look for 'gross pay' on a payslip × number of pay periods."
          >
            <NumberInput
              value={inputs.grossAnnualSalary || null}
              onChange={(v) => setInput('grossAnnualSalary', v)}
              prefix="$"
              min={0}
              step={1000}
              placeholder="e.g. 95000"
            />
          </Field>

          <div>
            <Toggle
              checked={showAge}
              onChange={(v) => {
                setShowAge(v);
                if (!v) setInput('age', 35);
              }}
              label="I'm under 30"
              hint="Only relevant for the private health age-based discount. Skip if you're 30 or older."
            />
            {showAge && (
              <div className="mt-3 pl-7">
                <Field label="Age">
                  <NumberInput
                    value={inputs.age}
                    onChange={(v) => setInput('age', v)}
                    min={18}
                    max={64}
                    suffix="years"
                  />
                </Field>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Employer</h2>

          <Field label="Employer type" hint="This determines your salary packaging caps.">
            <Select
              value={inputs.employerType}
              onChange={(v) => setInput('employerType', v)}
              options={EMPLOYER_OPTIONS}
            />
          </Field>

          {packagingAvailable && (
            <>
              <Field
                label="Current general packaging"
                hint="The post-tax dollar amount you package each year (mortgage, rent, card — not meals). Zero if you don't package."
              >
                <NumberInput
                  value={inputs.currentGeneralPackaging || null}
                  onChange={(v) => setInput('currentGeneralPackaging', v)}
                  prefix="$"
                  min={0}
                  step={100}
                  placeholder="0"
                />
              </Field>

              <Field
                label="Current meal & entertainment packaging"
                hint="Separate cap. Often zero unless you actively use it."
              >
                <NumberInput
                  value={inputs.currentMEPackaging || null}
                  onChange={(v) => setInput('currentMEPackaging', v)}
                  prefix="$"
                  min={0}
                  step={100}
                  placeholder="0"
                />
              </Field>
            </>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Super</h2>

          <Field
            label="Extra voluntary super sacrifice per year"
            hint="Concessional contributions on top of the 12% employer Super Guarantee. Zero is fine — most people's default."
          >
            <NumberInput
              value={inputs.currentSuperSacrifice || null}
              onChange={(v) => setInput('currentSuperSacrifice', v)}
              prefix="$"
              min={0}
              step={500}
              placeholder="0"
            />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Private health</h2>

          <Toggle
            checked={inputs.hasPrivateHospitalCover}
            onChange={(v) => {
              setInput('hasPrivateHospitalCover', v);
              if (!v) setInput('privateHealthPremiumAnnual', null);
            }}
            label="I have private hospital cover"
            hint="Extras-only cover doesn't count — MLS requires hospital cover specifically."
          />

          {inputs.hasPrivateHospitalCover && (
            <Field
              label="Annual premium"
              hint="What you actually pay. If you get the rebate as reduced premium, enter that reduced amount."
            >
              <NumberInput
                value={inputs.privateHealthPremiumAnnual}
                onChange={(v) => setInput('privateHealthPremiumAnnual', v)}
                prefix="$"
                min={0}
                step={50}
                placeholder="e.g. 1800"
              />
            </Field>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">HECS/STSL</h2>

          <Toggle
            checked={inputs.hasHECS}
            onChange={(v) => setInput('hasHECS', v)}
            label="I have a HECS/HELP/STSL debt"
          />

          {inputs.hasHECS && (
            <Field label="Current balance (optional)">
              <NumberInput
                value={inputs.hecsBalance}
                onChange={(v) => setInput('hecsBalance', v)}
                prefix="$"
                min={0}
                step={1000}
                placeholder="e.g. 25000"
              />
            </Field>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Goals</h2>

          <Field
            label="First-home property goal"
            hint="Affects how super recommendations are framed — super locks money up."
          >
            <Select
              value={inputs.propertyGoal}
              onChange={(v) => setInput('propertyGoal', v)}
              options={PROPERTY_GOAL_OPTIONS}
            />
          </Field>
        </section>

        <section>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-2"
          >
            {showAdvanced ? 'Hide advanced inputs' : 'Advanced inputs'}
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-5 rounded-md border border-stone-200 bg-white p-5">
              <p className="text-xs text-stone-500">
                Most users leave these as zero. They improve the accuracy of MLS and HECS
                repayment income.
              </p>

              <Field label="Net financial investment losses" hint="From share/margin loans etc.">
                <NumberInput
                  value={inputs.netFinancialInvestmentLosses || null}
                  onChange={(v) => setInput('netFinancialInvestmentLosses', v)}
                  prefix="$"
                  min={0}
                  step={100}
                />
              </Field>

              <Field label="Net rental property losses" hint="Negative gearing amount.">
                <NumberInput
                  value={inputs.netRentalPropertyLosses || null}
                  onChange={(v) => setInput('netRentalPropertyLosses', v)}
                  prefix="$"
                  min={0}
                  step={100}
                />
              </Field>

              <Field
                label="Deductible personal super contributions"
                hint="Non-concessional contributions for which you'll submit a notice-of-intent-to-claim."
              >
                <NumberInput
                  value={inputs.deductiblePersonalSuperContributions || null}
                  onChange={(v) => setInput('deductiblePersonalSuperContributions', v)}
                  prefix="$"
                  min={0}
                  step={100}
                />
              </Field>

              <Field label="Employer Super Guarantee rate" hint="2025-26 default is 12%. Some employers are higher.">
                <NumberInput
                  value={inputs.employerSGRate * 100}
                  onChange={(v) => setInput('employerSGRate', v / 100)}
                  suffix="%"
                  min={0}
                  max={30}
                  step={0.5}
                />
              </Field>
            </div>
          )}
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-stone-200">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            Show my map →
          </button>
          {!canSubmit && (
            <span className="text-xs text-stone-500">Enter a gross salary to continue.</span>
          )}
        </div>

        <p className="pt-2 text-xs text-stone-500 leading-relaxed">
          These calculations are estimates based on the inputs you've provided. They don't
          account for all edge cases. If any number here would drive a significant decision,
          confirm with your payroll provider, accountant, or a financial advisor.
        </p>
      </form>
    </div>
  );
}
