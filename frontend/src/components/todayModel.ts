import type { AvoidZone, FishingOutlook } from "../types";

/**
 * The backend writes the advisory as a flat list of spoken sentences
 * (`backend/app/services/plain_language.py`), always in the same order:
 *
 *   verdict · the sea · [official warning] · [when it settles]
 *   · one line per closed area · where the fish are · best hours
 *   · how long to stay · the next two days · the disclaimer
 *
 * The panel needs that list as a hierarchy, not ten equal bullets. The
 * sentences are free text in three languages, so they are not parsed: the
 * structured fields of the same response say how many lines each block has,
 * and the list is cut by count. If the counts do not add up (a newer backend,
 * a live edition that words things differently) the list is kept whole and
 * shown as plain notes — nothing is ever dropped.
 */
export interface AdviceParts {
  /** The go / do-not-go sentence. Always first, always shown first. */
  verdict: string;
  /** The sea and wind in human terms. */
  sea: string | null;
  /** Official warning, "the sea settles after…". */
  notices: string[];
  /** One per closed area, paired with the area it speaks about. */
  prohibitions: { text: string; zone: AvoidZone | null }[];
  /** Which grounds to head for. */
  where: string[];
  /** Best hours, time on the ground, come back early / not worth it. */
  plan: string[];
  /** Tomorrow and the day after, as sentences. */
  outlook: string[];
  /** "Not a promise of fish. Follow the official warning." */
  disclaimer: string | null;
  /** False when the list could not be cut by count and is shown as notes. */
  structured: boolean;
}

export function splitAdvice(data: FishingOutlook): AdviceParts {
  const lines = data.advice ?? [];
  const parts: AdviceParts = {
    verdict: lines[0] ?? "",
    sea: null,
    notices: [],
    prohibitions: [],
    where: [],
    plan: [],
    outlook: [],
    disclaimer: null,
    structured: false,
  };
  if (lines.length < 2) return parts;

  const severe = data.safety.category === "HIGH" || data.safety.category === "EXTREME";
  const nNotices =
    (data.safety.official_warning ? 1 : 0) + (severe && data.safety.improves_after ? 1 : 0);
  const nClosed = data.avoid.length;
  const good = data.areas.some((a) => a.rating === "very_good" || a.rating === "good");
  const nWhere = good ? 2 : data.areas.length ? 1 : 0;
  const d = data.duration;
  const nPlan = (data.best_window ? 1 : 0) + (d ? (d.feasible && d.limited_by_weather ? 2 : 1) : 0);
  const nOutlook = Math.max(0, Math.min(2, data.forecast.length - 1));

  const expected = 2 + nNotices + nClosed + nWhere + nPlan + nOutlook + 1;
  if (expected !== lines.length) {
    // Unknown shape: verdict first, disclaimer last, everything else as notes.
    parts.disclaimer = lines[lines.length - 1];
    parts.plan = lines.slice(1, -1);
    return parts;
  }

  let i = 1;
  const take = (n: number) => lines.slice(i, (i += n));
  parts.sea = take(1)[0];
  parts.notices = take(nNotices);
  parts.prohibitions = take(nClosed).map((text, k) => ({ text, zone: data.avoid[k] ?? null }));
  parts.where = take(nWhere);
  parts.plan = take(nPlan);
  parts.outlook = take(nOutlook);
  parts.disclaimer = take(1)[0];
  parts.structured = true;
  return parts;
}

/** Which face of a data panel to draw. */
export type PanelState = "loading" | "error" | "stale" | "ready";

/**
 * - no reading yet (one on the way, or the position still unknown) → the
 *   drafted skeleton
 * - no reading and the request failed → the error sheet (a retry in flight
 *   shows the skeleton again)
 * - a reading on screen and the newest request failed → keep it, say so
 * - otherwise → the reading
 *
 * A refresh while a reading is on screen stays "ready": the old sheet is
 * held rather than flashed back to a skeleton.
 */
export function panelState(s: { hasData: boolean; loading?: boolean; error?: boolean }): PanelState {
  if (s.hasData) return s.error ? "stale" : "ready";
  return s.error && !s.loading ? "error" : "loading";
}

/**
 * "Bombil (Bombay duck)" → the name the fisher uses, then the gloss.
 * The backend writes the local name first; a bare name has no gloss.
 */
export function speciesParts(label: string): { local: string; gloss: string | null } {
  const m = /^(.*?)\s*\((.+)\)\s*$/.exec(label);
  return m ? { local: m[1], gloss: m[2] } : { local: label.trim(), gloss: null };
}

/** The five documented model factors, in reading order. */
export const FACTOR_KEYS = ["chlorophyll", "sst", "front", "sea_state", "time_of_day"] as const;
export type FactorKey = (typeof FACTOR_KEYS)[number];

/** A 0–1 factor as a whole number out of 100, clamped; null when absent. */
export function factorScore(v: number | null | undefined): number | null {
  if (v == null || !Number.isFinite(v)) return null;
  return Math.round(Math.max(0, Math.min(1, v)) * 100);
}

/** An hour of the day as the 24-hour readout the rest of the sheet uses. */
export function hourReadout(h: number): string {
  return `${String(((Math.round(h) % 24) + 24) % 24).padStart(2, "0")}:00`;
}

/**
 * Fired on `window` when a panel offers "choose harbour" and nobody handed it
 * a callback: the location picker listens and opens its harbour list.
 */
export const CHOOSE_HARBOUR_EVENT = "orca:choose-harbour";

/** "{km} km" style templates: fills `{name}` slots, leaves unknown ones. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole,
  );
}

/**
 * A day with no trip in it. The backend still returns the hour the fish would
 * bite and the grounds they would be on; under "Do not go out" those read as
 * an invitation. When this is true a view shows the verdict and the warning
 * and nothing that plans a trip.
 *
 * The backend's own signal comes first (`duration.feasible`: is there enough
 * safe time to make a trip worthwhile). EXTREME is a no-go whatever it says,
 * and so is a day the safety gate cannot clear: with a critical reading
 * missing, ORCA plans no trip at all (INSUFFICIENT DATA).
 */
export function tripIsOff(data: {
  safety: { category: string };
  duration: { feasible: boolean } | null;
  decision?: { state: string } | null;
}): boolean {
  if (data.safety.category === "EXTREME") return true;
  if (data.decision?.state === "INSUFFICIENT_DATA") return true;
  return data.duration ? !data.duration.feasible : false;
}
