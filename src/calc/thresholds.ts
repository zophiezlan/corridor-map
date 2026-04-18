/**
 * Status thresholds for corridor cards. Tune here without hunting through UI code.
 * Based on spec §9.4 — defaults to iterate on once the author has a feel for real usage.
 */

export const PACKAGING_THRESHOLDS = {
  general: {
    greenMin: 0.95, // ≥95% utilisation → green
    amberMin: 0.5, // 50-94% → amber
    // <50% → red
    // 0% when employer is PBI/public hospital → red (with explainer)
  },
  me: {
    greenMin: 0.95,
    amberMin: 0.5,
    // M&E at 0% defaults to amber (not useful for everyone)
  },
} as const;

export const SUPER_THRESHOLDS = {
  // When property goal is 'none' or '3y-plus'
  longHorizon: {
    redBelow: 0.1, // <10% of cap used
    amberBelow: 0.3, // <30% of cap used
  },
  // When property goal is 'within-12m' or '1-3y'
  shortHorizon: {
    amberAbove: 0.5, // >50% may be locking up money user will want
  },
} as const;
