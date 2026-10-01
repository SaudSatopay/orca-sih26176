import type { ReactNode } from "react";

/**
 * Effect 3 — the chart loupe (liquid-glass-js) around a real control.
 * Placeholder until its builder lands it: the children are rendered exactly
 * as they are, which is also what every visitor without the effect gets.
 * `id` names the loupe ("tabs", "open") for the effect ledger.
 */
export default function GlassLoupe({ children }: { id: string; children: ReactNode }) {
  return <>{children}</>;
}
