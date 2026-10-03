import { lazy, useEffect, useState } from "react";
import { PHASES } from "../crew";
import { LABEL, T } from "../i18n/agentTrace";
import type { Language } from "../types";
import { GlSlot } from "../ui/console/GlSlot";
import { StatusMark, type StatusMarkStatus } from "../ui/reactbits/status-mark";

/** The radar's chunk (and ogl) is fetched only where GlSlot allows it. */
const Radar = lazy(() => import("../ui/reactbits/radar"));

/** How long each phase holds the watch before the next is called. */
const PHASE_MS = 600;

const MARK: Record<"done" | "now" | "next", StatusMarkStatus> = {
  next: "pending",
  now: "running",
  done: "done",
};

/**
 * What the answer column shows while a question is out with the crew: the
 * same manifest the trace will print afterwards, with each phase called in
 * the order the graph runs. No spinner; the sea-surface rule carries the
 * motion, and the manifest says who is working.
 *
 * The steps are a clock, not telemetry: they show the order of work, and the
 * real statuses and timings replace them when the answer lands.
 */
export default function CrewWorking({ language = "en" }: { language?: Language }) {
  const t = T[language] ?? T.en;
  const labels = LABEL[language] ?? LABEL.en;
  const [called, setCalled] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setCalled((n) => (n < PHASES.length - 1 ? n + 1 : n)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="crew panel rule-double overflow-hidden" role="status" aria-live="polite">
      <div className="hd !items-center">
        <div className="min-w-0">
          <h2 className="font-display text-lead font-bold text-ink-900">{t.working}</h2>
          <p className="mt-0.5 text-label leading-relaxed text-ink-500">{t.workingSub}</p>
        </div>
        <div className="wave-rule w-16 shrink-0" aria-hidden />
      </div>

      <div className="relative">
        {/* the sweep: chart-teal range rings and a turning beam on the paper
            behind the manifest, desktop only (GlSlot); it goes with this sheet
            the moment the answer lands */}
        <GlSlot className="pointer-events-none absolute inset-0">
          <Radar />
        </GlSlot>
        <ol className="crew-grid relative">
          {PHASES.map((phase, i) => {
            const state = i < called ? "done" : i === called ? "now" : "next";
            return (
              <li key={phase.key} className="px-4 py-3" aria-current={state === "now" ? "step" : undefined}>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-display text-body font-bold ${
                      state === "next" ? "text-ink-500" : "text-ink-900"
                    }`}
                  >
                    {t[phase.key]}
                  </span>
                  <span className="ml-auto font-mono text-label font-semibold uppercase tracking-[0.14em] text-ink-400">
                    {state === "next" ? t.waiting : t.called}
                  </span>
                </div>
                <div className="mt-1.5 h-px bg-ink-900/10">
                  {state !== "next" && <div className="grow-x h-px bg-chart-500" />}
                </div>
                <ul className="mt-2 space-y-1">
                  {phase.agents.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-label text-ink-700">
                      {/* standing by: a dashed ring; called: a turning arc;
                          its phase passed: a closed ring with a tick */}
                      <StatusMark status={MARK[state]} size={13} />
                      {labels[a] ?? a}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
