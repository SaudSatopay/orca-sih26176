import { lazy, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { Language } from "../../types";
import { SHOWCASE, type ShowcaseStrings } from "../../i18n/showcase";
import { EffectSlot } from "../../effects/EffectSlot";
import { requestedEffects } from "../../effects/gate";
import { PixelSwap } from "../../ui/reactbits/pixel-swap";
import { prefersReducedMotion } from "../../ui/cn";
import { PauseGlyph, PlayGlyph } from "../glyphs";
import { BULLETIN, PHONE_EDITION, SHEETS, ShowcaseContext, sheet, type Sheet } from "./sheets";
import "./showcase.css";

/*
 * The showcase: ORCA has no photography, so its pictures are ORCA itself:
 * real screenshots of its own sheets, and one illustrative printed bulletin.
 * Four sections, each a <section> with its own heading, each a finished
 * poster first. The three WebGL pieces mount through EffectSlot (one context
 * each, under the landing's cap) and step the poster back only once they are
 * drawing; the DOM pixel swap runs on its own, and under reduced motion
 * swaps at once and never advances by itself.
 */

// Each its own chunk, fetched only when its slot mounts it (effects/gate.ts).
const FlexCarousel = lazy(() => import("../../effects/FlexCarousel"));
const RippleDistortion = lazy(() => import("../../effects/RippleDistortion"));
const PaperCrumple = lazy(() => import("../../effects/PaperCrumple"));

const strings = (language: Language): ShowcaseStrings => SHOWCASE[language] ?? SHOWCASE.en;

/** A screenshot as an image: lazy, sized, from this origin, described. */
function Shot({ s, alt, className }: { s: Sheet; alt: string; className?: string }) {
  return (
    <img
      src={s.src}
      width={s.width}
      height={s.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}

/** The panel every showcase section sits on: a kicker in the header, a heading inside. */
function Panel({
  kicker,
  titleId,
  className = "",
  children,
}: {
  kicker: string;
  titleId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={titleId} className={`panel mt-5 overflow-hidden ${className}`}>
      <div className="hd">
        <span className="label">{kicker}</span>
      </div>
      {children}
    </section>
  );
}

function Title({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-headline font-semibold leading-tight tracking-tight text-ink-900"
      style={{ textWrap: "balance" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-[520px] text-body leading-relaxed text-ink-700" style={{ textWrap: "pretty" }}>
      {children}
    </p>
  );
}

/** Whether the page may move on its own: not under reduced motion, not with `?fx=none`. */
function mayMove(): boolean {
  if (prefersReducedMotion()) return false;
  const asked = typeof window !== "undefined" ? requestedEffects(window.location.search) : null;
  return asked == null || asked.length > 0;
}

/* ------------------------------------------------------------------ editions */

const SWAP_MS = 4000;

/**
 * "One ORCA, two editions": the console and the phone in one frame, swapped
 * pixel by pixel (React Bits PixelSwap). It advances every four seconds while
 * it is in view and the tab is visible; hovering or focusing a button shows
 * that edition and holds the timer back; Pause stops it.
 */
export function EditionsSwap({ language }: { language: Language }) {
  const t = strings(language);
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const [edition, setEdition] = useState<"console" | "phone">("console");
  const [paused, setPaused] = useState(false);
  // A pointer resting on a button, or focus inside the switch, holds the timer.
  const [holding, setHolding] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  // A manual choice restarts the four seconds.
  const [nudge, setNudge] = useState(0);
  const [moves] = useState(mayMove);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const running = moves && !paused && !holding && inView && tabVisible;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setEdition((e) => (e === "console" ? "phone" : "console")), SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [running, edition, nudge]);

  const show = useCallback((next: "console" | "phone") => {
    setEdition(next);
    setNudge((n) => n + 1);
  }, []);

  const consoleShot = sheet("today");
  const images = useMemo(
    () =>
      [
        { src: consoleShot.src, aspect: consoleShot.width / consoleShot.height },
        { src: PHONE_EDITION.src, aspect: PHONE_EDITION.width / PHONE_EDITION.height },
      ] as const,
    [consoleShot],
  );

  return (
    <section ref={ref} aria-labelledby={`${id}-title`} className="panel mt-5 overflow-hidden">
      <div className="hd">
        <span className="label">{t.editions.kicker}</span>
      </div>
      <div className="u5-split u5-split--editions">
        <div className="min-w-0 lg:pl-1">
          <Title id={`${id}-title`}>{t.editions.title}</Title>
          <Lead>{t.editions.lead}</Lead>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label={t.editions.switchLabel}
              className="flex gap-2"
              onMouseLeave={() => setHolding(false)}
              onBlur={() => setHolding(false)}
            >
              {(["console", "phone"] as const).map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-pressed={edition === e}
                  className={edition === e ? "btn-ink" : "btn-line"}
                  onMouseEnter={() => {
                    setHolding(true);
                    show(e);
                  }}
                  onFocus={() => {
                    setHolding(true);
                    show(e);
                  }}
                  onClick={() => show(e)}
                >
                  {e === "console" ? t.editions.console : t.editions.phone}
                </button>
              ))}
            </div>
            {moves && (
              <button type="button" className="btn-line" onClick={() => setPaused((p) => !p)}>
                {paused ? <PlayGlyph size={11} /> : <PauseGlyph size={11} />}
                {paused ? t.editions.play : t.editions.pause}
              </button>
            )}
          </div>
        </div>

        <div className="u5-frame">
          <PixelSwap
            active={edition === "phone"}
            className="u5-16x10"
            pixelSize={56}
            pattern="diagonal"
            randomness={0.35}
            images={images}
            firstContent={<Shot s={consoleShot} alt={t.sheets.today.alt} className="u5-cover" />}
            secondContent={
              <img
                src={PHONE_EDITION.src}
                width={PHONE_EDITION.width}
                height={PHONE_EDITION.height}
                alt={t.editions.phoneAlt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="u5-cover"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ flow */

/**
 * The sheets as one flowing row (React Bits FlexCarousel, WebGL). The poster
 * is the same row as a scrollable strip with every image, alt text and
 * caption; it stays in the document under the running row and comes back to
 * the front when the keyboard enters it.
 */
export function SheetsFlow({ language }: { language: Language }) {
  const t = strings(language);
  const id = useId();
  const ctx = useMemo(() => ({ language, crumpled: false, setCrumpled: () => {} }), [language]);

  return (
    <Panel kicker={t.flow.kicker} titleId={`${id}-title`}>
      <div className="u5-head">
        <Title id={`${id}-title`}>{t.flow.title}</Title>
        <Lead>{t.flow.lead}</Lead>
      </div>
      <ShowcaseContext.Provider value={ctx}>
        <EffectSlot
          name="sheets"
          Effect={FlexCarousel}
          className="u5-flow relative mt-2"
          effectClassName="u5-flow-live absolute inset-0"
          poster={
            <div role="region" aria-label={t.flow.strip} tabIndex={0} className="u5-flow-strip">
              {SHEETS.map((s) => (
                <figure key={s.id} className="u5-flow-card">
                  <Shot s={s} alt={t.sheets[s.id].alt} className="u5-flow-shot" />
                  <figcaption className="label u5-caption">{t.sheets[s.id].caption}</figcaption>
                </figure>
              ))}
            </div>
          }
        />
      </ShowcaseContext.Provider>
    </Panel>
  );
}

/* ------------------------------------------------------------------ ripple */

/**
 * "The chart is the sea." Pointer-driven water over the Ask sheet (React Bits
 * RippleDistortion, WebGL). The poster is the sheet itself.
 */
export function ChartRipple({ language }: { language: Language }) {
  const t = strings(language);
  const id = useId();
  const ask = sheet("ask");

  return (
    <Panel kicker={t.ripple.kicker} titleId={`${id}-title`}>
      <figure className="u5-split u5-split--ripple">
        <div className="min-w-0 lg:pl-1">
          <Title id={`${id}-title`}>{t.ripple.title}</Title>
          <div className="wave-rule u5-ripple-rule" />
          <figcaption className="u5-ripple-caption text-body leading-relaxed text-ink-700">{t.ripple.caption}</figcaption>
        </div>
        <EffectSlot
          name="ripple"
          Effect={RippleDistortion}
          className="u5-ripple u5-frame u5-16x10"
          poster={<Shot s={ask} alt={t.sheets.ask.alt} className="u5-ripple-poster u5-cover" />}
        />
      </figure>
    </Panel>
  );
}

/* ------------------------------------------------------------------ crumple */

/**
 * "Bulletins are written for officers. ORCA rewrites them for the fisher."
 * The poster lays the bulletin beside ORCA's plain answer. When the paper is
 * live (React Bits PaperCrumple, three) it lies over the answer; pressing it,
 * or the button, crumples it into a ball and the answer is there underneath,
 * as real text in the reader's language.
 */
export function BulletinCrumple({ language }: { language: Language }) {
  const t = strings(language);
  const id = useId();
  const [crumpled, setCrumpled] = useState(false);
  const ctx = useMemo(() => ({ language, crumpled, setCrumpled }), [language, crumpled]);

  return (
    <Panel kicker={t.crumple.kicker} titleId={`${id}-title`} className="u5-crumple">
      <div className="u5-split u5-split--crumple">
        <div className="min-w-0 lg:pl-1">
          <Title id={`${id}-title`}>{t.crumple.title}</Title>
          <Lead>{t.crumple.lead}</Lead>
          <div className="u5-crumple-controls mt-5 flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              className="btn-line"
              aria-pressed={crumpled}
              onClick={() => setCrumpled((c) => !c)}
            >
              {crumpled ? t.crumple.smooth : t.crumple.crumple}
            </button>
            <span className="text-body text-ink-500">{t.crumple.hint}</span>
          </div>
        </div>

        <ShowcaseContext.Provider value={ctx}>
          <EffectSlot
            name="crumple"
            Effect={PaperCrumple}
            className="u5-stage relative"
            effectClassName="u5-stage-live absolute inset-0"
            poster={
              <div className="u5-stage-poster">
                <figure className="u5-bulletin">
                  <img
                    src={BULLETIN.src}
                    width={BULLETIN.width}
                    height={BULLETIN.height}
                    alt={t.crumple.bulletinAlt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption className="label mt-2">{t.crumple.officers}</figcaption>
                </figure>
                <div className="u5-answer">
                  <div className="label u5-fisher">{t.crumple.fisher}</div>
                  <div className="mt-3">
                    <span className="stamp text-risk-extreme">{t.crumple.verdict}</span>
                  </div>
                  <p className="mt-4 font-display text-title font-semibold leading-snug text-ink-900">
                    {t.crumple.answer}
                  </p>
                  <p className="mt-3 border-t pt-2 text-body text-ink-500" style={{ borderColor: "var(--rule-faint)" }}>
                    {t.crumple.footnote}
                  </p>
                </div>
              </div>
            }
          />
        </ShowcaseContext.Provider>
      </div>
    </Panel>
  );
}
