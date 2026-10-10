/**
 * A reading's age against its own limits, drawn to scale: the fresh span,
 * then the stale span up to the age past which the reading is not used, and
 * a tick at the reading's age. Only real numbers are drawn; a reading with no
 * age or no limit gets no bar (see `freshnessScale`).
 */
export default function FreshnessBar({ age, fresh, max }: { age: number; fresh: number; max: number }) {
  const at = Math.min(1, Math.max(0, age / max));
  const edge = Math.min(1, fresh / max);
  return (
    <span
      aria-hidden="true"
      data-fresh-bar={at.toFixed(3)}
      className="relative mt-1 block h-1.5 w-28 rounded-[1px] bg-risk-moderate/25"
    >
      <span className="absolute inset-y-0 left-0 rounded-l-[1px] bg-risk-low/30" style={{ width: `${edge * 100}%` }} />
      <span className="absolute -inset-y-0.5 w-0.5 bg-ink-900" style={{ left: `calc(${at * 100}% - 1px)` }} />
    </span>
  );
}
