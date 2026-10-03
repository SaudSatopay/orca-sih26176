/*
 * Floating Tooltip — from Unlumen UI (https://ui.unlumen.com/docs/components/floating-tooltip),
 * free component, used under the Unlumen UI license. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a chart annotation that follows the pointer. One tooltip
 * per provider, drawn on paper with a hairline and the lift shadow, the name
 * in the mono label and one line beneath it. It answers the keyboard as well
 * as the mouse: a trigger is focusable, focus shows its tooltip under it,
 * Escape puts it away, and the trigger is described by it while it shows.
 * The original's velocity skew and stretch are kept but halved (no wobble on
 * the chart); the cva variants and dark-mode colours are gone. Under reduced
 * motion the tooltip sits where it is put, with no trailing spring.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";

interface Tip {
  owner: string;
  title: string;
  line: string;
  /** Where it came from: the pointer follows; focus pins it under the trigger. */
  by: "pointer" | "focus";
}

interface TooltipApi {
  tipId: string;
  active: Tip | null;
  show: (tip: Tip, at: { x: number; y: number }) => void;
  hide: (owner: string) => void;
}

const TooltipContext = createContext<TooltipApi | null>(null);

/** Gap between the pointer (or the trigger's foot) and the tooltip, px. */
const OFFSET = 14;

export function TooltipProvider({ children, className }: { children: ReactNode; className?: string }) {
  const tipId = useId();
  const still = prefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { damping: 45, stiffness: 750 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const scaleX = useTransform(vx, [-1000, 0, 1000], [0.96, 1, 1.06]);
  const scaleY = useTransform(vy, [-1000, 0, 1000], [1.06, 1, 0.96]);
  const skewX = useTransform(vx, [-1000, 0, 1000], [-1.5, 0, 1.5]);

  const [active, setActive] = useState<Tip | null>(null);
  // Near the right edge the tooltip hangs to the left of the pointer.
  const [flip, setFlip] = useState(false);

  const place = useCallback(
    (px: number, py: number, jump: boolean) => {
      setFlip(px > window.innerWidth - 340);
      if (jump || still) {
        x.jump(px);
        y.jump(py);
        sx.jump(px);
        sy.jump(py);
      } else {
        x.set(px);
        y.set(py);
      }
    },
    [x, y, sx, sy, still],
  );

  const show = useCallback(
    (tip: Tip, at: { x: number; y: number }) => {
      place(at.x, at.y, true);
      setActive(tip);
    },
    [place],
  );
  const hide = useCallback((owner: string) => setActive((a) => (a && a.owner === owner ? null : a)), []);

  // The pointer is followed only while a tooltip it opened is up.
  const following = active?.by === "pointer";
  useEffect(() => {
    if (!following) return;
    const move = (e: MouseEvent) => place(e.clientX, e.clientY, false);
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [following, place]);

  const api = useMemo(() => ({ tipId, active, show, hide }), [tipId, active, show, hide]);

  return (
    <TooltipContext.Provider value={api}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                key="tip"
                className="pointer-events-none fixed z-50"
                style={{ left: still ? x : sx, top: still ? y : sy }}
                initial={still ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={still ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                <motion.div
                  id={tipId}
                  role="tooltip"
                  className={cn(
                    "max-w-[36ch] rounded-[2px] border bg-paper-50 px-3 py-2 shadow-lift",
                    className,
                  )}
                  style={{
                    borderColor: "var(--rule)",
                    marginTop: OFFSET,
                    translateX: flip ? `calc(-100% - ${OFFSET}px)` : `${OFFSET}px`,
                    ...(still ? {} : { scaleX, scaleY, skewX }),
                  }}
                >
                  <span className="block font-mono text-label font-bold uppercase tracking-[0.12em] text-chart-700">
                    {active.title}
                  </span>
                  <span className="mt-0.5 block text-body leading-snug text-ink-800">{active.line}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </TooltipContext.Provider>
  );
}

/**
 * Wraps a name in a focusable trigger. Hover follows the pointer; focus pins
 * the tooltip under the name; Escape closes it.
 */
export function TooltipTrigger({
  title,
  line,
  children,
  className,
}: {
  title: string;
  line: string;
  children: ReactNode;
  className?: string;
}) {
  const api = useContext(TooltipContext);
  const owner = useId();
  if (!api) throw new Error("TooltipTrigger must be inside TooltipProvider");
  const { tipId, active, show, hide } = api;
  const mine = active?.owner === owner;

  return (
    <span
      tabIndex={0}
      className={cn("cursor-help", className)}
      aria-describedby={mine ? tipId : undefined}
      onMouseEnter={(e) => show({ owner, title, line, by: "pointer" }, { x: e.clientX, y: e.clientY })}
      onMouseLeave={() => hide(owner)}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        show({ owner, title, line, by: "focus" }, { x: r.left - OFFSET, y: r.bottom - OFFSET / 2 });
      }}
      onBlur={() => hide(owner)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && mine) {
          e.stopPropagation();
          hide(owner);
        }
      }}
    >
      {children}
    </span>
  );
}
