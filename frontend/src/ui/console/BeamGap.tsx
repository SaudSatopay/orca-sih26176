import { useRef, type CSSProperties } from "react";
import { AnimatedBeam } from "../magicui/animated-beam";
import { cn } from "../cn";
import { chart } from "../../tokens";

/**
 * A gap in a pipeline, and the course a signal runs across it.
 *
 * The gap is a real layout cell between two nodes (a provider and the cache,
 * one crew phase and the next). Its two edges are the anchors, so the beam
 * starts where one node ends and lands where the next begins: a dashed
 * resting course with a teal light travelling it. Each gap is its own frame,
 * so the light crosses the whole gap; `delay` staggers the gaps of one
 * pipeline so the signal reads in the order the work runs.
 *
 * `on` is false below desktop width, where the stacked flow keeps its drop
 * lines and no beam is drawn.
 */
export function BeamGap({
  on,
  className,
  style,
  duration = 2.4,
  delay = 0,
}: {
  on: boolean;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  delay?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const from = useRef<HTMLSpanElement>(null);
  const to = useRef<HTMLSpanElement>(null);
  return (
    <div
      ref={frame}
      data-beam-gap
      aria-hidden
      className={cn("relative min-h-2 min-w-7 items-center justify-between self-stretch", className)}
      style={style}
    >
      {/* zero-width anchors on the gap's two edges, at its vertical middle */}
      <span ref={from} className="h-px w-0" />
      <span ref={to} className="h-px w-0" />
      {on && (
        <AnimatedBeam
          containerRef={frame}
          fromRef={from}
          toRef={to}
          duration={duration}
          delay={delay}
          repeatDelay={0.6}
          pathWidth={2}
          pathOpacity={0.45}
          // a full-strength teal light on the paler resting course
          gradientStartColor={chart[600]}
          gradientStopColor={chart[500]}
        />
      )}
    </div>
  );
}
