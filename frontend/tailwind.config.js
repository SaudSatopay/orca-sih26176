import { colors } from "./src/tokens.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // "Living nautical chart": warm chart paper, marine ink, shallow-water
      // teal, and buoy/signal colours. The values live in src/tokens.ts, the
      // one source shared with canvas, Leaflet and SVG code.
      colors,
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
      // Transform-only entrances, deliberately: an animation that starts at
      // opacity 0 with fill-mode both leaves content INVISIBLE if animations
      // never run (hidden tab, some projectors) — and these carry safety data.
      keyframes: {
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
        rise: "rise .35s ease-out both",
        stampIn: "stampIn .45s cubic-bezier(.2,.9,.3,1.2) both",
      },
    },
  },
  plugins: [],
};
