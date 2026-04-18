import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, NumberInput, Select, Toggle } from "../components/Fields";
import { useDocumentTitle } from "../components/DocumentTitle";
import { useInputs, DEFAULT_INPUTS } from "../state/InputsContext";
import type { EmployerType } from "../calc/constants";
import type {
  PremiumPeriod,
  PropertyGoal,
  RebateTreatment,
  UserInputs,
} from "../calc/types";

const EMPLOYER_OPTIONS: Array<{ value: EmployerType; label: string }> = [
  { value: "PBI", label: "PBI (charity, DGR-endorsed NFP) — $15,900 cap" },
  {
    value: "Public Hospital",
    label: "Public hospital / ambulance — $9,010 cap",
  },
  { value: "Rebatable NFP", label: "Rebatable NFP (no FBT-exempt packaging)" },
  { value: "For-profit", label: "For-profit employer" },
  { value: "Unknown", label: "I'm not sure" },
];

const PROPERTY_GOAL_OPTIONS: Array<{ value: PropertyGoal; label: string }> = [
  { value: "none", label: "Not a current goal" },
  { value: "within-12m", label: "Within the next 12 months" },
  { value: "1-3y", label: "In 1–3 years" },
  { value: "3y-plus", label: "3+ years away" },
];

const PREMIUM_PERIOD_OPTIONS: Array<{ value: PremiumPeriod; label: string }> = [
  { value: "weekly", label: "Per week" },
  { value: "fortnightly", label: "Per fortnight" },
  { value: "monthly", label: "Per month" },
  { value: "annual", label: "Per year" },
];

const REBATE_TREATMENT_OPTIONS: Array<{
  value: RebateTreatment;
  label: string;
}> = [
  {
    value: "reduced-premium",
    label: "Yes — rebate already applied (bill is reduced)",
  },
  { value: "tax-refund", label: "No — I claim it at tax time" },
  { value: "unsure", label: "I'm not sure — treat as already applied" },
];

