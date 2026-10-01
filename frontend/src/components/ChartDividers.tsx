/**
 * Two decorative section breaks drawn in the chart's own language. Both are
 * hidden from assistive tech, take their colour from the accent token through
 * `currentColor`, and are still: the page already has a moving sea at its foot
 * and a crawling `.wave-rule`, and a third thing in motion would be noise.
 *
 * The wave geometry is a real export from Haikei's "Layered Waves" generator
 * (the raw file is frontend/studio/haikei/layered-waves.svg; canvas 1440 x 96,
 * four waves, balance 1, complexity 10, contrast 0.8, overlap 0.2). Only the
 * crest lines are kept: Haikei paints opaque bands, which is far too loud on
 * this sheet, so each band is printed here as a thin wash of the accent.
 * Haikei has no contour generator, so the contours are drawn by hand.
 */

/** The Haikei canvas, cropped to where its waves begin. */
const WAVE_W = 1440;
const WAVE_TOP = 8;
const WAVE_FOOT = 96;

/** Crest lines back to front, and how strong a wash each band is. */
const BANDS = [
  {
    strength: 0.06,
    crest:
      "M0 34L26.7 34.8C53.3 35.7 106.7 37.3 160 37.7C213.3 38 266.7 37 320 34C373.3 31 426.7 26 480 25.8C533.3 25.7 586.7 30.3 640 33.5C693.3 36.7 746.7 38.3 800 34.5C853.3 30.7 906.7 21.3 960 16.2C1013.3 11 1066.7 10 1120 11.8C1173.3 13.7 1226.7 18.3 1280 23.5C1333.3 28.7 1386.7 34.3 1413.3 37.2L1440 40",
  },
  {
    strength: 0.08,
    crest:
      "M0 55L26.7 55.3C53.3 55.7 106.7 56.3 160 54C213.3 51.7 266.7 46.3 320 44.7C373.3 43 426.7 45 480 47.2C533.3 49.3 586.7 51.7 640 52.7C693.3 53.7 746.7 53.3 800 48.2C853.3 43 906.7 33 960 30.8C1013.3 28.7 1066.7 34.3 1120 36.7C1173.3 39 1226.7 38 1280 35.2C1333.3 32.3 1386.7 27.7 1413.3 25.3L1440 23",
  },
  {
    strength: 0.1,
    crest:
      "M0 55L26.7 53C53.3 51 106.7 47 160 49.7C213.3 52.3 266.7 61.7 320 61.7C373.3 61.7 426.7 52.3 480 49.3C533.3 46.3 586.7 49.7 640 52.8C693.3 56 746.7 59 800 62.5C853.3 66 906.7 70 960 67.8C1013.3 65.7 1066.7 57.3 1120 53.2C1173.3 49 1226.7 49 1280 52.2C1333.3 55.3 1386.7 61.7 1413.3 64.8L1440 68",
  },
  {
    strength: 0.13,
    crest:
      "M0 61L26.7 61.7C53.3 62.3 106.7 63.7 160 65.7C213.3 67.7 266.7 70.3 320 70.3C373.3 70.3 426.7 67.7 480 66.3C533.3 65 586.7 65 640 66.8C693.3 68.7 746.7 72.3 800 75.7C853.3 79 906.7 82 960 83.2C1013.3 84.3 1066.7 83.7 1120 84.2C1173.3 84.7 1226.7 86.3 1280 83.7C1333.3 81 1386.7 74 1413.3 70.5L1440 67",
  },
] as const;

/**
 * Layered wave bands in chart teal on paper: the break between landing
 * sections. It has a flat foot, so it wants to stand on the top edge of the
 * panel below it (no margin between the two). The drawing stretches to the
 * box; a long swell is as true at 390 pixels as at 1440.
 */
