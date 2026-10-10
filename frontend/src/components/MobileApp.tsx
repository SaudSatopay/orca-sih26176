import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import * as api from "../api";
import type { ChatResponse, FishingOutlook, Language, RiskCategory, ZoneFeature } from "../types";
import ErrorBoundary from "./ErrorBoundary";
import {
  BoatGlyph,
  ChartDefs,
  CheckGlyph,
  CompassMark,
  CourseArrow,
  CrosshairGlyph,
  FishGlyph,
  MapGlyph,
  MicGlyph,
  SpeakerGlyph,
  StopGlyph,
  WarnGlyph,
} from "./glyphs";
import { initialLanguage, readBootParams } from "../boot";
import { ERRORS } from "../i18n/errors";
import {
  ASK_EXAMPLES,
  CATEGORY,
  clockLabel,
  LANGUAGE_MARK,
  LANGUAGE_NAME,
  parseClock,
  readAnswer,
  returnLabel,
  sentences,
  T,
  type MobileStrings,
} from "../i18n/mobile";
import { INSTRUCTION, VERDICT } from "../i18n/riskCard";
import { waveM, windKmh } from "../format";
import { PORTS } from "../ports";
import { RATING_COLOR, RATING_INK, RISK_BANDS, RISK_COLOR, RISK_INK } from "../risk";
import {
  askInput,
  getRecognition,
  listenOnce,
  listenProblem,
  SPEECH_LOCALE,
  speechRecognitionSupported,
  speechSynthesisSupported,
  type ListenProblem,
  type ListenSession,
} from "../speech";
import { alpha, ink, paper } from "../tokens";
import "./mobile.css";
import { tripIsOff } from "./todayModel";
import { locationAlreadyAllowed } from "../locate";

// `/?debug=1`: an on-screen list of over-wide elements, for layout checks.
const LayoutProbe = lazy(() => import("./LayoutProbe"));

/** One frozen empty list for the chart props with no reading yet (R1). */
const NONE: never[] = [];
const DEBUG_LAYOUT = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");

/**
 * The phone — ORCA for the fisher himself, many of whom read little.
 *
 * Design rules, in order:
 *   1. Zero taps to the verdict: open → GPS → the stamped dial.
 *   2. One tap to HEAR everything (browsers demand one gesture before TTS,
 *      so the speaker button is the biggest control on screen).
 *   3. Everything important is a symbol, a colour or a large numeral;
 *      words are short and secondary.
 *   4. Three destinations, never deeper: Today · Map · Ask (by voice).
 *
 * The app is a fixed shell (header, one scrolling pane, tab bar) sized to the
 * visible viewport, so nothing sits under the browser chrome, the notch or the
 * home indicator. The platform rules live in mobile.css.
 */

type MTab = "today" | "map" | "ask";
type Place = { lat: number; lon: number; name: string };
/** Where the position came from, or why there is none. */
/** "resting": a position could be read, and nobody has asked for it yet. */
type Geo = "pinned" | "checking" | "resting" | "asking" | "found" | "denied" | "unavailable" | "chosen";
type SheetKind = "harbour" | "language";

const TABS: MTab[] = ["today", "map", "ask"];
const LANGUAGES: Language[] = ["en", "hi", "mr"];
const SESSION = "phone";
const HOME = PORTS[0];
const HOME_PLACE: Place = { lat: HOME.lat, lon: HOME.lon, name: HOME.name };
const GEO_OPTIONS: PositionOptions = { enableHighAccuracy: true, timeout: 7000, maximumAge: 300_000 };

// The map (and Leaflet with it) is its own chunk: Today never pays for it.
const loadMap = () => import("./MarineMap");
const MarineMap = lazy(loadMap);

// A ground row's swipe drawer (DOM + Motion, its stylesheet and its words) is
// its own chunk too, fetched on the first touch of a row: the rows render
// plain and are upgraded in place.
const loadSwipeRow = () =>
  Promise.all([import("../ui/reactbits/swipe-row"), import("../i18n/swipe")]).then(([row, words]) => ({
    Row: row.SwipeRow,
    words: words.SWIPE,
  }));
type SwipeKit = Awaited<ReturnType<typeof loadSwipeRow>>;

/**
 * The reading whose entrance has played. A tab change remounts the verdict and
 * must not replay it; another harbour, or another verdict, is news.
 */
let entranceShownFor: string | null = null;

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

/** Keeps a clock time on one line: "संध्याकाळी 7" never leaves its 7 behind. */
const unbroken = (text: string) => text.replace(/ /g, String.fromCharCode(0xa0));

/** "Last reading: Mumbai, 3:43 PM" — what stays on screen when the crew is out of reach. */
function lastReadingNote(reading: FishingOutlook, language: Language): string {
  const at = parseClock(reading.generated_at);
  return fill(T[language].lastReading, {
    p: reading.location.nearest_landing_centre,
    t: at ? clockLabel(language, at.hour, at.minute) : "",
  });
}

const speciesLine = (names: string[] | undefined, joiner: string) =>
  (names ?? []).map((s) => s.split(" (")[0]).join(joiner);

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : true;
}

/** The ring can be followed: motion is wanted, the page is being painted, the engine can say what is animating. */
const canFollow = () =>
  !prefersReducedMotion() &&
  document.visibilityState === "visible" &&
  typeof requestAnimationFrame === "function" &&
  typeof Element.prototype.getAnimations === "function";

/**
 * The numeral follows the ring. While the ring's own draw is running, the
 * numeral is read off the arc, so the two share one clock. When nothing is
 * drawing (no entrance, reduced motion, a tab that is not painting, an engine
 * without getAnimations) the numeral is the score, and a timer settles it
 * whatever happens.
 */
