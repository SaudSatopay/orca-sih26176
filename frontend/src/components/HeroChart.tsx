import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties } from "react";
import * as api from "../api";
import type { ChatResponse, Language, RiskCategory } from "../types";
import { CheckGlyph, CourseArrow } from "./glyphs";
import type { SeaField } from "./HeroSea";
import "./hero.css";

/**
 * "The chart answers" — the landing hero.
 *
 * One sheet that performs the product's whole claim: a fisher's question goes
 * in, the crew reports, the course plots itself around the hatched no-go
 * area, and the verdict lands as a stamp with its reasons attributed.
 *
 * It is a poster first. The numbers below are the rehearsed scenarios'
 * measured results, so the sheet is complete before any request returns;
 * the live pipeline is then asked the same question and its real score,
 * factors and agent latencies replace the poster's in place (DEMO edition
 * only — in LIVE the sea has moved on from the drawing, so the poster
 * stays and says it is a rehearsed scenario).
 */

const HeroSea = lazy(() => import("./HeroSea"));

type SceneId = "route" | "danger" | "cyclone";
type FactorKey = "wave" | "cyclone" | "wind" | "weather" | "ocean" | "gis";

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
  ask: string;
  askLang: Language;
  place: string;
  score: number;
  category: RiskCategory;
  factors: { key: FactorKey; points: number }[];
  ran: Partial<Record<(typeof CREW)[number], number>>;
  official: boolean;
  window?: string;
  land: string;
  sea: SeaField;
}

const POSTERS: Record<SceneId, Poster> = {
  route: {
    ask: "Give me the safest route to the nearest fishing zone",
    askLang: "en",
    place: "Mumbai",
    score: 28,
    category: "MODERATE",
    factors: [
      { key: "wave", points: 9.2 },
      { key: "wind", points: 7.0 },
      { key: "gis", points: 6.4 },
    ],
    ran: { intent: 0, planner: 0, weather: 0, ocean: 0, pfz: 0, cyclone: 0, gis: 0, risk: 0, route: 26, explanation: 0 },
    official: false,
    land: LAND_WEST,
    sea: { kind: "breeze", u: 0.62, v: -0.3 },
  },
  danger: {
    ask: "मी उद्या सकाळी ६ वाजता मासेमारीला जाऊ शकतो का?",
    askLang: "mr",
    place: "Mumbai",
    score: 70,
    category: "HIGH",
    factors: [
      { key: "cyclone", points: 21.0 },
      { key: "wave", points: 15.5 },
      { key: "wind", points: 11.6 },
    ],
    ran: { intent: 0, planner: 0, weather: 0, ocean: 0, cyclone: 0, gis: 0, risk: 0, explanation: 0 },
    official: true,
    window: "11:00",
    land: LAND_WEST,
    sea: { kind: "breeze", u: 1.25, v: -0.72 },
  },
  cyclone: {
    ask: "Is there a cyclone near Paradip?",
    askLang: "en",
    place: "Paradip",
    score: 92,
    category: "EXTREME",
    factors: [
      { key: "wave", points: 25.0 },
      { key: "cyclone", points: 25.0 },
      { key: "wind", points: 20.0 },
    ],
    ran: { intent: 0, planner: 0, weather: 0, ocean: 0, cyclone: 0, gis: 0, risk: 0, explanation: 0 },
    official: true,
    land: LAND_EAST,
    sea: { kind: "vortex", cx: 420, cy: 214, reach: 104 },
  },
};

const SCENES: SceneId[] = ["route", "danger", "cyclone"];

const T: Record<
  Language,
  {
    sheet: string;
    asks: string;
    crew: string;
    crewRan: (n: number) => string;
    idle: string;
    verdict: Record<RiskCategory, string>;
    band: Record<RiskCategory, string>;
    why: string;
    factor: Record<FactorKey, string>;
    floor: string;
    clears: string;
    safest: string;
    direct: string;
    tabs: Record<SceneId, string>;
    tabsLabel: string;
    askReal: string;
    naval: string;
    channel: string;
    imd: string;
    until: string;
    storm: string;
    track: string;
    live: string;
    rehearsed: string;
  }
