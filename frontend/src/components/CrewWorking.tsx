import { useEffect, useState } from "react";
import { PHASES } from "../crew";
import { LABEL, T } from "../i18n/agentTrace";
import type { Language } from "../types";

/** How long each phase holds the watch before the next is called. */
const PHASE_MS = 600;

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
          <p className="mt-0.5 text-readout leading-relaxed text-ink-500">{t.workingSub}</p>
        </div>
        <div className="wave-rule w-16 shrink-0" aria-hidden />
      </div>

      <ol className="crew-grid">
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
                <span className="ml-auto font-mono text-micro font-semibold uppercase tracking-[0.14em] text-ink-400">
                  {state === "next" ? t.waiting : t.called}
                </span>
              </div>
              <div className="mt-1.5 h-px bg-ink-900/10">
                {state !== "next" && <div className="grow-x h-px bg-chart-500" />}
              </div>
              <ul className="mt-2 space-y-1">
                {phase.agents.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-readout text-ink-700">
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 rotate-45 border border-chart-600 ${
                        state === "next" ? "" : "bg-chart-500"
                      }`}
                      style={
                        state === "now" ? { animation: "inkblink 1.2s ease-in-out infinite" } : undefined
                      }
                    />
                    {labels[a] ?? a}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
