import { lazy, useEffect, useState, type ReactNode } from "react";
import * as api from "../api";
import type { Language } from "../types";
import { CompassMark, CourseArrow, FishGlyph, PhoneGlyph, PlayGlyph } from "./glyphs";
import { L10N } from "../i18n/landing";
import HeroChart from "./HeroChart";
import ReliefSection from "./ReliefSection";
import { EffectSlot } from "../effects/EffectSlot";
import GlassLoupe from "../effects/GlassLoupe";
import { countContexts } from "../effects/ledger";
import "../effects/sea.css";

// The effects are separate chunks, fetched only when a slot mounts them
// (effects/gate.ts decides whether this browser gets anything but the poster).
const SeaGradient = lazy(() => import("../effects/SeaGradient"));

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
 * state, so the end position — everything visible — is always reached; with
 * reduced motion the content simply starts there.
 */
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
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(16px)",
        transition: prefersStill()
          ? "none"
          : `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.2, 0.7, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Count-up with the same fail-safe as the risk dial: the number always lands. */
function useCountUp(target: number | null, ms = 1000): string {
  const [v, setV] = useState(0);
  const still = prefersStill();
  useEffect(() => {
    // Reduced motion: no count, the number is simply there (see the return).
    if (target == null || still) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / ms));
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const settle = window.setTimeout(() => setV(target), ms + 150);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [target, ms, still]);
  return target == null ? "—" : String(still ? target : v);
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

  useEffect(() => {
    let alive = true;
    api
      .authority()
      .then((d) => {
        if (!alive) return;
        setCentres(d.summary.monitored ?? null);
        setWarnings(d.summary.official_warnings ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const agentsN = useCountUp(10, 900);
  const centresN = useCountUp(centres, 1100);
  const warningsN = useCountUp(warnings, 1300);
  const langsN = useCountUp(3, 800);

  const cardTabs: ("home" | "ask" | "authority" | "system")[] = ["home", "ask", "authority", "system"];

  const stats = [
    { k: t.stats[0], v: agentsN },
    { k: t.stats[1], v: centresN },
    { k: t.stats[2], v: warningsN, warn: (warnings ?? 0) > 0 },
    { k: t.stats[3], v: langsN },
    { k: t.stats[4], v: mode },
  ];

  return (
    <main className="mx-auto flex min-h-full max-w-[1240px] flex-col px-5 py-5">
      {/* the <i> is the far swell layer (index.css): three layers, each on its own transform */}
      {/* the sea at the foot of the sheet: the CSS swell is the poster */}
      <EffectSlot
        name="sea"
        Effect={SeaGradient}
        eager
        effectClassName="sea-live"
        poster={
          <>
            <div className="sea-drift" aria-hidden>
              <i />
            </div>
            <div className="fish-drift" aria-hidden />
          </>
        }
      />

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
            SIH26176 · ISRO · Smart India Hackathon 2026
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
                className={`rounded-[2px] border px-2 py-1 font-mono text-label font-bold transition-colors ${
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

      {/* hero: the claim on the left, the product performing it on the right */}
      <div className="mt-9 grid items-center gap-x-12 gap-y-9 lg:mt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <Reveal delay={60}>
            <h1
              className="max-w-[520px] font-display text-hero font-semibold leading-[1.06] tracking-tight text-ink-900"
              style={{ textWrap: "balance" }}
            >
              {t.tag1}
              <br />
              {t.tag2a}
              <span className="text-chart-600">{t.tag2b}</span>
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
                <button onClick={() => onEnter("home")} className="btn-ink group !px-6 !py-3">
                  {t.openOrca}
                  <CourseArrow size={13} className="transition-transform group-hover:translate-x-1" />
                </button>
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
              className={`group px-4 py-3.5 transition-colors hover:bg-chart-100/40 ${i > 0 ? "border-l" : ""}`}
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <div className="label min-h-[2lh] !text-label leading-tight sm:min-h-0 lg:whitespace-nowrap">{x.k}</div>
              <div
                className={`mt-1 font-mono text-headline font-bold tabular-nums leading-none transition-colors ${
                  x.warn ? "text-risk-extreme" : "text-ink-900 group-hover:text-chart-600"
                }`}
              >
                {x.v}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <ReliefSection language={language} />

      {/* the index of sheets — four ways in, set like a chart catalogue */}
      <Reveal delay={420}>
        <nav aria-label={t.indexTitle} className="panel rule-double mt-5 overflow-hidden">
          <div className="hd">
            <span className="label">{t.indexTitle}</span>
          </div>
          <ul>
            {t.cards.map((c, i) => (
              <li key={cardTabs[i]} className={i > 0 ? "border-t" : ""} style={{ borderColor: "var(--rule-faint)" }}>
                <button
                  onClick={() => onEnter(cardTabs[i])}
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
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Reveal>

      {/* how it decides — the differentiator */}
      <Reveal delay={880}>
        <div className="panel mt-5 overflow-hidden">
          <div className="hd">
            <span className="label">{t.pipelineTitle}</span>
            <button
              onClick={() => onEnter("system")}
              className="font-mono text-label font-bold uppercase tracking-[0.1em] text-chart-600 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
            >
              {t.watchLive}
            </button>
          </div>
          <div className="grid sm:grid-cols-4">
            {t.phases.map((p, i) => (
              <div
                key={p.t}
                className={`group relative px-4 py-3.5 transition-colors hover:bg-chart-100/40 ${i > 0 ? "sm:border-l" : ""}`}
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
                    className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-ink-300 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-chart-600 sm:block"
                  />
                )}
              </div>
            ))}
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
