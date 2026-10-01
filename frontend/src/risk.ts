import { chance, chanceInk, risk, riskInk } from "./tokens";
import type { CatchRating, RiskCategory } from "./types";

/**
 * The risk bands, as the backend categorises them (`backend/app/config.py`,
 * `thresholds`): `max` is the highest score that still belongs to the band.
 * The backend decides the category; the frontend uses this table to draw the
 * band edges on the dial and timeline, and to label a bare score.
 */
export const RISK_BANDS: { category: RiskCategory; from: number; max: number }[] = [
  { category: "LOW", from: 0, max: 25 },
  { category: "MODERATE", from: 25, max: 50 },
  { category: "HIGH", from: 50, max: 79 },
  { category: "EXTREME", from: 79, max: 100 },
];

/** The band a 0-100 score falls in. Rounds first, exactly as the backend does. */
export function riskBand(score: number): RiskCategory {
  const s = Math.round(score);
  return (RISK_BANDS.find((b) => s <= b.max) ?? RISK_BANDS[RISK_BANDS.length - 1]).category;
}

export const RISK_COLOR: Record<RiskCategory, string> = {
  LOW: risk.low,
  MODERATE: risk.moderate,
  HIGH: risk.high,
  EXTREME: risk.extreme,
};

/** The same bands as text: the ink that holds 4.5:1 on chart paper (tokens.ts). */
export const RISK_INK: Record<RiskCategory, string> = {
  LOW: riskInk.low,
  MODERATE: riskInk.moderate,
  HIGH: riskInk.high,
  EXTREME: riskInk.extreme,
};

/** The colour a bare score is drawn in. */
export function riskColor(score: number): string {
  return RISK_COLOR[riskBand(score)];
}

/** Rating colours tuned for chart paper — inky enough to read as drafted. */
export const RATING_COLOR: Record<CatchRating, string> = {
  very_good: risk.low,
  good: chance.good,
  fair: chance.some,
  poor: chance.poor,
};

/** The same ratings as text. */
export const RATING_INK: Record<CatchRating, string> = {
  very_good: riskInk.low,
  good: chanceInk.good,
  fair: chanceInk.some,
  poor: chanceInk.poor,
};
