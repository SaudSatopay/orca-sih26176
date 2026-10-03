/*
 * Refresh Button — from Unlumen UI (https://ui.unlumen.com/docs/components/refresh),
 * free component, used under the Unlumen UI license. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a square chart control (2 px corners, hairline, ink on
 * paper) whose hand-drawn arrow winds back a notch when pressed and turns a
 * full circle once the reading it asked for has arrived. The lucide icon and
 * the shadcn button variants are gone (the arrow is drawn here, in the
 * glyphs' style); the hover grow is gone (no bounce on the chart); the turn
 * is an ease-out tween, not a spring that overshoots. While a reading is in
 * flight the button is busy and says so. Under reduced motion nothing turns.
 */
import { useCallback, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";

function TurnGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.2 8.4a5.2 5.2 0 1 1-1.6-3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12.2 1.6v3.3H8.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RefreshButton({
  onRefresh,
  label,
  busy = false,
  className,
}: {
  /** Awaited before the arrow completes its turn. */
  onRefresh: () => void | Promise<unknown>;
  /** The accessible name and the tooltip, in the reader's language. */
  label: string;
  busy?: boolean;
  className?: string;
}) {
  const turn = useAnimation();
  const total = useRef(0);
  const wound = useRef(false);
  const to = useCallback(
    (delta: number, duration: number) => {
      if (prefersReducedMotion()) return Promise.resolve();
      total.current += delta;
      return turn.start({ rotate: total.current, transition: { duration, ease: [0.23, 1, 0.32, 1] } });
    },
    [turn],
  );

  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      // busy, not disabled: a disabled control drops keyboard focus
      aria-busy={busy}
      aria-disabled={busy}
      // a pointer press winds the arrow back a notch; the click (pointer or
      // keyboard) asks for the reading and the arrow turns once it is in
      onPointerDown={() => {
        wound.current = true;
        void to(-24, 0.12);
      }}
      onClick={async () => {
        if (busy) return;
        const rest = wound.current ? -336 : -360;
        wound.current = false;
        await onRefresh();
        await to(rest, 0.6);
      }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-[2px] border bg-paper-50 text-ink-800 hover:bg-ink-900 hover:text-paper-50 aria-disabled:cursor-progress aria-disabled:opacity-60",
        className,
      )}
      style={{ borderColor: "var(--rule)" }}
    >
      <motion.span className="inline-flex" animate={turn}>
        <TurnGlyph />
      </motion.span>
    </motion.button>
  );
}
