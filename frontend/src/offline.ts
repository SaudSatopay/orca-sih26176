import type { DataHealth, FishingOutlook, GateState, Language, SafetyDecision } from "./types";
import { OFFLINE } from "./i18n/offline";
import { ageText } from "./gateModel";
import { splitAdvice } from "./components/todayModel";

/**
 * ORCA's last plan, kept on the phone for when the network drops.
 *
 * A saved answer is never shown as it was. The safety gate's own rules
 * (backend `services/data_health.check` and `services/safety_gate.decide`) are
 * run again on the device as the plan ages, using the limits each
 * `data_health` record carries, so a GO from this morning becomes CAUTION once
 * the warnings are over an hour old and INSUFFICIENT_DATA past three — and the
 * plan is then withheld exactly as the server withholds it.
 *
 * Re-judging can only move a verdict toward caution:
 *   - NO_GO stays NO_GO (it is never weakened);
 *   - an input the server called MISSING, ERROR or unusable stays unusable;
 *   - an input's status is the worse of what the server said and what its
 *     age says now, so a phone clock running behind cannot freshen a reading.
 */

/** How far in the future a timestamp may sit before it is a fault (data_health.FUTURE_SKEW_S). */
const FUTURE_SKEW_S = 600;

export interface SavedPlan {
  /** When the phone received the plan (ms since the epoch, device clock). */
  at: number;
  lat: number;
  lon: number;
  language: Language;
  data: FishingOutlook;
}

const KEY = "orca.lastPlan.v1.";
const LANGUAGES: readonly Language[] = ["en", "hi", "mr"];

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null; // private mode, blocked site data
  }
}

/** Keep the last good outlook for this device. Never throws. */
export function savePlan(device: string, plan: SavedPlan): void {
  try {
    storage()?.setItem(KEY + device, JSON.stringify(plan));
  } catch {
    /* full or blocked: the plan simply is not kept */
  }
}

/** The last good outlook for this device, or null. Never throws. */
export function loadPlan(device: string): SavedPlan | null {
  try {
    const raw = storage()?.getItem(KEY + device);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<SavedPlan>;
    const ok =
      typeof p.at === "number" &&
      Number.isFinite(p.at) &&
      typeof p.lat === "number" &&
      typeof p.lon === "number" &&
      LANGUAGES.includes(p.language as Language) &&
      typeof p.data === "object" &&
      p.data !== null &&
      Array.isArray(p.data.advice) &&
      typeof p.data.safety === "object";
    return ok ? (p as SavedPlan) : null;
  } catch {
    return null;
  }
}

/**
 * A failure that means "no connection", not "the server answered badly":
 * the phone says it is offline, fetch could not reach anyone (TypeError), or
 * the request timed out.
 */
