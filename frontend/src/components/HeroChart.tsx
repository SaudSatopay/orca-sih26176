import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import * as api from "../api";
import type { ChatResponse, Language, RiskCategory } from "../types";
import { CheckGlyph, CourseArrow } from "./glyphs";
import type { SeaField } from "./HeroSea";
import { HERO as T, type FactorKey, type SceneId } from "../i18n/hero";
import { LABEL as AGENT } from "../i18n/agentTrace";
import { COURSE_MS, END, heroStage, type HeroStage } from "./heroSequence";
import GlassLoupe from "../effects/GlassLoupe";
import { readEffectEnv } from "../effects/gate";
import "./hero.css";

/**
 * "The chart answers" — the landing hero.
 *
 * One sheet that performs the product's whole claim: a fisher's question goes
 * in, the crew reports, the course plots itself around the hatched no-go
 * area, and the verdict lands as a stamp with its reasons attributed.
 *
 * It is a poster first. The numbers below are what the DEMO pipeline
 * measurably returns for the same three questions (checked against the
 * running backend), so the sheet is complete before any request returns;
 * the live pipeline is then asked the same question at mount and its real
 * score, factors, confidences and readouts replace the poster's in place
 * (DEMO edition only — in LIVE the sea has moved on from the drawing, so
 * the poster stays and says it is a rehearsed scenario).
 *
 * Motion doctrine (HANDOFF 3.5): nothing here is revealed by a CSS animation
 * that could stall. The sequence is STATE, advanced by a timer — what is on
 * the sheet at any moment is what the state says, and the timer always
 * reaches the end, with or without frames. The keyframes in hero.css are
 * transform-only and carry no fill-mode: if they never run, nothing is lost.
 * Under reduced motion the sheet starts finished. In the stacked layout the
 * sheet is the poster until half of it is on screen; then the sequence runs
 * once.
 *
 * Chart labels that carry information (course labels, area names, warning
 * plates, readouts) are HTML positioned over the SVG in percent, so they
 * render at 11 CSS px or more at every width. Soundings — the italic depth
 * numerals — are decoration and stay SVG.
 */

const HeroSea = lazy(() =>
  // A failed chunk must not take the landing down: the sea is decoration.
  import("./HeroSea").catch(
    () => ({ default: () => null }) as unknown as typeof import("./HeroSea"),
  ),
);

const VB_W = 600;
const VB_H = 330;

/** West coast (Mumbai): land down the right-hand edge of the sheet. */
const LAND_WEST =
  "M452 0 C440 34 468 68 455 104 C445 132 462 162 450 193 C440 219 458 252 447 284 C442 302 452 318 448 330 L600 330 L600 0 Z";
/** East coast (Paradip): land across the upper left. */
const LAND_EAST =
  "M0 0 L340 0 C318 30 262 54 226 98 C196 134 132 166 100 218 C80 252 44 288 0 306 Z";

const COURSE =
  "M436 198 C 418 176 390 156 348 152 C 294 148 234 170 202 206 C 184 226 168 242 148 252";
const STORM_TRACK = "M548 322 L420 214 L318 142";

const CREW = [
  "intent",
  "planner",
  "weather",
  "ocean",
  "pfz",
  "cyclone",
  "gis",
  "risk",
  "route",
  "explanation",
] as const;

interface Poster {
  place: string;
  score: number;
  category: RiskCategory;
  factors: { key: FactorKey; points: number }[];
  ran: Partial<Record<(typeof CREW)[number], number>>;
  official: boolean;
  window?: string;
  land: string;
  sea: SeaField;
  /** Buoy confidences, percent, by rank (r.pfz[].confidence live). */
  buoys: [number, number, number];
  /** The warning plates' readouts (the wave and wind evidence live). */
  waveM?: number;
  windKmh?: number;
  /** The course labels' distances (r.routes live). */
  safestKm?: number;
  directKm?: number;
}

