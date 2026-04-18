/**
 * Corridor-card summaries. Each function takes inputs + derived values and
 * returns the status + headline + insight used on the /map page.
 *
 * Status thresholds come from thresholds.ts (spec §9.4).
 */

import {
  formatAUD,
  mePackagingPotentialSaving,
  packagingPotentialSaving,
  superTopUpPotentialSaving,
} from "./calculations";
import { PACKAGING_THRESHOLDS, SUPER_THRESHOLDS } from "./thresholds";
import type {
  CorridorCardSummary,
  CorridorStatus,
  DerivedValues,
  UserInputs,
} from "./types";

// ---------- MLS / PHI ----------

export function mlsCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  const {
    mlsTier,
    mlsLiabilityAnnual,
    netPhiCostAnnual,
    breakEvenNetCostAnnual,
  } = derived;
  const tierRateMap = {
    Base: 0,
    Tier1: 0.01,
    Tier2: 0.0125,
    Tier3: 0.015,
  } as const;
  const hypotheticalMls = Math.round(derived.mlsIncome * tierRateMap[mlsTier]);

  if (inputs.hasPrivateHospitalCover) {
    const netCost = netPhiCostAnnual ?? 0;
    let insight: string;
    if (mlsTier === "Base") {
      insight =
        "You have cover, but your income is below the MLS threshold — MLS doesn't apply to you.";
    } else if (netCost < hypotheticalMls) {
      insight = `Your policy costs less than the MLS you'd otherwise pay (~${formatAUD(hypotheticalMls, { round10: true })}).`;
    } else {
      insight = `Your policy costs more than the MLS it avoids (~${formatAUD(hypotheticalMls, { round10: true })}) — worth reviewing.`;
    }
    return {
      id: "mls",
      name: "MLS / Private Health",
      status: "green",
      headline:
        netCost > 0
          ? `${formatAUD(netCost, { round10: true })}/yr net premium`
          : "Covered",
      insight,
      applicable: true,
    };
  }

  if (mlsTier === "Base") {
    return {
      id: "mls",
      name: "MLS / Private Health",
      status: "green",
      headline: "Not applicable",
      insight:
        "Your income is below the MLS threshold. Private cover is optional from a tax standpoint.",
      applicable: true,
    };
  }

  // Has liability, no cover.
  const savings =
    breakEvenNetCostAnnual != null
      ? `A compliant hospital policy with a net cost up to ~${formatAUD(breakEvenNetCostAnnual, { round10: true })}/yr would break even.`
      : "";
  return {
    id: "mls",
    name: "MLS / Private Health",
    status: "red",
    headline: `${formatAUD(mlsLiabilityAnnual, { round10: true })}/yr MLS`,
    insight:
      `You're paying MLS that a private hospital policy could avoid. ${savings}`.trim(),
    applicable: true,
  };
}

// ---------- Salary packaging (general) ----------

export function generalPackagingCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  if (!derived.generalPackagingCap) {
    return {
      id: "packaging-general",
      name: "Salary Packaging (General)",
      status: "grey",
      headline: "Not available",
      insight:
        inputs.employerType === "Unknown"
          ? "Ask your payroll team whether your employer offers FBT-exempt packaging."
          : "Your employer type doesn't provide FBT-exempt salary packaging.",
      applicable: false,
    };
  }

  const util = derived.generalPackagingUtilisation;
  const { additional, annualSaving } = packagingPotentialSaving(
    inputs,
    derived,
  );

  let status: CorridorStatus;
  if (util >= PACKAGING_THRESHOLDS.general.greenMin) status = "green";
  else if (util >= PACKAGING_THRESHOLDS.general.amberMin) status = "amber";
  else status = "red";

  const headline =
    util >= PACKAGING_THRESHOLDS.general.greenMin
      ? `${Math.round(util * 100)}% of cap used`
      : `${formatAUD(annualSaving, { round10: true })}/yr potential saving`;

  const insight =
    util >= PACKAGING_THRESHOLDS.general.greenMin
      ? "You're using the general cap fully — nothing to change here."
      : `Packaging another ${formatAUD(additional, { round10: true })}/yr could save roughly ${formatAUD(annualSaving, { round10: true })}/yr in tax.`;

  return {
    id: "packaging-general",
    name: "Salary Packaging (General)",
    status,
    headline,
    insight,
    applicable: true,
  };
}

