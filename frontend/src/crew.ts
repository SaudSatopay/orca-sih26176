/**
 * The one crew roster: ten agents in four phases, in the order the graph
 * actually executes. Every surface that names the crew — the landing hero,
 * the Ask trace, CrewWorking, System — counts and names from here, so the
 * product never disagrees with itself about who is aboard.
 */
export const PHASES: { key: "understand" | "gather" | "decide" | "explain"; agents: string[] }[] = [
  { key: "understand", agents: ["intent", "planner"] },
  { key: "gather", agents: ["weather", "ocean", "pfz", "cyclone", "gis"] },
  { key: "decide", agents: ["risk", "route"] },
  { key: "explain", agents: ["explanation"] },
];

/** Every agent aboard, in execution order. */
export const CREW: string[] = PHASES.flatMap((p) => p.agents);

/** Ten. The number every "N agents" line prints. */
export const CREW_SIZE = CREW.length;

/** "ok:reported|failed:failed" → { ok: "reported", failed: "failed" }. */
export function pairs(table: string): Record<string, string> {
  return Object.fromEntries(
    table.split("|").map((entry) => {
      const at = entry.indexOf(":");
      return [entry.slice(0, at), entry.slice(at + 1)];
    }),
  );
}
