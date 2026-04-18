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
        className="cursor-help border-b border-dotted border-stone-400 decoration-dotted underline-offset-4 no-underline"
      >
        {text}
      </abbr>
      <span id={descId} className="sr-only">
        {def}
      </span>
    </>
  );
}
