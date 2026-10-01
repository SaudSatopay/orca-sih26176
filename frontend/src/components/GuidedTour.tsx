import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "../types";
import { PauseGlyph, PlayGlyph } from "./glyphs";
import { ChevronGlyph, CrossGlyph } from "./viewGlyphs";
import { TOUR, TOUR_UI } from "../i18n/tour";
import { fill } from "./todayModel";
import "./views.css";

/**
 * The scripted walkthrough's narration bar. A non-modal dialog docked at the
 * foot of the sheet: focus moves into it when it opens and goes back to
 * whatever opened it when it closes, Escape closes it, and it never holds the
 * keyboard — Tab walks straight out of it into the page it is describing.
 */
export default function GuidedTour({
  step,
  language = "en",
  paused,
  onPause,
  onNext,
  onPrev,
  onExit,
}: {
  step: number;
  language?: Language;
  paused: boolean;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const s = TOUR[step];
  const ui = TOUR_UI[language] ?? TOUR_UI.en;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // The bar belongs to one run of one step: a new step, a pause or a resume
  // starts a new run, and a reading from an older run counts as zero.
  const run = `${step}:${paused}`;
  const [reading, setReading] = useState({ run, value: 0 });
  const progress = reading.run === run ? reading.value : 0;
  const dwell = s?.dwell ?? 0;

  // Progress bar driven by wall-clock, not rAF, so it still advances when the
  // window is not compositing.
  useEffect(() => {
    if (paused || !dwell) return;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setReading({ run, value: Math.min(1, (Date.now() - startedAt) / dwell) });
    }, 100);
    return () => window.clearInterval(id);
  }, [run, paused, dwell]);

  // Focus comes in when the tour opens and returns to its trigger when it ends.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      if (opener && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  // Escape closes the tour from anywhere, unless something nearer (an open
  // list, a field) already used the key.
  const exitRef = useRef(onExit);
  useEffect(() => {
    exitRef.current = onExit;
  }, [onExit]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) exitRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!s) return null;

  const stepLabel = fill(ui.step, { n: step + 1, total: TOUR.length });
  const square =
    "v-press v-quiet-btn grid h-9 w-9 shrink-0 place-items-center rounded-[2px] disabled:opacity-40";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center p-3 sm:p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="panel rule-double v-enter v-tour pointer-events-auto w-full max-w-3xl shadow-2xl"
        style={{ background: "var(--paper-bright)" }}
      >
        {/* time left on this step */}
        <div className="h-[4px] overflow-hidden bg-ink-900/10" aria-hidden>
          <span className="v-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-4 py-3.5 sm:px-5 sm:py-4">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-ink-900 font-display text-lead font-black tabular-nums text-paper-50"
            aria-hidden
          >
            {step + 1}
          </div>

          <div className="min-w-0 flex-1 basis-[260px]" aria-live="polite" aria-atomic="true">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h2 id={titleId} className="font-display text-lead font-bold leading-snug text-ink-900">
                <span className="sr-only">{ui.name}: </span>
                {s.title[language] ?? s.title.en}
              </h2>
              {s.feature && (
                <span className="border border-chart-500/60 bg-chart-100/50 px-2 py-0.5 font-mono text-label font-bold uppercase tracking-[0.08em] text-chart-700">
                  {s.feature[language] ?? s.feature.en}
                </span>
              )}
            </div>
            <p className="mt-1.5 max-w-[68ch] text-body leading-relaxed text-ink-700">
              {s.say[language] ?? s.say.en}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onPrev}
                disabled={step === 0}
                title={ui.prev}
                aria-label={ui.prev}
                className={square}
              >
                <ChevronGlyph size={12} className="rotate-90" />
              </button>
              <button
                type="button"
                onClick={onPause}
                title={paused ? ui.resume : ui.pause}
                aria-label={paused ? ui.resume : ui.pause}
                aria-pressed={paused}
                className="v-press grid h-9 w-9 place-items-center rounded-[2px] bg-ink-900 text-paper-50"
              >
                {paused ? <PlayGlyph size={12} /> : <PauseGlyph size={12} />}
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={step + 1 >= TOUR.length}
                title={ui.next}
                aria-label={ui.next}
                className={square}
              >
                <ChevronGlyph size={12} className="-rotate-90" />
              </button>
              <button
                type="button"
                onClick={onExit}
                title={`${ui.exit} (Esc)`}
                aria-label={ui.exit}
                className="v-press v-danger-btn ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-[2px]"
              >
                <CrossGlyph />
              </button>
            </div>
            <div className="font-mono text-label font-semibold tabular-nums text-ink-700">
              {paused && <span className="mr-2 text-ink-900">{ui.paused} ·</span>}
              {stepLabel}
            </div>
          </div>
        </div>

        {/* where this step sits in the whole walk */}
        <div
          role="progressbar"
          aria-label={stepLabel}
          aria-valuemin={1}
          aria-valuemax={TOUR.length}
          aria-valuenow={step + 1}
          className="flex gap-0.5 px-4 pb-3 sm:px-5"
        >
          {TOUR.map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 ${
                i < step ? "bg-ink-900" : i === step ? "bg-chart-500" : "bg-ink-900/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
