import { lazy, useId, useLayoutEffect, useRef, type ReactNode } from "react";
import type { Language } from "../../types";
import { EffectSlot } from "../../effects/EffectSlot";
import { BANDS } from "../../i18n/bands";
import { L10N } from "../../i18n/landing";
import { LABEL } from "../../i18n/agentTrace";
import { VERDICT } from "../../i18n/riskCard";
import { CREW } from "../../crew";
import { chart, ink, paper, risk } from "../../tokens";
import { CourseArrow, PlayGlyph, WarnGlyph } from "../glyphs";
import { STORM_ARM_WIDTH, STORM_ARMS, STORM_BOX, STORM_EYE } from "./storm";
import { swellPaths, threadPaths, WAKE_HALF, wakePaths } from "./nightPaths";

/**
 * The sea at night: full-bleed ink interludes between the landing's paper
 * sections, and one paper section printed with a halftone sea.
 *
 * Each band is a finished design with every effect off. Its ground and its
 * art are CSS gradients and inline SVG (the poster); on a wide window with a
 * mouse the slots (effects/EffectSlot.tsx, effects/gate.ts) lay a live canvas
 * over the art and step the art back once the canvas has really drawn.
 * At most two WebGL effects per band. Landing only: never the console, never
 * the phone (the phone app does not import this module).
 */

const GradientWaves = lazy(() => import("../../effects/GradientWaves"));
const GlowCursor = lazy(() => import("../../effects/GlowCursor"));
const ParticleWord = lazy(() => import("../../effects/ParticleText"));
const SideRays = lazy(() => import("../../effects/SideRays"));
const ElectricLogo = lazy(() => import("../../effects/ElectricLogo"));
const WebThreads = lazy(() => import("../../effects/WebThreads"));
const Strands = lazy(() => import("../../effects/Strands"));
const PatternWaves = lazy(() => import("../../effects/PatternWaves"));

type Enter = (tab: "home" | "ask" | "authority" | "system") => void;

/**
 * A band breaks out of the landing's 1240 px column to the window's edges.
 * `100vw` counts the scrollbar, so the scrollbar's width is measured and
 * given back (otherwise a band would push the page sideways by that much).
 */
function useBleed() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const bar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      el.style.setProperty("--nb-bar", `${bar}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return ref;
}

function Band({
  name,
  tone,
  labelledBy,
  className = "",
  children,
}: {
  name: string;
  tone: "ink" | "paper";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useBleed();
  return (
    <section
      ref={ref}
      data-band={name}
      aria-labelledby={labelledBy}
      className={`night-band ${tone === "ink" ? "night-band--ink" : "night-band--paper"} ${className}`}
    >
      {children}
    </section>
  );
}

function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-label font-bold uppercase tracking-[0.16em] ${className}`}>{children}</p>
  );
}

/* ------------------------------------------------------------------ posters */

/**
 * The word where the motes will gather, printed as a screen of paper dots
 * (SVG text filled with a dot pattern), so the finished poster already reads
 * as plankton rather than as a second, louder headline.
 */
function WordPoster() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="nb-fade absolute inset-0 h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <pattern id={`${id}-motes`} width="3.2" height="3.2" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.05" fill={paper[50]} />
        </pattern>
      </defs>
      <text
        x="200"
        y="98"
        textAnchor="middle"
        className="font-display"
        fontSize="112"
        fontWeight="900"
        fill={`url(#${id}-motes)`}
        {...{ translate: "no" }}
      >
        ORCA
      </text>
    </svg>
  );
}

const SWELL_W = 1000;
const SWELL_H = 400;
const SWELL = swellPaths(SWELL_W, SWELL_H);

