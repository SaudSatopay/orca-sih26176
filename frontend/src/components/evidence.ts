import type { DataHealth, HealthStatus, Language } from "../types";
import { GATE } from "../i18n/gate";
import { ageText } from "../gateModel";

/** A reading's status, in the status colours (never decoration). */
export const STATUS_INK: Record<HealthStatus, string> = {
  FRESH: "text-risk-low",
  STALE: "text-risk-moderate",
  MISSING: "text-risk-extreme",
  ERROR: "text-risk-extreme",
};

/**
 * A reading's age against its own limit, as the Evidence Confidence panel
 * prints it: "4 h 10 min" and "limit 3 h"; "bundled" for the chart layer
 * that ships with the app; "—" when there is no reading.
 */
export function freshnessLabel(h: DataHealth, language: Language): { age: string; limit: string | null } {
  const g = GATE[language] ?? GATE.en;
  const age =
    h.age_seconds != null
      ? ageText(h.age_seconds, language)
      : h.available && h.freshness_limit_seconds == null
        ? g.bundled
        : "—";
  const limit = h.freshness_limit_seconds != null ? `${g.limit} ${ageText(h.freshness_limit_seconds, language)}` : null;
  return { age, limit };
}

/** The numbers a freshness bar is drawn from, when the reading has all three. */
export function freshnessScale(h: DataHealth): { age: number; fresh: number; max: number } | null {
  return h.age_seconds != null && h.freshness_limit_seconds != null && h.max_age_seconds != null
    ? { age: h.age_seconds, fresh: h.freshness_limit_seconds, max: h.max_age_seconds }
    : null;
}
