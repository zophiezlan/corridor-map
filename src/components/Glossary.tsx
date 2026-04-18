import { useId } from "react";
import type { ReactNode } from "react";

/**
 * Definitions for acronyms that appear throughout the UI. Kept terse —
 * the tooltip is a definition, not an explainer.
 */
const DEFINITIONS: Record<string, string> = {
  MLS: "Medicare Levy Surcharge — an extra 1–1.5% levy on higher earners without private hospital cover.",
  RFBA: "Reportable Fringe Benefits Amount — the grossed-up value of salary-packaged benefits, reported on your payment summary.",
  STSL: "Study and Training Support Loan — covers HELP/HECS/VET/FEE-HELP etc., repaid via the same income-based schedule.",
  HECS: "Higher Education Contribution Scheme — now called HELP, repaid via an income-tested schedule through payroll.",
  HELP: "Higher Education Loan Program — the current name for what most still call HECS.",
  SG: "Superannuation Guarantee — the employer-paid super contribution rate (12% for FY 2025-26).",
  FBT: "Fringe Benefits Tax — paid by the employer on non-cash benefits; PBIs/public hospitals have an exemption up to a cap.",
  FHSS: "First Home Super Saver — scheme letting you withdraw voluntary super contributions toward a first home.",
  PBI: "Public Benevolent Institution — a charitable NFP eligible for the $15,900 FBT-exempt packaging cap.",
  DGR: "Deductible Gift Recipient — charity endorsement that allows donors a tax deduction.",
  NFP: "Not-For-Profit — a broad category; only certain NFPs (PBIs, public hospitals, rebatable NFPs) have FBT concessions.",
  PHI: "Private Health Insurance.",
  ATO: "Australian Taxation Office.",
  LHC: "Lifetime Health Cover loading — a premium surcharge for taking out hospital cover after age 31.",
  concessional:
    "Concessional (pre-tax) contribution — money going into super before income tax is deducted. Taxed at 15% on the way in instead of your marginal rate.",
  "non-concessional":
    "Non-concessional (post-tax) contribution — money going into super from your take-home pay. No tax saving on the way in; a separate cap applies.",
  "preservation age":
    "The age you can first access your super. For anyone born after 1 July 1964, that's 60.",
  "Division 293":
    "An extra 15% tax on concessional super contributions if your total income + super contributions exceeds $250,000 — only bites at very high incomes.",
  "marginal rate":
    "The income-tax rate applied to your next dollar of income. Higher than your average rate because tax is progressive — each bracket taxed at its own rate.",
  "salary sacrifice":
    "An arrangement with payroll where part of your gross salary goes somewhere else (usually super) before tax is calculated, reducing your taxable income.",
  "salary packaging":
    "An arrangement where part of your salary is paid as non-cash benefits (mortgage, rent, card, meals). FBT-exempt for PBI/NFP workers up to a capped amount, saving income tax at your marginal rate.",
  "taxable income":
    "Gross income minus allowable deductions and pre-tax salary sacrifice. What the ATO actually applies tax brackets to.",
  "gross-up factor":
    "A multiplier (1.8868 for FBT-exempt benefits) that converts the real dollar value of packaged benefits into the RFBA figure on your payment summary.",
  deduction:
    "An expense the ATO allows you to subtract from your taxable income. Saves you your marginal rate on each dollar deducted (e.g. ~32c per $1 at $90k).",
};

type Props = {
  term: keyof typeof DEFINITIONS | string;
  /** Override or supply a definition for terms not in the built-in list. */
  definition?: string;
  children?: ReactNode;
};

/**
 * Inline abbreviation with a native tooltip (via <abbr title>) plus a
 * visible dotted underline to cue it's interactive. Keeps semantics honest
 * for screen readers without needing a custom popover.
 */
export function Term({ term, definition, children }: Props) {
  const text = (children ?? term) as ReactNode;
  const def = definition ?? DEFINITIONS[term];
  const descId = useId();
  return (
    <>
      <abbr
        title={def}
        aria-describedby={descId}
        className="cursor-help border-b border-dotted border-stone-400 decoration-dotted underline-offset-4 no-underline dark:border-stone-500"
      >
        {text}
      </abbr>
      <span id={descId} className="sr-only">
        {def}
      </span>
    </>
  );
}
