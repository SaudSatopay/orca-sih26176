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
 *
 * After editing this file, restart `npm run dev`: the running dev server keeps
 * the Tailwind config it started with. Builds and tests always read it fresh.
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
 * Marine ink. 400 is the lightest ink that may carry text. It holds 4.5:1 on
 * every ground a label sits on: 5.50 on paper-50, 5.09 on the sheet, 4.73 on
 * the hover tint, 5.00 on a tinted cell. (It was #5A6F81, which fell to 4.43
 * on tinted cells and 4.20 on hover.) 300 is decoration only, rules and quiet
 * icons, at 2.9:1.
 */
export const ink = {
  900: "#12212D", // headings, primary buttons
  800: "#1B2F3E",
  700: "#263B4D", // body text
  500: "#42596D", // secondary text
  400: "#526778", // labels, placeholders, inactive tabs
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

/**
 * Status colours print darker as text. The values above are fills: rings,
 * bars, squares, hatching, the dial's arc. Set as text they fall under 4.5:1
 * on chart paper (moderate is 4.06:1 on paper-50, "some chance" 3.31:1), so
 * each has an ink of the same hue, the lightest that holds 4.6:1 on the
 * darkest paper that carries text (paper-200). Tailwind's `text-risk-*`,
 * `text-chance-*` and `text-signal` resolve to these inks, so a status word
 * is legible wherever it is set; `bg-`, `border-`, `fill-` and `stroke-`
 * keep the fill. In JavaScript: `RISK_INK` and `RATING_INK` (risk.ts).
 */
export const riskInk = {
  low: "#1A6C47",
  moderate: "#7E5800",
  high: "#A0410F",
  extreme: "#AF2318", // the fill already holds 4.92:1 on paper-200
} as const;

export const chanceInk = {
  good: "#4C6721",
  some: "#7B5900",
  poor: "#86523A",
} as const;

export const signalInk = "#A83927";

/** Tailwind `textColor` overrides: the status colours as text. */
export const textColors = { risk: riskInk, chance: chanceInk, signal: signalInk } as const;

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

/** The top edge of a sheet catching the light: the one use of white. */
export const sheen = "#FFFFFF";

/**
 * Elevation. A sheet lies on the chart table, and a row lifts a little under
 * the pointer; nothing floats higher than that. Tailwind: `shadow-sheet`,
 * `shadow-lift`; in CSS: `theme(boxShadow.sheet)`.
 */
export const shadow = {
  sheet: [
    `inset 0 1px 0 ${alpha(sheen, 0.55)}`,
    `0 1px 3px ${alpha(ink[900], 0.1)}`,
    `0 14px 30px -20px ${alpha(ink[900], 0.35)}`,
  ].join(", "),
  lift: [
    `inset 0 1px 0 ${alpha(sheen, 0.55)}`,
    `0 3px 6px ${alpha(ink[900], 0.1)}`,
    `0 22px 40px -22px ${alpha(ink[900], 0.45)}`,
  ].join(", "),
} as const;

/**
 * The type scale, in CSS pixels: nine steps, a minor third (x1.2) apart,
 * counted from 16 and rounded to the pixel. Nothing is set smaller than 11.
 * One step per role; a size is never written as a literal. Sizes only:
 * line-height stays with the element.
 */
export const TYPE_RATIO = 1.2;
export const TYPE_BASE = 16;
export const typePx = {
  label: 11, // the mono label, table heads, stamps, buttons, readouts, footnotes
  body: 13, // running text: conversation, advice, fields, tables, chips
  lead: 16, // lead lines, panel titles, the phone's body copy
  title: 19, // card and row titles, the advice headline, LISTEN
  headline: 23, // section headlines, instrument figures, the verdict line
  numeral: 28, // large soundings, the ORCA wordmark, return-by
  display: 33, // the authority board's totals
  dial: 40, // the risk dial numeral, the phone's score
  hero: 48, // the landing claim, the largest text in the product
} as const;

export type TypeStep = keyof typeof typePx;

/** The same scale as Tailwind `fontSize` entries: `text-label`, `text-body`… */
export const fontSize = Object.fromEntries(
  Object.entries(typePx).map(([step, px]) => [step, `${px}px`]),
) as Record<TypeStep, string>;

/** Everything Tailwind turns into colour utilities. */
export const colors = { paper, ink, chart, signal, risk, chance, sst, flow, sea, rule } as const;