/** The sea, frozen: engraved swell lines under a band of haze at the horizon. */
function SeaPoster() {
  return (
    <div className="nb-poster nb-fade" aria-hidden>
      <svg className="nb-sea nb-sea-poster" viewBox={`0 0 ${SWELL_W} ${SWELL_H}`} preserveAspectRatio="none" fill="none">
        {SWELL.map(({ d, depth }) => (
          <path
            key={d}
            d={d}
            stroke={chart[300]}
            strokeOpacity={0.1 + 0.32 * depth}
            strokeWidth={0.8 + 0.9 * depth}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}

function StormPoster() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="nb-fade absolute inset-0 m-auto h-[62%] w-[62%]" viewBox={`0 0 ${STORM_BOX} ${STORM_BOX}`} fill="none" aria-hidden>
      <defs>
        <filter id={`${id}-halo`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      {/* the warning glow, then the symbol drawn in paper over it */}
      <g stroke={risk.extreme} filter={`url(#${id}-halo)`} opacity="0.7">
        {STORM_ARMS.map((d) => (
          <path key={d} d={d} strokeWidth={STORM_ARM_WIDTH + 1} strokeLinecap="round" />
        ))}
        <circle cx="32" cy="32" r={STORM_EYE.r} strokeWidth={STORM_EYE.width + 1} />
      </g>
      {/* the outline the live effect traces: each arm stroked wide in paper,
          then its body knocked back out in the band's ink */}
      <g strokeLinecap="round">
        {STORM_ARMS.map((d) => (
          <path key={d} d={d} stroke={paper[50]} strokeWidth={STORM_ARM_WIDTH + 0.6} />
        ))}
        {STORM_ARMS.map((d) => (
          <path key={`${d}-in`} d={d} stroke={ink[900]} strokeWidth={STORM_ARM_WIDTH - 0.6} />
        ))}
      </g>
      <g stroke={paper[50]} strokeWidth="0.6">
        <circle cx="32" cy="32" r={STORM_EYE.r + STORM_EYE.width / 2} />
        <circle cx="32" cy="32" r={STORM_EYE.r - STORM_EYE.width / 2} />
      </g>
    </svg>
  );
}

const THREADS_W = 1000;
const THREADS_H = 240;
const THREAD_D = threadPaths(THREADS_W, THREADS_H);

function ThreadsPoster() {
  return (
    <svg
      className="nb-fade absolute inset-0 h-full w-full"
      viewBox={`0 0 ${THREADS_W} ${THREADS_H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {THREAD_D.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i < THREAD_D.length / 2 ? chart[500] : chart[300]}
          strokeOpacity="0.7"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

const WAKE_D = wakePaths();

function WakePoster() {
  return (
    <svg
      className="nb-fade absolute inset-0 h-full w-full"
      viewBox={`${-WAKE_HALF} -0.5 ${WAKE_HALF * 2} 1`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
    >
      {WAKE_D.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={[chart[700], chart[500], chart[300]][i % 3]}
          strokeOpacity="0.75"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------- bands */

/**
 * Night watch. The swell rolls toward a hazy horizon under the copy; "ORCA"
 * gathers out of drifting motes; inside this band only, the pointer leaves
 * a plankton-light trail. Two WebGL contexts (waves, trail) and one 2D.
 */
export function NightWatchBand({ language }: { language: Language }) {
  const t = (BANDS[language] ?? BANDS.en).watch;
  const id = useId();
  return (
    <Band name="watch" tone="ink" labelledBy={`${id}-t`} className="nb-watch">
      <EffectSlot
        name="gradientwaves"
        Effect={GradientWaves}
        className="nb-layer nb-slot"
        effectClassName="nb-sea"
        poster={<SeaPoster />}
      />
      <EffectSlot name="glowcursor" Effect={GlowCursor} className="nb-layer nb-slot" poster={null} />
      <div className="nb-inner relative grid gap-x-12 gap-y-8 pb-56 pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:pb-64 lg:pt-24">
        <div>
          {/* chart-100, not the other bands' chart-300: the plankton trail
              can pass behind this line, and chart-300 would fall under 4.5:1 */}
          <Kicker className="text-chart-100">{t.kicker}</Kicker>
          <h2
            id={`${id}-t`}
            className="mt-4 max-w-[560px] font-display text-headline font-semibold leading-tight tracking-tight text-paper-50 lg:text-display"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-[500px] text-lead leading-relaxed text-chart-100">{t.body}</p>
        </div>
        <EffectSlot
          name="particletext"
          Effect={ParticleWord}
          className="nb-slot nb-word relative h-32 w-full lg:h-44"
          effectClassName="absolute inset-0"
          poster={<WordPoster />}
        />
      </div>
    </Band>
  );
}

/**
 * The halftone sea: a PAPER section. A lit swell printed as a screen of
 * chart-teal dots, faint where the statement sits, behind the promise that
 * every number on the chart names its source. One WebGL context.
 */
export function HalftoneSea({ language }: { language: Language }) {
  const t = (BANDS[language] ?? BANDS.en).halftone;
  const id = useId();
  return (
    <Band name="halftone" tone="paper" labelledBy={`${id}-t`} className="nb-halftone">
      <EffectSlot
        name="patternwaves"
        Effect={PatternWaves}
        className="nb-layer nb-slot"
        poster={<div className="nb-poster nb-poster-halftone nb-fade" aria-hidden />}
      />
      <div className="nb-inner relative flex flex-col items-center py-24 text-center">
        <Kicker className="text-chart-700">{t.kicker}</Kicker>
        <h2
          id={`${id}-t`}
          className="mt-4 max-w-[640px] font-display text-headline font-semibold leading-tight tracking-tight text-ink-900 lg:text-display"
        >
          {t.title}
        </h2>
        <p className="mt-5 max-w-[560px] text-lead leading-relaxed text-ink-700">{t.body}</p>
        <ul className="mt-7 flex flex-wrap justify-center gap-2" aria-label={t.kicker}>
          {t.sources.map((s) => (
            <li
              key={s}
              className="rounded-[2px] border bg-paper-50 px-2.5 py-1 font-mono text-label font-bold uppercase tracking-[0.12em] text-chart-700"
              style={{ borderColor: "var(--rule)" }}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}

/**
 * Official warnings override everything. Light falls from the band's corner
 * over the copy; the storm symbol burns as a living lightning outline in
 * warning red and paper. Two WebGL contexts (rays, storm).
 */
export function WarningBand({ language }: { language: Language }) {
  const t = (BANDS[language] ?? BANDS.en).warning;
  const verdict = (VERDICT[language] ?? VERDICT.en).HIGH;
  const id = useId();
  return (
    <Band name="warning" tone="ink" labelledBy={`${id}-t`} className="nb-warning">
      <EffectSlot
        name="siderays"
        Effect={SideRays}
        className="nb-layer nb-slot nb-rays"
        poster={<div className="nb-poster nb-poster-rays nb-fade" aria-hidden />}
      />
      <div className="nb-inner relative grid items-center gap-x-12 gap-y-10 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-24">
        <div>
          <Kicker className="flex items-center gap-2 text-chart-300">
            <WarnGlyph size={14} className="text-paper-50" />
            {t.kicker}
          </Kicker>
          <h2
            id={`${id}-t`}
            className="mt-4 max-w-[600px] font-display text-headline font-semibold leading-tight tracking-tight text-paper-50 lg:text-display"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-[540px] text-lead leading-relaxed text-chart-100">{t.body}</p>
          {/* the rule, as the chart would print it: who, what, the verdict */}
          <div className="nb-rule mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-label font-bold uppercase tracking-[0.12em]">
            <span className="text-paper-50">{t.authorities}</span>
            <span className="text-chart-300">{t.rule}</span>
            <CourseArrow size={13} className="text-chart-300" />
            <span className="nb-verdict">{verdict}</span>
          </div>
        </div>
        <EffectSlot
          name="electriclogo"
          Effect={ElectricLogo}
          className="nb-slot nb-storm relative mx-auto aspect-square w-full max-w-[360px]"
          effectClassName="absolute inset-0"
          poster={<StormPoster />}
        />
      </div>
    </Band>
  );
}

/**
 * Ten agents, one thread. Ten glowing threads, one per agent, loose under
 * their names and knotted at the right where the risk engine decides. One
 * WebGL context.
 */
export function ThreadsBand({ language }: { language: Language }) {
  const t = (BANDS[language] ?? BANDS.en).threads;
  const names = LABEL[language] ?? LABEL.en;
  const id = useId();
  return (
    <Band name="threads" tone="ink" labelledBy={`${id}-t`} className="nb-threads">
      <div className="nb-inner relative pt-20 lg:pt-24">
        <Kicker className="text-chart-300">{t.kicker}</Kicker>
        <h2
          id={`${id}-t`}
          className="mt-4 max-w-[600px] font-display text-headline font-semibold leading-tight tracking-tight text-paper-50 lg:text-display"
        >
          {t.title}
        </h2>
        <p className="mt-5 max-w-[540px] text-lead leading-relaxed text-chart-100">{t.body}</p>
        <ol className="nb-crew mt-10 flex flex-wrap gap-x-6 lg:justify-between gap-y-2 font-mono text-label font-bold uppercase tracking-[0.12em] text-chart-100">
          {CREW.map((agent, i) => (
            <li key={agent} className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="tabular-nums text-chart-300">{String(i + 1).padStart(2, "0")}</span>
              <span>{names[agent] ?? agent}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="nb-threads-field relative mt-4 h-48 lg:h-56">
        <EffectSlot
          name="webthreads"
          Effect={WebThreads}
          className="nb-layer nb-slot"
          poster={<ThreadsPoster />}
        />
      </div>
      <div className="nb-inner relative flex justify-end pb-16 lg:pb-20">
        <p className="flex items-center gap-2 font-mono text-label font-bold uppercase tracking-[0.12em] text-paper-50">
          <span className="nb-knot" aria-hidden />
          {t.decision}
        </p>
      </div>
    </Band>
  );
}

/**
 * The closing call: a short ink strip with a quiet wake braiding between the
 * line and the two ways in. One WebGL context.
 */
export function CallBand({
  language,
  onEnter,
  onTour,
}: {
  language: Language;
  onEnter: Enter;
  onTour: () => void;
}) {
  const t = (BANDS[language] ?? BANDS.en).call;
  const l = L10N[language] ?? L10N.en;
  const id = useId();
  return (
    <Band name="call" tone="ink" labelledBy={`${id}-t`} className="nb-call">
      <EffectSlot name="strands" Effect={Strands} className="nb-layer nb-slot" poster={<WakePoster />} />
      <div className="nb-inner relative flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <Kicker className="text-chart-300">{t.kicker}</Kicker>
          <h2 id={`${id}-t`} className="mt-2 font-display text-headline font-semibold leading-tight tracking-tight text-paper-50">
            {t.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`?tab=home&lang=${language}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              onEnter("home");
            }}
            className="nb-btn group"
          >
            {l.openOrca}
            <CourseArrow size={13} className="transition-transform group-hover:translate-x-1" />
          </a>
          <button type="button" onClick={onTour} className="nb-btn-line">
            <PlayGlyph size={11} /> {l.ctaTour}
          </button>
        </div>
      </div>
    </Band>
  );
}
