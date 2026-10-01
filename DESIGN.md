# ORCA — design system: the living nautical chart

Extracted from the shipped code on 1 October 2026 (`frontend/tailwind.config.js`, `frontend/src/index.css`, the components). This file is the single source of truth for visual decisions. The system below is kept; the last two sections list its debts and the additions proposed for it.

## The idea

The interface is drawn the way sea charts are drawn, because that is the visual language fishers, pilots and port officers already read. A light sheet also projects better than a dark dashboard. Everything on screen should look like a drafted chart that happens to be alive.

Audience feeling in one word: **trust**.

## Colour tokens

| Role | Token | Value | Use |
|---|---|---|---|
| Surface | `paper-50` | `#FBF7ED` | panels, fields |
| Surface | `paper-100` | `#F5EEDD` | the sheet (page background) |
| Surface | `paper-150` / `200` / `300` / `400` | `#EFE6CF` `#E6DABD` `#D6C7A2` `#B9A67C` | tints, aged edges |
| Ink | `ink-900` | `#12212D` | headings, primary buttons |
| Ink | `ink-800` / `700` | `#1B2F3E` `#263B4D` | body text |
| Ink | `ink-500` / `400` | `#42596D` `#5D7386` | secondary text, labels |
| Ink | `ink-300` | `#82949F` | decoration only (fails AA as text on paper) |
| Accent | `chart-500` | `#2A7391` | the one accent: focus ring, links, the sea, signals |
| Accent | `chart-700` / `600` / `300` / `100` | `#174F68` `#1E5F7A` `#7FA9BC` `#D8E7EB` | accent steps |
| Signal | `signal` | `#C7442E` | buoy red, restricted marks |
| Semantic | `risk-low` | `#1D7A50` | LOW, good chance of fish |
| Semantic | `risk-moderate` | `#A17000` | MODERATE |
| Semantic | `risk-high` | `#BF4E12` | HIGH |
| Semantic | `risk-extreme` | `#AF2318` | EXTREME, official warnings |
| Rules | `--rule-faint` / `--rule` / `--rule-strong` | ink at 14 / 28 / 55 percent | hairlines, panel borders, neatlines |

Proportion: paper carries about 70 percent, ink about 25, chart teal and the risk colours share the rest. Risk colours are status only and never decorate.

## Type

| Role | Family | Where |
|---|---|---|
| Display | Fraunces Variable (with Noto Serif Devanagari Variable for hi and mr) | wordmark, headlines, verdicts, buoy numbers, soundings (italic, `SOFT` 40) |
| Body | Archivo Variable | running text, list items |
| Mono | Spline Sans Mono Variable | labels (10 px, uppercase, tracking 0.16em), buttons, instrument readouts |

All four are self-hosted through `@fontsource-variable` imports in `main.tsx`; nothing loads from a font CDN.

## Shape, surface, depth

- Radius: 2 px on controls, 3 px on panels. Nothing rounder except buoys, dials and pulse dots, which are circles.
- Panels (`.panel`): paper-50, one hairline border, a soft table shadow. `.panel-tint` is the flat variant. `.rule-double` (3 px double top rule) marks a sheet's lead panels only.
- Panel headers (`.hd`): mono label on a shallow-water wash.
- The page: graticule grid at 130 px, aged-edge vignette, bathymetric contours lower left, compass rose upper right, one grain pass at 4.5 percent, and the sea at the foot of every page (three swell layers and passing schools of fish).

## Chart semantics as components

- `.stamp`: verdicts land as a rotated rubber stamp (−2 degrees, double border).
- `.hatch-danger` and the SVG `zone-hatch-*` patterns: restricted areas are actually hatched.
- `.sounding`: probabilities and depths as italic serif numerals.
- `.chart-sheet` + `.chart-frame`: the map sits inside a tick-marked neatline with a compass rose.
- Buoy markers numbered by rank, so area 1 always means best chance.
- `.wave-rule`: the sea-surface symbol as a section divider.
- Icons are hand-drawn inline SVG in `glyphs.tsx`. No emoji, no icon font.
- Controls: `.btn-ink` (primary), `.btn-line` (secondary), `.btn-square`, `.chip`, `.tab` (folio tab whose underline draws from the left), `.field`.

## Motion doctrine (as shipped)

