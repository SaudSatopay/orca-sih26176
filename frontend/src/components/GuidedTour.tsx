import { useEffect, useState } from "react";
import type { Language } from "../types";
import { PauseGlyph, PlayGlyph } from "./glyphs";
import { TOUR } from "../i18n/tour";

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

  if (!s) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center p-4">
      <div
        className="panel rule-double pointer-events-auto w-full max-w-3xl shadow-2xl"
        style={{ background: "var(--paper-bright)" }}
      >
        {/* progress */}
        <div className="h-[3px] bg-ink-900/10">
          <div
            className="h-full bg-ink-900 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-start gap-4 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-ink-900 font-display text-[16px] font-black text-paper-50">
            {step + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-[16px] font-bold text-ink-900">
                {s.title[language] ?? s.title.en}
              </h3>
              {s.feature && (
                <span className="border border-chart-500/50 bg-chart-100/50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-chart-700">
                  {s.feature}
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] tabular-nums text-ink-400">
                {step + 1} / {TOUR.length}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-700">
              {s.say[language] ?? s.say.en}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={step === 0}
              title="Previous"
              className="btn-square !h-8 !w-8 disabled:opacity-30"
            >
              ‹
            </button>
            <button
              onClick={onPause}
              title={paused ? "Resume" : "Pause"}
              className="grid h-9 w-9 place-items-center rounded-[2px] bg-ink-900 text-paper-50 transition hover:bg-ink-700"
            >
              {paused ? <PlayGlyph size={12} /> : <PauseGlyph size={12} />}
            </button>
            <button onClick={onNext} title="Next" className="btn-square !h-8 !w-8">
              ›
            </button>
            <button
              onClick={onExit}
              title="Exit tour"
              className="btn-square !h-8 !w-8 hover:!border-risk-extreme hover:!bg-risk-extreme"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
