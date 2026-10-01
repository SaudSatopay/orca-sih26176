/** The pace the field was tuned at: one step per frame of a 60 Hz display. */
export const FLOW_FRAME_MS = 1000 / 60;

/**
 * How far to advance the flow field for a display frame that arrives
 * `elapsedMs` after the last step, in 60 Hz frames. 0 means "not yet": a 120
 * or 144 Hz display calls more often than the field needs to move. The cap
 * stops one step leaping across the chart after a stall.
 */
export function flowStep(elapsedMs: number): number {
  if (elapsedMs < FLOW_FRAME_MS - 1) return 0;
  return Math.min(elapsedMs / FLOW_FRAME_MS, 3);
}
