import type { AgentTrace as Trace } from "../types";

const LABEL: Record<string, string> = {
  intent: "Intent",
  weather: "Weather",
  ocean: "Ocean",
  pfz: "Fishing zones",
  cyclone: "Alerts",
  gis: "GIS",
  risk: "Risk engine",
  route: "Route",
  explanation: "Explanation",
};

/** The graph, as it actually executes. */
const PHASES: { key: string; title: string; note: string; agents: string[] }[] = [
  { key: "understand", title: "Understand", note: "parse the question", agents: ["intent"] },
  {
    key: "gather",
    title: "Gather",
    note: "specialists run in parallel",
    agents: ["weather", "ocean", "pfz", "cyclone", "gis"],
  },
  { key: "decide", title: "Decide", note: "fuse evidence, plan", agents: ["risk", "route"] },
  { key: "explain", title: "Explain", note: "answer in the user's language", agents: ["explanation"] },
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
}: {
  trace: Trace[];
  elapsed?: number;
}) {
  if (!trace.length) return null;

  const byName = new Map(trace.map((t) => [t.agent, t]));
  const maxLatency = Math.max(...trace.map((t) => t.latency_ms), 1);
  const ran = PHASES.map((p) => ({
    ...p,
    rows: p.agents.map((a) => byName.get(a)).filter(Boolean) as Trace[],
  })).filter((p) => p.rows.length);

  return (
    <div className="panel overflow-hidden">
      <div className="hd">
        <span className="label">Agent crew</span>
        <span className="font-mono text-[10px] tabular-nums text-ink-400">
          {trace.length} agents · {elapsed ?? trace.reduce((s, t) => s + t.latency_ms, 0)} ms total
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
                  ∥ {phase.rows.length} CONCURRENT
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
              {phase.rows.map((t) => {
                return (
                  // Deliberately NOT per-row entrance-animated. A staggered
                  // animation with fill-mode:both leaves rows at opacity 0 if
                  // animations never run (hidden tab, reduced motion, some
                  // projectors) — and an invisible agent trace during a demo,
                  // or invisible safety data, is not an acceptable failure.
                  <div
                    key={t.agent}
                    className="rounded-[2px] border bg-paper-100 px-2.5 py-1.5"
                    style={{
                      borderColor:
                        t.status === "ok" || t.status === "skipped"
                          ? "var(--rule-faint)"
                          : STATUS_DOT[t.status] + "66",
                    }}
                  >
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <span
                        className="h-2 w-2 shrink-0 rotate-45"
                        style={{ background: STATUS_DOT[t.status] }}
                      />
                      <span className="w-[88px] shrink-0 font-semibold text-ink-900">
                        {LABEL[t.agent] ?? t.agent}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ink-500">
                        {t.summary || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-ink-400">
                        {t.latency_ms}ms
                      </span>
                    </div>
                    {t.latency_ms > 0 && (
                      <div className="mt-1 h-[2px] bg-ink-900/[0.07]">
                        <div
                          className="h-full bg-chart-500/70 transition-all duration-500"
                          style={{ width: `${(t.latency_ms / maxLatency) * 100}%` }}
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
        The planner decides which specialists a question needs and runs the independent ones
        concurrently. The risk engine waits for all of them — no agent's opinion can skip it.
      </p>
    </div>
  );
}
