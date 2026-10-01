# ORCA — design system: the living nautical chart

Extracted from the shipped code on 1 October 2026 and kept current through the missile flight. This file is the single source of truth for visual decisions; `frontend/src/tokens.ts` is the single source of the values. Tailwind reads that file, `index.css` derives its custom properties from it, and canvas, Leaflet and SVG code import it. No component spells a colour or a pixel size literally (a test enforces the colours).

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
| Ink | `ink-500` / `400` | `#42596D` `#5A6F81` | secondary text, labels (400 is the lightest ink that may carry text: 4.51:1 on the sheet) |
| Ink | `ink-300` | `#82949F` | decoration only (fails AA as text on paper) |
| Accent | `chart-500` | `#2A7391` | the one accent: focus ring, links, the sea, signals |
| Accent | `chart-700` / `600` / `300` / `100` | `#174F68` `#1E5F7A` `#7FA9BC` `#D8E7EB` | accent steps |
| Signal | `signal` | `#C7442E` | buoy red, restricted marks |
| Semantic | `risk-low` | `#1D7A50` | LOW, good chance of fish |
| Semantic | `risk-moderate` | `#A17000` | MODERATE |
| Semantic | `risk-high` | `#BF4E12` | HIGH |
| Semantic | `risk-extreme` | `#AF2318` | EXTREME, official warnings |
| Chance of fish | `chance-good` / `some` / `poor` | `#63862B` `#B08000` `#9C5F44` | ground ratings below "very good" (which is `risk-low`) |
| Sea temperature | `sst-cold` / `cool` / `mild` / `warm` / `hot` | `#3E7A99` `#2F8A7D` `#7E9A4A` `#B08532` `#BF6A1F` | the chart's temperature shade and its legend |
| Flow | `flow-calm` | `#8FB0C0` | slowest wind or current in the particle field |
| Sea | `sea` | `#CFE0E6` | map background behind tiles |
| Rules | `--rule-faint` / `--rule` / `--rule-strong` | ink at 14 / 28 / 55 percent | hairlines, panel borders, neatlines |

Proportion: paper carries about 70 percent, ink about 25, chart teal and the risk colours share the rest. Risk colours are status only and never decorate.

## Type

| Role | Family | Where |
|---|---|---|
| Display | Fraunces Variable (with Noto Serif Devanagari Variable for hi and mr) | wordmark, headlines, verdicts, buoy numbers, soundings (italic, `SOFT` 40) |
| Body | Archivo Variable | running text, list items |
| Mono | Spline Sans Mono Variable | labels (10 px, uppercase, tracking 0.16em), buttons, instrument readouts |

All four are self-hosted through `@fontsource-variable` imports in `main.tsx`; nothing loads from a font CDN.

### Type scale

One named scale; components never use a literal pixel size.

| Step | px | Role |
|---|---|---|
| `micro` | 9 | table heads, stamps, chart margin notes |
| `label` | 10 | the mono label, captions, hints, timestamps |
| `readout` | 11 | buttons, folio tabs, mono readouts |
| `small` | 12 | chips, dense lists, alert detail |
| `body` | 13 | conversation, advice, fields, tables |
| `prose` | 14 | lead-ins, row figures |
| `lead` | 15 | lead lines, small panel headings |
| `subtitle` | 16 | panel titles, phone body copy |
| `title` | 17 | row titles, the LISTEN button |
| `heading` | 19 | card headings, the advice headline, the hero question |
| `figure` | 21 | instrument figures, the verdict line |
| `headline` | 24 | section headlines, a ground's chance of fish |
| `numeral` | 26 | large soundings, return-by |
| `display` | 30 | the console wordmark, the phone score |
| `tile` | 34 | authority board totals |
| `dial` | 38 | the risk dial numeral, the landing thesis |
| `hero` | 76 | the landing wordmark |

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

## Signature moment: the chart answers

Built in `HeroChart.tsx`, `HeroSea.tsx`, `hero.css`. It is the landing hero and the only orchestrated sequence in the product.

1. **Poster first.** The sheet's base styles are the finished state: question written, crew ticked, course plotted, verdict stamped. The numbers are the rehearsed scenarios' measured results. If no animation runs, or under reduced motion, the hero is simply complete.
2. **The sequence**, once per question, about 2.3 s: the question writes itself (620 ms, clip-path) → the ten crew names tick in 45 ms apart, with real latencies → the course draws around the hatched naval area (820 ms, stroke-dashoffset through a mask, so the dashes keep running afterwards) → the buoys land → the verdict stamps (420 ms, the house stamp overshoot) → the three "why" bars draw. Transform, opacity, clip-path and stroke only.
3. **Three rehearsed questions** as tabs (arrow keys move between them): the safest course off Mumbai (28, go with care), the Marathi 6 AM question under an IMD warning (70, do not go), the cyclone off Paradip (92, do not launch). Each replays the sequence.
4. **Live.** 400 ms after a question is shown, the real pipeline is asked the same thing and its score, top three factors and agent latencies replace the poster's in place. In the LIVE data edition the poster stays and is labelled a rehearsed scenario.
5. **The sea.** A lazy 2.4 KB canvas of about 240 motes advected along the wind (a vortex for the cyclone), drawn in chart teal with fading trails, kept off the land by the same path the SVG draws. Device pixel ratio capped at 1.5, 40 frames a second at most, paused off-screen and on a hidden tab, never mounted under reduced motion.
6. **Cost.** No dependency. Landing Lighthouse performance stayed at 98 after it was added.

Easing for the whole product: entrances `cubic-bezier(0.23, 1, 0.32, 1)`, on-screen movement `cubic-bezier(0.77, 0, 0.175, 1)`. Hover effects are gated to fine pointers; pressed states run 100 to 160 ms.

## Banned here

Gradient text, purple or indigo, glass panels, emoji as icons, radii above 3 px on rectangles, drop shadows heavier than the panel shadow, a second accent, bounce or overshoot outside the stamp, scroll-triggered effects inside the app, any animation that starts from opacity 0 on safety data.

## Settled during the flight

- One token source (`tokens.ts`); the nine off-palette values are named tokens; `ink-400` darkened to pass AA on the sheet; `ink-300` no longer carries text.
- A named type scale replaced about 220 literal sizes.
- The landing's three equal feature cards became an index of sheets: a catalogue list with whole-row targets.

## Still open

- Ambient loops are many; they must pause off-screen and on hidden tabs.
- `risk-moderate`, `chance-good` and `chance-some` are under 4.5:1 as small text on paper. The risk palette is protected, so small text in those colours is set in ink with the colour carried by a mark beside it.