- Entrances are transform-only (`rise` 350 ms, `stampIn` 450 ms, `growx` 900 ms, `popin` 400 ms). Nothing starts at opacity 0, so safety data is visible even if an animation never runs.
- UI transitions are 200 to 300 ms.
- Ambient loops belong to things that would move at sea: buoys bob (3.4 s), the hull rolls (4.2 s), the compass needle sways (7 s), waterlines crawl, the plotted course's dashes run, the storm symbol turns, signals travel the pipeline, the swell drifts.
- The chart's sea is a canvas particle field (`FlowLayer.ts`) of wind or surface current over a sea-temperature shade. It checks `prefers-reduced-motion` itself.
- `prefers-reduced-motion: reduce` collapses every CSS animation and transition.
- Focus: 2 px dashed chart-teal outline, 2 px offset, on everything focusable.

## Layout

- Desktop console: masthead panel with folio tabs, then a two-column working sheet (chart left, plan or conversation right).
- At 640 px and below, a separate phone app renders (`MobileApp.tsx`): three bottom tabs, one verdict circle, one LISTEN button, tap-to-hear cards.
- Content gutter 24 px on the console, 120 px on the landing at 1440.

## Signature moment (spec for the next flight)

**The chart answers.** Lives in the landing hero, replacing the small static course illustration.

1. At rest (and with JavaScript off, or reduced motion): the finished chart as a static SVG poster, with the course plotted, the no-go area hatched and the verdict stamp already down. The hero is complete at rest.
2. On load, once: a question types itself in the fisher's language (about 600 ms), the ten agent names tick in along the neatline (stagger 50 ms), the course draws itself around the hatched area (stroke-dashoffset, 700 ms), and the verdict stamps (`stampIn`). Total under 2.5 s, transform and stroke only.
3. After that: the sea under the chart moves, using the existing `FlowLayer` particle field, lazy-loaded after first paint and paused when off-screen.
4. Interaction: the three scenario chips (safe, danger, cyclone) replay the sequence with that scenario's real numbers from `/api/scenarios`. Response to a tap under 100 ms.
5. Budget: no new dependency, under 10 percent of the Lighthouse performance budget, works at 390 px on the phone app's first screen as the verdict circle's entrance.

## Banned here

Gradient text, purple or indigo, glass panels, emoji as icons, radii above 3 px on rectangles, drop shadows heavier than the panel shadow, a second accent, bounce or overshoot outside the stamp, scroll-triggered effects inside the app, any animation that starts from opacity 0 on safety data.

## Debts in the current system

1. **Three token sources.** The palette lives in `tailwind.config.js`, again as 8 custom properties in `index.css`, and again as about 110 literal hex values inside components (`MarineMap.tsx` 32, `Landing.tsx` 26, `SystemPanel.tsx` 10, `RiskTimeline.tsx` 10).
2. **Off-palette values** in components: `#B08000`, `#63862B`, `#7E9A4A`, `#BF6A1F`, `#B08532`, `#2F8A7D`, `#3E7A99`, `#8FB0C0`, `#9C5F44`. Each needs a token or a merge into an existing one.
3. **Contrast.** `ink-300` on paper is about 2.9:1 and is used for inactive tabs and placeholder text; Lighthouse reports 17 failing elements on the Ask view.
4. **No type scale.** Sizes are literal (`text-[10px]`, `text-[11.5px]`, `text-[13.5px]`).
5. **Many always-on loops** against a budget of one orchestrated moment, and a fixed full-screen grain layer at z-index 2000.
6. `<html lang>` stays `en` when the interface switches to Hindi or Marathi.

## Proposed additions (never a replacement)

1. One token source: CSS custom properties in `index.css` (`--paper-50` … `--risk-extreme`), with `tailwind.config.js` reading them, and a small `tokens.ts` export for canvas and Leaflet code that needs colours in JavaScript.
2. Fold the off-palette values into named tokens (`chance-good`, `chance-some`, `sst-cool`, `sst-warm`).
3. Fix contrast at the token: darken the text use of `ink-300` to `ink-400`, keep `ink-300` for decoration.
4. A named type scale (label, readout, body, lead, title, display) replacing the literal sizes.
5. A motion budget: ambient loops pause when off-screen and on hidden tabs; the landing gets the one orchestrated sequence above.
