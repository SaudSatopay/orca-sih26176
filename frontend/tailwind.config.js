import { colors, fontSize, shadow, textColors } from "./src/tokens.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Every `hover:` utility sits behind `@media (hover: hover) and (pointer: fine)`:
  // a finger never leaves a control stuck in its hover state.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      // "Living nautical chart": warm chart paper, marine ink, shallow-water
      // teal, and buoy/signal colours. The values live in src/tokens.ts, the
      // one source shared with canvas, Leaflet and SVG code.
      colors,
      // Status colours print darker as text (tokens.ts, `riskInk`): this
      // changes the `text-risk-*`, `text-chance-*` and `text-signal`
      // utilities only.
      textColor: textColors,
      // The nine-step type scale (label … hero), also from src/tokens.ts.
      fontSize,
      // Elevation: a sheet on the table, a row under the pointer.
      boxShadow: shadow,
      fontFamily: {
        display: [
          '"Fraunces Variable"',
          '"Noto Serif Devanagari Variable"',
          "Georgia",
          "serif",
        ],
        sans: [
          '"Archivo Variable"',
          '"Segoe UI"',
          '"Nirmala UI"',
          "system-ui",
          "sans-serif",
        ],
        mono: ['"Spline Sans Mono Variable"', '"Nirmala UI"', "Consolas", "monospace"],
      },
      // Transform-only entrances with no fill-mode: if an animation never
      // runs, the element is simply at rest, fully visible.
      keyframes: {
        // The vendored UI kit (src/ui): transform-only loops, no fill-mode.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        rise: {
          "0%": { transform: "translateY(8px)" },
          "100%": { transform: "translateY(0)" },
        },
        stampIn: {
          "0%": { transform: "scale(1.3) rotate(-5deg)" },
          "60%": { transform: "scale(0.96) rotate(-1.4deg)" },
          "100%": { transform: "scale(1) rotate(-2deg)" },
        },
      },
      animation: {
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        ripple: "ripple var(--duration, 2.4s) ease calc(var(--i, 0) * 0.2s) infinite",
        rise: "rise .26s ease-out",
        stampIn: "stampIn .45s cubic-bezier(.2,.9,.3,1.2)",
      },
    },
  },
  plugins: [],
};
