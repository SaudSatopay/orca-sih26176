import type { DataDrill, DataHealth, GateState, Language, SafetyDecision } from "./types";
import { GATE } from "./i18n/gate";

/** The four rehearsed states of the marine feed, in demo order. */
export const DRILLS: readonly DataDrill[] = ["healthy", "stale", "unavailable", "recovery"];

export function isDrill(v: string | null | undefined): v is DataDrill {
  return (DRILLS as readonly string[]).includes(v ?? "");
}

/** "4 h 10 min" / "4 घं 10 मि" / "4 तास 10 मिनिटे" — the digits never change. */
export function ageText(seconds: number, lang: Language): string {
  const u = (GATE[lang] ?? GATE.en).units;
  const minutes = Math.max(0, Math.floor(seconds / 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const mins = (n: number) => `${n} ${n === 1 ? u.min1 : u.min}`;
  if (h && m) return `${h} ${u.h} ${mins(m)}`;
  if (h) return `${h} ${u.h}`;
  return mins(m);
}

/** Critical inputs that are fresh, out of all the critical ones. */
export function freshCount(health: readonly DataHealth[]): { fresh: number; total: number } {
  const critical = health.filter((h) => h.critical);
  return { fresh: critical.filter((h) => h.status === "FRESH").length, total: critical.length };
}

/** The gate holds the verdict back: no score, no stamp, no trip plan. */
export function gateWithholds(d: SafetyDecision | null | undefined): boolean {
  return d?.state === "INSUFFICIENT_DATA";
}

/** The gate lets the verdict stand, marked as resting on out-of-date evidence. */
export function gateTempers(d: SafetyDecision | null | undefined): boolean {
  return d?.state === "CAUTION";
}

/**
 * A score is on screen but its evidence is incomplete: stale (CAUTION), or a
 * NO-GO that a missing reading did not weaken but may have under-counted (the
 * engine assumes a mid hazard for an unknown value; the warning floor holds).
 * Such a number is printed as unconfirmed, never as a plain verdict.
 */
export function scoreUnconfirmed(d: SafetyDecision | null | undefined): boolean {
  if (!d || d.state === "INSUFFICIENT_DATA") return false;
  return d.blocking_inputs.length > 0 || d.stale_inputs.length > 0;
}

export type GateTone = "go" | "caution" | "insufficient" | "nogo";

export function gateTone(state: GateState): GateTone {
  switch (state) {
    case "CAUTION":
      return "caution";
    case "INSUFFICIENT_DATA":
      return "insufficient";
    case "NO_GO":
      return "nogo";
    default:
      return "go";
  }
}

/**
 * The reasons worth printing. The backend ends a clean decision with "All N
 * critical inputs are fresh", which the strip already says as a count; any
 * line before it (a feed that reconnected) still matters. When something is
 * missing or stale, every reason is printed.
 */
export function shownReasons(d: SafetyDecision): string[] {
  const troubled = d.blocking_inputs.length > 0 || d.stale_inputs.length > 0 || d.state === "INSUFFICIENT_DATA";
  return troubled ? d.reasons : d.reasons.slice(0, -1);
}
