import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_EFFECTS, effectsHere, readEffectEnv, requestedEffects } from "./gate";
import { noteEffect, type EffectState } from "./ledger";
import { leases } from "./contexts";
import { RULE_H, scaleNumerals, type ScaleNumeral } from "./glassScale";
import "./glass.css";

/**
 * Effect 3 — the chart loupe: clear glass lying on the chart, refracting the
 * drawn surfaces under it (never content, never a page snapshot).
 *
 * The children are the control and stay the control: the same DOM elements,
 * roles, roving tabindex, focus ring, keys and handlers. Everything the
 * loupe adds is `aria-hidden` decoration with no pointer events, so the
 * accessibility tree with and without the lens is identical.
 *
 * How it runs fast (what the first trial got wrong):
 *   - the backdrop texture is painted by glassBackdrop.ts from computed
 *     styles — html2canvas is gone and must not come back;
 *   - a lens draws once: the WebGL canvas is copied into plain 2D stills
 *     and the context is released, so at rest the page holds ZERO live
 *     WebGL contexts (gate.ts counts glass as 0);
 *   - the tabs' three stills are pre-rendered at arming, one per tab
 *     position; pressing a tab only crossfades between them — no canvas
 *     and no context is created on a tab press.
 *
 * Tiers: the WebGL still → a CSS `backdrop-filter` lens when WebGL or the
 * backdrop fails (tabs only; the primary action's fallback is the solid
 * `btn-ink`) → the plain control for everyone the gate turns away.
 *
 * `id` names the loupe: "tabs" (the hero's question tabs, over the distance
 * scale) or "open" (the primary action, on the page ground).
 */

export type GlassTier = "gl" | "css" | "off";

const SHIPPED_LOUPES: readonly string[] = ["tabs", "open"];

/** After load and fonts: long enough for the hero's entrance to have landed. */
const SETTLE_MS = 1200;
const REARM_DEBOUNCE_MS = 250;
/** The open slab re-arms once scrolling has been still this long. */
const SCROLL_SETTLE_MS = 400;
/** …and only if the page has moved more than this since the still was drawn. */
const SCROLL_DRIFT_PX = 2;

/**
 * Draw a lens's stills under a WebGL context lease (contexts.ts): arming
 * waits its turn when three contexts are out, opens its one context, loses
 * it, and gives the lease back. Rejects if `signal` aborts while waiting.
 */
async function underLease<T>(signal: AbortSignal, draw: () => Promise<T>): Promise<T> {
  const lease = await leases.acquire("glass", { signal });
  try {
    return await draw();
  } finally {
    lease.release();
  }
}

/** How far the lens bleeds past a tab, px. */
const TAB_LENS_BLEED_X = 4;
const TAB_LENS_BLEED_Y = 3;
/** The rule under the primary action bleeds this far past the button. */
// The ruler stays wholly under the slab: a bleed past the bezel read as
// ticks spilling out of the button (owner, 1 Oct 2026), so the glass shows
// the scale through itself and nothing floats outside the hairline.
const RULE_BLEED = 0;

let tierCache: GlassTier | null = null;

function glassTier(): GlassTier {
  if (tierCache) return tierCache;
  if (typeof window === "undefined" || !window.matchMedia) return (tierCache = "off");
  const env = readEffectEnv();
  const wanted = (requestedEffects(env.search) ?? DEFAULT_EFFECTS).includes("glass");
  if (!wanted || !env.wide || !env.finePointer || env.reducedMotion || env.saveData || env.reducedTransparency) {
    return (tierCache = "off");
  }
  const blur =
    typeof CSS !== "undefined" &&
    (CSS.supports("backdrop-filter", "blur(2px)") || CSS.supports("-webkit-backdrop-filter", "blur(2px)"));
  // `fxtier=css` forces the fallback tier, for testing and evidence shots.
  if (new URLSearchParams(env.search).get("fxtier") === "css") return (tierCache = blur ? "css" : "off");
  if (effectsHere().includes("glass")) return (tierCache = "gl");
  return (tierCache = blur ? "css" : "off");
}

function loupesHere(): readonly string[] {
  if (typeof window === "undefined") return SHIPPED_LOUPES;
  const raw = new URLSearchParams(window.location.search).get("fxloupe");
  return raw == null ? SHIPPED_LOUPES : raw.split(",").map((s) => s.trim().toLowerCase());
}

