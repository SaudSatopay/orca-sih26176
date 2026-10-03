/*
 * Glowing Badge — from Unlumen UI (https://ui.unlumen.com/docs/components/glowing-badge),
 * free component, used under the Unlumen UI license. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a status chip printed on the chart, not a pill. Square
 * 2 px corners, a hairline in the status colour, the words in ink (so they
 * hold AA whatever the status), and the status carried by the dot and a faint
 * halo of the same colour. A badge that is `pulse` pings with the house
 * `.pulse-dot` (a CSS loop the ambient watcher already pauses off-screen and
 * on a hidden tab); a still badge keeps its dot and a fainter halo. The
 * original's per-badge Motion loop is gone: one CSS loop, no script.
 */
import type { HTMLAttributes } from "react";
import { cn } from "../cn";

interface GlowingBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The status colour, a fill token (`risk.low`, `chart[600]`…). */
  tone: string;
  /** Pings: the thing named is in use right now. */
  pulse?: boolean;
  dot?: boolean;
  /** The words' colour: ink by default; a status ink (`text-risk-*`) where the word is the status. */
  textClassName?: string;
}

export function GlowingBadge({ tone, pulse = false, dot = true, textClassName = "text-ink-800", children, className, ...props }: GlowingBadgeProps) {
  return (
    <span className="relative inline-flex" data-pulse={pulse ? "" : undefined}>
      {/* the glow: the status colour bleeding into the paper around the chip */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-[3px] blur-md"
        style={{ background: tone, opacity: pulse ? 0.28 : 0.12 }}
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-[2px] border bg-paper-50 px-1.5 py-px font-mono text-label font-bold uppercase tracking-[0.12em]",
          textClassName,
          className,
        )}
        style={{ borderColor: tone }}
        {...props}
      >
        {dot && (
          <span
            aria-hidden
            className={cn("pulse-dot shrink-0 !h-1.5 !w-1.5", !pulse && "pulse-dot--still")}
            style={{ background: tone, color: tone }}
          />
        )}
        {children}
      </span>
    </span>
  );
}
