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
  ok: "bg-emerald-400",
  degraded: "bg-amber-400",
  failed: "bg-red-400",
  skipped: "bg-white/25",
};

const STATUS_ROW: Record<Trace["status"], string> = {
  ok: "border-white/10 bg-white/[0.035]",
  degraded: "border-amber-400/30 bg-amber-400/[0.07]",
  failed: "border-red-400/30 bg-red-400/[0.07]",
  skipped: "border-white/5 bg-white/[0.02]",
};

/**
 * The "ten agents actually ran" panel — the screen that proves ORCA is a crew
 * rather than a single prompt. Grouped by execution phase so the parallel fan-out
 * is visible, with real measured latencies.
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
    <div className="card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="label">Agent crew</span>
        <span className="font-mono text-[10px] tabular-nums text-ocean-300">
          {trace.length} agents · {elapsed ?? trace.reduce((s, t) => s + t.latency_ms, 0)} ms total
        </span>
      </div>

      <div className="space-y-3">
        {ran.map((phase) => (
          <div key={phase.key}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-ocean-100">{phase.title}</span>
              <span className="text-[10px] text-ocean-300/65">{phase.note}</span>
              {phase.key === "gather" && phase.rows.length > 1 && (
                <span className="ml-auto rounded-full bg-ocean-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-ocean-300">
                  ∥ {phase.rows.length} CONCURRENT
                </span>
              )}
            </div>

            <div
              className={
                phase.key === "gather"
                  ? "space-y-1 border-l-2 border-ocean-500/30 pl-2.5"
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
                    className={`rounded-lg border px-2.5 py-1.5 ${STATUS_ROW[t.status]}`}
                  >
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[t.status]}`} />
                      <span className="w-[84px] shrink-0 font-semibold text-ocean-100">
                        {LABEL[t.agent] ?? t.agent}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ocean-300/90">
                        {t.summary || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-ocean-300/70">
                        {t.latency_ms}ms
                      </span>
                    </div>
                    {t.latency_ms > 0 && (
                      <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-ocean-500/70 transition-all duration-500"
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

      <p className="mt-3 border-t border-white/[0.07] pt-2.5 text-[10.5px] leading-relaxed text-ocean-300/65">
        The planner decides which specialists a question needs and runs the independent ones
        concurrently. The risk engine waits for all of them — no agent's opinion can skip it.
      </p>
    </div>
  );
}