function useRingCount(target: number, play: boolean, root: RefObject<HTMLElement>): number {
  // Opens on 0 only when the ring is about to draw; otherwise the score is simply there.
  const [value, setValue] = useState(() => (play && canFollow() ? 0 : target));
  useEffect(() => {
    if (!play) return;
    // Whatever happens below, the score is on screen within a second.
    const settle = window.setTimeout(() => setValue(target), 1000);
    if (!canFollow()) return () => window.clearTimeout(settle);
    const arc = root.current?.querySelector<SVGCircleElement>(".m-ring-arc");
    const draw = arc?.getAnimations().find((a) => (a as CSSAnimation).animationName === "m-ring-draw");
    const length = parseFloat(arc?.getAttribute("stroke-dasharray") ?? "");
    let frame = 0;
    const follow = () => {
      // Nothing is drawing, or the draw is over: the numeral is the score.
      if (!arc || !draw || !(length > 0) || draw.playState === "finished" || draw.playState === "idle") {
        setValue(target);
        return;
      }
      const drawn = 1 - parseFloat(getComputedStyle(arc).strokeDashoffset) / length;
      setValue(Math.max(0, Math.min(target, Math.round(drawn * 100))));
      frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [target, play, root]);
  return play ? value : target;
}

/* ------------------------------------------------------------------ dial */

/** The arc from 12 o'clock through `part` of the circle, for the dashed ring. */
function arcPath(r: number, part: number): string {
  const p = Math.max(0.001, Math.min(0.9999, part));
  const a = p * 2 * Math.PI - Math.PI / 2;
  const x = 60 + r * Math.cos(a);
  const y = 60 + r * Math.sin(a);
  return `M 60 ${60 - r} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${x} ${y}`;
}

/** The risk dial: a ring drawn to the score, with the band edges ticked. */
function Ring({
  score,
  color,
  size,
  stroke = 9,
  dashed = false,
  children,
}: {
  score: number;
  color: string;
  size: number;
  stroke?: number;
  /** A kept, old reading: the arc draws dashed, like unsurveyed data (PT6). */
  dashed?: boolean;
  children: ReactNode;
}) {
  const r = 59 - stroke / 2;
  const length = 2 * Math.PI * r;
  const part = Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className="m-ring" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <circle cx="60" cy="60" r={r} fill={paper[50]} stroke={alpha(color, 0.2)} strokeWidth={stroke} />
        {dashed ? (
          <path
            d={arcPath(r, part)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray="3 4"
          />
        ) : (
          <circle
            className="m-ring-arc"
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={length}
            strokeDashoffset={length * (1 - part)}
            style={{ "--m-ring-length": length } as CSSProperties}
          />
        )}
        {/* where one band ends and the next begins, as on the console's dial */}
        {RISK_BANDS.slice(0, -1).map((b) => {
          const a = (b.max / 100) * 2 * Math.PI;
          const [sin, cos] = [Math.sin(a), Math.cos(a)];
          return (
            <line
              key={b.category}
              x1={60 + (r - stroke / 2) * sin}
              y1={60 - (r - stroke / 2) * cos}
              x2={60 + (r + stroke / 2) * sin}
              y2={60 - (r + stroke / 2) * cos}
              stroke={paper[50]}
              strokeWidth="1.6"
            />
          );
        })}
      </svg>
      <div className="m-ring-face">{children}</div>
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} aria-hidden>
      <path d="M1.5 3.5 L5 7 L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** LISTEN, and STOP while it is reading: the same button, so it is always cancellable. */
function ListenButton({
  t,
  speaking,
  canSpeak,
  onToggle,
  compact = false,
}: {
  t: MobileStrings;
  speaking: boolean;
  canSpeak: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!canSpeak}
      aria-pressed={speaking}
      className={`m-press m-btn-ink flex w-full items-center justify-center gap-3 rounded-[3px] px-4 font-mono font-bold uppercase tracking-[0.14em] ${
        compact ? "min-h-[48px] text-lead" : "min-h-[56px] text-title"
      }`}
    >
      {canSpeak ? (
        <>
          {speaking ? <StopGlyph size={compact ? 16 : 20} /> : <SpeakerGlyph size={compact ? 20 : 24} />}
          {speaking ? t.stop : t.listen}
        </>
      ) : (
        <span className="text-body normal-case tracking-normal">{t.noVoiceOut}</span>
      )}
    </button>
  );
}

/** Calm, plain, with the one useful action. */
function OfflineNotice({
  language,
  body,
  note,
  onRetry,
}: {
  language: Language;
  body: string;
  /** What is still on screen, and from when. */
  note?: string;
  onRetry: () => void;
}) {
  const e = ERRORS[language];
  return (
    <div role="alert" className="panel-tint m-rise flex items-start gap-3 px-3.5 py-3">
      <WarnGlyph size={20} className="mt-0.5 shrink-0 text-risk-high" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lead font-bold leading-snug text-ink-900">{e.offlineTitle}</p>
        <p className="mt-1 text-body leading-relaxed text-ink-700">{body}</p>
        {note && <p className="mt-1.5 font-mono text-label text-ink-500">{note}</p>}
        <button
          type="button"
          onClick={onRetry}
          className="m-press m-btn-line mt-2.5 min-h-[44px] rounded-[2px] px-4 font-mono text-body font-bold uppercase tracking-[0.1em]"
        >
          {e.retry}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- sheet */

/**
 * A bottom sheet rising from the tab bar: a short list of choices within the
 * thumb's reach. Modal: focus moves in, Tab stays in, Escape and the scrim
 * close it, and focus returns to the control that opened it.
 */
function Sheet({
  title,
  closeLabel,
  onClose,
  children,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: (close: () => void) => ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  // A double tap on the opener lands its second tap on the scrim and would
  // close the sheet mid-entrance: the scrim answers only once the sheet is in.
  const openedAt = useRef(0);

  // Leaves the way it came: the sheet slides back down, then unmounts.
  const close = useCallback(() => {
    if (prefersReducedMotion()) onClose();
    else setClosing(true);
  }, [onClose]);
  useEffect(() => {
    if (!closing) return;
    const id = window.setTimeout(onClose, 170);
    return () => window.clearTimeout(id);
  }, [closing, onClose]);

  useEffect(() => {
    openedAt.current = performance.now();
    const opener = document.activeElement as HTMLElement | null;
    const sheet = ref.current;
    (sheet?.querySelector<HTMLElement>("[data-current='true']") ?? sheet)?.focus();
    return () => opener?.focus?.();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab" || !ref.current) return;
    const stops = [...ref.current.querySelectorAll<HTMLElement>("button:not(:disabled)")];
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      <div
        className="m-scrim"
        data-closing={closing}
        onClick={() => {
          if (performance.now() - openedAt.current > 300) close();
        }}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-closing={closing}
        className="m-sheet outline-none"
        onKeyDown={onKeyDown}
      >
        <div
          className="flex items-center justify-between gap-3 border-b py-1.5 pl-4 pr-1.5"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          <h2 id={titleId} className="label !text-label !text-ink-700">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            className="m-press min-h-[44px] rounded-[2px] px-3 font-mono text-body font-bold uppercase tracking-[0.1em] text-ink-700"
          >
            {closeLabel}
          </button>
        </div>
        <div className="m-sheet-list">{children(close)}</div>
      </div>
    </>
  );
}

function SheetRow({
  current,
  onPick,
  lang,
  icon,
  title,
  detail,
}: {
  current: boolean;
  onPick: () => void;
  lang?: string;
  icon?: ReactNode;
  title: string;
  detail?: string;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-current={current ? "true" : undefined}
      data-current={current}
      lang={lang}
      className="m-row flex min-h-[56px] w-full items-center gap-3 border-b px-4 py-2 text-left"
      style={{ borderColor: "var(--rule-faint)" }}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-title font-bold leading-snug text-ink-900">{title}</span>
        {detail && <span className="block font-mono text-label text-ink-500">{detail}</span>}
      </span>
      {current && <CheckGlyph size={18} className="shrink-0 text-chart-600" />}
    </button>
  );
}

/* ------------------------------------------------------- drafted loading */

/** Today before the first reading: the sheet pencilled in, not a blank page. */
function TodayDraft({ label }: { label: string }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="panel rule-double px-4 pb-4 pt-3">
        <div className="flex items-center gap-2 font-mono text-label font-bold uppercase tracking-[0.14em] text-chart-700">
          <CompassMark size={18} className="text-chart-600" />
          {label}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <svg width="128" height="128" viewBox="0 0 120 120" fill="none" aria-hidden className="shrink-0">
            <circle
              className="m-draft-ring"
              cx="60"
              cy="60"
              r="54"
              stroke={ink[300]}
              strokeWidth="1.5"
              strokeDasharray="3 5"
            />
            <circle cx="60" cy="60" r="45" stroke={alpha(ink[300], 0.5)} strokeWidth="1" />
          </svg>
          <div className="flex-1 space-y-2.5">
            <div className="m-draft h-8 w-32" />
            <div className="m-draft h-4 w-40 max-w-full" />
            <div className="m-draft h-3 w-28" />
          </div>
        </div>
        <div className="m-draft mt-4 h-5 w-full" />
        <div className="m-draft mt-2 h-5 w-3/5" />
        <div className="m-draft mt-4 h-14 w-full" />
      </div>
      <div className="panel grid grid-cols-2 gap-3 p-3" aria-hidden>
        <div className="m-draft h-16" />
        <div className="m-draft h-16" />
      </div>
      <div className="panel space-y-3 p-3" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="m-draft h-12 w-12 shrink-0 !rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="m-draft h-4 w-20" />
              <div className="m-draft h-3 w-44 max-w-full" />
            </div>
            <div className="m-draft h-7 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** The chart before Leaflet arrives: sea, graticule and a neatline. */
function MapDraft({ label, height }: { label: string; height: number }) {
  return (
    <div className="chart-sheet" role="status" aria-live="polite">
      <div className="chart-frame m-draft-chart grid place-items-center" style={{ height }}>
        <div className="flex flex-col items-center gap-2 rounded-[2px] border border-ink-700/40 bg-paper-50/95 px-4 py-3">
          <CompassMark size={40} className="text-ink-800" />
          <span className="font-mono text-label font-bold uppercase tracking-[0.14em] text-ink-700">
            {label}
          </span>
        </div>
      </div>
      <div className="mt-2 h-3.5" />
    </div>
  );
}

/* ----------------------------------------------------------------- today */

function Verdict({
  outlook,
  language,
  t,
  updating,
  stale,
  speaking,
  canSpeak,
  onListen,
}: {
  outlook: FishingOutlook;
  language: Language;
  t: MobileStrings;
  updating: boolean;
  /** A kept reading after a failure: it must never look live (PT6). */
  stale: boolean;
  speaking: boolean;
  canSpeak: boolean;
  onListen: () => void;
}) {
  const { score, category, wave_height_m: wave, wind_speed_kmh: wind } = outlook.safety;
  const reading = `${outlook.location.nearest_landing_centre}:${category}:${score}`;
  // Decided at mount: a reading whose entrance has not played gets it.
  const [enter, setEnter] = useState(() => entranceShownFor !== reading);
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    entranceShownFor = reading;
    const id = window.setTimeout(() => setEnter(false), 1000);
    return () => window.clearTimeout(id);
    // Decided once per mount, like the entrance itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = RISK_COLOR[category];
  const printed = RISK_INK[category];
  const danger = category === "HIGH" || category === "EXTREME";
  const counted = useRingCount(score, enter && !stale, rootRef);
  const read = parseClock(outlook.generated_at);
  const readings = [
    wave != null && `${waveM(wave)} ${t.waves}`,
    wind != null && `${windKmh(wind)} ${t.wind}`,
  ].filter(Boolean);

  return (
    <section
      ref={rootRef}
      aria-labelledby="m-question"
      className={`panel rule-double bg-paper-50 ${enter && !stale ? "m-enter" : ""}`}
      // The band tint rides as an image over the panel's own paper, so the
      // page's rose and contours never show through the verdict (PT2).
      style={{
        backgroundImage: `linear-gradient(${alpha(color, 0.07)}, ${alpha(color, 0.07)})`,
      }}
    >
      <div className="flex items-baseline justify-between gap-3 px-4 pt-3">
        <h2 id="m-question" className="sounding text-title leading-tight text-ink-900">
          {t.question}
        </h2>
        {stale && read ? (
          /* an old reading is boxed and dashed, the chart's mark for unsurveyed data */
          <span className="shrink-0 self-center border border-dashed border-ink-700 bg-paper-50 px-1.5 py-0.5 font-mono text-label font-bold uppercase tracking-[0.08em] text-ink-800">
            {fill(t.oldAt, { t: clockLabel(language, read.hour, read.minute) })}
          </span>
        ) : (
          <span className="shrink-0 font-mono text-body text-ink-500">
            {updating
              ? t.updating
              : read && fill(t.asOf, { t: clockLabel(language, read.hour, read.minute) })}
          </span>
        )}
      </div>

      {/* the verdict — colour and symbol first, words second */}
      <div className="flex items-center gap-4 px-4 pt-3.5">
        <Ring score={score} color={color} size={128} dashed={stale}>
          <span style={{ color: printed }}>
            {danger ? <WarnGlyph size={26} /> : <BoatGlyph size={28} />}
          </span>
          <span
            className="lining font-display text-dial font-black leading-none"
            style={{ color: printed }}
          >
            {counted}
          </span>
          <span className="mt-0.5 font-mono text-label font-bold text-ink-500">/ 100</span>
        </Ring>
        <div className="min-w-0">
          {/* the stamp prints the verdict itself; the band word stands beside the ring (PT3, X1) */}
          <span className="m-stamp" style={{ color: printed }}>
            {VERDICT[language][category]}
          </span>
          <p className="mt-3 text-lead font-semibold leading-tight text-ink-900">
            {CATEGORY[language][category]}
          </p>
          {readings.length > 0 && (
            <p className="mt-1.5 font-mono text-body leading-relaxed text-ink-700">
              {readings.map((r) => (
                <span key={String(r)} className="block">
                  {r}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      <p className="px-4 pt-3.5 font-display text-title font-semibold leading-snug text-ink-900 [text-wrap:balance]">
        {/* a kept reading answers from the client's own tables, so the
            sentence follows a language switch even offline (PT6) */}
        {stale ? INSTRUCTION[language][category] : outlook.advice[0]}
      </p>

      {/* THE button — one tap, hear everything */}
      <div className="px-4 pb-4 pt-3.5">
        <ListenButton t={t} speaking={speaking} canSpeak={canSpeak} onToggle={onListen} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- ask */

/** The answer whose arrival has played: it rises and stamps once, not on every return to the tab. */
let answerShown: ChatResponse | null = null;

function AnswerCard({
  res,
  speaking,
  canSpeak,
  onListen,
}: {
  res: ChatResponse;
  speaking: boolean;
  canSpeak: boolean;
  onListen: () => void;
}) {
  const [arriving] = useState(() => answerShown !== res);
  useEffect(() => {
    answerShown = res;
  }, [res]);
  // The card speaks the answer's own language, whatever the app was set to.
  const language = res.language;
  const t = T[language] ?? T.en;
  const { headline, reasons } = readAnswer(res.answer);
  const risk = res.risk;
  const color = risk ? RISK_COLOR[risk.category] : ink[500];
  const printed = risk ? RISK_INK[risk.category] : ink[500];
  const why = reasons.length ? reasons : (risk?.factors ?? []).slice(0, 3).map((f) => f.detail);

  return (
    <article
      lang={language}
      className={`panel rule-double ${arriving ? "m-rise" : ""} w-full bg-paper-50`}
      // The band tint as an image over paper, never in place of it (PT2).
      style={
        risk
          ? { backgroundImage: `linear-gradient(${alpha(color, 0.07)}, ${alpha(color, 0.07)})` }
          : undefined
      }
    >
      {risk && (
        <div className="flex items-center gap-3.5 px-4 pt-4">
          <Ring score={risk.score} color={color} size={84} stroke={10}>
            <span
              className="lining font-display text-numeral font-black leading-none"
              style={{ color: printed }}
            >
              {Math.round(risk.score)}
            </span>
          </Ring>
          <div className="min-w-0">
            {/* the stamp prints the verdict; the band word stands beside the ring (PA2, X1) */}
            <span className="m-stamp" style={{ color: printed }}>
              {VERDICT[language][risk.category as RiskCategory]}
            </span>
            <p className="mt-2.5 text-lead font-semibold leading-tight text-ink-900">
              {CATEGORY[language][risk.category as RiskCategory]}
            </p>
          </div>
        </div>
      )}

      <p className="px-4 pt-3.5 font-display text-title font-semibold leading-snug text-ink-900 [text-wrap:balance]">
        {headline}
      </p>

      {risk?.official_warning && (
        <div className="mx-4 mt-3 rounded-[2px] border border-risk-extreme/60 px-3 py-2 hatch-danger">
          <p className="flex items-center gap-2 font-display text-lead font-bold text-risk-extreme">
            <WarnGlyph size={20} className="shrink-0" />
            {t.warnSpeak}
          </p>
          {/* the warning says what it warns about: its own headline (X1, PA2) */}
          {res.alerts?.[0]?.headline && (
            <p className="mt-1 text-body font-semibold leading-snug text-ink-900">
              {res.alerts[0].headline}
            </p>
          )}
        </div>
      )}

      <div className="px-4 pt-3.5">
        <ListenButton t={t} speaking={speaking} canSpeak={canSpeak} onToggle={onListen} compact />
      </div>

      {why.length > 0 && (
        <div className="mt-4 border-t px-4 pb-1 pt-3" style={{ borderColor: "var(--rule-faint)" }}>
          <h3 className="label">{t.why}</h3>
          <ul className="mt-1.5">
            {why.map((reason, i) => (
              <li
                key={reason}
                className="flex items-baseline gap-2.5 border-b py-2 text-lead leading-snug text-ink-800 last:border-b-0"
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <span className="sounding w-4 shrink-0 text-lead text-chart-700">{i + 1}</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p
        className="mt-3 border-t px-4 py-2.5 text-body leading-relaxed text-ink-700"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        {res.mode !== "LIVE" && <span className="block">{t.simulated}</span>}
        <span className="block">{res.disclaimer || t.advisory}</span>
      </p>
    </article>
  );
}

/* =================================================================== app */

export default function MobileApp() {
  const [language, setLanguage] = useState<Language>(() =>
    initialLanguage(window.location.search, navigator.languages),
  );
  const t = T[language] ?? T.en;

  const [tab, setTab] = useState<MTab>(() => {
    const tp = new URLSearchParams(window.location.search).get("tab");
    return tp === "map" || tp === "ask" ? tp : "today";
  });
  const [sheet, setSheet] = useState<SheetKind | null>(null);

  // ---- position ----
  const [pinned] = useState(() => readBootParams(window.location.search).at);
  const canLocate = typeof navigator !== "undefined" && "geolocation" in navigator;
  const [geo, setGeo] = useState<Geo>(() =>
    pinned ? "pinned" : canLocate ? "checking" : "unavailable",
  );
  const [place, setPlace] = useState<Place | null>(() =>
    pinned
      ? { lat: pinned.latitude, lon: pinned.longitude, name: "—" }
      : canLocate
        ? null
        : HOME_PLACE,
  );

  // ---- the reading ----
  // The outlook is kept with the request it answers, so a new position or
  // language is never shown under another one's verdict by mistake.
  const [loaded, setLoaded] = useState<{
    place: Place;
    language: Language;
    data: FishingOutlook;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState<{ place: Place; language: Language; attempt: number } | null>(
    null,
  );
  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [zonesFailed, setZonesFailed] = useState(false);
  const [zonesAttempt, setZonesAttempt] = useState(0);
  const [focusRank, setFocusRank] = useState<number | null>(null);
  const [swipe, setSwipe] = useState<SwipeKit | null>(null);
  const swipeAsked = useRef(false);

  // ---- voice out ----
  const [canSpeak] = useState(speechSynthesisSupported);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speakRun = useRef(0);

  // ---- ask ----
  const [canListen] = useState(speechRecognitionSupported);
  const [micBlocked, setMicBlocked] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [askFailed, setAskFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [listenIssue, setListenIssue] = useState<ListenProblem | null>(null);
  const [typed, setTyped] = useState("");
  const recRef = useRef<ListenSession | null>(null);
  const paneRef = useRef<HTMLElement>(null);

  // ---------------------------------------------------------------- boot
  const onPosition = useCallback((pos: GeolocationPosition) => {
    setGeo("found");
    setPlace({
      lat: +pos.coords.latitude.toFixed(4),
      lon: +pos.coords.longitude.toFixed(4),
      name: "—",
    });
  }, []);
  const onNoPosition = useCallback((err: GeolocationPositionError) => {
    // 1 is PERMISSION_DENIED; anything else is a fix that could not be had.
    setGeo(err.code === 1 ? "denied" : "unavailable");
    setPlace((p) => p ?? HOME_PLACE);
  }, []);

  useEffect(() => {
    // A position pinned by the link wins; GPS is not asked.
    if (pinned || !canLocate) return;
    // Found without a prompt if the fisher has allowed it before. Otherwise
    // the home harbour now, which is a whole answer, and the prompt comes
    // when they press "Use my position" (locate.ts).
    let alive = true;
    void locationAlreadyAllowed().then((allowed) => {
      if (!alive) return;
      if (allowed) {
        setGeo("asking");
        navigator.geolocation.getCurrentPosition(onPosition, onNoPosition, GEO_OPTIONS);
      } else {
        setGeo("resting");
        setPlace((p) => p ?? HOME_PLACE);
      }
    });
    return () => {
      alive = false;
    };
  }, [pinned, canLocate, onPosition, onNoPosition]);

  useEffect(() => {
    let alive = true;
    api
      .zones()
      .then((z) => {
        if (!alive) return;
        setZones(z.features);
        setZonesFailed(false);
      })
      .catch(() => alive && setZonesFailed(true));
    return () => {
      alive = false;
    };
  }, [zonesAttempt]);

  useEffect(() => {
    if (!place) return;
    let alive = true;
    api
      .fishingOutlook(place.lat, place.lon, { radiusKm: 100, days: 3, lang: language })
      .then((d) => {
        if (!alive) return;
        setLoaded({ place, language, data: d });
        setFailed(null);
      })
      .catch(() => alive && setFailed({ place, language, attempt }));
    return () => {
      alive = false;
    };
  }, [place, language, attempt]);

  // The page itself speaks the chosen language, and names the open tab.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    document.title = `${t[tab]} · ORCA`;
  }, [t, tab]);

  // The address keeps up, so a reload or a shared link opens the same tab in
  // the same language. replaceState: tabs are places, not history entries.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (tab === "today") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    url.searchParams.set("lang", language);
    window.history.replaceState(window.history.state, "", url);
  }, [tab, language]);

  // A new tab starts at the top of its pane.
  useEffect(() => {
    paneRef.current?.scrollTo?.(0, 0);
  }, [tab]);

  // ---------------------------------------------------------------- data
  const current =
    loaded && loaded.place === place && loaded.language === language ? loaded.data : null;
  const failedNow =
    failed !== null &&
    failed.place === place &&
    failed.language === language &&
    failed.attempt === attempt;
  // The last reading stays on screen when the crew cannot be reached, and
  // while the same position is re-read in another language.
  const stale =
    !current && loaded && (failedNow || loaded.place === place) ? loaded.data : null;
  const outlook = current ?? stale;
  // A kept reading after a failure must never look live (PT6) …
  const staleShown = failedNow && !current && stale != null;
  // … and it is spoken in its own language, whatever the app switched to.
  const outlookLang = current ? language : (loaded?.language ?? language);
  const placeName = outlook?.location.nearest_landing_centre ?? (place && place.name !== "—" ? place.name : "…");

  // Stable identities for the chart (guidelines audit R1): a fresh origin
  // object or handler per render redrew and refit it on every unrelated
  // render, which cancelled the boat drag and reset the fisher's zoom.
  const mapOrigin = useMemo(
    () => (place ? { name: placeName, latitude: place.lat, longitude: place.lon } : null),
    [place, placeName],
  );
  const pickOnMap = useCallback((lat: number, lon: number) => {
    setGeo("chosen");
    setPlace({ lat, lon, name: "—" });
  }, []);

  // Once Today has its reading, fetch the map chunk in an idle moment so the
  // Map tab opens without a wait.
  const hasReading = current !== null;
  useEffect(() => {
    if (!hasReading) return;
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => void loadMap(), { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => void loadMap(), 1500);
    return () => window.clearTimeout(id);
  }, [hasReading]);

  // ---------------------------------------------------------------- voice
  const hush = useCallback(() => {
    speakRun.current++;
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [canSpeak]);

  const say = useCallback(
    (id: string, text: string, lang: Language) => {
      if (!canSpeak) return;
      const run = ++speakRun.current;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = SPEECH_LOCALE[lang];
        u.rate = 0.95;
        const done = () => {
          if (speakRun.current === run) setSpeakingId(null);
        };
        u.onend = done;
        u.onerror = done;
        window.speechSynthesis.speak(u);
        setSpeakingId(id);
      } catch {
        setSpeakingId(null); // no voice after all — the text is on screen anyway
      }
    },
    [canSpeak],
  );

  const toggleSay = (id: string, text: string, lang: Language) =>
    speakingId === id ? hush() : say(id, text, lang);

  // Some engines never fire `end` on a long utterance: ask now and then.
  useEffect(() => {
    if (!speakingId) return;
    const run = speakRun.current;
    const id = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (speakRun.current === run && !synth.speaking && !synth.pending) setSpeakingId(null);
    }, 1500);
    return () => window.clearInterval(id);
  }, [speakingId]);

  // Leaving the app must not leave a voice talking.
  useEffect(
    () => () => {
      if (speechSynthesisSupported()) window.speechSynthesis.cancel();
      recRef.current?.abort();
    },
    [],
  );

  // A no-go day plans nothing: no best hour, no return time, no grounds, no profit.
  const tripOff = outlook ? tripIsOff(outlook) : false;
  const windowText =
    outlook?.best_window && !tripOff
      ? `${unbroken(clockLabel(language, outlook.best_window.from_hour))} – ${unbroken(clockLabel(language, outlook.best_window.to_hour))}`
      : null;
  const back =
    outlook?.duration?.return_by && !tripOff
      ? returnLabel(language, outlook.duration.return_by, outlook.generated_at)
      : null;

  const speakPlan = () => {
    if (!outlook) return;
    const bits = [...outlook.advice.slice(0, 4)];
    if (tripOff) bits.push(t.noTrip + ".");
    if (outlook.best_window && !tripOff)
      bits.push(
        fill(t.bestTimeSay, {
          a: clockLabel(language, outlook.best_window.from_hour),
          b: clockLabel(language, outlook.best_window.to_hour),
        }),
      );
    if (back) bits.push(back.say);
    // LISTEN speaks the reading in the language it was written in (PT6).
    toggleSay("plan", bits.join(" "), outlookLang);
  };

  const hearArea = (a: FishingOutlook["areas"][number]) => {
    const line = `${a.rank}. ${Math.round(a.distance_km)} ${t.km}. ${a.probability}%. ${speciesLine(a.likely_species, ", ")}`;
    say(`area-${a.rank}`, line, language);
  };
  const showArea = (a: FishingOutlook["areas"][number]) => {
    setFocusRank(a.rank);
    setTab("map");
  };
  // A tap does both, as it always has.
  const speakArea = (a: FishingOutlook["areas"][number]) => {
    hearArea(a);
    showArea(a);
  };

  // The first touch of a ground asks for SwipeRow; the rows are upgraded once
  // that gesture is over, so the tap that asked still lands on the plain row.
  const armSwipe = () => {
    if (swipeAsked.current) return;
    swipeAsked.current = true;
    const loading = loadSwipeRow();
    const settle = () => {
      ["pointerup", "pointercancel", "touchend"].forEach((k) => window.removeEventListener(k, settle));
      window.setTimeout(() => {
        loading
          .then(setSwipe)
          .catch(() => {
            swipeAsked.current = false; // offline: the plain rows still work; try on the next touch
          });
      }, 0);
    };
    ["pointerup", "pointercancel", "touchend"].forEach((k) => window.addEventListener(k, settle));
  };

  // ---------------------------------------------------------------- ask
  const sendAsk = async (text: string) => {
    hush();
    setQuestion(text);
    setAnswer(null);
    setAskFailed(false);
    setListenIssue(null);
    setBusy(true);
    try {
      const res = await api.ask({
        message: text,
        sessionId: SESSION,
        latitude: place?.lat,
        longitude: place?.lon,
      });
      setAnswer(res);
      if (res.language !== language) setLanguage(res.language);
      say("answer", sentences(res.answer).slice(0, 3).join(" "), res.language);
    } catch {
      setAskFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const askVoice = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = getRecognition();
    if (!rec) return;
    hush();
    setListenIssue(null);
    rec.lang = SPEECH_LOCALE[language];
    // One spoken question is asked once, whole, when listening ends — never
    // once per word, however the phone reports what it heard.
    recRef.current = listenOnce(rec, {
      onFinal: (heard) => void sendAsk(heard),
      onNothing: () => setListenIssue("no-speech"),
      onError: (code) => {
        const problem = listenProblem(code);
        if (problem === "blocked") setMicBlocked(true);
        setListenIssue(problem);
      },
      onEnd: () => setListening(false),
    });
    try {
      rec.start();
      setListening(true);
    } catch {
      setListenIssue("failed");
    }
  };

  const submitTyped = (e: FormEvent) => {
    e.preventDefault();
    const text = typed.trim();
    if (!text || busy) return;
    setTyped("");
    void sendAsk(text);
  };

  const locateMe = () => {
    setGeo("asking");
    navigator.geolocation.getCurrentPosition(onPosition, onNoPosition, GEO_OPTIONS);
  };

  // ---------------------------------------------------------------- bits
  const input = askInput(canListen, micBlocked);
  const issueText =
    listenIssue === "no-speech" ? t.noSpeech : listenIssue === "failed" ? t.listenFailed : null;
  const askStatus = listening ? t.listening : busy ? t.thinking : "";
  const announce = askStatus || (speakingId ? t.speaking : "");
  const idle = !question && !busy;
  // Said once the reading (or its failure) is on screen, never above content
  // that has already been painted: a late notice must not push the verdict.
  const locationNotice = (geo === "resting" || geo === "denied" || geo === "unavailable") && (
    <div className="panel-tint flex items-center gap-3 py-2 pl-3.5 pr-2">
      <CrosshairGlyph size={18} className="shrink-0 text-ink-500" />
      <p className="min-w-0 flex-1 text-body leading-snug text-ink-800">
        {fill(
          geo === "resting" ? t.locationResting : geo === "denied" ? t.locationOff : t.locationFailed,
          { p: placeName },
        )}
      </p>
      {geo === "resting" ? (
        /* never asked: one press, and the browser's prompt answers that press */
        <button
          type="button"
          onClick={locateMe}
          className="m-press m-btn-line min-h-[44px] shrink-0 rounded-[2px] px-3 font-mono text-label font-bold uppercase tracking-[0.08em]"
        >
          {t.useMyPosition}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setSheet("harbour")}
          aria-haspopup="dialog"
          className="m-press m-btn-line min-h-[44px] shrink-0 rounded-[2px] px-3 font-mono text-label font-bold uppercase tracking-[0.08em]"
        >
          {t.chooseHarbour}
        </button>
      )}
    </div>
  );

  return (
    <div className="m-app">
      {DEBUG_LAYOUT && (
        <Suspense fallback={null}>
          <LayoutProbe />
        </Suspense>
      )}
      <ChartDefs />
      <div className="m-sr" role="status" aria-live="polite">
        {announce}
      </div>

      {/* ---------------- header: what this is, and where ---------------- */}
      <header className="m-header">
        <CompassMark size={34} className="shrink-0 text-ink-900" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-headline font-black leading-none text-ink-900" translate="no">
            ORCA
          </h1>
          <p className="mt-1 truncate text-body leading-tight text-ink-500">{t.purpose}</p>
        </div>
        <button
          type="button"
          onClick={() => setSheet("harbour")}
          aria-haspopup="dialog"
          aria-label={fill(t.harbourNow, { p: placeName })}
          className="m-press m-btn-line flex min-h-[44px] max-w-[46%] shrink-0 items-center gap-1.5 rounded-[2px] px-2.5 font-mono text-body font-bold"
        >
          <CrosshairGlyph size={16} className="shrink-0 text-chart-600" />
          <span className="truncate">{placeName}</span>
          <Chevron className="shrink-0 text-ink-500" />
        </button>
      </header>

      {/* ================= TODAY ================= */}
      {tab === "today" && (
        <main ref={paneRef} className="m-main space-y-3" tabIndex={-1}>
          {failedNow && (
            <OfflineNotice
              language={language}
              body={stale ? ERRORS[language].offlineBody : t.offlineFirst}
              note={stale ? lastReadingNote(stale, language) : undefined}
              onRetry={() => setAttempt((a) => a + 1)}
            />
          )}

          {!outlook && failedNow && locationNotice}

          {!outlook && !failedNow && <TodayDraft label={place ? t.reading : t.locating} />}

          {outlook && (
            <>
              <Verdict
                outlook={outlook}
                language={language}
                t={t}
                updating={!current && !failedNow}
                stale={staleShown}
                speaking={speakingId === "plan"}
                canSpeak={canSpeak}
                onListen={speakPlan}
              />

              {locationNotice}

              {/* official warning — red, loud, speaks itself */}
              {outlook.safety.official_warning && (
                <button
                  type="button"
                  onClick={() => toggleSay("warn", `${t.warnSpeak}. ${outlook.advice[0]}`, language)}
                  aria-pressed={speakingId === "warn"}
                  className="panel hatch-danger m-press flex min-h-[56px] w-full items-center gap-3 border-risk-extreme/70 px-4 py-3 text-left"
                >
                  <WarnGlyph size={30} className="shrink-0 text-risk-extreme" />
                  <span className="font-display text-lead font-bold leading-tight text-risk-extreme">
                    {t.warnSpeak}
                  </span>
                  <span className="ml-auto shrink-0 text-risk-extreme">
                    {speakingId === "warn" ? <StopGlyph size={16} /> : <SpeakerGlyph size={20} />}
                  </span>
                </button>
              )}

              {/* a day with no trip in it says so, in the place the plan would be */}
              {tripOff && (
                <div className="panel-tint hatch-danger px-3.5 py-3" role="note">
                  <div className="font-display text-title font-bold leading-tight text-ink-900">
                    {t.noTrip}
                  </div>
                  <p className="mt-1 text-lead leading-snug text-ink-700">
                    {outlook.safety.improves_after
                      ? fill(t.noTripUntil, { t: outlook.safety.improves_after })
                      : t.noTripBody}
                  </p>
                </div>
              )}

              {/* when to go, when to be back — a matched pair */}
              {(windowText || back) && (
                <div className={`panel grid ${windowText && back ? "grid-cols-2" : ""}`}>
                  {windowText && (
                    <div className="px-3.5 py-3">
                      <div className="label">{t.bestTime}</div>
                      <div className="mt-1.5 font-display text-title font-bold leading-tight text-ink-900">
                        {windowText}
                      </div>
                      <div className="mt-1 text-body text-ink-500">{t.dayToday}</div>
                    </div>
                  )}
                  {back && (
                    <div
                      className={`px-3.5 py-3 ${windowText ? "border-l" : ""}`}
                      style={{ borderColor: "var(--rule-faint)" }}
                    >
                      <div className="label">{t.returnBy}</div>
                      <div className="mt-1.5 font-display text-title font-bold leading-tight text-ink-900">
                        {unbroken(back.time)}
                      </div>
                      <div className="mt-1 text-body text-ink-500">{back.day}</div>
                    </div>
                  )}
                </div>
              )}

              {/* the grounds — tap to hear + see on the chart */}
              {outlook.areas.length > 0 && !tripOff && (
                <section className="panel overflow-hidden" aria-labelledby="m-areas">
                  <div className="hd !items-center !px-3.5 !py-2">
                    <h2 id="m-areas" className="label flex items-center gap-2">
                      {t.areas} <FishGlyph size={14} className="text-chart-500" />
                    </h2>
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-label font-semibold text-chart-700">
                      <SpeakerGlyph size={13} /> {t.tapToHear}
                    </span>
                  </div>
                  <ul onPointerDownCapture={armSwipe} onTouchStartCapture={armSwipe}>
                    {outlook.areas.slice(0, 3).map((a) => {
                      const row = (
                        <button
                          type="button"
                          onClick={() => speakArea(a)}
                          className="m-row flex min-h-[68px] w-full items-center gap-3 px-3.5 py-2.5 text-left"
                        >
                          <span
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 bg-paper-50 font-display text-title font-extrabold text-ink-900"
                            style={{ borderColor: RATING_COLOR[a.rating] }}
                          >
                            {a.rank}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-title font-bold leading-tight text-ink-900">
                              {Math.round(a.distance_km)} {t.km}
                            </span>
                            <span className="mt-0.5 block truncate text-body text-ink-700">
                              {speciesLine(a.likely_species, " · ")}
                            </span>
                          </span>
                          <span
                            className="sounding shrink-0 text-numeral leading-none"
                            style={{ color: RATING_INK[a.rating] }}
                          >
                            {a.probability}
                            <span className="text-body">%</span>
                            <span className="m-sr"> {t.chance}.</span>
                          </span>
                          <SpeakerGlyph size={18} className="shrink-0 text-chart-600" />
                          <span className="m-sr">{fill(t.hearArea, { n: a.rank })}</span>
                        </button>
                      );
                      return (
                        <li
                          key={a.id}
                          className="border-b last:border-b-0"
                          style={{ borderColor: "var(--rule-faint)" }}
                        >
                          {swipe ? (
                            <swipe.Row
                              label={fill(swipe.words[language].row, { n: a.rank })}
                              toggleLabel={fill(swipe.words[language].more, { n: a.rank })}
                              openedLabel={swipe.words[language].opened}
                              actions={[
                                {
                                  id: "map",
                                  label: swipe.words[language].showOnMap,
                                  icon: <MapGlyph size={20} />,
                                  className: "swipe-action--chart",
                                  onSelect: () => showArea(a),
                                },
                                {
                                  id: "hear",
                                  label: swipe.words[language].hearIt,
                                  icon: <SpeakerGlyph size={20} />,
                                  className: "swipe-action--ink",
                                  onSelect: () => hearArea(a),
                                },
                              ]}
                            >
                              {row}
                            </swipe.Row>
                          ) : (
                            row
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* money — two numbers a fisher weighs every morning */}
              {outlook.economics && !tripOff && (
                <div className="panel grid grid-cols-2">
                  <div className="px-3.5 py-3">
                    <div className="label">{t.fuel}</div>
                    <div className="mt-1.5 font-mono text-title font-bold leading-tight text-ink-900">
                      ₹{outlook.economics.fuel_cost_inr.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="border-l px-3.5 py-3" style={{ borderColor: "var(--rule-faint)" }}>
                    <div className="label">{t.profit}</div>
                    <div className="mt-1.5 font-mono text-title font-bold leading-tight text-risk-low">
                      ₹{outlook.economics.profit_inr.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              )}

              <p className="px-1 pt-1 text-center text-body leading-relaxed text-ink-700">
                {outlook.mode !== "LIVE" && <span className="block">{t.simulated}</span>}
                <span className="block">{t.advisory}</span>
              </p>
            </>
          )}
        </main>
      )}

      {/* ================= MAP ================= */}
      {tab === "map" && (
        <MapPane
          t={t}
          language={language}
          zonesFailed={zonesFailed}
          onRetryZones={() => setZonesAttempt((n) => n + 1)}
        >
          {(height) => (
            <ErrorBoundary language={language}>
              <Suspense fallback={<MapDraft label={t.drawingChart} height={height} />}>
                <MarineMap
                  origin={mapOrigin}
                  zones={zones}
                  pfz={NONE}
                  areas={outlook?.areas ?? NONE}
                  radiusKm={outlook?.radius_km ?? 100}
                  routes={outlook?.routes ?? NONE}
                  geofence={NONE}
                  language={language}
                  onPickLocation={pickOnMap}
                  focusRank={focusRank}
                  heightPx={height}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </MapPane>
      )}

      {/* ================= ASK ================= */}
      {tab === "ask" && (
        <main ref={paneRef} className="m-main" tabIndex={-1}>
          <h2 className="m-sr">{t.ask}</h2>
          <div className="mx-auto flex w-full max-w-[30rem] flex-col gap-3.5">
            {/* the mic IS the interface — where the browser can listen */}
            {input === "voice" ? (
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={askVoice}
                  disabled={busy}
                  aria-pressed={listening}
                  aria-label={listening ? t.micStop : t.micStart}
                  className={`m-mic ${idle ? "h-32 w-32" : "h-20 w-20"}`}
                >
                  {listening && (
                    <>
                      <span className="m-mic-wave" aria-hidden />
                      <span className="m-mic-wave" aria-hidden />
                    </>
                  )}
                  {listening ? (
                    <StopGlyph size={idle ? 40 : 26} />
                  ) : (
                    <MicGlyph size={idle ? 58 : 36} />
                  )}
                </button>
                <p className="font-mono text-body font-bold uppercase tracking-[0.14em] text-ink-700">
                  {listening ? t.tapMicStop : busy ? t.thinking : t.tapMic}
                </p>
                {issueText && (
                  <p role="alert" className="m-rise text-center text-lead leading-snug text-ink-800">
                    {issueText}
                  </p>
                )}
              </div>
            ) : (
              <p className="panel-tint flex items-start gap-3 px-3.5 py-3 text-lead leading-snug text-ink-800">
                <MicGlyph size={22} className="mt-0.5 shrink-0 text-ink-500" />
                {micBlocked ? t.micBlocked : t.cannotListen}
              </p>
            )}

            {/* typing: the way in where a browser cannot listen, and a second way where it can */}
            <form onSubmit={submitTyped} className="flex gap-2">
              <input
                className="m-field min-w-0 flex-1"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={t.typeHere}
                aria-label={t.typeHere}
                name="question"
                lang={language}
                enterKeyHint="send"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={busy || !typed.trim()}
                className="m-press m-btn-ink flex min-h-[48px] shrink-0 items-center gap-2 rounded-[2px] px-4 font-mono text-body font-bold uppercase tracking-[0.1em]"
              >
                {t.send}
                <CourseArrow size={16} />
              </button>
            </form>

            {question && (
              <div className="rounded-[3px] bg-ink-900 px-4 py-3">
                <div className="font-mono text-label font-semibold uppercase tracking-[0.16em] text-chart-300">
                  {t.youAsked}
                </div>
                <p className="mt-1 text-lead leading-snug text-paper-50">{question}</p>
              </div>
            )}

            {busy && (
              <div className="flex items-center justify-center gap-2 py-3" aria-hidden>
                <span className="m-dot" />
                <span className="m-dot" />
                <span className="m-dot" />
              </div>
            )}

            {askFailed && question && (
              <OfflineNotice
                language={language}
                body={t.offlineFirst}
                onRetry={() => void sendAsk(question)}
              />
            )}

            {answer && (
              <AnswerCard
                res={answer}
                speaking={speakingId === "answer"}
                canSpeak={canSpeak}
                onListen={() =>
                  toggleSay("answer", sentences(answer.answer).slice(0, 3).join(" "), answer.language)
                }
              />
            )}

            {/* what to ask: the rehearsed questions, then the crew's follow-ups */}
            {!busy && (
              <div className="flex flex-col gap-2">
                <h3 className="label px-0.5 pt-1">{t.tryAsking}</h3>
                {(answer ? answer.suggestions.slice(0, 3) : ASK_EXAMPLES[language]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void sendAsk(s)}
                    className="m-press m-btn-line flex min-h-[48px] w-full items-center gap-3 rounded-[2px] px-3.5 py-2 text-left text-lead font-medium leading-snug"
                  >
                    <span className="min-w-0 flex-1">{s}</span>
                    <CourseArrow size={16} className="shrink-0 text-chart-600" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ---------------- tab bar: three doors, never deeper ---------------- */}
      <nav className="m-nav" aria-label={`ORCA: ${t.today}, ${t.map}, ${t.ask}`} onPointerDown={() => void loadMap()}>
        {TABS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setTab(m)}
            aria-current={tab === m ? "page" : undefined}
            className="m-tab"
          >
            {m === "today" ? <BoatGlyph size={26} /> : m === "map" ? <MapGlyph size={26} /> : <MicGlyph size={26} />}
            <span className="font-mono text-label font-bold uppercase tracking-wide">{t[m]}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSheet("language")}
          aria-haspopup="dialog"
          className="m-tab m-tab--lang"
        >
          {/* the अ is set in the phone's own Devanagari face: one glyph must not
              cost the 127 KB serif */}
          <span className="flex h-[26px] items-center text-title font-bold leading-none" aria-hidden>
            अ<span className="px-0.5 font-mono text-label text-ink-400">/</span>A
          </span>
          <span className="font-mono text-label font-bold uppercase tracking-wide" aria-hidden>
            {LANGUAGE_MARK[language]}
          </span>
          <span className="m-sr">
            {t.language}: {LANGUAGE_NAME[language]}
          </span>
        </button>
      </nav>

      {/* ---------------- sheets ---------------- */}
      {sheet === "language" && (
        <Sheet title={t.language} closeLabel={t.close} onClose={() => setSheet(null)}>
          {(close) =>
            LANGUAGES.map((l) => (
              <SheetRow
                key={l}
                lang={l}
                current={language === l}
                title={LANGUAGE_NAME[l]}
                onPick={() => {
                  hush();
                  setLanguage(l);
                  close();
                }}
              />
            ))
          }
        </Sheet>
      )}
      {sheet === "harbour" && (
        <Sheet title={t.harbours} closeLabel={t.close} onClose={() => setSheet(null)}>
          {(close) => (
            <>
              {canLocate && !pinned && (
                <SheetRow
                  current={geo === "found"}
                  icon={<CrosshairGlyph size={20} className="shrink-0 text-chart-600" />}
                  title={t.useMyPosition}
                  onPick={() => {
                    locateMe();
                    close();
                  }}
                />
              )}
              {PORTS.map((p) => (
                <SheetRow
                  key={p.name}
                  current={geo !== "found" && place?.lat === p.lat && place?.lon === p.lon}
                  title={p.name}
                  detail={p.state}
                  onPick={() => {
                    setGeo("chosen");
                    setPlace({ lat: p.lat, lon: p.lon, name: p.name });
                    setTab("today");
                    close();
                  }}
                />
              ))}
            </>
          )}
        </Sheet>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- map */

/**
 * The map tab's frame. The chart takes exactly the room between the header
 * and the tab bar: the pane is measured (it is sized by the dvh shell, so it
 * follows the browser chrome), and the sheet's own margins are subtracted.
 */
function MapPane({
  t,
  language,
  zonesFailed,
  onRetryZones,
  children,
}: {
  t: MobileStrings;
  language: Language;
  zonesFailed: boolean;
  onRetryZones: () => void;
  children: (height: number) => ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(() => Math.max(260, window.innerHeight - 230));

  const fit = useCallback(() => {
    const box = boxRef.current;
    if (!box || !box.clientHeight) return;
    const sheet = box.querySelector<HTMLElement>(".chart-sheet");
    const frame = box.querySelector<HTMLElement>(".chart-frame");
    // everything the sheet adds around the map itself: margin, neatline, caption
    const around = sheet && frame ? sheet.offsetHeight - frame.clientHeight : 44;
    setHeight(Math.max(240, Math.floor(box.clientHeight - around)));
  }, []);

  useLayoutEffect(() => {
    fit();
    const box = boxRef.current;
    if (!box || typeof ResizeObserver !== "function") return;
    // the pane resizes with the browser chrome; the lazy chart replaces its
    // drafted placeholder as a new child
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    const mo = new MutationObserver(fit);
    mo.observe(box, { childList: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [fit]);

  return (
    <main className="m-main m-main--map">
      <h2 className="m-sr">{t.map}</h2>
      {zonesFailed && (
        <div role="alert" className="panel-tint flex flex-none items-center gap-3 py-1.5 pl-3 pr-1.5">
          <WarnGlyph size={18} className="shrink-0 text-risk-high" />
          <p className="min-w-0 flex-1 text-body leading-snug text-ink-800">{t.zonesMissing}</p>
          <button
            type="button"
            onClick={onRetryZones}
            className="m-press m-btn-line min-h-[44px] shrink-0 rounded-[2px] px-3 font-mono text-label font-bold uppercase tracking-[0.08em]"
          >
            {ERRORS[language].retry}
          </button>
        </div>
      )}
      <div ref={boxRef} className="min-h-0 flex-1 overflow-hidden">
        {children(height)}
      </div>
    </main>
  );
}
