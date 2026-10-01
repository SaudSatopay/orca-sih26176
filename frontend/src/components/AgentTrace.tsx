import type { AgentTrace as Trace, Language } from "../types";
import { useFirstSight } from "../firstSight";
import { LABEL, T } from "../i18n/agentTrace";
import { CREW_SIZE, PHASES, pairs } from "../crew";
import { alpha, ink, risk } from "../tokens";

const STATUS_DOT: Record<Trace["status"], string> = {
  ok: risk.low,
  degraded: risk.moderate,
  failed: risk.extreme,
  skipped: ink[300],
};

/** "0 ms" reads as "did not run"; the truth is it ran in under a millisecond. */
function latencyLabel(ms: number | null): string {
  if (ms == null) return "—";
  return ms < 1 ? "<1 ms" : `${ms} ms`;
}

/**
 * The crew manifest — the panel that proves ORCA is a crew rather than a
 * single prompt. The whole ten-agent roster is printed for every answer:
 * agents the planner stood down say so, and the planner itself holds the
 * watch for the whole run. Labels follow the reader; each agent's own
 * report keeps the answer's language.
 */
export default function AgentTracePanel({
  trace,
  elapsed,
  language = "en",
  answerLang,
}: {
  trace: Trace[];
  elapsed?: number;
  language?: Language;
  /** The language the answer (and so each agent's summary) was written in. */
  answerLang?: Language;
}) {
  // The latency bars draw once per trace, not on every return to the view.
  const fresh = useFirstSight(`trace:${elapsed ?? 0}:${trace.map((x) => x.latency_ms).join(".")}`);
  if (!trace.length) return null;
  const t = T[language] ?? T.en;
  const labels = LABEL[language] ?? LABEL.en;
  const statusName = pairs(t.status);
  const total = elapsed ?? trace.reduce((s, x) => s + x.latency_ms, 0);

  const byName = new Map(trace.map((x) => [x.agent, x]));
  const maxLatency = Math.max(...trace.map((x) => x.latency_ms), total, 1);
  // The full roster, every answer. The planner emits no trace row of its own:
  // it is the orchestration, so its watch is the whole elapsed time. Agents
  // the planner did not call are printed as stood down, never hidden.
  const row = (a: string): { trace: Trace; synthetic: boolean } => {
    const real = byName.get(a);
    if (real) return { trace: real, synthetic: false };
    if (a === "planner")
      return {
        synthetic: true,
        trace: { agent: a, status: "ok", latency_ms: total, summary: t.plannerSummary, source: "", mode: "DEMO" },
      };
    return {
      synthetic: true,
      trace: { agent: a, status: "skipped", latency_ms: 0, summary: t.notNeeded, source: "", mode: "DEMO" },
    };
  };
  const ran = PHASES.map((p) => ({
    ...p,
    title: t[p.key],
    note: t[`${p.key}N`],
    rows: p.agents.map(row),
  }));

  return (
    <section id="crew-trace" className="panel overflow-hidden">
      <div className="hd">
        <h2 className="label">{t.crew}</h2>
        <span className="font-mono text-label tabular-nums text-ink-400">
          {CREW_SIZE} {t.agents} · {total} {t.total}
        </span>
      </div>

      <div className="space-y-3.5 px-4 py-3.5">
        {ran.map((phase) => (
          <div key={phase.key}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <h3 className="font-display text-body font-bold text-ink-900">{phase.title}</h3>
              <span className="text-label italic text-ink-400">{phase.note}</span>
              {phase.key === "gather" && phase.rows.length > 1 && (
                <span className="ml-auto border border-chart-500/50 bg-chart-100/50 px-2 py-0.5 font-mono text-label font-bold tracking-wide text-chart-700">
                  ∥ {phase.rows.length} {t.concurrent}
                </span>
              )}
            </div>

            <div
              className={
                phase.key === "gather"
                  ? "space-y-1 border-l border-chart-500/50 pl-2.5"
                  : "space-y-1"
              }
            >
              {phase.rows.map(({ trace: r, synthetic }) => {
                return (
                  // Deliberately NOT per-row entrance-animated. A staggered
                  // animation with fill-mode:both leaves rows at opacity 0 if
                  // animations never run (hidden tab, reduced motion, some
                  // projectors) — and an invisible agent trace during a demo,
                  // or invisible safety data, is not an acceptable failure.
                  <div
                    key={r.agent}
                    className="rounded-[2px] border bg-paper-100 px-2.5 py-1.5"
                    style={{
                      borderColor:
                        r.status === "ok" || r.status === "skipped"
                          ? "var(--rule-faint)"
                          : alpha(STATUS_DOT[r.status], 0.4),
                    }}
                  >
                    <div className="flex items-center gap-2 text-label">
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rotate-45"
                        style={{ background: STATUS_DOT[r.status] }}
                      />
                      <span className="sr-only">{statusName[r.status] ?? r.status}:</span>
                      <span
                        className={`w-[96px] shrink-0 font-semibold ${
                          r.status === "skipped" ? "text-ink-500" : "text-ink-900"
                        }`}
                      >
                        {labels[r.agent] ?? r.agent}
                      </span>
                      <span
                        className="min-w-0 flex-1 truncate text-ink-500"
                        title={r.summary || undefined}
                        lang={synthetic ? undefined : answerLang}
                      >
                        {r.summary || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-label tabular-nums text-ink-400">
                        {latencyLabel(r.status === "skipped" ? null : r.latency_ms)}
                      </span>
                    </div>
                    {r.latency_ms > 0 && (
                      <div className="mt-1 h-[2px] overflow-hidden bg-ink-900/[0.07]">
                        <div
                          className={`${fresh ? "grow-x" : ""} h-full bg-chart-500/70`}
                          style={{ width: `${(r.latency_ms / maxLatency) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p
        className="border-t px-4 py-2.5 text-label leading-relaxed text-ink-500"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <span className="block max-w-[78ch]">{t.note}</span>
      </p>
    </section>
  );
}
