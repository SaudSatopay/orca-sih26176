import type { AgentTrace as Trace, Language } from "../types";
import { LABEL, T } from "../i18n/agentTrace";

/** The graph, as it actually executes. */
const PHASES: { key: string; agents: string[] }[] = [
  { key: "understand", agents: ["intent"] },
  { key: "gather", agents: ["weather", "ocean", "pfz", "cyclone", "gis"] },
  { key: "decide", agents: ["risk", "route"] },
  { key: "explain", agents: ["explanation"] },
];

const STATUS_DOT: Record<Trace["status"], string> = {
  ok: "#1D7A50",
  degraded: "#A17000",
  failed: "#AF2318",
  skipped: "#82949F",
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

  const byName = new Map(trace.map((x) => [x.agent, x]));
  const maxLatency = Math.max(...trace.map((x) => x.latency_ms), 1);
  const ran = PHASES.map((p) => ({
    ...p,
    title: t[p.key],
    note: t[`${p.key}N`],
    rows: p.agents.map((a) => byName.get(a)).filter(Boolean) as Trace[],
  })).filter((p) => p.rows.length);

  return (
    <div className="panel overflow-hidden">
      <div className="hd">
        <span className="label">{t.crew}</span>
        <span className="font-mono text-[10px] tabular-nums text-ink-400">
          {trace.length} {t.agents} · {elapsed ?? trace.reduce((s, x) => s + x.latency_ms, 0)}{" "}
          {t.total}
        </span>
      </div>

      <div className="space-y-3.5 px-4 py-3.5">
        {ran.map((phase) => (
          <div key={phase.key}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <span className="font-display text-[13px] font-bold text-ink-900">{phase.title}</span>
              <span className="text-[10.5px] italic text-ink-400">{phase.note}</span>
              {phase.key === "gather" && phase.rows.length > 1 && (
                <span className="ml-auto border border-chart-500/50 bg-chart-100/50 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-chart-700">
                  ∥ {phase.rows.length} {t.concurrent}
                </span>
              )}
            </div>

            <div
              className={
                phase.key === "gather"
                  ? "space-y-1 border-l-2 border-chart-500/40 pl-2.5"
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
                          : STATUS_DOT[row.status] + "66",
                    }}
                  >
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <span
                        className="h-2 w-2 shrink-0 rotate-45"
                        style={{ background: STATUS_DOT[row.status] }}
                      />
                      <span className="w-[96px] shrink-0 font-semibold text-ink-900">
                        {labels[row.agent] ?? row.agent}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ink-500">
                        {row.summary || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-ink-400">
                        {row.latency_ms}ms
                      </span>
                    </div>
                    {row.latency_ms > 0 && (
                      <div className="mt-1 h-[2px] overflow-hidden bg-ink-900/[0.07]">
                        <div
                          className="grow-x h-full bg-chart-500/70 transition-all duration-500"
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
        className="border-t px-4 py-2.5 text-[10.5px] italic leading-relaxed text-ink-400"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        {t.note}
      </p>
    </div>
  );
}
