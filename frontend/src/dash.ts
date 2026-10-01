/**
 * How far a running dash pattern travels in one loop of `dashdrift`: the
 * whole number of its own periods (dash plus gap) nearest to 48 units, the
 * distance the house loop was drawn for. Every pattern then runs at about the
 * same pace and none of them jumps when the loop restarts.
 */
export function dashLoop(dashArray: string): number {
  const parts = dashArray.trim().split(/[\s,]+/).map(Number);
  const sum = parts.reduce((total, n) => total + n, 0);
  // SVG repeats an odd-length list once to make it even.
  const period = parts.length % 2 ? sum * 2 : sum;
  if (!(period > 0)) return 48;
  return period * Math.max(1, Math.round(48 / period));
}
