import { useEffect, useState, type RefObject } from "react";

/** Whether a media query matches, kept current. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/**
 * How far down the page an element starts, in CSS pixels, kept current as the
 * title block wraps, fonts land or the window is resized. The working sheet
 * uses it to size its sticky column to exactly the room left under the header.
 */
export function usePageTop(ref: RefObject<HTMLElement | null>, watch?: unknown): number {
  const [top, setTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const next = Math.round(el.getBoundingClientRect().top + window.scrollY);
      setTop((prev) => (prev === next ? prev : next));
    };
    measure();
    window.addEventListener("resize", measure);
    // Anything above the element changing height moves it, and the sheet
    // that holds them both changes height whenever that happens.
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    ro?.observe(el.closest("[data-sheet-root]") ?? document.body);
    if (el.parentElement) ro?.observe(el.parentElement);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
    // `watch` names what the ref is attached to: when it changes, the ref
    // points at a different element and the measuring starts over.
  }, [ref, watch]);
  return top;
}

/**
 * The height to give the thing inside a slot so that it, plus the frame it
 * draws around itself, exactly fills the slot. `inner` selects the element
 * whose height is being set; whatever its wrapper adds (margins, a caption)
 * is measured and subtracted. Undefined until measured or when disabled.
 */
export function useFittedHeight(
  slot: RefObject<HTMLElement | null>,
  inner: string,
  enabled: boolean,
  min: number,
  max: number,
): number | undefined {
  const [fitted, setFitted] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = slot.current;
    if (!enabled || !el) return;
    const measure = () => {
      const frame = el.firstElementChild as HTMLElement | null;
      const target = el.querySelector<HTMLElement>(inner);
      const chrome = frame && target ? frame.offsetHeight - target.offsetHeight : 60;
      const next = clamp(min, Math.floor(el.clientHeight - chrome), max);
      setFitted((prev) => (prev === next ? prev : next));
    };
    measure();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [slot, inner, enabled, min, max]);
  return enabled ? fitted : undefined;
}

export function clamp(min: number, value: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