export function isNetworkFailure(err: unknown, online: boolean): boolean {
  if (!online) return true;
  if (err instanceof TypeError) return true;
  const name = (err as { name?: unknown } | null)?.name;
  return name === "AbortError" || name === "TimeoutError";
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

/** 0 fresh and usable, 1 stale but usable, 2 unusable. */
const healthRank = (h: Pick<DataHealth, "status" | "usable">) =>
  !h.usable ? 2 : h.status === "STALE" ? 1 : 0;

/**
 * One input re-judged at `now` (ms). `receivedAt` is when the phone got it;
 * the age is then the larger of "now − observed_at" and "the age the server
 * measured + the time since", so neither clock can make a reading younger.
 */
export function regateHealth(
  h: DataHealth,
  now: number,
  opts: { lang?: Language; receivedAt?: number } = {},
): DataHealth {
  const g = (OFFLINE[opts.lang ?? "en"] ?? OFFLINE.en).gate;
  const lang = opts.lang ?? "en";
  // MISSING and ERROR stay unusable; a static layer is always FRESH; with no
  // timestamp the age cannot be shown (the server already said unusable).
  if (!h.available || h.status === "MISSING" || h.status === "ERROR") return h;
  if (h.freshness_limit_seconds == null) return h;
  const observed = h.observed_at ? Date.parse(h.observed_at) : NaN;
  if (!Number.isFinite(observed)) return h;

  const sinceObserved = (now - observed) / 1000;
  if (opts.receivedAt == null && sinceObserved < -FUTURE_SKEW_S)
    return { ...h, status: "ERROR", usable: false, detail: g.future };
  const sinceServer =
    opts.receivedAt != null && h.age_seconds != null
      ? h.age_seconds + (now - opts.receivedAt) / 1000
      : -Infinity;
  const age = Math.max(0, Math.floor(Math.max(sinceObserved, sinceServer)));

  const limit = h.freshness_limit_seconds;
  const maxAge = h.max_age_seconds;
  const words = { age: ageText(age, lang), limit: ageText(limit, lang) };
  let next: DataHealth;
  if (age <= limit) next = { ...h, age_seconds: age, status: "FRESH", usable: true, detail: fill(g.fresh, words) };
  else if (maxAge == null || age <= maxAge)
    next = { ...h, age_seconds: age, status: "STALE", usable: true, detail: fill(g.stale, words) };
  else
    next = {
      ...h,
      age_seconds: age,
      status: "STALE",
      usable: false,
      detail: fill(g.expired, { age: words.age, limit: ageText(maxAge, lang) }),
    };
  // Never better than the server said.
  return healthRank(next) >= healthRank(h) ? next : { ...h, age_seconds: age };
}

const STATE_RANK: Record<Exclude<GateState, "NO_GO">, number> = {
  GO: 0,
  CAUTION: 1,
  INSUFFICIENT_DATA: 2,
};

/**
 * The safety gate re-run on the phone (safety_gate.decide, same order):
 *
 *   no risk result                          -> INSUFFICIENT_DATA
 *   the safety rules say do not go          -> NO_GO  (never weakened)
 *   a critical input missing or too old     -> INSUFFICIENT_DATA
 *   a critical input stale but still usable -> CAUTION
 *   otherwise                               -> GO
 *
 * The result is never better than the decision it started from.
 */
export function regate(
  health: readonly DataHealth[],
  decision: SafetyDecision | null | undefined,
  now: number,
  opts: { lang?: Language; receivedAt?: number } = {},
): { health: DataHealth[]; decision: SafetyDecision } {
  const lang = opts.lang ?? "en";
  const g = (OFFLINE[lang] ?? OFFLINE.en).gate;
  const judged = health.map((h) => regateHealth(h, now, opts));
  const byInput = new Map(judged.map((h) => [h.input, h]));
  const critical = judged.filter((h) => h.critical);

  // An input the server called blocking but did not report stays blocking;
  // with no critical record at all there is nothing to decide on.
  const blocking = critical.filter((h) => !h.usable).map((h) => h.input);
  for (const k of decision?.blocking_inputs ?? []) if (!byInput.has(k) && !blocking.includes(k)) blocking.push(k);
  const stale = critical.filter((h) => h.usable && h.status === "STALE").map((h) => h.input);

  const riskGo = decision ? decision.risk_go : null;
  const noRisk = !decision || (riskGo === null && decision.state === "INSUFFICIENT_DATA");
  let state: GateState;
  if (noRisk) state = "INSUFFICIENT_DATA";
  else if (decision.state === "NO_GO" || riskGo === false) state = "NO_GO";
  else if (blocking.length || critical.length === 0) state = "INSUFFICIENT_DATA";
  else if (stale.length) state = "CAUTION";
  else state = "GO";
  // Never better than where it started.
  if (state !== "NO_GO" && decision && decision.state !== "NO_GO" && STATE_RANK[decision.state] > STATE_RANK[state])
    state = decision.state;

  const confidence =
    blocking.length || state === "INSUFFICIENT_DATA" ? "insufficient" : stale.length ? "degraded" : "normal";

  const reasons: string[] = [];
  if (noRisk && decision) reasons.push(...decision.reasons);
  for (const k of blocking) {
    const h = byInput.get(k);
    if (h) reasons.push(fill(g.reasonBlocking, { input: h.label, detail: h.detail }));
  }
  for (const k of stale) {
    const h = byInput.get(k)!;
    reasons.push(
      fill(g.reasonStale, {
        input: h.label,
        age: ageText(h.age_seconds ?? 0, lang),
        limit: ageText(h.freshness_limit_seconds ?? 0, lang),
      }),
    );
  }
  if (!blocking.length && !stale.length && !noRisk && critical.length)
    reasons.push(fill(g.allFresh, { n: critical.length }));
  if (state === "NO_GO" && blocking.length) reasons.push(g.nogoMissing);
  else if (state === "NO_GO" && stale.length) reasons.push(g.nogoStale);
  else if (state === "INSUFFICIENT_DATA" && !noRisk) reasons.push(g.block);
  else if (state === "CAUTION") reasons.push(g.cautionAct);

  return {
    health: judged,
    decision: {
      state,
      confidence,
      headline: g.headline[state],
      reasons,
      blocking_inputs: blocking,
      stale_inputs: stale,
      risk_go: riskGo,
      drill: decision?.drill ?? "healthy",
      timestamp: new Date(now).toISOString(),
    },
  };
}

/**
 * The server's withholding (api/fishing.py) applied to a re-judged outlook:
 * under INSUFFICIENT_DATA no grounds, no best hours, no stay or catch figures,
 * no course and no forecast, and the first sentence is the gate's own.
 */
export function withhold(data: FishingOutlook, decision: SafetyDecision, lang: Language): FishingOutlook {
  const g = (OFFLINE[lang] ?? OFFLINE.en).gate;
  if (decision.state === "INSUFFICIENT_DATA") {
    const parts = splitAdvice(data);
    // Keep only what the server keeps on a withheld day: the sea, the
    // notices, the closed areas and the disclaimer — never a plan.
    const advice = parts.structured
      ? [
          g.line.INSUFFICIENT_DATA,
          ...(parts.sea ? [parts.sea] : []),
          ...parts.notices,
          ...parts.prohibitions.map((p) => p.text),
          ...(parts.disclaimer ? [parts.disclaimer] : []),
        ]
      : [g.line.INSUFFICIENT_DATA, ...(parts.disclaimer ? [parts.disclaimer] : [])];
    return {
      ...data,
      areas: [],
      best_window: null,
      hourly_ranking: [],
      duration: null,
      economics: null,
      routes: [],
      forecast: [],
      advice,
      decision,
    };
  }
  if (decision.state === "CAUTION" && data.advice.length) {
    return { ...data, advice: [g.line.CAUTION, ...data.advice.slice(1)], decision };
  }
  return { ...data, decision };
}

/** A saved plan as it must be read at `now`: re-judged, and withheld if need be. */
export function regateOutlook(plan: SavedPlan, now: number): FishingOutlook {
  const { health, decision } = regate(plan.data.data_health ?? [], plan.data.decision, now, {
    lang: plan.language,
    receivedAt: plan.at,
  });
  return withhold({ ...plan.data, data_health: health }, decision, plan.language);
}

/** Seconds since the phone received the plan. */
export function planAgeSeconds(plan: SavedPlan, now: number): number {
  return Math.max(0, Math.floor((now - plan.at) / 1000));
}

/** An ISO timestamp moved by `ms`, keeping its own UTC offset ("…+05:30"). */
export function shiftIso(iso: string, ms: number): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  const m = /([+-])(\d\d):(\d\d)$/.exec(iso);
  const offsetMs = m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60_000 : 0;
  const local = new Date(t + ms + offsetMs).toISOString().slice(0, 19);
  return m ? `${local}${m[0]}` : `${local}Z`;
}

/**
 * The `?offline=<minutes>` demo: a plan just received, made `minutes` older.
 * Every timestamp in it moves back together, so the banner, the verdict's
 * "as of" and the re-judged ages all tell the same story.
 */
export function agePlan(plan: SavedPlan, minutes: number): SavedPlan {
  const ms = -minutes * 60_000;
  const d = plan.data;
  return {
    ...plan,
    at: plan.at + ms,
    data: {
      ...d,
      generated_at: shiftIso(d.generated_at, ms),
      decision: d.decision ? { ...d.decision, timestamp: shiftIso(d.decision.timestamp, ms) } : d.decision,
      data_health: d.data_health?.map((h) =>
        h.observed_at ? { ...h, observed_at: shiftIso(h.observed_at, ms) } : h,
      ),
    },
  };
}
