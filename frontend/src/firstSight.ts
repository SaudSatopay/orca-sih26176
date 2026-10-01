import { useEffect, useState } from "react";

/**
 * A reveal belongs to a reading, not to a mount.
 *
 * Changing sheets remounts every view. An entrance tied to the mount would
 * stamp the same verdict again, count the same dial up from zero again and
 * redraw the same bars on every visit. So each reading is named by a key and
 * its entrance plays the first time that key is on screen in this page load.
 */
const seen = new Map<string, symbol>();

/**
 * True while `key` is on screen for the first time, for `ms` milliseconds;
 * false on every later mount and once the entrance has had time to play. The
 * entrances it gates are transform-only keyframes with no fill-mode: if the
 * timer never fires the class simply stays on a finished animation.
 */
export function useFirstSight(key: string, ms = 1000): boolean {
  const [me] = useState(() => Symbol("sight"));
  const [done, setDone] = useState<string | null>(null);
  const owner = seen.get(key);
  const fresh = done !== key && (owner === undefined || owner === me);
  useEffect(() => {
    if (!fresh) return;
    seen.set(key, me);
    const id = window.setTimeout(() => setDone(key), ms);
    return () => window.clearTimeout(id);
  }, [key, fresh, me, ms]);
  return fresh;
}

/** Test seam: forget every reading. */
export function forgetSights(): void {
  seen.clear();
}
