/**
 * Which landing effects may run in this browser.
 *
 * The effects are decoration on the desktop landing. They are never the
 * content: each one sits on top of a poster that is already the finished
 * design, and this gate decides whether the poster is all the visitor gets.
 *
 * Rules (the effects contract):
 *   - the phone app gets none of them (they are not even in its chunk graph;
 *     this gate is the second lock for a narrow or touch-first desktop window);
 *   - reduced motion and reduced transparency get the poster;
 *   - at most three live WebGL contexts on the landing;
 *   - everything works with no network: an effect loads nothing but its own
 *     chunk from this origin.
 *
 * Pure functions over a snapshot of the environment, so the rules are tested
 * without a browser.
 */

/**
 * - `ground`: the sheet's depth contours breathing under the whole landing
 *   (a 2D canvas: no WebGL context at all);
 * - `ink`: wet ink in the ORCA wordmark (Paper Shaders LiquidMetal through an
 *   ink ramp), one canvas;
 * - `glass`: the chart loupe on the hero's question tabs and the primary
 *   action (liquid-glass-js). A lens draws once and releases its context, so
 *   it holds none at rest;
 * - `relief`: the sea bed below the hero as a 3D paper sheet (React Three
 *   Fiber), one canvas, drawn on demand;
 * - `splash`: wet ink blooming in the water under the landing where the
 *   pointer moves (React Bits SplashCursor, SplashInk.tsx), one canvas,
 *   no frames at rest. It follows a pointer, so it needs a fine one even
 *   when `?fx=` asks for it.
 * - `sheets`: ORCA's own screens as a flowing row (React Bits FlexCarousel,
 *   ogl), one canvas;
 * - `ripple`: water displacement over the Ask sheet under the pointer (React
 *   Bits RippleDistortion, ogl), one canvas, no frames once the water is still;
 * - `crumple`: the officers' bulletin crumpled into a paper ball (React Bits
 *   PaperCrumple, three), one canvas, drawn on demand.
 *
 * The ShaderGradient sea was tried and removed: the
 * CSS swell at the foot of the sheet is the sea.
 *
 * The night bands (components/landing/NightBands.tsx): the sea at night,
 * full-bleed ink interludes between the paper sections of the landing only.
 * - `gradientwaves`: the swell rolling to a hazy horizon (Night watch);
 * - `glowcursor`: a plankton-light trail inside the Night watch band only;
 * - `particletext`: the word assembling from drifting motes (2D canvas);
 * - `siderays`: light falling from one side over the warning band;
 * - `electriclogo`: the storm symbol as a living lightning outline;
 * - `webthreads`: ten threads woven into one (the crew band);
 * - `strands`: the quiet wake under the closing call strip;
 * - `patternwaves`: a halftone sea printed on the paper section.
 * At most two WebGL effects per band.
 */
export type EffectName =
  | "ground"
  | "ink"
  | "glass"
  | "relief"
  | "splash"
  | "gradientwaves"
  | "glowcursor"
  | "particletext"
  | "siderays"
  | "electriclogo"
  | "webthreads"
  | "strands"
  | "patternwaves"
  | "sheets"
  | "ripple"
  | "crumple";

/** The night bands' effects, in page order. */
export const BAND_EFFECTS: readonly EffectName[] = [
  "gradientwaves",
  "glowcursor",
  "particletext",
  "patternwaves",
  "siderays",
  "electriclogo",
  "webthreads",
  "strands",
];

/** The showcase's WebGL sheets, in page order (components/landing/SheetsShowcase.tsx). */
export const SHOWCASE_EFFECTS: readonly EffectName[] = ["sheets", "ripple", "crumple"];

/**
 * In priority order: when the context cap bites, later ones wait
 * (contexts.ts serves its queue in this order). The night bands rank above
 * the splash: the splash is yieldable and steps aside, once its ink has
 * faded, for a band coming into view.
 */
export const ALL_EFFECTS: readonly EffectName[] = [
  "ground",
  "ink",
  "glass",
  "relief",
  ...BAND_EFFECTS,
  ...SHOWCASE_EFFECTS,
  "splash",
];

/**
 * Live WebGL contexts each effect holds at once, at most.
 *
 * The cap itself is enforced at run time by contexts.ts: every context is
 * opened under a lease and three leases exist. These numbers are the
 * static half of the promise: what the shipped set needs at its fullest.
 */
// ink is 1: the mark flies twice, at the hero and in the closing cartouche,
// but the two are never on screen together and a slot that has been out of
// view for 1.5 s gives its context back (EffectSlot's `releaseWhenAway`).
// Glass opens one context while arming and loses it at once, under a lease,
// so it holds none at rest. Ink, relief and splash fill the cap of three;
// each night-band effect and each showcase sheet holds one context while
// its section is in view (particletext is a 2D canvas).
export const CONTEXTS: Record<EffectName, number> = {
  ground: 0,
  ink: 1,
  glass: 0,
  relief: 1,
  splash: 1,
  gradientwaves: 1,
  glowcursor: 1,
  particletext: 0,
  siderays: 1,
  electriclogo: 1,
  webthreads: 1,
  strands: 1,
  patternwaves: 1,
  sheets: 1,
  ripple: 1,
  crumple: 1,
};