const POSTERS: Record<SceneId, Poster> = {
  route: {
    place: "Mumbai",
    score: 30,
    category: "MODERATE",
    factors: [
      { key: "wave", points: 10.2 },
      { key: "wind", points: 7.4 },
      { key: "gis", points: 6.4 },
    ],
    ran: { intent: 0, planner: 43, weather: 0, ocean: 0, pfz: 1, cyclone: 0, gis: 0, risk: 0, route: 39, explanation: 0 },
    official: false,
    land: LAND_WEST,
    sea: { kind: "breeze", u: 0.62, v: -0.3 },
    buoys: [81, 76, 74],
    safestKm: 36.4,
    directKm: 31.0,
  },
  danger: {
    place: "Mumbai",
    score: 70,
    category: "HIGH",
    factors: [
      { key: "cyclone", points: 21.0 },
      { key: "wave", points: 15.5 },
      { key: "wind", points: 11.6 },
    ],
    ran: { intent: 0, planner: 2, weather: 0, ocean: 0, cyclone: 0, gis: 0, risk: 0, explanation: 0 },
    official: true,
    window: "11:00",
    land: LAND_WEST,
    sea: { kind: "breeze", u: 1.25, v: -0.72 },
    buoys: [81, 76, 74],
    waveM: 1.9,
    windKmh: 29,
  },
  cyclone: {
    place: "Paradip",
    score: 92,
    category: "EXTREME",
    factors: [
      { key: "wave", points: 25.0 },
      { key: "cyclone", points: 25.0 },
      { key: "wind", points: 20.0 },
    ],
    ran: { intent: 0, planner: 2, weather: 0, ocean: 0, cyclone: 0, gis: 0, risk: 0, explanation: 0 },
    official: true,
    land: LAND_EAST,
    sea: { kind: "vortex", cx: 420, cy: 214, reach: 104 },
    buoys: [0, 0, 0],
    waveM: 5.2,
    windKmh: 87,
  },
};

const SCENES: SceneId[] = ["route", "danger", "cyclone"];

const RISK_TEXT: Record<RiskCategory, string> = {
  LOW: "text-risk-low",
  MODERATE: "text-risk-moderate",
  HIGH: "text-risk-high",
  EXTREME: "text-risk-extreme",
};
const RISK_BG: Record<RiskCategory, string> = {
  LOW: "bg-risk-low",
  MODERATE: "bg-risk-moderate",
  HIGH: "bg-risk-high",
  EXTREME: "bg-risk-extreme",
};

const FACTOR_KEYS: FactorKey[] = ["wave", "cyclone", "wind", "weather", "ocean", "gis"];

/** What the live pipeline said, folded into the poster's shape. */
function fromResponse(base: Poster, r: ChatResponse): Poster {
  if (!r.risk) return base;
  const ran: Poster["ran"] = { planner: r.elapsed_ms };
  for (const tr of r.trace) {
    if (tr.status !== "skipped" && (CREW as readonly string[]).includes(tr.agent)) {
      ran[tr.agent as (typeof CREW)[number]] = tr.latency_ms;
    }
  }
  const factors = r.risk.factors
    .filter((f) => (FACTOR_KEYS as string[]).includes(f.key))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((f) => ({ key: f.key as FactorKey, points: f.contribution }));
  const buoys =
    r.pfz.length >= 3
      ? ([0, 1, 2].map((i) => Math.round(r.pfz[i].confidence * 100)) as [number, number, number])
      : base.buoys;
  const evidence = (label: string): number | undefined => {
    const e = r.evidence.find((x) => x.label === label);
    const n = e ? parseFloat(e.value) : NaN;
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    ...base,
    score: Math.round(r.risk.score),
    category: r.risk.category,
    factors: factors.length ? factors : base.factors,
    ran,
    official: r.risk.official_warning,
    window: r.risk.window ?? undefined,
    buoys,
    waveM: evidence("Wave height") ?? base.waveM,
    windKmh: evidence("Wind") ?? base.windKmh,
    safestKm: r.routes.find((x) => x.kind === "safest")?.distance_km ?? base.safestKm,
    directKm: r.routes.find((x) => x.kind === "shortest")?.distance_km ?? base.directKm,
  };
}