export function Inputs() {
  useDocumentTitle("Your situation");
  const { inputs, setInput, reset } = useInputs();
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(
    inputs.netFinancialInvestmentLosses > 0 ||
      inputs.netRentalPropertyLosses > 0 ||
      inputs.deductiblePersonalSuperContributions > 0,
  );
  const [showAge, setShowAge] = useState(inputs.age < 30);

  const canSubmit = inputs.grossAnnualSalary > 0;

  const packagingAvailable =
    inputs.employerType === "PBI" || inputs.employerType === "Public Hospital";

  const isDirty =
    JSON.stringify(inputs) !== JSON.stringify(DEFAULT_INPUTS as UserInputs);

  function handleSubmit() {
    if (!canSubmit) return;
    navigate("/map");
  }

  function handleReset() {
    if (!isDirty) return;
    if (
      window.confirm(
        "Reset all inputs to defaults? This clears any values you've entered.",
      )
    ) {
      reset();
      setShowAge(false);
      setShowAdvanced(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Your situation</h1>
      <p className="mt-2 text-stone-700">
        All fields stay on your device. Nothing is sent anywhere. You can change
        any of these later.
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
            {(id) => (
              <NumberInput
                id={id}
                value={inputs.grossAnnualSalary || null}
                onChange={(v) => setInput("grossAnnualSalary", v)}
                prefix="$"
                min={0}
                step={1000}
                placeholder="e.g. 95000"
              />
            )}
          </Field>

          <div>
            <Toggle
              checked={showAge}
              onChange={(v) => {
                setShowAge(v);
                if (v && inputs.age >= 30) setInput("age", 25);
                if (!v) setInput("age", 30);
              }}
              label="I'm under 30"
              hint="Only relevant for the private health age-based discount. Skip if you're 30 or older."
            />
            {showAge && (
              <div className="mt-3 pl-7">
                <Field label="Age">
                  {(id) => (
                    <NumberInput
                      id={id}
                      value={inputs.age}
                      onChange={(v) => setInput("age", v ?? 25)}
                      min={18}
                      max={29}
                      suffix="years"
                    />
                  )}
                </Field>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Employer</h2>

          <Field
            label="Employer type"
            hint="This determines your salary packaging caps."
          >
            {(id) => (
              <Select
                id={id}
                value={inputs.employerType}
                onChange={(v) => setInput("employerType", v)}
                options={EMPLOYER_OPTIONS}
              />
            )}
          </Field>

          {packagingAvailable && (
            <>
              <Field
                label="Current general packaging"
                hint="The post-tax dollar amount you package each year (mortgage, rent, card — not meals). Zero if you don't package."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.currentGeneralPackaging || null}
                    onChange={(v) => setInput("currentGeneralPackaging", v)}
                    prefix="$"
                    min={0}
                    step={100}
                    placeholder="0"
                  />
                )}
              </Field>

              <Field
                label="Current meal & entertainment packaging"
                hint="Separate cap. Often zero unless you actively use it."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.currentMEPackaging || null}
                    onChange={(v) => setInput("currentMEPackaging", v)}
                    prefix="$"
                    min={0}
                    step={100}
                    placeholder="0"
                  />
                )}
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
            {(id) => (
              <NumberInput
                id={id}
                value={inputs.currentSuperSacrifice || null}
                onChange={(v) => setInput("currentSuperSacrifice", v)}
                prefix="$"
                min={0}
                step={500}
                placeholder="0"
              />
            )}
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">
            Private health
          </h2>

          <Toggle
            checked={inputs.hasPrivateHospitalCover}
            onChange={(v) => {
              setInput("hasPrivateHospitalCover", v);
              if (!v) setInput("privateHealthPremium", null);
            }}
            label="I have private hospital cover"
            hint="Extras-only cover doesn't count — MLS requires hospital cover specifically."
          />

          {inputs.hasPrivateHospitalCover && (
            <div className="space-y-5 rounded-md border border-stone-200 bg-white p-5">
              <p className="text-xs text-stone-600 leading-relaxed">
                Grab your most recent bill or direct-debit notice. The dollar
                amount and the period are right there — you don't need to do any
                maths.
              </p>

              <div className="grid gap-4 sm:grid-cols-[2fr_3fr]">
                <Field label="Period">
                  {(id) => (
                    <Select
                      id={id}
                      value={inputs.privateHealthPremiumPeriod}
                      onChange={(v) =>
                        setInput("privateHealthPremiumPeriod", v)
                      }
                      options={PREMIUM_PERIOD_OPTIONS}
                    />
                  )}
                </Field>

                <Field
                  label="Premium amount"
                  hint="Whatever's billed for the period above — no rounding needed."
                >
                  {(id) => (
                    <NumberInput
                      id={id}
                      value={inputs.privateHealthPremium}
                      onChange={(v) => setInput("privateHealthPremium", v)}
                      prefix="$"
                      min={0}
                      placeholder="e.g. 42.80"
                    />
                  )}
                </Field>
              </div>

              <Field
                label="Is the government rebate already on your bill?"
                hint="Most funds apply it by default — your bill is lower than the 'full' premium. If you picked the 'claim at tax time' option with your fund, choose that here."
              >
                {(id) => (
                  <Select
                    id={id}
                    value={inputs.privateHealthRebateTreatment}
                    onChange={(v) =>
                      setInput("privateHealthRebateTreatment", v)
                    }
                    options={REBATE_TREATMENT_OPTIONS}
                  />
                )}
              </Field>
            </div>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">HECS/STSL</h2>

          <Toggle
            checked={inputs.hasHECS}
            onChange={(v) => setInput("hasHECS", v)}
            label="I have a HECS/HELP/STSL debt"
          />

          {inputs.hasHECS && (
            <Field label="Current balance (optional)">
              {(id) => (
                <NumberInput
                  id={id}
                  value={inputs.hecsBalance}
                  onChange={(v) => setInput("hecsBalance", v)}
                  prefix="$"
                  min={0}
                  step={1000}
                  placeholder="e.g. 25000"
                />
              )}
            </Field>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-900">Goals</h2>

          <Field
            label="First-home property goal"
            hint="Affects how super recommendations are framed — super locks money up."
          >
            {(id) => (
              <Select
                id={id}
                value={inputs.propertyGoal}
                onChange={(v) => setInput("propertyGoal", v)}
                options={PROPERTY_GOAL_OPTIONS}
              />
            )}
          </Field>
        </section>

        <section>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className="text-sm text-stone-700 hover:text-stone-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-2 rounded"
          >
            {showAdvanced ? "Hide advanced inputs" : "Advanced inputs"}
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-5 rounded-md border border-stone-200 bg-white p-5">
              <p className="text-xs text-stone-600">
                Most users leave these as zero. They improve the accuracy of MLS
                and HECS repayment income.
              </p>

              <Field
                label="Net financial investment losses"
                hint="From share/margin loans etc."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.netFinancialInvestmentLosses || null}
                    onChange={(v) =>
                      setInput("netFinancialInvestmentLosses", v)
                    }
                    prefix="$"
                    min={0}
                    step={100}
                  />
                )}
              </Field>

              <Field
                label="Net rental property losses"
                hint="Negative gearing amount."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.netRentalPropertyLosses || null}
                    onChange={(v) => setInput("netRentalPropertyLosses", v)}
                    prefix="$"
                    min={0}
                    step={100}
                  />
                )}
              </Field>

              <Field
                label="Deductible personal super contributions"
                hint="Non-concessional contributions for which you'll submit a notice-of-intent-to-claim."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.deductiblePersonalSuperContributions || null}
                    onChange={(v) =>
                      setInput("deductiblePersonalSuperContributions", v)
                    }
                    prefix="$"
                    min={0}
                    step={100}
                  />
                )}
              </Field>

              <Field
                label="Employer Super Guarantee rate"
                hint="2025-26 default is 12%. Some employers are higher."
              >
                {(id) => (
                  <NumberInput
                    id={id}
                    value={inputs.employerSGRate * 100}
                    onChange={(v) => setInput("employerSGRate", v / 100)}
                    suffix="%"
                    min={0}
                    max={30}
                    step={0.5}
                  />
                )}
              </Field>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-200">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
          >
            Show my map →
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty}
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:border-stone-500 disabled:text-stone-400 disabled:hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-2"
          >
            Reset all
          </button>
          {!canSubmit && (
            <span className="text-xs text-stone-600" role="status">
              Enter a gross salary to continue.
            </span>
          )}
        </div>

        <p className="pt-2 text-xs text-stone-600 leading-relaxed">
          These calculations are estimates based on the inputs you've provided.
          They don't account for all edge cases. If any number here would drive
          a significant decision, confirm with your payroll provider,
          accountant, or a financial advisor.
        </p>
      </form>
    </div>
  );
}
