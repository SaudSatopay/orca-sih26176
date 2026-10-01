/** The agent graph, in the order it actually executes. */
export const PHASES: { key: "understand" | "gather" | "decide" | "explain"; agents: string[] }[] = [
  { key: "understand", agents: ["intent"] },
  { key: "gather", agents: ["weather", "ocean", "pfz", "cyclone", "gis"] },
  { key: "decide", agents: ["risk", "route"] },
  { key: "explain", agents: ["explanation"] },
];

/** "ok:reported|failed:failed" → { ok: "reported", failed: "failed" }. */
export function pairs(table: string): Record<string, string> {
  return Object.fromEntries(
    table.split("|").map((entry) => {
      const at = entry.indexOf(":");
      return [entry.slice(0, at), entry.slice(at + 1)];
    }),
  );
}
