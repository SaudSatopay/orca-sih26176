import type { AuthorityRow, RiskCategory } from "../types";

/** The columns an officer can order the board by. */
export type SortKey = "risk" | "name" | "wave" | "wind";
export type SortDir = "ascending" | "descending";
export interface Sort {
  key: SortKey;
  dir: SortDir;
}

/** The board opens worst-first: that is the question it exists to answer. */
export const DEFAULT_SORT: Sort = { key: "risk", dir: "descending" };

/**
 * Clicking the column already in use turns it over; a new column starts in
 * its natural direction (names A to Z, measurements highest first).
 */
export function nextSort(current: Sort, key: SortKey): Sort {
  if (current.key === key)
    return { key, dir: current.dir === "ascending" ? "descending" : "ascending" };
  return { key, dir: key === "name" ? "ascending" : "descending" };
}

/** The value for a header's `aria-sort`. */
export function ariaSort(current: Sort, key: SortKey): SortDir | "none" {
  return current.key === key ? current.dir : "none";
}

function measure(row: AuthorityRow, key: SortKey): number | null {
  if (key === "risk") return row.risk_score;
  if (key === "wave") return row.wave_height_m;
  if (key === "wind") return row.wind_speed_kmh;
  return null;
}

/**
 * A new array in the asked order. A missing reading sorts last in either
 * direction (an unknown sea is never "the calmest"), and ties fall back to
 * the name so the order is stable from one refresh to the next.
 */
export function sortRows(rows: readonly AuthorityRow[], sort: Sort): AuthorityRow[] {
  const sign = sort.dir === "ascending" ? 1 : -1;
  const byName = (a: AuthorityRow, b: AuthorityRow) => a.name.localeCompare(b.name);
  return [...rows].sort((a, b) => {
    if (sort.key === "name") return sign * byName(a, b);
    const x = measure(a, sort.key);
    const y = measure(b, sort.key);
    if (x == null && y == null) return byName(a, b);
    if (x == null) return 1;
    if (y == null) return -1;
    return x === y ? byName(a, b) : sign * (x - y);
  });
}

/** How many centres sit in each band, from the rows themselves. */
export function bandCounts(rows: readonly AuthorityRow[]): Record<RiskCategory, number> {
  const counts: Record<RiskCategory, number> = { LOW: 0, MODERATE: 0, HIGH: 0, EXTREME: 0 };
  for (const r of rows) counts[r.risk_category] += 1;
  return counts;
}

export type CoastStretch = "west" | "east" | "islands";

/** Kanniyakumari, the cape: west of it is the Arabian Sea coast. */
const CAPE_LON = 77.6;

function stretchOf(r: AuthorityRow): CoastStretch {
  // Andaman & Nicobar lie far out in the Bay; Lakshadweep off the Malabar coast.
  if (r.longitude > 90 || (r.longitude < 74 && r.latitude < 12.5)) return "islands";
  return r.longitude < CAPE_LON ? "west" : "east";
}

/**
 * The centres in the order a ship would pass them: down the west coast from
 * Gujarat, round the cape, up the east coast to Bengal, then the islands.
 * Neighbours on the strip are neighbours on the water, so a storm shows as a
 * run of high marks rather than as scattered rows.
 */
export function coastOrder(
  rows: readonly AuthorityRow[],
): { stretch: CoastStretch; rows: AuthorityRow[] }[] {
  const pick = (s: CoastStretch) => rows.filter((r) => stretchOf(r) === s);
  const west = pick("west").sort((a, b) => b.latitude - a.latitude);
  const east = pick("east").sort((a, b) => a.latitude - b.latitude);
  const islands = pick("islands").sort((a, b) => b.latitude - a.latitude);
  return (
    [
      { stretch: "west", rows: west },
      { stretch: "east", rows: east },
      { stretch: "islands", rows: islands },
    ] as const
  ).filter((g) => g.rows.length > 0);
}

export interface ScoreChange {
  name: string;
  from: number;
  to: number;
}

/**
 * What moved between two readings of the board: every centre whose score
 * changed, largest move first. Centres that appear or vanish are not score
 * changes and are left out.
 */
export function boardChanges(
  before: readonly AuthorityRow[],
  after: readonly AuthorityRow[],
): ScoreChange[] {
  const was = new Map(before.map((r) => [r.name, r.risk_score]));
  return after
    .filter((r) => was.has(r.name) && was.get(r.name) !== r.risk_score)
    .map((r) => ({ name: r.name, from: was.get(r.name)!, to: r.risk_score }))
    .sort((a, b) => Math.abs(b.to - b.from) - Math.abs(a.to - a.from) || a.name.localeCompare(b.name));
}
