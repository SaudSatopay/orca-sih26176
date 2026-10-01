import type { AgentTrace as Trace, Language } from "../types";
import { LABEL, T } from "../i18n/agentTrace";
import { PHASES, pairs } from "../crew";
import { alpha, ink, risk } from "../tokens";

const STATUS_DOT: Record<Trace["status"], string> = {
  ok: risk.low,
  degraded: risk.moderate,
  failed: risk.extreme,
  skipped: ink[300],
};

/**
 * The crew manifest — the panel that proves ORCA is a crew rather than a
 * single prompt. Grouped by execution phase so the parallel fan-out is
 * visible, with real measured latencies, set like a ship's log.
 */
export default function AgentTracePanel({
  trace,
  elapsed,
  language = "en",
}: {
  trace: Trace[];
  elapsed?: number;
  language?: Language;
}) {
  if (!trace.length) return null;
  const t = T[language] ?? T.en;
  const labels = LABEL[language] ?? LABEL.en;
  const statusName = pairs(t.status);

  const byName = new Map(trace.map((x) => [x.agent, x]));
  const maxLatency = Math.max(...trace.map((x) => x.latency_ms), 1);
  const ran = PHASES.map((p) => ({
    ...p,
    title: t[p.key],
    note: t[`${p.key}N`],
    rows: p.agents.map((a) => byName.get(a)).filter(Boolean) as Trace[],
  })).filter((p) => p.rows.length);

  return (
    <section className="panel overflow-hidden">
      <div className="hd">
        <h2 className="label">{t.crew}</h2>
        <span className="font-mono text-label tabular-nums text-ink-400">
          {trace.length} {t.agents} · {elapsed ?? trace.reduce((s, x) => s + x.latency_ms, 0)}{" "}
          {t.total}
        </span>
      </div>

      <div className="space-y-3.5 px-4 py-3.5">
        {ran.map((phase) => (
          <div key={phase.key}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <h3 className="font-display text-body font-bold text-ink-900">{phase.title}</h3>
              <span className="text-label italic text-ink-400">{phase.note}</span>
              {phase.key === "gather" && phase.rows.length > 1 && (
                <span className="ml-auto border border-chart-500/50 bg-chart-100/50 px-2 py-0.5 font-mono text-micro font-bold tracking-wide text-chart-700">
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
              {phase.rows.map((row) => {
                return (
                  // Deliberately NOT per-row entrance-animated. A staggered
                  // animation with fill-mode:both leaves rows at opacity 0 if
                  // animations never run (hidden tab, reduced motion, some
                  // projectors) — and an invisible agent trace during a demo,
                  // or invisible safety data, is not an acceptable failure.
                  <div
                    key={row.agent}
                    className="rounded-[2px] border bg-paper-100 px-2.5 py-1.5"
                    style={{
                      borderColor:
                        row.status === "ok" || row.status === "skipped"
                          ? "var(--rule-faint)"
                          : alpha(STATUS_DOT[row.status], 0.4),
                    }}
                  >
                    <div className="flex items-center gap-2 text-readout">
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rotate-45"
                        style={{ background: STATUS_DOT[row.status] }}
                      />
                      <span className="sr-only">{statusName[row.status] ?? row.status}:</span>
                      <span className="w-[96px] shrink-0 font-semibold text-ink-900">
                        {labels[row.agent] ?? row.agent}
                      </span>
                      <span
                        className="min-w-0 flex-1 truncate text-ink-500"
                        title={row.summary || undefined}
                      >
                        {row.summary || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-label tabular-nums text-ink-400">
                        {row.latency_ms} ms
                      </span>
                    </div>
                    {row.latency_ms > 0 && (
                      <div className="mt-1 h-[2px] overflow-hidden bg-ink-900/[0.07]">
                        <div
                          className="grow-x h-full bg-chart-500/70"
                          style={{ width: `${(row.latency_ms / maxLatency) * 100}%` }}
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
        className="border-t px-4 py-2.5 text-readout leading-relaxed text-ink-500"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <span className="block max-w-[78ch]">{t.note}</span>
      </p>
    </section>
  );
}
