import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import * as api from "../api";
import type { AuthorityRow, Language, RiskCategory } from "../types";
import { CompassMark, CourseArrow, FishGlyph, PhoneGlyph, PlayGlyph, WarnGlyph } from "./glyphs";
import { BRAND_RING, L10N } from "../i18n/landing";
import { HERO } from "../i18n/hero";
import { LABEL as AGENT } from "../i18n/agentTrace";
import { PHASES } from "../crew";
import { RISK_COLOR } from "../risk";
import { chart } from "../tokens";
import { Marquee } from "../ui/magicui/marquee";
import type { AnimatedBeamProps } from "../ui/magicui/animated-beam";
import DecryptedText from "../ui/reactbits/decrypted-text";
import SpotlightCard from "../ui/reactbits/spotlight-card";
import CircularText from "../ui/reactbits/circular-text";
import HeroChart from "./HeroChart";
import ReliefSection from "./ReliefSection";
import GlassLoupe from "../effects/GlassLoupe";
import { InkMark } from "../effects/InkWordmark";
import { EffectSlot } from "../effects/EffectSlot";
import "../effects/ground.css";
import InkCartouche from "../effects/InkWordmark";
import { countContexts } from "../effects/ledger";

// The living ground is its own chunk, mounted only when the gate allows it.
const GroundSwell = lazy(() => import("../effects/GroundSwell"));

// The kit pieces that ride on `motion` (spring values, in-view watching, the
// beams' moving gradients) load as their own chunk after the first paint, so
// the page's first script stays as small as it was. Each has a still
// stand-in, and a chunk that fails to load leaves the stand-in in place.
const NumberTicker = lazy(() =>
  import("../ui/magicui/number-ticker")
    .then((m) => ({ default: m.NumberTicker }))
    .catch(() => ({ default: ({ value }: { value: number }) => <>{value}</> })),
);
const AnimatedBeam = lazy<ComponentType<AnimatedBeamProps>>(() =>
  import("../ui/magicui/animated-beam")
    .then((m) => ({ default: m.AnimatedBeam }))
    .catch(() => ({ default: () => null })),
);
const Highlighter = lazy(() =>
  import("../ui/magicui/highlighter")
    .then((m) => ({ default: m.Highlighter }))
    .catch(() => ({
      default: ({ children }: { children: ReactNode }) => (
        <span className="relative inline-block bg-transparent">{children}</span>
      ),
    })),
);

// With ?fxdebug=1 the page counts the WebGL contexts it opens (effects/ledger.ts).
countContexts();

