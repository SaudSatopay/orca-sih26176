import { paper } from "../../tokens";

/**
 * The chart's tropical-storm symbol — two swept arms around a ringed eye —
 * at the geometry the hero sheet draws it (HeroChart: arms of radius 23 and
 * width 6, the eye 10.5 across with a paper centre), on a 64-unit square.
 * The warning band prints it as a poster and hands it to the lightning
 * outline (effects/ElectricLogo.tsx) as an image to trace.
 */
export const STORM_BOX = 64;
export const STORM_ARMS = ["M32 9 A 23 23 0 0 1 55 32", "M32 55 A 23 23 0 0 1 9 32"] as const;
export const STORM_ARM_WIDTH = 6;
/** The eye as a ring: outer radius 10.5, inner 4, like the hero's paper-centred core. */
export const STORM_EYE = { r: 7.25, width: 6.5 } as const;

/**
 * The symbol as an SVG data URL, for tracing. Any opaque ink would do (the
 * tracer reads coverage, not colour); it is drawn in paper so no colour is
 * spelled here. Rendered large so the trace is sharp.
 */
export function stormDataUrl(px = 560): string {
  const ink = paper[50];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${STORM_BOX} ${STORM_BOX}" fill="none">` +
    STORM_ARMS.map(
      (d) => `<path d="${d}" stroke="${ink}" stroke-width="${STORM_ARM_WIDTH}" stroke-linecap="round"/>`,
    ).join("") +
    `<circle cx="32" cy="32" r="${STORM_EYE.r}" stroke="${ink}" stroke-width="${STORM_EYE.width}"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