// One ledger entry for both loupes: the furthest any has got.
const states = new Map<string, EffectState>();
const ORDER: readonly EffectState[] = ["live", "loading", "waiting", "failed", "poster"];
function note(id: string, state: EffectState | null) {
  if (state) states.set(id, state);
  else states.delete(id);
  const all = [...states.values()];
  noteEffect("glass", ORDER.find((s) => all.includes(s)) ?? "poster");
}

interface GlassDebug {
  tabs?: { ms: number; backdrop: HTMLCanvasElement };
  open?: { ms: number; backdrop: HTMLCanvasElement };
}

function debugStash(id: "tabs" | "open", entry: { ms: number; backdrop: HTMLCanvasElement }) {
  if (!new URLSearchParams(window.location.search).has("fxdebug")) return;
  const w = window as Window & { __orcaGlass?: GlassDebug };
  w.__orcaGlass ??= {};
  w.__orcaGlass[id] = entry;
}

/** Run `cb` after load, fonts and the hero's entrance, at idle. */
function whenSettled(cb: () => void): () => void {
  let gone = false;
  let timer: number | undefined;
  let idleId: number | undefined;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((done) => window.addEventListener("load", () => done(), { once: true }));
  void Promise.all([loaded, document.fonts?.ready ?? Promise.resolve()]).then(() => {
    if (gone) return;
    timer = window.setTimeout(() => {
      if (gone) return;
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => !gone && cb(), { timeout: 1500 });
      else cb();
    }, SETTLE_MS);
  });
  return () => {
    gone = true;
    window.clearTimeout(timer);
    if (idleId != null) w.cancelIdleCallback?.(idleId);
  };
}

function pageRect(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
}

/** The control is the anchor's next element sibling (decorations render first). */
function tablistOf(anchor: HTMLElement | null): HTMLElement | null {
  const el = anchor?.nextElementSibling;
  return el instanceof HTMLElement ? el : null;
}
function tabsOf(list: HTMLElement): HTMLElement[] {
  return Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
}
function selectedIndex(list: HTMLElement): number {
  return Math.max(0, tabsOf(list).findIndex((t) => t.getAttribute("aria-selected") === "true"));
}

/* ------------------------------------------------------------------ */
/* The question tabs: a loupe over the distance scale, one still per   */
/* tab, moved by crossfade.                                            */
/* ------------------------------------------------------------------ */

