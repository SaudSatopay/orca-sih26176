/**
 * Joins class names, skipping the falsy ones. The vendored components were
 * written against `clsx` + `tailwind-merge`; ORCA's classes never conflict
 * by design (tokens, one step per role), so a plain join is all they need.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** True when the reader asked the system for less motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}