function prefersStill(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function isWide(): boolean {
  return (
    typeof window !== "undefined" && !!window.matchMedia?.("(min-width: 1024px)").matches
  );
}

/**
 * Where the sequence stands. A timer, not a frame callback, moves it on: it
 * ticks in a hidden tab and on a display that never composites, so the end
 * is always reached. State is only replaced when something visible changes.
 * With `still` the sheet is simply the finished poster.
 */
function useHeroStage(askLength: number, still: boolean): HeroStage {
  const [stage, setStage] = useState<HeroStage>(() =>
    heroStage(still || prefersStill() ? END : 0, askLength),
  );
  useEffect(() => {
    if (still || prefersStill()) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const next = heroStage(performance.now() - start, askLength);
      setStage((prev) => (prev.key === next.key ? prev : next));
      if (next.settled) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [askLength, still]);
  return stage;
}

/** Latency readout: a crew member that ran in under a millisecond says so. */
function fmtMs(ms: number): string {
  return ms < 1 ? "<1 ms" : `${ms} ms`;
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="svg-bob">
        <circle r="13" className="fill-ink-900 stroke-paper-50" strokeWidth="2.2" />
        <path d="M0 -7 v7 M0 -5.2 l4.8 5.2 h-4.8 z" className="fill-paper-50 stroke-paper-50" strokeWidth="1.4" />
        <path d="M-5.2 3.6 q2.6 2.1 5.2 0 t5.2 0" className="stroke-paper-50" strokeWidth="1.3" fill="none" />
      </g>
    </g>
  );
}

function Buoy({
  x,
  y,
  n,
  lead = false,
  hailing = false,
  phase = 0,
}: {
  x: number;
  y: number;
  n: number;
  lead?: boolean;
  /** The course has reached this buoy: it rings. */
  hailing?: boolean;
  phase?: number;
}) {
  const r = lead ? 14 : 10.5;
  return (
    <g transform={`translate(${x} ${y})`}>
      {hailing && <circle className="svg-ping stroke-risk-low" r={r} fill="none" strokeWidth="2" />}
      <g className={hailing ? "hero-pop-in" : undefined}>
        <g className="svg-bob" style={{ animationDelay: `${phase * 0.7}s` }}>
          <circle r={r} className="fill-paper-50 stroke-risk-low" strokeWidth={lead ? 3.5 : 2.6} />
          <text
            y={lead ? 5 : 4}
            textAnchor="middle"
            className="fill-ink-900 font-display font-extrabold"
            fontSize={lead ? 14 : 11}
          >
            {n}
          </text>
        </g>
      </g>
    </g>
  );
}

/** Percent position inside the chart frame for a viewBox coordinate. */
function at(x: number, y: number): React.CSSProperties {
  return { left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` };
}

/** One question's sheet. Remounted per question, so the sequence starts over. */
function Sheet({
  scene,
  poster: p,
  isLive,
  language,
  seaOn,
  still,
}: {
  scene: SceneId;
  poster: Poster;
  isLive: boolean;
  language: Language;
  seaOn: boolean;
  /** Stacked layout before the sheet is half on screen: the finished poster. */
  still: boolean;
}) {
  const t = T[language] ?? T.en;
  const crewName = AGENT[language] ?? AGENT.en;
  const question = t.ask[scene];
  const askLang = t.askLang[scene];
  const stage = useHeroStage(question.length, still);
  const ranCount = CREW.filter((a) => p.ran[a] != null).length;
  const top = Math.max(...p.factors.map((f) => f.points), 1);
  const ask = `“${question}”`;
  // The opening quote mark is written with the first letter.
  const typed = stage.typed >= question.length ? ask.length : stage.typed === 0 ? 0 : stage.typed + 1;

  return (
    <div id="hero-sheet" role="tabpanel" aria-labelledby={`hero-tab-${scene}`}>
      {/* 1 · the question, written out as it is asked */}
      <div className="hero-q relative z-[2] px-5 pb-3 pt-3">
        {/* A <p> prohibits aria-label (axe aria-prohibited-attr): assistive
            tech reads the full question from a visually hidden span while
            the typing spans stay decoration. */}
        <p lang={askLang} className="font-display text-title font-semibold leading-snug text-ink-900">
          <span className="sr-only">{ask}</span>
          <span aria-hidden>{ask.slice(0, typed)}</span>
          <span aria-hidden className="invisible">
            {ask.slice(typed)}
          </span>
        </p>
      </div>

      {/* 2 · the crew, reporting in the order the graph runs */}
      <div className="hero-crew-sec relative z-[2] border-t px-5 py-2.5" style={{ borderColor: "var(--rule-faint)" }}>
        <div className="label flex items-baseline justify-between gap-3">
          <span>{t.crew}</span>
          <span className="normal-case tracking-normal text-ink-400" aria-live="off">
            {stage.crew >= CREW.length ? `${t.crewRan(ranCount)} · ${isLive ? t.live : t.rehearsed}` : "…"}
          </span>
        </div>
        <ul className="hero-crew mt-2 grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-x-3 gap-y-1.5">
          {CREW.map((a, n) => {
            const reported = n < stage.crew;
            const ms = p.ran[a];
            const ran = ms != null;
            return (
              <li
                key={a}
                className={`flex items-center gap-1 font-mono text-label font-semibold ${
                  reported && ran ? "text-ink-800" : "text-ink-400"
                }`}
                title={reported && !ran ? t.idle : undefined}
              >
                {reported && ran ? (
                  <CheckGlyph size={11} className="hero-pop-in shrink-0 text-risk-low" />
                ) : (
                  <span aria-hidden className="inline-block w-[11px] shrink-0 text-center">
                    ·
                  </span>
                )}
                <span className={`whitespace-nowrap ${reported && !ran ? "line-through decoration-ink-300" : ""}`}>
                  {a === "planner" ? t.planner : (crewName[a] ?? a)}
                </span>
                {reported && ran && (
                  <span className="hero-ms ml-auto whitespace-nowrap tabular-nums text-chart-700">{fmtMs(ms)}</span>
                )}
                {reported && !ran && <span className="sr-only">— {t.idle}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3 · the chart */}
      <div className="chart-frame relative mx-4 !rounded-[2px]" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width={VB_W} height={VB_H} className="fill-chart-100" opacity="0.55" />
          {[66, 132, 198, 264].map((y) => (
            <line key={y} x1="0" y1={y} x2={VB_W} y2={y} className="stroke-chart-500" strokeWidth="0.5" opacity="0.22" />
          ))}
          {[100, 200, 300, 400, 500].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2={VB_H} className="stroke-chart-500" strokeWidth="0.5" opacity="0.22" />
          ))}
        </svg>

        {seaOn && (
          <Suspense fallback={null}>
            <HeroSea field={p.sea} land={p.land} width={VB_W} height={VB_H} />
          </Suspense>
        )}

        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${p.place}: ${t.verdict[p.category]}, ${p.score}/100`}
        >
          {/* While a line is being drawn it shows through a mask whose stroke
              runs out along it; once the sequence has settled the mask is gone
              and the line is simply there. */}
          {!stage.settled && (
            <defs>
              <mask id="hero-course-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                <path d={COURSE} pathLength={1} className="hero-line" data-drawn={stage.course ? 1 : 0} style={{ transitionDuration: `${COURSE_MS}ms` }} stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" />
              </mask>
              <mask id="hero-track-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                <path d={STORM_TRACK} pathLength={1} className="hero-line" data-drawn={stage.course ? 1 : 0} style={{ transitionDuration: `${COURSE_MS}ms` }} stroke="white" strokeWidth="9" fill="none" />
              </mask>
            </defs>
          )}

          {/* the coast */}
          <path d={p.land} className="fill-paper-200 stroke-ink-500" strokeWidth="1.2" />
          <path d={p.land} className="stroke-chart-500" strokeWidth="5" fill="none" opacity="0.14" />

          {scene !== "cyclone" ? (
            <>
              <text x="70" y="52" className="sounding fill-chart-500" fontSize="11" opacity="0.7">44</text>
              <text x="330" y="300" className="sounding fill-chart-500" fontSize="11" opacity="0.7">27</text>
              <text x="60" y="296" className="sounding fill-chart-500" fontSize="11" opacity="0.7">61</text>
            </>
          ) : (
            <>
              <text x="250" y="300" className="sounding fill-chart-500" fontSize="11" opacity="0.7">38</text>
              <text x="548" y="70" className="sounding fill-chart-500" fontSize="11" opacity="0.7">72</text>
            </>
          )}

          {scene === "route" && (
            <>
              {/* the areas the direct track would cross */}
              <polygon points="246,186 350,178 358,250 254,258" fill="url(#hatch-critical)" className="stroke-risk-extreme" strokeWidth="1.3" strokeDasharray="7 4" />
              <polygon points="376,202 424,198 428,220 380,226" fill="url(#hatch-warning)" className="stroke-risk-high" strokeWidth="1.1" strokeDasharray="6 4" />
              {/* the direct track: shorter, and wrong */}
              <line x1="436" y1="198" x2="148" y2="252" className="stroke-ink-400" strokeWidth="1.5" strokeDasharray="2 6" opacity="0.75" />
              {/* the answer: it plots itself, then keeps running. The dashes
                  loop over whole periods: 3 × (11+8) = 57 (--dash-loop, read
                  by the dashdrift keyframe), so the run never jumps. */}
              <g mask={stage.settled ? undefined : "url(#hero-course-mask)"}>
                <path
                  d={COURSE}
                  className="route-live stroke-risk-low"
                  strokeWidth="3"
                  strokeDasharray="11 8"
                  strokeLinecap="round"
                  fill="none"
                  style={{ "--dash-loop": "-57" } as React.CSSProperties}
                />
              </g>
              <Buoy x={240} y={78} n={2} phase={2} />
              <Buoy x={112} y={150} n={3} phase={3} />
              <Buoy x={148} y={252} n={1} lead hailing={stage.arrived} />
            </>
          )}

          {scene === "danger" && (
            <>
              {/* the whole inshore sea is under the advisory */}
              <path
                d="M18 18 H436 C428 44 452 72 440 104 C432 130 446 160 436 190 C428 216 442 250 432 282 C428 296 434 306 432 312 H18 Z"
                fill="url(#hatch-warning)"
                className="stroke-risk-high"
                strokeWidth="1.3"
                strokeDasharray="8 5"
              />
              {/* heavy sea-surface marks */}
              {[
                [60, 70], [150, 230], [300, 60], [250, 270], [360, 210], [90, 280], [372, 96],
              ].map(([x, y], n) => (
                <path key={n} d={`M${x} ${y} q6 -6 12 0 t12 0 t12 0`} className="stroke-chart-600" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
              ))}
              <Buoy x={148} y={252} n={1} phase={2} />
            </>
          )}

          {scene === "cyclone" && (
            <>
              <circle cx="420" cy="214" r="104" fill="url(#hatch-critical)" className="stroke-risk-extreme" strokeWidth="1.5" strokeDasharray="8 5" />
              <g mask={stage.settled ? undefined : "url(#hero-track-mask)"}>
                <path d={STORM_TRACK} className="stroke-risk-extreme" strokeWidth="2" strokeDasharray="3 6" fill="none" strokeLinecap="round" />
              </g>
              {stage.arrived && (
                <circle cx="318" cy="142" r="4" className="hero-pop-in fill-paper-50 stroke-risk-extreme" strokeWidth="1.6" />
              )}
              <g transform="translate(420 214)">
                <g className="storm-spin" style={{ transformBox: "fill-box" }}>
                  <path d="M0 -23 A 23 23 0 0 1 23 0" className="stroke-risk-extreme" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M0 23 A 23 23 0 0 1 -23 0" className="stroke-risk-extreme" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle r="10.5" className="fill-risk-extreme" />
                  <circle r="4" className="fill-paper-50" />
                </g>
              </g>
            </>
          )}

          <Boat x={scene === "cyclone" ? 238 : 436} y={scene === "cyclone" ? 110 : 198} />

          {/* compass */}
          <g transform={scene === "cyclone" ? "translate(48 286)" : "translate(552 284)"} opacity="0.8">
            <circle r="19" fill="none" className="stroke-ink-900" strokeWidth="1.1" />
            <g className="compass-needle">
              <path d="M0 -16 L4 5 L0 9 L-4 5 Z" className="fill-ink-900" />
            </g>
            <text y="-22" textAnchor="middle" className="fill-ink-900 font-mono" fontSize="7.5">
              N
            </text>
          </g>
        </svg>

        {/* Informational labels: HTML in percent over the SVG, 11 px or more
            at every width. The chart's aria-label carries the verdict. */}
        <div className="hero-labels" aria-hidden>
          {scene !== "cyclone" ? (
            <span className="hero-lbl hero-area" style={at(520, 150)}>MUMBAI</span>
          ) : (
            <span className="hero-lbl hero-area" style={at(118, 70)}>PARADIP</span>
          )}

          {scene === "route" && (
            <>
              <span className="hero-lbl hero-halo font-bold uppercase text-risk-extreme" style={at(302, 222)}>
                {t.naval}
              </span>
              <span className="hero-lbl hero-anchor-s hero-halo text-ink-500" style={at(196, 276)}>
                {t.direct} · {(p.directKm ?? 31.0).toFixed(1)} km
              </span>
              {stage.arrived && (
                <span className="hero-lbl hero-anchor-s hero-halo font-bold uppercase text-risk-low" style={at(260, 134)}>
                  <span className="hero-rise-in block">
                    {t.safest} · {(p.safestKm ?? 36.4).toFixed(1)} km
                  </span>
                </span>
              )}
              <span className="hero-lbl hero-anchor-s hero-pct" style={at(240 + 16.5, 78)}>{p.buoys[1]}%</span>
              <span className="hero-lbl hero-anchor-s hero-pct" style={at(112 + 16.5, 150)}>{p.buoys[2]}%</span>
              <span className="hero-lbl hero-anchor-e hero-pct hero-pct-lead" style={at(148 - 21, 252)}>{p.buoys[0]}%</span>
            </>
          )}

          {scene === "danger" && (
            <>
              <div className="hero-plate hero-plate-high" style={at(200, 143)}>
                <span className="block font-bold uppercase text-risk-high">{t.imd}</span>
                <span className="mt-0.5 block text-ink-700">
                  {(p.waveM ?? 1.9).toFixed(1)} m · {Math.round(p.windKmh ?? 29)} km/h SW · {t.until}{" "}
                  {p.window ?? "11:00"}
                </span>
              </div>
              <span className="hero-lbl hero-anchor-s hero-pct" style={at(148 + 16.5, 252)}>{p.buoys[0]}%</span>
            </>
          )}

          {scene === "cyclone" && (
            <>
              {stage.arrived && (
                <span className="hero-lbl hero-anchor-s font-bold text-risk-extreme" style={at(328, 132)}>
                  <span className="hero-rise-in block">+24 h · {t.track}</span>
                </span>
              )}
              <div className="hero-plate hero-plate-extreme" style={at(474, 282)}>
                <span className="block font-bold uppercase text-risk-extreme">{t.storm}</span>
                <span className="mt-0.5 block text-ink-700">
                  {(p.waveM ?? 5.2).toFixed(1)} m · {Math.round(p.windKmh ?? 87)} km/h
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4 · the verdict, stamped, with its reasons */}
      <div className="hero-verdict relative z-[2] grid grid-cols-[auto_1fr] items-center gap-5 px-5 pb-4 pt-4">
        {stage.stamped ? (
          /* Keyed on the verdict: if the live answer lands after the stamp is
             down with a different score, it stamps again. */
          <div
            key={`${p.score}-${p.category}`}
            className={`hero-stamp hero-stamp-in stamp !px-3.5 !py-2 text-center ${RISK_TEXT[p.category]}`}
            aria-label={`${t.verdict[p.category]} — ${p.score}/100`}
          >
            <div className="flex items-baseline justify-center gap-1 leading-none">
              <span className="sounding text-dial tracking-normal">{p.score}</span>
              <span className="font-sans text-body font-bold tabular-nums tracking-normal text-ink-700 [text-shadow:none]">/100</span>
            </div>
            <div className="mt-1 whitespace-nowrap text-title font-black leading-tight">{t.verdict[p.category]}</div>
          </div>
        ) : (
          /* where the stamp will land: the same box, still empty */
          <div className="hero-stamp stamp-slot !px-3.5 !py-2" aria-hidden>
            <div className="flex items-baseline justify-center gap-1 leading-none">
              <span className="sounding invisible text-dial tracking-normal">{p.score}</span>
              <span className="invisible font-sans text-body font-bold tabular-nums">/100</span>
            </div>
            <div className="invisible mt-1 whitespace-nowrap text-title font-black leading-tight">{t.verdict[p.category]}</div>
          </div>
        )}

        <div className="min-w-0">
          <div className="label">{t.why}</div>
          <ul className="mt-1.5 space-y-1">
            {p.factors.map((f, n) => {
              const shown = n < stage.why;
              return (
                <li
                  key={f.key}
                  className={`grid grid-cols-[3.2rem_1fr] items-center gap-2 text-label leading-tight text-ink-700 ${
                    shown ? "hero-rise-in" : "invisible"
                  }`}
                >
                  <span className="text-right font-mono font-bold tabular-nums text-ink-900">
                    +{f.points.toFixed(1)}
                  </span>
                  <span className="relative block min-w-0">
                    <span className="block truncate">{t.factor[f.key]}</span>
                    <span className="mt-0.5 block h-[3px] rounded-[1px] bg-paper-200">
                      {shown && (
                        <span
                          className={`grow-x block h-full rounded-[1px] ${RISK_BG[p.category]}`}
                          style={{ width: `${Math.max(8, (f.points / top) * 100)}%` }}
                        />
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          {(p.official || p.window) && (
            <p
              className={`mt-2 text-label font-semibold leading-snug text-risk-extreme ${
                stage.note ? "hero-rise-in" : "invisible"
              }`}
            >
              {p.official && t.floor}
              {p.official && p.window && " · "}
              {p.window && (
                <span className="text-ink-700">
                  {t.clears} {p.window}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroChart({
  language,
  onAsk,
}: {
  language: Language;
  onAsk: (ask: string) => void;
}) {
  const t = T[language] ?? T.en;
  const [scene, setScene] = useState<SceneId>("route");
  const [run, setRun] = useState(0);
  // What the live pipeline answered, per question and language asked.
  const [live, setLive] = useState<Record<string, Poster>>({});
  const [seaOn, setSeaOn] = useState(false);
  // In the stacked layout the sequence waits until half the sheet is on
  // screen, once; until then the sheet is the finished poster.
  const [started, setStarted] = useState(() => prefersStill() || isWide());
  const figRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<SceneId, HTMLButtonElement | null>>>({});

  // The sea is decoration: only where the effects gate would allow
  // decoration at all (wide window, fine pointer, motion and data allowed),
  // and only after the sheet has painted.
  const seaAllowed = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    const env = readEffectEnv();
    return env.wide && env.finePointer && !env.reducedMotion && !env.saveData;
  }, []);
  useEffect(() => {
    if (!seaAllowed) return;
    const id = window.setTimeout(() => setSeaOn(true), 900);
    return () => window.clearTimeout(id);
  }, [seaAllowed]);

  useEffect(() => {
    if (started) return;
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.5) {
          setStarted(true);
          setRun((n) => n + 1);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Ask the real pipeline the same question at mount, so the honest answer
  // is usually in hand before the stamp lands; fold it into the poster.
  const question = t.ask[scene];
  const liveKey = `${scene}-${language}`;
  useEffect(() => {
    if (live[liveKey]) return;
    let alive = true;
    api
      .ask({ message: question, sessionId: `hero-${liveKey}` })
      .then((r) => {
        if (!alive || r.mode !== "DEMO" || !r.risk) return;
        // The storm-warning and cyclone sheets draw the warning itself, so
        // only an answer that reached the same verdict may replace their
        // numbers. The course sheet draws no weather: whatever the sea is
        // doing this hour, its live verdict is the honest one to stamp.
        if (scene !== "route" && r.risk.category !== POSTERS[scene].category) return;
        setLive((m) => ({ ...m, [liveKey]: fromResponse(POSTERS[scene], r) }));
      })
      .catch(() => {
        /* the poster already says everything; it stays labelled as rehearsed */
      });
    return () => {
      alive = false;
    };
  }, [scene, liveKey, question, live]);

  const p = live[liveKey] ?? POSTERS[scene];

  const pick = (id: SceneId) => {
    setScene(id);
    setRun((n) => n + 1);
  };
  const onTabKey = (e: React.KeyboardEvent) => {
    const at = SCENES.indexOf(scene);
    const next =
      e.key === "ArrowRight" ? SCENES[(at + 1) % 3] : e.key === "ArrowLeft" ? SCENES[(at + 2) % 3] : null;
    if (!next) return;
    e.preventDefault();
    pick(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <figure ref={figRef} className="hero-chart chart-sheet m-0 !p-0" aria-label={t.sheet} data-glass-surface="sheet">
      {/* The sheet's first line: who is asking, and the three rehearsed
          questions. The tablist leads the DOM, so it is the first thing the
          eye and the Tab key reach; it lives OUTSIDE the keyed subtree so
          the loupe's stills survive a tab change. */}
      <div className="hero-head relative z-[2] px-5 pt-4">
        <div className="label flex items-baseline justify-between gap-3">
          <span>
            {t.asks} · {p.place}
          </span>
          <span className="normal-case tracking-normal text-ink-400">
            {t.askLang[scene] === "mr" ? "मराठी" : t.askLang[scene] === "hi" ? "हिंदी" : "English"}
          </span>
        </div>
        <GlassLoupe id="tabs">
          <div role="tablist" aria-label={t.tabsLabel} className="mt-2 flex flex-wrap gap-1.5" onKeyDown={onTabKey}>
            {SCENES.map((id) => {
              const on = id === scene;
              const ends = (live[`${id}-${language}`] ?? POSTERS[id]).category;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[id] = el;
                  }}
                  id={`hero-tab-${id}`}
                  role="tab"
                  aria-selected={on}
                  aria-controls="hero-sheet"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(id)}
                  className={`hero-tab inline-flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1.5 font-mono text-label font-bold uppercase tracking-[0.1em] ${
                    on ? "border-ink-900 bg-ink-900 text-paper-50" : "text-ink-700"
                  }`}
                  style={on ? undefined : { borderColor: "var(--rule)" }}
                >
                  {/* how this question ends: its verdict band, as a mark */}
                  <span aria-hidden className={`h-2 w-2 shrink-0 ${RISK_BG[ends]}`} />
                  {t.tabs[id]}
                </button>
              );
            })}
          </div>
        </GlassLoupe>
      </div>

      {/* `key` starts the sequence over for each question. */}
      <Sheet
        key={`${scene}-${run}-${language}`}
        scene={scene}
        poster={p}
        isLive={!!live[liveKey]}
        language={language}
        seaOn={seaOn}
        still={!started}
      />

      <figcaption
        className="relative z-[2] flex items-center border-t px-5 py-2.5"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <button
          onClick={() => onAsk(question)}
          className="group ml-auto inline-flex items-center gap-1.5 font-mono text-label font-bold uppercase tracking-[0.1em] text-chart-700 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
        >
          {t.askReal}
          <CourseArrow size={12} className="transition-transform group-hover:translate-x-1" />
        </button>
      </figcaption>
    </figure>
  );
}