export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 ${WAVE_TOP} ${WAVE_W} ${WAVE_FOOT - WAVE_TOP}`}
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[72px] w-full text-chart-500 ${className}`}
    >
      {BANDS.map((b, i) => (
        <path
          key={i}
          data-band={i}
          d={`${b.crest}V${WAVE_FOOT}H0Z`}
          fill="currentColor"
          fillOpacity={b.strength}
        />
      ))}
    </svg>
  );
}

/** The contour drawing's own units; it is stretched to the divider's box. */
const CONTOUR_W = 1200;
const CONTOUR_H = 80;

/**
 * Five depth contours as heights at seven evenly spaced stations. Every line
 * ends at the height it started. The third and fourth part around a shoal at
 * station 4.2; the gap they open at station 1.5 holds the deeper sounding.
 */
const ISOBATHS = [
  [10, 5, 13, 6, 4, 9, 10],
  [22, 14, 24, 18, 9, 17, 22],
  [33, 22, 30, 31, 15, 26, 33],
  [48, 57, 50, 47, 63, 54, 48],
  [68, 74, 64, 70, 76, 71, 68],
] as const;

/** A smooth line through the stations: level at each one, an S-curve between. */
function isobath(heights: readonly number[]): string {
  const step = CONTOUR_W / (heights.length - 1);
  return heights
    .map((y, i) => {
      if (i === 0) return `M0 ${y}`;
      const x = i * step;
      return `C${x - step / 2} ${heights[i - 1]} ${x - step / 2} ${y} ${x} ${y}`;
    })
    .join(" ");
}

/** A closed contour around (cx, cy): a slightly lopsided oval, as surveyed shoals are. */
function shoal(cx: number, cy: number, rx: number, ry: number): string {
  const k = 0.56;
  return [
    `M${cx - rx} ${cy}`,
    `C${cx - rx} ${cy - ry * k * 1.2} ${cx - rx * k} ${cy - ry} ${cx + rx * 0.08} ${cy - ry}`,
    `C${cx + rx * k * 1.1} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy + ry * 0.1}`,
    `C${cx + rx} ${cy + ry * k * 1.2} ${cx + rx * k} ${cy + ry} ${cx - rx * 0.1} ${cy + ry}`,
    `C${cx - rx * k * 1.1} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
    "Z",
  ].join(" ");
}

const SHOAL = { cx: 840, cy: 39, rx: 150, ry: 17 } as const;

/** Where the two soundings sit, as fractions of the box: in the gap, and on the shoal. */
const SOUNDINGS = [
  { depth: "18", left: (300 / CONTOUR_W) * 100, top: (39 / CONTOUR_H) * 100 },
  { depth: "7", left: (SHOAL.cx / CONTOUR_W) * 100, top: (SHOAL.cy / CONTOUR_H) * 100 },
] as const;

/** A band of nested depth contours with two italic soundings: the quieter break. */
export function ContourDivider({ className = "" }: { className?: string }) {
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke",
  } as const;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-20 select-none text-chart-500 ${className}`}
    >
      <svg
        focusable="false"
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${CONTOUR_W} ${CONTOUR_H}`}
        preserveAspectRatio="none"
      >
        {ISOBATHS.map((heights, i) => (
          <path key={i} d={isobath(heights)} {...line} strokeOpacity={i === 2 ? 0.42 : 0.28} />
        ))}
        <path d={shoal(SHOAL.cx, SHOAL.cy, SHOAL.rx, SHOAL.ry)} {...line} strokeOpacity={0.34} />
        <path
          d={shoal(SHOAL.cx + 6, SHOAL.cy, SHOAL.rx * 0.5, SHOAL.ry * 0.66)}
          {...line}
          strokeOpacity={0.42}
        />
      </svg>
      {SOUNDINGS.map((s) => (
        <span
          key={s.depth}
          className="sounding absolute -translate-x-1/2 -translate-y-1/2 text-body leading-none text-chart-600 opacity-70"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
        >
          {s.depth}
        </span>
      ))}
    </div>
  );
}