// ---------- Salary packaging (M&E) ----------

export function mePackagingCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  if (!derived.mePackagingCap) {
    return {
      id: "packaging-me",
      name: "Salary Packaging (Meal & Entertainment)",
      status: "grey",
      headline: "Not available",
      insight: "Your employer type doesn't provide an M&E cap.",
      applicable: false,
    };
  }

  const util = derived.mePackagingUtilisation;
  const { additional, annualSaving } = mePackagingPotentialSaving(
    inputs,
    derived,
  );

  let status: CorridorStatus;
  if (util >= PACKAGING_THRESHOLDS.me.greenMin) status = "green";
  else if (util >= PACKAGING_THRESHOLDS.me.amberMin) status = "amber";
  else status = "amber"; // M&E at 0% is amber, not red — genuinely not for everyone

  const headline =
    util >= PACKAGING_THRESHOLDS.me.greenMin
      ? `${Math.round(util * 100)}% of cap used`
      : `${formatAUD(annualSaving, { round10: true })}/yr potential saving`;

  const insight =
    util >= PACKAGING_THRESHOLDS.me.greenMin
      ? "M&E cap is fully used."
      : util === 0
        ? `If you eat out or cater events, packaging up to ${formatAUD(additional, { round10: true })}/yr could save ~${formatAUD(annualSaving, { round10: true })}/yr. Only worth it if the spend is real.`
        : `Room to package another ${formatAUD(additional, { round10: true })}/yr if the spend is real.`;

  return {
    id: "packaging-me",
    name: "Salary Packaging (Meal & Entertainment)",
    status,
    headline,
    insight,
    applicable: true,
  };
}

// ---------- Super concessional cap ----------

export function superCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  const used =
    derived.totalConcessionalContributions /
    (derived.totalConcessionalContributions + derived.concessionalCapRemaining);

  const { annualSaving } = superTopUpPotentialSaving(inputs, derived);
  const shortHorizon =
    inputs.propertyGoal === "within-12m" || inputs.propertyGoal === "1-3y";

  let status: CorridorStatus;
  let insight: string;

  if (shortHorizon) {
    // Super locks money up — high utilisation conflicts with a near-term property goal.
    const sacrificeUse = inputs.currentSuperSacrifice > 0;
    if (!sacrificeUse) {
      status = "green";
      insight =
        "With a property goal in the next few years, not sacrificing to super is sensible — the money stays accessible.";
    } else if (used > SUPER_THRESHOLDS.shortHorizon.amberAbove) {
      status = "amber";
      insight =
        "You're sacrificing heavily to super but have a near-term property goal — super can't be withdrawn for a deposit (FHSS aside).";
    } else {
      status = "green";
      insight =
        "Modest super sacrifice alongside a near-term property goal — reasonable balance. Look at FHSS if not already.";
    }
    return {
      id: "super",
      name: "Super Concessional Cap",
      status,
      headline: `${formatAUD(derived.totalConcessionalContributions, { round10: true })}/yr of ${formatAUD(derived.totalConcessionalContributions + derived.concessionalCapRemaining)}`,
      insight,
      applicable: true,
    };
  }

  // Long-horizon or no property goal: super is a clear tax corridor.
  if (used < SUPER_THRESHOLDS.longHorizon.redBelow) status = "red";
  else if (used < SUPER_THRESHOLDS.longHorizon.amberBelow) status = "amber";
  else status = "green";

  const headline =
    derived.concessionalCapRemaining > 0
      ? `${formatAUD(annualSaving, { round10: true })}/yr saving available`
      : "Cap fully used";

  insight =
    derived.concessionalCapRemaining > 0
      ? `Topping up to the cap would add ${formatAUD(derived.concessionalCapRemaining, { round10: true })}/yr of concessional contributions and save ~${formatAUD(annualSaving, { round10: true })}/yr in tax.`
      : "You're at the concessional cap. Check that you're not about to exceed it — excess attracts extra tax.";

  return {
    id: "super",
    name: "Super Concessional Cap",
    status,
    headline,
    insight,
    applicable: true,
  };
}