function TabsLoupe({ tier, children }: { tier: Exclude<GlassTier, "off">; children: ReactNode }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const hostsRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Exclude<GlassTier, "off">>(tier);
  const [stripW, setStripW] = useState<number | null>(null);
  const [numerals, setNumerals] = useState<ScaleNumeral[]>([]);
  const [cssRect, setCssRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // The scale strip follows the tablist's width; numerals from the shared geometry.
  useEffect(() => {
    const list = tablistOf(anchorRef.current);
    if (!list) return;
    const fit = () => {
      const w = list.offsetWidth;
      setStripW(w);
      setNumerals(scaleNumerals(w));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    note("tabs", mode === "gl" ? "waiting" : "live");
    return () => note("tabs", null);
  }, [mode]);

  // The WebGL stills: armed once the page has settled, rebuilt on resize or
  // a size change (a language switch re-sets the labels), never on a press.
  useEffect(() => {
    if (mode !== "gl") return;
    const hosts = hostsRef.current;
    const anchor = anchorRef.current;
    let gone = false;
    let timer: number | undefined;
    const ctl = new AbortController();

    const clear = () => {
      if (hosts) hosts.replaceChildren();
    };

    const arm = async () => {
      const list = tablistOf(anchor);
      const strip = stripRef.current;
      const sheet = list?.closest(".chart-sheet");
      if (!list || !strip || !sheet || !hosts) return;
      note("tabs", "loading");
      try {
        const { armTabs } = await import("./glassArm");
        if (gone) return;
        const tabs = tabsOf(list);
        const stripPage = pageRect(strip);
        const lenses = tabs.map((t) => {
          const r = pageRect(t);
          return {
            x: r.x - TAB_LENS_BLEED_X,
            y: stripPage.y - TAB_LENS_BLEED_Y,
            width: r.width + TAB_LENS_BLEED_X * 2,
            height: stripPage.height + TAB_LENS_BLEED_Y * 2,
          };
        });
        const result = await underLease(ctl.signal, () =>
          armTabs({
            sheetEl: sheet,
            strip: { x: stripPage.x, y: stripPage.y, width: strip.offsetWidth },
            lenses,
            dpr: Math.min(window.devicePixelRatio || 1, 2),
          }),
        );
        if (gone) return;
        const sel = selectedIndex(list);
        clear();
        result.stills.forEach((still, i) => {
          const tab = tabs[i];
          const host = document.createElement("span");
          host.className = "glass-host glass-host-tab";
          host.style.left = `${tab.offsetLeft - TAB_LENS_BLEED_X}px`;
          host.style.top = `${strip.offsetTop - TAB_LENS_BLEED_Y}px`;
          host.style.width = `${lenses[i].width}px`;
          host.style.height = `${lenses[i].height}px`;
          host.dataset.sel = i === sel ? "1" : "0";
          still.style.width = "100%";
          still.style.height = "100%";
          host.appendChild(still);
          hosts.appendChild(host);
        });
        hosts.dataset.live = "1";
        note("tabs", "live");
        debugStash("tabs", { ms: result.ms, backdrop: result.backdrop });
      } catch {
        if (!gone) {
          clear();
          setMode("css");
          note("tabs", "failed");
        }
      }
    };

    const rearm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void arm(), REARM_DEBOUNCE_MS);
    };
    // Note on font swaps: the only face the texture carries is Spline Sans
    // Mono (the ruler's digits), and arming waits for document.fonts.ready.
    // A later font load (e.g. Devanagari for a tab's question) cannot change
    // the texture, so it does not re-arm — a tab press must never open a
    // context, even indirectly.
    const cancelSettle = whenSettled(() => void arm());
    window.addEventListener("resize", rearm);
    const list = tablistOf(anchor);
    const ro = list ? new ResizeObserver(rearm) : null;
    if (list && ro) ro.observe(list);
    return () => {
      gone = true;
      ctl.abort();
      cancelSettle();
      window.clearTimeout(timer);
      window.removeEventListener("resize", rearm);
      ro?.disconnect();
      clear();
    };
  }, [mode]);

  // Selection: crossfade between the pre-rendered stills (gl) or move the
  // CSS lens. No canvas is created here.
  useEffect(() => {
    const list = tablistOf(anchorRef.current);
    if (!list) return;
    const apply = () => {
      const sel = selectedIndex(list);
      const hosts = hostsRef.current;
      if (hosts) {
        Array.from(hosts.children).forEach((h, i) => {
          if (h instanceof HTMLElement) h.dataset.sel = i === sel ? "1" : "0";
        });
      }
      const strip = stripRef.current;
      const tab = tabsOf(list)[sel];
      if (mode === "css" && strip && tab) {
        setCssRect({
          left: tab.offsetLeft - TAB_LENS_BLEED_X,
          top: strip.offsetTop - TAB_LENS_BLEED_Y,
          width: tab.offsetWidth + TAB_LENS_BLEED_X * 2,
          height: strip.offsetHeight + TAB_LENS_BLEED_Y * 2,
        });
      }
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(list, { attributes: true, attributeFilter: ["aria-selected"], subtree: true });
    return () => mo.disconnect();
  }, [mode]);

  return (
    <>
      <span ref={anchorRef} className="glass-anchor" aria-hidden />
      {children}
      <div
        ref={stripRef}
        className="glass-scale"
        aria-hidden
        style={stripW != null ? { width: stripW } : undefined}
      >
        {numerals.map((n, i) => (
          <span key={n.x} style={{ left: n.x }} data-first={i === 0 ? "1" : undefined}>
            {n.text}
          </span>
        ))}
      </div>
      {mode === "css" && cssRect && (
        <span
          className="glass-css"
          aria-hidden
          style={{ left: cssRect.left, top: cssRect.top, width: cssRect.width, height: cssRect.height }}
        />
      )}
      <span ref={hostsRef} className="glass-hosts" aria-hidden />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The primary action: one glass slab on the page ground. Its only     */
/* fallback is the solid button.                                       */
/* ------------------------------------------------------------------ */

function OpenLoupe({ children }: { children: ReactNode }) {
  const ruleRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    note("open", failed ? "failed" : "waiting");
    return () => note("open", null);
  }, [failed]);

  useEffect(() => {
    if (failed) return;
    let gone = false;
    let timer: number | undefined;
    let scrollTimer: number | undefined;
    /** The scroll the still was drawn at: the ground under the slab is a fixed layer. */
    let armedAt: { x: number; y: number } | null = null;
    let arming = false;
    /** A resize or scroll asked for a new still while one was being drawn. */
    let again = false;
    const ctl = new AbortController();
    // The decorations render before the children: the control is the host's
    // next element sibling.
    const control = hostRef.current?.nextElementSibling;
    const host = hostRef.current;
    const rule = ruleRef.current;
    if (!(control instanceof HTMLElement) || !host || !rule) return;

    const clear = () => {
      host.replaceChildren();
      delete host.dataset.live;
      delete control.dataset.glassLive;
      delete rule.dataset.live;
    };

    const arm = async () => {
      if (arming) {
        again = true;
        return;
      }
      arming = true;
      note("open", "loading");
      try {
        const { armOpen } = await import("./glassArm");
        if (gone) return;
        const { result, at, lens } = await underLease(ctl.signal, async () => {
          // Measured inside the lease: the ground is painted at this scroll.
          const at = { x: window.scrollX, y: window.scrollY };
          const btn = pageRect(control);
          const lens = { x: btn.x - 3, y: btn.y - 3, width: btn.width + 6, height: btn.height + 6 };
          const ruleSpec = { x: btn.x - RULE_BLEED, baseY: btn.y + btn.height - 3, width: btn.width + RULE_BLEED * 2 };
          const result = await armOpen({ lens, rule: ruleSpec, dpr: Math.min(window.devicePixelRatio || 1, 2) });
          return { result, at, lens };
        });
        if (gone) return;
        armedAt = at;
        clear();
        // Position against the shared offsetParent, like the lens host.
        rule.style.left = `${control.offsetLeft - RULE_BLEED}px`;
        rule.style.top = `${control.offsetTop + control.offsetHeight - 3 - RULE_H}px`;
        rule.style.width = `${control.offsetWidth + RULE_BLEED * 2}px`;
        rule.style.height = `${RULE_H}px`;
        rule.dataset.live = "1";
        host.style.left = `${control.offsetLeft - 3}px`;
        host.style.top = `${control.offsetTop - 3}px`;
        host.style.width = `${lens.width}px`;
        host.style.height = `${lens.height}px`;
        const still = result.stills[0];
        still.style.width = "100%";
        still.style.height = "100%";
        host.appendChild(still);
        host.dataset.live = "1";
        control.dataset.glassLive = "1";
        note("open", "live");
        debugStash("open", { ms: result.ms, backdrop: result.backdrop });
      } catch {
        if (!gone) {
          clear();
          setFailed(true);
        }
      } finally {
        arming = false;
        if (again && !gone) {
          again = false;
          rearm();
        }
      }
    };

    const rearm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void arm(), REARM_DEBOUNCE_MS);
    };
    // The slab's still shows the fixed ground as it lay under the button at
    // the scroll it was drawn at. Once scrolling settles somewhere else with
    // the button on screen, draw it again (a lease permitting), so the
    // graticule under the glass lines up with the graticule around it.
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (!armedAt || gone) return;
        const moved =
          Math.abs(window.scrollY - armedAt.y) > SCROLL_DRIFT_PX ||
          Math.abs(window.scrollX - armedAt.x) > SCROLL_DRIFT_PX;
        const r = control.getBoundingClientRect();
        const onScreen = r.bottom > 0 && r.top < window.innerHeight;
        if (moved && onScreen) void arm();
      }, SCROLL_SETTLE_MS);
    };
    const cancelSettle = whenSettled(() => void arm());
    window.addEventListener("resize", rearm);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      gone = true;
      ctl.abort();
      cancelSettle();
      window.clearTimeout(timer);
      window.clearTimeout(scrollTimer);
      window.removeEventListener("resize", rearm);
      window.removeEventListener("scroll", onScroll);
      clear();
    };
  }, [failed]);

  if (failed) return <>{children}</>;
  return (
    <>
      <span ref={ruleRef} className="glass-rule" aria-hidden />
      <span ref={hostRef} className="glass-host glass-host-open" aria-hidden />
      {children}
    </>
  );
}

export default function GlassLoupe({ id, children }: { id: string; children: ReactNode }) {
  const tier = useMemo(() => glassTier(), []);
  const on = tier !== "off" && loupesHere().includes(id);
  if (!on) return <>{children}</>;
  if (id === "tabs") return <TabsLoupe tier={tier}>{children}</TabsLoupe>;
  // The primary action has no CSS tier: its fallback is the solid button.
  if (tier !== "gl") return <>{children}</>;
  return <OpenLoupe>{children}</OpenLoupe>;
}