> = {
  en: {
    sheet: "One question, start to finish",
    asks: "A fisher asks",
    crew: "The crew reports",
    crewRan: (n) => `${n} of 10 needed`,
    idle: "not needed for this question",
    verdict: { LOW: "Safe to go", MODERATE: "Go with care", HIGH: "Do not go", EXTREME: "Do not launch" },
    band: { LOW: "Low", MODERATE: "Moderate", HIGH: "High", EXTREME: "Extreme" },
    why: "Why — every point attributed",
    factor: {
      wave: "Wave height",
      cyclone: "Official warning",
      wind: "Wind",
      weather: "Rain and visibility",
      ocean: "Sea state",
      gis: "Position and zones",
    },
    floor: "Official warning in force — the score cannot go lower",
    clears: "Expected to clear after",
    safest: "Safest course",
    direct: "direct track",
    tabs: { route: "Safest course", danger: "Storm warning", cyclone: "Cyclone" },
    tabsLabel: "Rehearsed questions",
    askReal: "Ask this in the app",
    naval: "Naval exercise area",
    channel: "Port channel",
    imd: "IMD fishermen warning",
    until: "until",
    storm: "Severe cyclonic storm",
    track: "forecast track",
    live: "answered live by the crew",
    rehearsed: "rehearsed scenario · simulated data",
  },
  hi: {
    sheet: "एक सवाल, शुरू से आख़िर तक",
    asks: "मछुआरा पूछता है",
    crew: "टीम की रिपोर्ट",
    crewRan: (n) => `10 में से ${n} की ज़रूरत`,
    idle: "इस सवाल के लिए ज़रूरी नहीं",
    verdict: { LOW: "जाना सुरक्षित", MODERATE: "सावधानी से जाएँ", HIGH: "न जाएँ", EXTREME: "नाव न उतारें" },
    band: { LOW: "कम", MODERATE: "मध्यम", HIGH: "अधिक", EXTREME: "अत्यधिक" },
    why: "क्यों — हर अंक का हिसाब",
    factor: {
      wave: "लहर की ऊँचाई",
      cyclone: "आधिकारिक चेतावनी",
      wind: "हवा",
      weather: "बारिश और दृश्यता",
      ocean: "समुद्र की दशा",
      gis: "स्थिति और क्षेत्र",
    },
    floor: "आधिकारिक चेतावनी लागू — स्कोर इससे कम नहीं हो सकता",
    clears: "सुधरने की उम्मीद",
    safest: "सबसे सुरक्षित मार्ग",
    direct: "सीधा रास्ता",
    tabs: { route: "सुरक्षित मार्ग", danger: "तूफ़ान की चेतावनी", cyclone: "चक्रवात" },
    tabsLabel: "तैयार सवाल",
    askReal: "यही ऐप में पूछें",
    naval: "नौसेना अभ्यास क्षेत्र",
    channel: "बंदरगाह चैनल",
    imd: "IMD मछुआरा चेतावनी",
    until: "तक",
    storm: "गंभीर चक्रवाती तूफ़ान",
    track: "अनुमानित मार्ग",
    live: "टीम ने अभी जवाब दिया",
    rehearsed: "तैयार परिदृश्य · नक़ली डेटा",
  },
  mr: {
    sheet: "एक प्रश्न, सुरुवातीपासून शेवटपर्यंत",
    asks: "मच्छीमार विचारतो",
    crew: "टीमचा अहवाल",
    crewRan: (n) => `10 पैकी ${n} लागले`,
    idle: "या प्रश्नासाठी गरज नाही",
    verdict: { LOW: "जाणे सुरक्षित", MODERATE: "सावधगिरीने जा", HIGH: "जाऊ नका", EXTREME: "होडी उतरवू नका" },
    band: { LOW: "कमी", MODERATE: "मध्यम", HIGH: "जास्त", EXTREME: "अत्यंत" },
    why: "का — प्रत्येक गुणाचा हिशेब",
    factor: {
      wave: "लाटांची उंची",
      cyclone: "अधिकृत इशारा",
      wind: "वारा",
      weather: "पाऊस आणि दृश्यमानता",
      ocean: "समुद्राची स्थिती",
      gis: "स्थान आणि क्षेत्रे",
    },
    floor: "अधिकृत इशारा लागू — गुण यापेक्षा कमी होऊ शकत नाहीत",
    clears: "सुधारण्याची शक्यता",
    safest: "सर्वात सुरक्षित मार्ग",
    direct: "थेट मार्ग",
    tabs: { route: "सुरक्षित मार्ग", danger: "वादळाचा इशारा", cyclone: "चक्रीवादळ" },
    tabsLabel: "तयार प्रश्न",
    askReal: "हेच अ‍ॅपमध्ये विचारा",
    naval: "नौदल सराव क्षेत्र",
    channel: "बंदर मार्ग",
    imd: "IMD मच्छीमार इशारा",
    until: "पर्यंत",
    storm: "तीव्र चक्रीवादळ",
    track: "अंदाजित मार्ग",
    live: "टीमने आत्ताच उत्तर दिले",
    rehearsed: "तयार परिस्थिती · नमुना डेटा",
  },
};

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
  return {
    ...base,
    score: Math.round(r.risk.score),
    category: r.risk.category,
    factors: factors.length ? factors : base.factors,
    ran,
    official: r.risk.official_warning,
    window: r.risk.window ?? undefined,
  };
}

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function prefersStill(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
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

function Buoy({ x, y, n, pct, lead = false, order = 0 }: { x: number; y: number; n: number; pct: number; lead?: boolean; order?: number }) {
  const r = lead ? 14 : 10.5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="hero-pop" style={i(order)}>
        {lead && <circle className="svg-ping stroke-risk-low" r={r} fill="none" strokeWidth="2" />}
        <g className="svg-bob" style={{ animationDelay: `${order * 0.7}s` }}>
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
        <text
          x={lead ? -(r + 7) : r + 6}
          y="4"
          textAnchor={lead ? "end" : "start"}
          className="sounding fill-risk-low"
          fontSize={lead ? 13 : 11}
        >
          {pct}%
        </text>
      </g>
    </g>
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
  const [live, setLive] = useState<Partial<Record<SceneId, Poster>>>({});
  const [seaOn, setSeaOn] = useState(false);
  const tabRefs = useRef<Partial<Record<SceneId, HTMLButtonElement | null>>>({});

  // The sea is decoration: let the sheet paint first, then bring it in.
  useEffect(() => {
    if (prefersStill()) return;
    const id = window.setTimeout(() => setSeaOn(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  // Ask the real pipeline the same question; fold its answer into the poster.
  useEffect(() => {
    if (live[scene]) return;
    let alive = true;
    api
      .ask({ message: POSTERS[scene].ask, sessionId: `hero-${scene}` })
      .then((r) => {
        if (!alive || r.mode !== "DEMO") return;
        setLive((m) => ({ ...m, [scene]: fromResponse(POSTERS[scene], r) }));
      })
      .catch(() => {
        /* the poster already says everything; it stays labelled as rehearsed */
      });
    return () => {
      alive = false;
    };
  }, [scene, live]);

  const p = live[scene] ?? POSTERS[scene];
  const isLive = !!live[scene];
  const ranCount = CREW.filter((a) => p.ran[a] != null).length;
  const top = Math.max(...p.factors.map((f) => f.points), 1);

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
    <figure className="hero-chart chart-sheet m-0 !p-0" aria-label={t.sheet}>
      {/* `key` replays the entrance for each question; the base styles are the finished sheet. */}
      <div key={`${scene}-${run}`} id="hero-sheet" role="tabpanel" aria-labelledby={`hero-tab-${scene}`}>
        {/* 1 · the question */}
        <div className="relative z-[2] px-5 pb-3 pt-5">
          <div className="label flex items-baseline justify-between gap-3">
            <span>
              {t.asks} · {p.place}
            </span>
            <span className="normal-case tracking-normal text-ink-400">
              {p.askLang === "mr" ? "मराठी" : p.askLang === "hi" ? "हिंदी" : "English"}
            </span>
          </div>
          <p
            lang={p.askLang}
            className={`hero-type mt-1.5 font-display text-[19px] font-semibold leading-snug text-ink-900 ${
              p.askLang === "en" ? "italic" : ""
            }`}
          >
            “{p.ask}”
          </p>
        </div>

        {/* 2 · the crew */}
        <div className="relative z-[2] border-t px-5 py-2.5" style={{ borderColor: "var(--rule-faint)" }}>
          <div className="label flex items-baseline justify-between gap-3">
            <span>{t.crew}</span>
            <span className="normal-case tracking-normal text-ink-400">
              {t.crewRan(ranCount)} · {isLive ? t.live : t.rehearsed}
            </span>
          </div>
          <ul className="mt-2 grid grid-cols-5 gap-x-2 gap-y-1.5">
            {CREW.map((a, n) => {
              const ms = p.ran[a];
              const ran = ms != null;
              return (
                <li
                  key={a}
                  className={`hero-tick flex items-center gap-1 font-mono text-[10.5px] font-semibold ${
                    ran ? "text-ink-800" : "text-ink-400"
                  }`}
                  style={i(n)}
                  title={ran ? undefined : t.idle}
                >
                  {ran ? (
                    <CheckGlyph size={11} className="shrink-0 text-risk-low" />
                  ) : (
                    <span aria-hidden className="inline-block w-[11px] shrink-0 text-center">
                      ·
                    </span>
                  )}
                  <span className={`truncate ${ran ? "" : "line-through decoration-ink-300"}`}>{a}</span>
                  {ran && ms > 0 && <span className="ml-auto tabular-nums text-chart-700">{ms} ms</span>}
                  {!ran && <span className="sr-only">— {t.idle}</span>}
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
            <defs>
              <mask id="hero-course-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                <path d={COURSE} pathLength={1} className="hero-draw" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" />
              </mask>
              <mask id="hero-track-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                <path d={STORM_TRACK} pathLength={1} className="hero-draw" stroke="white" strokeWidth="9" fill="none" />
              </mask>
            </defs>

            {/* the coast */}
            <path d={p.land} className="fill-paper-200 stroke-ink-500" strokeWidth="1.2" />
            <path d={p.land} className="stroke-chart-500" strokeWidth="5" fill="none" opacity="0.14" />

            {scene !== "cyclone" ? (
              <>
                <text x="520" y="150" textAnchor="middle" className="fill-ink-500 font-display italic" fontSize="13" letterSpacing="2.5">
                  MUMBAI
                </text>
                <text x="70" y="52" className="sounding fill-chart-500" fontSize="11" opacity="0.7">44</text>
                <text x="330" y="300" className="sounding fill-chart-500" fontSize="11" opacity="0.7">27</text>
                <text x="60" y="296" className="sounding fill-chart-500" fontSize="11" opacity="0.7">61</text>
              </>
            ) : (
              <>
                <text x="118" y="70" textAnchor="middle" className="fill-ink-500 font-display italic" fontSize="13" letterSpacing="2.5">
                  PARADIP
                </text>
                <text x="250" y="300" className="sounding fill-chart-500" fontSize="11" opacity="0.7">38</text>
                <text x="548" y="70" className="sounding fill-chart-500" fontSize="11" opacity="0.7">72</text>
              </>
            )}

            {scene === "route" && (
              <>
                {/* the areas the direct track would cross */}
                <g className="hero-pop hero-pop--scene" style={i(0)}>
                  <polygon points="246,186 350,178 358,250 254,258" fill="url(#hatch-critical)" className="stroke-risk-extreme" strokeWidth="1.3" strokeDasharray="7 4" />
                  <text x="302" y="222" textAnchor="middle" className="fill-risk-extreme font-mono font-bold uppercase" fontSize="8" letterSpacing="1.2">
                    {t.naval}
                  </text>
                </g>
                <g className="hero-pop hero-pop--scene" style={i(1)}>
                  <polygon points="376,202 424,198 428,220 380,226" fill="url(#hatch-warning)" className="stroke-risk-high" strokeWidth="1.1" strokeDasharray="6 4" />
                </g>
                {/* the direct track: shorter, and wrong */}
                <line x1="436" y1="198" x2="148" y2="252" className="stroke-ink-400" strokeWidth="1.5" strokeDasharray="2 6" opacity="0.75" />
                <text x="196" y="282" className="fill-ink-500 font-mono" fontSize="8.5" letterSpacing="0.6">
                  {t.direct} · 31.0 km
                </text>
                {/* the answer: it plots itself, then keeps running */}
                <g mask="url(#hero-course-mask)">
                  <path d={COURSE} className="route-live stroke-risk-low" strokeWidth="3" strokeDasharray="11 8" strokeLinecap="round" fill="none" />
                </g>
                <g className="hero-pop" style={i(1)}>
                  <text x="268" y="136" className="fill-risk-low font-mono font-bold uppercase" fontSize="9" letterSpacing="1">
                    {t.safest} · 36.4 km
                  </text>
                </g>
                <Buoy x={240} y={78} n={2} pct={74} order={2} />
                <Buoy x={112} y={150} n={3} pct={72} order={3} />
                <Buoy x={148} y={252} n={1} pct={77} lead />
              </>
            )}

            {scene === "danger" && (
              <>
                {/* the whole inshore sea is under the advisory */}
                <g className="hero-pop hero-pop--scene" style={i(0)}>
                  <path
                    d="M18 18 H436 C428 44 452 72 440 104 C432 130 446 160 436 190 C428 216 442 250 432 282 C428 296 434 306 432 312 H18 Z"
                    fill="url(#hatch-warning)"
                    className="stroke-risk-high"
                    strokeWidth="1.3"
                    strokeDasharray="8 5"
                  />
                </g>
                <g className="hero-pop hero-pop--scene" style={i(1)}>
                  <rect x="84" y="118" width="232" height="50" rx="2" className="fill-paper-50 stroke-risk-high" strokeWidth="1.4" />
                  <text x="200" y="139" textAnchor="middle" className="fill-risk-high font-mono font-bold uppercase" fontSize="10" letterSpacing="1.4">
                    {t.imd}
                  </text>
                  <text x="200" y="156" textAnchor="middle" className="fill-ink-700 font-mono" fontSize="9.5" letterSpacing="0.8">
                    1.9 m · 29 km/h SW · {t.until} 11:00
                  </text>
                </g>
                {/* heavy sea-surface marks */}
                {[
                  [60, 70], [150, 230], [300, 60], [250, 270], [360, 210], [90, 280], [372, 96],
                ].map(([x, y], n) => (
                  <path key={n} d={`M${x} ${y} q6 -6 12 0 t12 0 t12 0`} className="stroke-chart-600" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
                ))}
                <Buoy x={148} y={252} n={1} pct={77} order={2} />
              </>
            )}

            {scene === "cyclone" && (
              <>
                <g className="hero-pop hero-pop--scene" style={i(0)}>
                  <circle cx="420" cy="214" r="104" fill="url(#hatch-critical)" className="stroke-risk-extreme" strokeWidth="1.5" strokeDasharray="8 5" />
                </g>
                <g mask="url(#hero-track-mask)">
                  <path d={STORM_TRACK} className="stroke-risk-extreme" strokeWidth="2" strokeDasharray="3 6" fill="none" strokeLinecap="round" />
                </g>
                <g className="hero-pop" style={i(0)}>
                  <circle cx="318" cy="142" r="4" className="fill-paper-50 stroke-risk-extreme" strokeWidth="1.6" />
                  <text x="328" y="134" className="fill-risk-extreme font-mono font-bold" fontSize="9" letterSpacing="0.8">
                    +24 h · {t.track}
                  </text>
                </g>
                <g transform="translate(420 214)">
                  <g className="hero-pop hero-pop--scene" style={i(1)}>
                    <g className="storm-spin" style={{ transformBox: "fill-box" }}>
                      <path d="M0 -23 A 23 23 0 0 1 23 0" className="stroke-risk-extreme" strokeWidth="6" strokeLinecap="round" fill="none" />
                      <path d="M0 23 A 23 23 0 0 1 -23 0" className="stroke-risk-extreme" strokeWidth="6" strokeLinecap="round" fill="none" />
                      <circle r="10.5" className="fill-risk-extreme" />
                      <circle r="4" className="fill-paper-50" />
                    </g>
                  </g>
                </g>
                <g className="hero-pop hero-pop--scene" style={i(2)}>
                  <rect x="372" y="262" width="204" height="40" rx="2" className="fill-paper-50 stroke-risk-extreme" strokeWidth="1.4" />
                  <text x="474" y="279" textAnchor="middle" className="fill-risk-extreme font-mono font-bold uppercase" fontSize="9.5" letterSpacing="1.2">
                    {t.storm}
                  </text>
                  <text x="474" y="294" textAnchor="middle" className="fill-ink-700 font-mono" fontSize="9" letterSpacing="0.8">
                    5.7 m · 93 km/h
                  </text>
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
        </div>

        {/* 4 · the verdict, stamped, with its reasons */}
        <div className="relative z-[2] grid grid-cols-[auto_1fr] items-center gap-5 px-5 pb-4 pt-4">
          <div
            className={`hero-stamp stamp !px-3.5 !py-2 text-center ${RISK_TEXT[p.category]}`}
            aria-label={`${t.verdict[p.category]} — ${p.score}/100`}
          >
            <div className="flex items-baseline justify-center gap-1 leading-none">
              <span className="sounding text-[40px] tracking-normal">{p.score}</span>
              <span className="font-mono text-[10px] font-bold tracking-normal opacity-80">/100</span>
            </div>
            <div className="mt-1 whitespace-nowrap text-[11.5px] leading-tight">{t.verdict[p.category]}</div>
          </div>

          <div className="min-w-0">
            <div className="label hero-rise" style={i(0)}>
              {t.why}
            </div>
            <ul className="mt-1.5 space-y-1">
              {p.factors.map((f, n) => (
                <li key={f.key} className="grid grid-cols-[3.2rem_1fr] items-center gap-2 text-[11.5px] leading-tight text-ink-700">
                  <span className="hero-rise text-right font-mono font-bold tabular-nums text-ink-900" style={i(n)}>
                    +{f.points.toFixed(1)}
                  </span>
                  <span className="relative block min-w-0">
                    <span className="hero-rise block truncate" style={i(n)}>
                      {t.factor[f.key]}
                    </span>
                    <span className="mt-0.5 block h-[3px] rounded-[1px] bg-paper-200">
                      <span
                        className={`hero-bar block h-full rounded-[1px] ${RISK_BG[p.category]}`}
                        style={{ ...i(n), width: `${Math.max(8, (f.points / top) * 100)}%` }}
                      />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {(p.official || p.window) && (
              <p className="hero-rise mt-2 text-[11px] font-semibold leading-snug text-risk-extreme" style={i(3)}>
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

      {/* the three rehearsed questions */}
      <figcaption
        className="relative z-[2] flex flex-wrap items-center gap-x-3 gap-y-2 border-t px-5 py-3"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <div role="tablist" aria-label={t.tabsLabel} className="flex gap-1.5" onKeyDown={onTabKey}>
          {SCENES.map((id) => {
            const on = id === scene;
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
                className={`hero-tab rounded-[2px] border px-2.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] ${
                  on ? "border-ink-900 bg-ink-900 text-paper-50" : "text-ink-700"
                }`}
                style={on ? undefined : { borderColor: "var(--rule)" }}
              >
                {t.tabs[id]}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onAsk(p.ask)}
          className="group ml-auto inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-chart-700 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
        >
          {t.askReal}
          <CourseArrow size={12} className="transition-transform group-hover:translate-x-1" />
        </button>
      </figcaption>
    </figure>
  );
}