/** Honour the OS "reduce motion" setting — those users get the finished page. */
function prefersStill(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Entrance choreography with a projector fail-safe: visibility is driven by
 * STATE + CSS transitions, never by keyframes with fill-mode. If rAF is
 * suspended (hidden tab, non-compositing output) the timeout still flips the
 * state, so the end position is always reached; with reduced motion the
 * content simply starts there.
 *
 * Transform ONLY, by doctrine and by measurement: the h1 inside the first
 * Reveal is the page's LCP element, and fading it from opacity 0 put 99.7%
 * of its LCP time into render delay on a 4x-throttled trace. Everything is
 * readable from the first frame; the rise is the entrance. Delays are capped
 * so nothing below the fold waits on a stagger.
 */
const REVEAL_MAX_DELAY = 220;

function Reveal({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const [on, setOn] = useState(prefersStill);
  useEffect(() => {
    if (on) return;
    const raf = requestAnimationFrame(() => setOn(true));
    const settle = window.setTimeout(() => setOn(true), 500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={className}
      style={{
        transform: on ? "none" : "translateY(10px)",
        transition: prefersStill()
          ? "none"
          : `transform 0.26s var(--ease-out) ${Math.min(delay, REVEAL_MAX_DELAY)}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A live figure on the stats strip: Magic UI's Number Ticker (kit), which
 * springs up from zero the first time the strip is on screen and writes each
 * frame straight to its own text node (no React render per frame). A dash
 * until the board answers; the full number at once under reduced motion.
 */
function Count({ to, delay = 0 }: { to: number | null; delay?: number }) {
  if (to == null) return <>—</>;
  // Until the ticker's chunk arrives, print exactly its first frame.
  const first = (
    <span className="lining inline-block tabular-nums">{prefersStill() ? to : 0}</span>
  );
  return (
    <Suspense fallback={first}>
      <NumberTicker value={to} delay={delay} />
    </Suspense>
  );
}

/**
 * When the masthead kicker starts decoding: once the claim has painted, so
 * the decode's frames never compete with the page's largest paint.
 */
const KICKER_DECODE_MS = 900;

/** When the hand-drawn mark goes down under the teal word: after the hero has settled. */
const MARK_AFTER_MS = 1100;

/**
 * The teal word in the claim, underlined by hand in chart teal (Magic UI's
 * Highlighter, kit, drawing with rough-notation) once the hero has settled.
 * The word is plain text from the first frame: the stand-in is the very box
 * the Highlighter renders, so swapping one for the other moves nothing.
 */
function MarkedWord({ children }: { children: ReactNode }) {
  const [drawn, setDrawn] = useState(prefersStill);
  useEffect(() => {
    if (drawn) return;
    const id = window.setTimeout(() => setDrawn(true), MARK_AFTER_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const word = <span className="relative inline-block bg-transparent">{children}</span>;
  return (
    <span data-mark={drawn ? "drawn" : "waiting"}>
      {drawn ? (
        <Suspense fallback={word}>
          <Highlighter action="underline" color={chart[500]} strokeWidth={2} animationDuration={800} iterations={2} padding={1}>
            {children}
          </Highlighter>
        </Suspense>
      ) : (
        word
      )}
    </span>
  );
}

/** One phase of the pipeline as a node on the diagram. */
function PhaseNode({
  n,
  title,
  note,
  nodeRef,
}: {
  n: number;
  title: string;
  note: string;
  nodeRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={nodeRef}
      className="relative z-[1] rounded-[2px] border bg-paper-50 px-3 py-2.5 shadow-sheet"
      style={{ borderColor: "var(--rule)" }}
    >
      <span className="block font-mono text-label font-bold text-chart-700">0{n}</span>
      <span className="mt-0.5 block font-display text-lead font-bold leading-tight text-ink-900">{title}</span>
      <span className="mt-1 block text-label italic leading-snug text-ink-500">{note}</span>
    </div>
  );
}

/**
 * The signal's timing: every leg takes the same lap, and each leg starts a
 * beat after the one before, so the light visibly runs Understand → Gather →
 * the five → Decide → Explain and starts again.
 */
const LAP = 3.2;
const BEAT = 0.8;
const LEGS = 4;
const leg = (n: number) => ({
  duration: LAP,
  delay: n * BEAT,
  repeatDelay: LEGS * BEAT - LAP + BEAT,
  pathWidth: 2,
  pathOpacity: 0.45,
  gradientStartColor: chart[600],
  gradientStopColor: chart[500],
});

/**
 * How ORCA decides, drawn as the graph it runs: Understand, then Gather
 * fanning out to the five specialists at once, then Decide and Explain. The
 * joins are Magic UI's Animated Beam (kit): a dashed resting course with a
 * teal light travelling it.
 *
 * Each leg is drawn in its own lane: a grid cell spanning the node the leg
 * leaves and the gap after it. The kit measures its light in percent of the
 * container it is given, and eases out hard, so in a lane the light dashes
 * through (hidden behind) the node it leaves and then runs slowly along the
 * visible gap into the next one, which is the part worth watching. The lane
 * also clips the line at the next node's edge.
 *
 * The beams load with the other motion-backed pieces after first paint; the
 * diagram reads without them. Wide screens only: below `md` the stacked grid
 * stands in.
 */
function PipelineLive({ language }: { language: Language }) {
  const t = L10N[language] ?? L10N.en;
  const crewName = AGENT[language] ?? AGENT.en;
  const gather = PHASES.find((p) => p.key === "gather")!.agents;
  const understand = useRef<HTMLDivElement>(null);
  const gatherNode = useRef<HTMLDivElement>(null);
  const decide = useRef<HTMLDivElement>(null);
  const explain = useRef<HTMLDivElement>(null);
  const laneA = useRef<HTMLDivElement>(null);
  const laneB = useRef<HTMLDivElement>(null);
  const laneC = useRef<HTMLDivElement>(null);
  const laneD = useRef<HTMLDivElement>(null);
  const c0 = useRef<HTMLSpanElement>(null);
  const c1 = useRef<HTMLSpanElement>(null);
  const c2 = useRef<HTMLSpanElement>(null);
  const c3 = useRef<HTMLSpanElement>(null);
  const c4 = useRef<HTMLSpanElement>(null);
  // The beams' chunk (motion) is fetched only as the diagram nears the
  // viewport, never during the first paint, and never where the diagram is
  // not shown at all (below md it is display: none and never intersects).
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || near || typeof IntersectionObserver !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setNear(true);
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  const lane = "pointer-events-none relative row-start-1 self-stretch";
  const chip = (i: number, ref: RefObject<HTMLSpanElement>) => {
    const name = crewName[gather[i]] ?? gather[i];
    return (
      <span
        ref={ref}
        data-specialist={name}
        className="relative z-[1] inline-flex items-center gap-1.5 whitespace-nowrap rounded-[2px] border bg-paper-50 px-2 py-1 font-mono text-label font-semibold text-ink-800"
        style={{ borderColor: "var(--rule)" }}
      >
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-chart-500" />
        {name}
      </span>
    );
  };

  return (
    <div ref={root} className="pipeline-live hidden grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)_4rem_auto_4rem_minmax(0,1fr)_4rem_minmax(0,1fr)] items-center px-6 py-6 md:grid">
      {/* the lanes the legs are drawn in, under the nodes */}
      <div ref={laneA} aria-hidden className={`${lane} col-span-2 col-start-1`}>
        {near && (<Suspense fallback={null}>
          <AnimatedBeam containerRef={laneA} fromRef={understand} toRef={gatherNode} {...leg(0)} />
        </Suspense>)}
      </div>
      <div ref={laneB} aria-hidden className={`${lane} col-span-2 col-start-3`}>
        {near && (<Suspense fallback={null}>
          <AnimatedBeam containerRef={laneB} fromRef={gatherNode} toRef={c0} {...leg(1)} />
          <AnimatedBeam containerRef={laneB} fromRef={gatherNode} toRef={c1} {...leg(1)} />
          <AnimatedBeam containerRef={laneB} fromRef={gatherNode} toRef={c2} {...leg(1)} />
          <AnimatedBeam containerRef={laneB} fromRef={gatherNode} toRef={c3} {...leg(1)} />
          <AnimatedBeam containerRef={laneB} fromRef={gatherNode} toRef={c4} {...leg(1)} />
        </Suspense>)}
      </div>
      <div ref={laneC} aria-hidden className={`${lane} col-span-2 col-start-5`}>
        {near && (<Suspense fallback={null}>
          <AnimatedBeam containerRef={laneC} fromRef={c0} toRef={decide} {...leg(2)} />
          <AnimatedBeam containerRef={laneC} fromRef={c1} toRef={decide} {...leg(2)} />
          <AnimatedBeam containerRef={laneC} fromRef={c2} toRef={decide} {...leg(2)} />
          <AnimatedBeam containerRef={laneC} fromRef={c3} toRef={decide} {...leg(2)} />
          <AnimatedBeam containerRef={laneC} fromRef={c4} toRef={decide} {...leg(2)} />
        </Suspense>)}
      </div>
      <div ref={laneD} aria-hidden className={`${lane} col-span-2 col-start-7`}>
        {near && (<Suspense fallback={null}>
          <AnimatedBeam containerRef={laneD} fromRef={decide} toRef={explain} {...leg(3)} />
        </Suspense>)}
      </div>

      <div className="col-start-1 row-start-1">
        <PhaseNode n={1} title={t.phases[0].t} note={t.phases[0].n} nodeRef={understand} />
      </div>
      <div className="col-start-3 row-start-1">
        <PhaseNode n={2} title={t.phases[1].t} note={t.phases[1].n} nodeRef={gatherNode} />
      </div>
      <div className="col-start-5 row-start-1 flex flex-col items-start gap-1.5">
        <span className="label mb-0.5 !text-chart-700">{t.fanNote}</span>
        {chip(0, c0)}
        {chip(1, c1)}
        {chip(2, c2)}
        {chip(3, c3)}
        {chip(4, c4)}
      </div>
      <div className="col-start-7 row-start-1">
        <PhaseNode n={3} title={t.phases[2].t} note={t.phases[2].n} nodeRef={decide} />
      </div>
      <div className="col-start-9 row-start-1">
        <PhaseNode n={4} title={t.phases[3].t} note={t.phases[3].n} nodeRef={explain} />
      </div>
    </div>
  );
}

/** A band word as text: the ink of its hue that holds 4.5:1 on paper (tokens.ts). */
const BAND_INK: Record<RiskCategory, string> = {
  LOW: "text-risk-low",
  MODERATE: "text-risk-moderate",
  HIGH: "text-risk-high",
  EXTREME: "text-risk-extreme",
};

/**
 * The coast, right now: every landing centre the authority board scores,
 * running past under the masthead like a harbour's notice board. Each centre
 * is its band as a square, its name, its score and its band word, with the
 * warning mark when an official warning is up. The moving copies are
 * decoration; a screen reader hears one sentence for the whole coast. Under
 * reduced motion the centres stand still in a wrapped row.
 */
function CoastTicker({ rows, language }: { rows: AuthorityRow[]; language: Language }) {
  const t = L10N[language] ?? L10N.en;
  const band = (HERO[language] ?? HERO.en).band;
  const still = prefersStill();
  const said = t.coastSr(
    rows.length,
    rows
      .map(
        (r) =>
          `${r.name} ${Math.round(r.risk_score)} ${band[r.risk_category]}${r.official_warning ? `, ${t.warnWord}` : ""}`,
      )
      .join("; "),
  );
  const centres = rows.map((r) => (
    <span
      key={r.name}
      data-centre
      className="inline-flex items-center gap-2 whitespace-nowrap border-l pl-4 font-mono text-label uppercase tracking-[0.08em]"
      style={{ borderColor: "var(--rule-faint)" }}
    >
      <span aria-hidden className="h-2 w-2 shrink-0" style={{ background: RISK_COLOR[r.risk_category] }} />
      <span className="font-semibold text-ink-900">{r.name}</span>
      <span className="lining font-bold text-ink-900">{Math.round(r.risk_score)}</span>
      <span className={`font-semibold ${BAND_INK[r.risk_category]}`}>{band[r.risk_category]}</span>
      {r.official_warning && <WarnGlyph size={13} className="shrink-0 text-risk-extreme" />}
    </span>
  ));
  return (
    <section
      className="coast-ticker flex min-h-9 items-stretch border-y"
      style={{ borderColor: "var(--rule)" }}
      aria-label={t.coastLabel}
    >
      <span
        aria-hidden
        className="label flex shrink-0 items-center gap-2 border-r pl-1.5 pr-4 !text-chart-700"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <span className="pulse-dot bg-chart-500 text-chart-500" />
        {t.coastLabel}
      </span>
      {still ? (
        <div aria-hidden className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5 py-2 pl-4">
          {centres}
        </div>
      ) : (
        <div aria-hidden className="coast-ticker-run min-w-0 flex-1 overflow-hidden">
          <Marquee
            pauseOnHover
            repeat={2}
            className="h-full items-center"
            style={{ "--duration": `${Math.max(40, rows.length * 7)}s`, "--gap": "1rem" } as CSSProperties}
          >
            {centres}
          </Marquee>
        </div>
      )}
      <p className="sr-only">{said}</p>
    </section>
  );
}

/**
 * The front door — the chart sheet before you step aboard.
 *
 * One screen that says what ORCA is (ten agents, one safe, explainable
 * decision), proves it is alive (live coastline stats, a running course),
 * and hands the judge three doors in.
 */
export default function Landing({
  mode,
  language = "en",
  onLanguage,
  onEnter,
  onTour,
  onScenario,
}: {
  mode: string;
  language?: Language;
  onLanguage: (lang: Language) => void;
  onEnter: (tab: "home" | "ask" | "authority" | "system") => void;
  onTour: () => void;
  onScenario: (ask: string) => void;
}) {
  const t = L10N[language] ?? L10N.en;
  const [centres, setCentres] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<number | null>(null);
  const [coast, setCoast] = useState<AuthorityRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .authority()
      .then((d) => {
        if (!alive) return;
        setCentres(d.summary.monitored ?? null);
        setWarnings(d.summary.official_warnings ?? null);
        setCoast(Array.isArray(d.locations) && d.locations.length ? d.locations : null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const cardTabs: ("home" | "ask" | "authority" | "system")[] = ["home", "ask", "authority", "system"];

  const stats: { k: string; v: ReactNode; warn?: boolean }[] = [
    { k: t.stats[0], v: "10" },
    { k: t.stats[1], v: <Count to={centres} /> },
    { k: t.stats[2], v: <Count to={warnings} delay={0.15} />, warn: (warnings ?? 0) > 0 },
    { k: t.stats[3], v: "3" },
    { k: t.stats[4], v: mode },
  ];

  return (
    <main tabIndex={-1} className="mx-auto flex min-h-full max-w-[1240px] flex-col px-5 py-5">
      {/* the ground stays with the viewport, so the page never ends in a seam */}
      <div className="sheet-ground" aria-hidden />
      {/* the living ground: the sheet's contours breathing (poster: the page as it is) */}
      <EffectSlot
        name="ground"
        Effect={GroundSwell}
        eager
        className="ground-slot"
        effectClassName="ground-live"
        poster={null}
      />
      {/* the sea at the foot of the sheet; the <i> is the far swell layer
          (index.css): three layers, each on its own transform */}
      <div className="sea-drift" aria-hidden>
        <i />
      </div>
      <div className="fish-drift" aria-hidden />

      {/* top strip: the mark and its name, the phone edition, the language */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-2.5">
            <CompassMark size={34} className="text-ink-900" />
            <span className="font-display text-numeral font-black leading-none tracking-tight text-ink-900">
              ORCA
            </span>
          </span>
          <span className="font-mono text-label font-bold uppercase tracking-[0.2em] text-chart-700">
            {/* read off the chart as the page opens (React Bits DecryptedText) */}
            <DecryptedText
              text="SIH26176 · ISRO · Smart India Hackathon 2026"
              animateOn="mount"
              speed={30}
              delay={KICKER_DECODE_MS}
              encryptedClassName="text-chart-500"
            />
          </span>
          {/* full reload on purpose: phone vs console is decided at boot */}
          <a
            href={`/?m=1&lang=${language}`}
            className="ml-auto inline-flex items-center gap-2 font-mono text-label font-semibold uppercase tracking-[0.1em] text-chart-700 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
          >
            <PhoneGlyph size={14} /> {t.ctaPhone}
          </a>
          <span className="flex gap-1" role="group" aria-label={t.languageLabel}>
            {(["en", "hi", "mr"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onLanguage(l)}
                aria-pressed={language === l}
                lang={l}
                className={`press min-h-7 rounded-[2px] border px-2.5 py-1 font-mono text-label font-bold transition-colors ${
                  language === l
                    ? "border-ink-900 bg-ink-900 text-paper-50"
                    : "text-ink-500 hover:text-ink-900"
                }`}
                style={language === l ? undefined : { borderColor: "var(--rule)" }}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिं" : "मरा"}
              </button>
            ))}
          </span>
        </div>
      </Reveal>

      {/* the coast, right now: the slot keeps its height from the first frame,
          so the hero never moves when the board arrives; while the board is
          loading, or if it fails, the slot is simply empty */}
      <div className="mt-4 min-h-9">{coast && <CoastTicker rows={coast} language={language} />}</div>

      {/* hero: the claim on the left, the product performing it on the right */}
      <div className="mt-6 grid items-center gap-x-12 gap-y-9 lg:mt-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <Reveal delay={60}>
            {/* the wordmark in wet ink leads the hero — the same mark as the
                closing cartouche, at full size, poster-first */}
            <InkMark className="ink-word-hero" />
            <h1
              className="max-w-[520px] font-display text-hero font-semibold leading-[1.06] tracking-tight text-ink-900"
              style={{ textWrap: "balance" }}
            >
              {t.tag1}
              <br />
              {t.tag2a}
              <span className="text-chart-600">
                <MarkedWord>{t.tag2b}</MarkedWord>
              </span>
              {t.tag2c}
            </h1>
            <div className="wave-rule mt-6 max-w-[360px]" />
            <p
              className="mt-6 max-w-[470px] text-lead leading-relaxed text-ink-500"
              style={{ textWrap: "pretty" }}
            >
              {t.sub}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <GlassLoupe id="open">
                <a
                  href={`?tab=home&lang=${language}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    onEnter("home");
                  }}
                  className="btn-ink group !px-6 !py-3"
                >
                  {t.openOrca}
                  <CourseArrow size={13} className="transition-transform group-hover:translate-x-1" />
                </a>
              </GlassLoupe>
              <button onClick={onTour} className="btn-line !px-5 !py-3">
                <PlayGlyph size={11} /> {t.ctaTour}
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <HeroChart language={language} onAsk={onScenario} />
        </Reveal>
      </div>

      {/* live stats strip */}
      <Reveal delay={420}>
        <div className="panel mt-14 grid grid-cols-2 sm:grid-cols-5">
          {stats.map((x, i) => (
            <div
              key={x.k}
              className={`px-4 py-3.5 ${i > 0 ? "border-l" : ""}`}
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <div className="label min-h-[2lh] leading-tight sm:min-h-0 lg:whitespace-nowrap">{x.k}</div>
              <div
                className={`mt-1 font-mono text-headline font-bold tabular-nums leading-none ${
                  x.warn ? "text-risk-extreme" : "text-ink-900"
                }`}
              >
                {x.v}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* a reading lamp over the relief sheet under a fine pointer (React Bits SpotlightCard) */}
      <SpotlightCard className="mt-5 rounded-[3px] [&>section]:mt-0">
        <ReliefSection language={language} />
      </SpotlightCard>

      {/* the index of sheets — four ways in, set like a chart catalogue */}
      <Reveal delay={420}>
        <nav aria-label={t.indexTitle} className="panel rule-double mt-5 overflow-hidden">
          <div className="hd">
            <span className="label">
              <DecryptedText text={t.indexTitle} speed={45} encryptedClassName="text-chart-500" />
            </span>
          </div>
          <ul>
            {t.cards.map((c, i) => (
              <li key={cardTabs[i]} className={i > 0 ? "border-t" : ""} style={{ borderColor: "var(--rule-faint)" }}>
                {/* a reading lamp follows a fine pointer along the row (React Bits SpotlightCard) */}
                <SpotlightCard>
                <a
                  href={`?tab=${cardTabs[i]}&lang=${language}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    onEnter(cardTabs[i]);
                  }}
                  className="sheet-row group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-2 px-4 py-4 text-left md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] md:items-center"
                >
                  {/* the sheet number rides in the label, above the title: one column, never beside it */}
                  <span className="min-w-0">
                    <span className="label flex items-center gap-2">
                      <span className="text-chart-700">
                        {t.sheetWord} {i + 1}
                      </span>
                      <span aria-hidden>·</span>
                      {c.kicker}
                      {i === 0 && <FishGlyph size={15} className="swim text-chart-500" />}
                    </span>
                    <span className="mt-1.5 block font-display text-title font-bold leading-snug text-ink-900">
                      {c.title}
                    </span>
                  </span>
                  <span className="col-span-2 row-start-2 min-w-0 text-body leading-relaxed text-ink-700 md:col-span-1 md:col-start-2 md:row-start-1">
                    {c.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                  <span className="col-start-2 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-label font-bold uppercase tracking-[0.1em] text-chart-700 md:col-start-3">
                    {t.openWord}
                    <CourseArrow size={13} className="sheet-row-arrow" />
                  </span>
                </a>
                </SpotlightCard>
              </li>
            ))}
          </ul>
        </nav>
      </Reveal>

      {/* how it decides — the differentiator */}
      <Reveal delay={880}>
        <div className="panel mt-5 overflow-hidden">
          <div className="hd">
            <span className="label">
              <DecryptedText text={t.pipelineTitle} speed={45} encryptedClassName="text-chart-500" />
            </span>
            <a
              href={`?tab=system&lang=${language}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                onEnter("system");
              }}
              className="font-mono text-label font-bold uppercase tracking-[0.1em] text-chart-600 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
            >
              {t.watchLive}
            </a>
          </div>
          <PipelineLive language={language} />
          <div className="pipeline-stacked grid sm:grid-cols-4 md:hidden">
            {t.phases.map((p, i) => (
              <div
                key={p.t}
                className={`relative px-4 py-3.5 ${i > 0 ? "sm:border-l" : ""}`}
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lead font-bold text-ink-900">{p.t}</span>
                  {i === 1 && (
                    <span className="font-mono text-label font-bold text-chart-700">∥ 5</span>
                  )}
                </div>
                <p className="mt-1 text-label italic leading-snug text-ink-500">{p.n}</p>
                {i < 3 && (
                  <CourseArrow
                    size={13}
                    className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-ink-300 sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* the closing cartouche — the folio's title block, wet ink behind the gate */}
      <Reveal delay={940}>
        <div className="relative">
          <InkCartouche language={language} />
          {/* the compass rose of the title block: the brand line lettered round
              a compass, turning once every forty seconds (React Bits
              CircularText); beside the mark on wide sheets, under it below lg */}
          <div className="brand-ring mx-auto mt-8 w-fit lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
            <CircularText
              text={BRAND_RING}
              spinDuration={40}
              size={176}
              letterClassName="font-mono text-label font-semibold leading-none text-ink-500"
            >
              <CompassMark size={60} className="text-ink-900" />
            </CircularText>
          </div>
        </div>
      </Reveal>

      {/* footer */}
      <Reveal delay={980}>
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2 pb-4">
          <span className="font-mono text-label uppercase tracking-[0.14em] text-ink-400">
            {t.footer}
          </span>
          <a
            href="https://github.com/SaudSatopay/orca-sih26176"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-label uppercase tracking-[0.14em] text-chart-600 transition-colors hover:text-ink-900"
          >
            github.com/SaudSatopay/orca-sih26176
          </a>
        </div>
      </Reveal>
    </main>
  );
}