// ---------- Described (non-computed) corridors ----------

export function fhssCorridor(inputs: UserInputs): CorridorCardSummary {
  const relevant =
    inputs.propertyGoal === "within-12m" || inputs.propertyGoal === "1-3y";
  return {
    id: "fhss",
    name: "First Home Super Saver",
    status: relevant ? "amber" : "grey",
    headline: relevant ? "Worth investigating" : "Not a current goal",
    insight: relevant
      ? "FHSS lets you make voluntary super contributions and later release them for a first home deposit. Up to $50k of contributions can be released."
      : "FHSS is a first-home deposit mechanism via super. Flag this if you plan to buy a first home.",
    applicable: true,
  };
}

export function deductionsCorridor(): CorridorCardSummary {
  return {
    id: "deductions",
    name: "Work-related Deductions",
    status: "amber",
    headline: "Checklist",
    insight:
      "Union fees, working-from-home running costs, professional memberships, eligible donations — the usual sector-worker deductions. Covered by your tax return, not this tool.",
    applicable: true,
  };
}

export function hecsCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  if (!inputs.hasHECS) {
    return {
      id: "hecs",
      name: "HECS/STSL",
      status: "grey",
      headline: "No loan",
      insight: "HECS/STSL doesn't apply to you.",
      applicable: false,
    };
  }

  if (derived.hecsRepaymentAnnual === 0) {
    return {
      id: "hecs",
      name: "HECS/STSL",
      status: "green",
      headline: "Below repayment threshold",
      insight:
        "Your repayment income is below the threshold — no compulsory repayment this year.",
      applicable: true,
    };
  }

  return {
    id: "hecs",
    name: "HECS/STSL",
    status: "amber",
    headline: `${formatAUD(derived.hecsRepaymentAnnual, { round10: true })}/yr repayment`,
    insight:
      "Voluntary extra repayments no longer attract a discount. Packaging and super sacrifice gross up your repayment income — factor that in before increasing either.",
    applicable: true,
  };
}

// ---------- Zone tax offset ----------

export function zoneOffsetCorridor(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary {
  if (inputs.zoneTaxResidency === "none") {
    return {
      id: "zone-offset",
      name: "Zone Tax Offset",
      status: "grey",
      headline: "Not applicable",
      insight:
        "For residents of designated remote or isolated zones. Flag this if you live regional — boundaries are narrower than you'd guess.",
      applicable: false,
    };
  }

  const zoneLabel: Record<
    Exclude<UserInputs["zoneTaxResidency"], "none">,
    string
  > = {
    "zone-a": "Zone A",
    "zone-b": "Zone B",
    "special-area": "Special area",
  };

  return {
    id: "zone-offset",
    name: "Zone Tax Offset",
    status: "amber",
    headline: `${formatAUD(derived.zoneOffsetBase)} base in ${zoneLabel[inputs.zoneTaxResidency]}`,
    insight:
      "Claim on your tax return under 'Zone or overseas forces'. The amount can be higher if you have dependents, a remote allowance, or qualify for an invalid-carer offset.",
    applicable: true,
  };
}

// ---------- All corridors, in display order ----------

export function allCorridors(
  inputs: UserInputs,
  derived: DerivedValues,
): CorridorCardSummary[] {
  return [
    mlsCorridor(inputs, derived),
    generalPackagingCorridor(inputs, derived),
    mePackagingCorridor(inputs, derived),
    superCorridor(inputs, derived),
    fhssCorridor(inputs),
    deductionsCorridor(),
    hecsCorridor(inputs, derived),
    zoneOffsetCorridor(inputs, derived),
  ];
}