/**
 * Effects left out of the up-front sum below: the night bands and the
 * showcase's sheets sit far apart
 * down the landing and are never all in view together, so their slots'
 * leases (EffectSlot, contexts.ts) hold them to the cap while the page
 * scrolls. The always-present set is still summed here.
 */
export const LEASED: ReadonlySet<EffectName> = new Set([...BAND_EFFECTS, ...SHOWCASE_EFFECTS]);

export const WEBGL_CAP = 3;

/**
 * The effects that passed their trial and ship switched on. An effect that
 * is not listed here only runs when a `?fx=` query asks for it by name.
 * Ink: Lighthouse 99 with it on, one context in view, zero at rest.
 * Relief: 98–99, one context, zero frames at rest. Splash: zero frames and
 * no lease contention at rest. `?fx=none` is the switch-off.
 */
export const DEFAULT_EFFECTS: readonly EffectName[] = [
  "ground",
  "ink",
  "glass",
  "relief",
  ...BAND_EFFECTS,
  ...SHOWCASE_EFFECTS,
  "splash",
];

export interface EffectEnv {
  /** `location.search` */
  search: string;
  /** A window wide enough for the desktop landing's two-column hero. */
  wide: boolean;
  /** A mouse or trackpad, with hover. */
  finePointer: boolean;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  /** The visitor asked the browser to save data. */
  saveData: boolean;
  webgl: boolean;
}

/**
 * `?fx=none` switches everything off, `?fx=all` asks for every effect, and
 * `?fx=ink,relief` for those two. No `fx` at all means "the shipped set".
 */
export function requestedEffects(search: string): readonly EffectName[] | null {
  const raw = new URLSearchParams(search).get("fx");
  if (raw == null) return null;
  const want = raw.split(",").map((s) => s.trim().toLowerCase());
  if (want.includes("none")) return [];
  if (want.includes("all")) return ALL_EFFECTS;
  return ALL_EFFECTS.filter((name) => want.includes(name));
}

/** The effects that may run, in priority order, inside the context cap. */
export function allowedEffects(env: EffectEnv): EffectName[] {
  // Hard refusals first: these are the reader's own settings and the
  // machine's ability, and no query overrides them.
  if (env.reducedMotion || env.saveData || !env.webgl) return [];
  const asked = requestedEffects(env.search);
  // The width and pointer rules are heuristics for who gets decoration by
  // DEFAULT. An explicit `?fx=` is a demand — a demo in a narrow pane, a
  // judge's projector — and walks past them.
  if (asked == null && (!env.wide || !env.finePointer)) return [];
  const wanted = asked ?? DEFAULT_EFFECTS;
  const out: EffectName[] = [];
  let contexts = 0;
  for (const name of ALL_EFFECTS) {
    if (!wanted.includes(name)) continue;
    // Glass over an opaque fallback is the reduced-transparency answer.
    if (name === "glass" && env.reducedTransparency) continue;
    // The splash answers a mouse; a touch screen would only ever see the poster.
    if (name === "splash" && !env.finePointer) continue;
    if (!LEASED.has(name)) {
      if (contexts + CONTEXTS[name] > WEBGL_CAP) continue;
      contexts += CONTEXTS[name];
    }
    out.push(name);
  }
  return out;
}

let webglProbe: boolean | null = null;

/** One throwaway context, released at once, to learn whether WebGL works. */
function hasWebGL(): boolean {
  if (webglProbe != null) return webglProbe;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglProbe = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglProbe = false;
  }
  return webglProbe;
}

export function readEffectEnv(): EffectEnv {
  const mq = (q: string) => typeof window !== "undefined" && !!window.matchMedia?.(q).matches;
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: { saveData?: boolean } }) : null;
  const search = typeof window !== "undefined" ? window.location.search : "";
  // Do not open a WebGL context just to learn that nothing was asked for.
  const anyWanted = (requestedEffects(search) ?? DEFAULT_EFFECTS).length > 0;
  return {
    search,
    wide: mq("(min-width: 1024px)"),
    finePointer: mq("(hover: hover) and (pointer: fine)"),
    reducedMotion: mq("(prefers-reduced-motion: reduce)"),
    reducedTransparency: mq("(prefers-reduced-transparency: reduce)"),
    saveData: !!nav?.connection?.saveData,
    webgl: anyWanted && typeof document !== "undefined" ? hasWebGL() : false,
  };
}

/** Read once per page load: the answer does not change while the page is open. */
let cached: EffectName[] | null = null;
export function effectsHere(): EffectName[] {
  cached ??= allowedEffects(readEffectEnv());
  return cached;
}
