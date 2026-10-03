/*
 * Status Mark — from React Bits (https://reactbits.dev/components/status-mark),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the glyph that says where an agent is in its watch. A
 * dashed ring while it is standing by, a turning arc while it is called, a
 * closed ring with a hand-drawn tick once it has reported; the dashes morph
 * into the arc and the arc into the ring, as in the original. Colours are
 * tokens (defaults in the stylesheet), the styles moved from arbitrary Tailwind classes into
 * status-mark.css (no keyframes: transitions and stroke-dashoffset only), the
 * spoken English labels are gone (the caller's row already says the status in
 * the reader's language, so the mark is decoration) and the failed and
 * cancelled states the console has no use for are dropped. Under reduced
 * motion the mark changes state without moving.
 */
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { animate, useMotionValue } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";
import "./status-mark.css";

export type StatusMarkStatus = "pending" | "running" | "done";

export interface StatusMarkProps {
  status?: StatusMarkStatus;
  /** Defaults to chart-600 (status-mark.css). */
  color?: string;
  /** Defaults to chart-700 (status-mark.css). */
  doneColor?: string;
  /** px */
  size?: number;
  strokeWidth?: number;
  dashes?: number;
  /** ms for one turn of the arc while running */
  spinDuration?: number;
  /** share of the ring the running arc covers */
  arcLength?: number;
  className?: string;
}

const UI = { type: "spring" as const, duration: 0.3, bounce: 0 };
const MORPH = { duration: 0.3, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] };
const CHECK = "M7.5 12.25 10.5 15.25 16.75 8.75";
const IDLE_DASH = 0.3;

export function StatusMark({
  status = "pending",
  color,
  doneColor,
  size = 14,
  strokeWidth = 2.2,
  dashes = 8,
  spinDuration = 1100,
  arcLength = 0.68,
  className,
}: StatusMarkProps) {
  const r = 10 - strokeWidth / 2;
  const C = 2 * Math.PI * r;
  const P = C / Math.max(1, dashes);
  const running = status === "running";
  const solid = status !== "pending";
  const targetArc = running ? arcLength : 1;

  const mode = useMotionValue(solid ? 1 : 0);
  const arc = useMotionValue(targetArc);
  const travel = useMotionValue(0);
  const ring = useRef<SVGCircleElement>(null);
  const geo = useRef({ C, P });
  const gen = useRef(0);

  // The ring's dash pattern is written straight to the element: a blend of
  // the idle dashes and the solid arc, by `mode`.
  const writeDash = useRef(() => {});
  useLayoutEffect(() => {
    geo.current = { C, P };
    writeDash.current = () => {
      const g = geo.current;
      const m = mode.get();
      const a = arc.get();
      const dash = IDLE_DASH * g.P + (a * g.C - IDLE_DASH * g.P) * m;
      const gap = (1 - IDLE_DASH) * g.P + ((1 - a) * g.C - (1 - IDLE_DASH) * g.P) * m;
      ring.current?.setAttribute("stroke-dasharray", `${Math.max(0, dash)} ${Math.max(0, gap)}`);
    };
    writeDash.current();
    ring.current?.setAttribute("stroke-dashoffset", String(travel.get()));
  }, [C, P, mode, arc, travel]);

  useEffect(() => {
    const offs = [
      mode.on("change", () => writeDash.current()),
      arc.on("change", () => writeDash.current()),
      travel.on("change", (v: number) => ring.current?.setAttribute("stroke-dashoffset", String(v))),
    ];
    return () => {
      offs.forEach((off) => off());
      mode.stop();
      arc.stop();
      travel.stop();
    };
  }, [mode, arc, travel]);

  useEffect(() => {
    const g = ++gen.current;
    if (prefersReducedMotion()) {
      mode.jump(solid ? 1 : 0);
      arc.jump(targetArc);
      travel.jump(0);
      return;
    }
    if (mode.get() === 0) arc.jump(targetArc);
    animate(mode, solid ? 1 : 0, MORPH);
    animate(arc, targetArc, UI);
    if (running) {
      // the arc turns while the agent is called; stopped by the next state
      const t0 = travel.get();
      const spin = animate(travel, [t0, t0 - C], { duration: spinDuration / 1000, ease: "linear", repeat: Infinity });
      return () => spin.stop();
    }
    const to = Math.floor(travel.get() / P) * P;
    animate(travel, to, UI).then(() => {
      if (gen.current === g) travel.jump(0);
    });
  }, [status, solid, running, targetArc, C, P, spinDuration, mode, arc, travel]);

  return (
    <span
      aria-hidden
      className={cn("status-mark", className)}
      data-status={status}
      style={
        {
          "--sm-color": color,
          "--sm-done": doneColor,
          "--sm-stroke": strokeWidth,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <circle className="status-mark-track" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <circle ref={ring} className="status-mark-ring" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <path className="status-mark-tick" d={CHECK} pathLength={1} />
      </svg>
    </span>
  );
}
