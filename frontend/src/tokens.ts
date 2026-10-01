/**
 * ORCA design tokens — the one source for every colour and type size.
 *
 * - Tailwind reads this file in `tailwind.config.js`, so `text-ink-900`,
 *   `bg-paper-50`, `text-label` and the rest are generated from it.
 * - `index.css` derives its custom properties from it with `theme()`.
 * - Code that needs a value in JavaScript (the canvas in FlowLayer, Leaflet
 *   path styles and marker HTML, SVG attributes) imports it from here.
 *
 * Nothing else in `src/` may spell a colour as a literal. DESIGN.md describes
 * what each token is for.
 */

/** Chart paper: the sheet and everything printed on it. */
export const paper = {
  50: "#FBF7ED", // panels, fields
  100: "#F5EEDD", // the sheet itself
  150: "#EFE6CF", // hover tint
  200: "#E6DABD",
  300: "#D6C7A2",
  400: "#B9A67C", // aged edge
} as const;

/**
 * Marine ink. 400 is the lightest ink that may carry text: 4.51:1 on paper-100
 * and 4.88:1 on paper-50 (it was #5D7386, 4.26:1 on the sheet). 300 is
 * decoration only — rules and quiet icons — at 2.9:1.
 */
export const ink = {
  900: "#12212D", // headings, primary buttons
  800: "#1B2F3E",
  700: "#263B4D", // body text
  500: "#42596D", // secondary text
  400: "#5A6F81", // labels, placeholders, inactive tabs
  300: "#82949F", // rules, quiet icons; never text
} as const;

/** Shallow-water teal, the one accent. */
export const chart = {
  700: "#174F68",
  600: "#1E5F7A",
  500: "#2A7391", // focus ring, links, the sea
  300: "#7FA9BC",
  100: "#D8E7EB",
} as const;

/** Buoy red: restricted marks. */
export const signal = "#C7442E";

/** Status only, never decoration. */
export const risk = {
  low: "#1D7A50",
  moderate: "#A17000",
  high: "#BF4E12",
  extreme: "#AF2318",
} as const;

/**
 * Chance of fish, below "very good" (which is `risk.low`): the ring on a
 * buoy, the sounding beside a ground, the top of the wind and current ramps.
 */
export const chance = {
  good: "#63862B",
  some: "#B08000",
  poor: "#9C5F44",
} as const;

/** Sea-surface temperature shade under the particle field, cold to hot. */
export const sst = {
  cold: "#3E7A99", // up to 25.0 °C
  cool: "#2F8A7D", // up to 27.0 °C
  mild: "#7E9A4A", // up to 28.5 °C
  warm: "#B08532", // up to 30.0 °C
  hot: "#BF6A1F", // above
} as const;

/** The particle field: the slowest wind or current, a pale wash of chart teal. */
export const flow = {
  calm: "#8FB0C0",
} as const;

/** Open water behind the map tiles while they load. */
export const sea = "#CFE0E6";

/** `#RRGGBB` at an opacity, as a CSS colour. */
export function alpha(hex: string, opacity: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
}

/** Hairlines: ink at three strengths. */
export const rule = {
  faint: alpha(ink[900], 0.14), // dividers inside a panel
  DEFAULT: alpha(ink[900], 0.28), // panel borders
  strong: alpha(ink[900], 0.55), // neatlines, the double rule
} as const;

/** Everything Tailwind turns into colour utilities. */
export const colors = { paper, ink, chart, signal, risk, chance, sst, flow, sea, rule } as const;
