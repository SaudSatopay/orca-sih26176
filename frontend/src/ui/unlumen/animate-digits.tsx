/*
 * Animate Digits — from Unlumen UI (https://ui.unlumen.com/docs/components/animate-digits),
 * free component, used under the Unlumen UI license. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a score that changes on a refresh rolls, digit by digit,
 * like a departures board. Each changed digit springs into place from above
 * (rising) or below (falling) while the old one drifts out and fades. The
 * new value is never hidden or late: the new digit is at full opacity from
 * its first frame, and only its position settles (the original's blur,
 * scale-in and opacity-in are gone: a score is safety data). The full value
 * is printed once for assistive tech; the rolling cells are decoration.
 * Under reduced motion the digits simply change.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";

/** How far a digit travels, in em. */
const TRAVEL = 0.7;
const SPRING = { stiffness: 260, damping: 26 };

interface Leaving {
  id: number;
  char: string;
  /** em, the way it leaves */
  to: number;
}

const rolls = (was: string, now: string) => was !== now && /\d/.test(was) && /\d/.test(now);

function DigitCell({ char }: { char: string }) {
  // The digit on show, and the ones on their way out. A change of digit is
  // taken in during render (no effect round trip): the new digit is drawn in
  // the same frame the value changes.
  const [shown, setShown] = useState(char);
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  const [count, setCount] = useState(0);
  if (shown !== char) {
    setShown(char);
    if (rolls(shown, char) && !prefersReducedMotion()) {
      const up = Number(char) > Number(shown);
      // the old digit drifts out and fades; it is the old value, and hidden
      setLeaving((q) => [...q.slice(-2), { id: count, char: shown, to: up ? -TRAVEL : TRAVEL }]);
      setCount(count + 1);
    }
  }

  // the spring runs in em, so the travel scales with the type
  const y = useSpring(0, SPRING);
  const yEm = useTransform(y, (v) => `${v}em`);
  const previous = useRef(char);
  useLayoutEffect(() => {
    const was = previous.current;
    previous.current = char;
    if (!rolls(was, char) || prefersReducedMotion()) return;
    // the new digit is at full strength from its first frame and settles
    y.jump(Number(char) > Number(was) ? TRAVEL : -TRAVEL);
    y.set(0);
  }, [char, y]);

  return (
    <span className="relative inline-grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence>
        {leaving.map((l) => (
          <motion.span
            key={l.id}
            initial={{ y: "0em", opacity: 1 }}
            animate={{ y: `${l.to}em`, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            onAnimationComplete={() => setLeaving((q) => q.filter((x) => x.id !== l.id))}
          >
            {l.char}
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.span style={{ y: yEm }}>{char}</motion.span>
    </span>
  );
}

export function AnimateDigits({ value, className }: { value: string; className?: string }) {
  const chars = value.split("");
  return (
    <span className={cn("relative inline-flex tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((c, i) => (
          // keyed from the right, so a units digit stays a units digit when
          // the number gains or loses a place
          <DigitCell key={chars.length - i} char={c} />
        ))}
      </span>
    </span>
  );
}
