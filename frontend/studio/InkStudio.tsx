/**
 * ORCA studio: wet ink on the wordmark. DEV ONLY.
 *
 *   cd frontend && npx vite --port 5194 --strictPort
 *   http://localhost:5194/studio/ink.html
 *
 * Paper Shaders' LiquidMetal is an AUTHORING tool here. The phone app gets no
 * WebGL and a social image is a still, so this page renders the wordmark and
 * the compass mark with the shader, freezes it on a fixed frame, and the
 * stills are captured to PNG (frontend/public/og.png, splash-*.png,
 * mark-ink-512.png). Nothing under src/ imports the shader library and this
 * page is not an input of the production build.
 *
 * Views (`?view=`): studio (default) · word · mark · og · splash.
 * Every recipe number can be overridden from the query string for tuning,
 * for example `?view=word&repetition=1.4&frame=5200&map=0`.
 *
 * Capture (playwright-cli, named session):
 *   playwright-cli -s=e4 open "http://localhost:5194/studio/ink.html?view=og"
 *   playwright-cli -s=e4 resize 1200 630
 *   playwright-cli -s=e4 screenshot --filename=og.png
 *   splash: view=splash at 1290x2796, 1179x2556, 1170x2532 · mark: view=mark at 512x512
 */
import { useEffect, useId, useState, type CSSProperties } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/spline-sans-mono";
import "./studio.css";
import { alpha, chart, ink, paper, rule } from "../src/tokens";
import { ContourDivider, WaveDivider } from "../src/components/ChartDividers";

const query = new URLSearchParams(location.search);
const num = (key: string, fallback: number) =>
  query.has(key) && Number.isFinite(Number(query.get(key))) ? Number(query.get(key)) : fallback;

const DISPLAY = '"Fraunces Variable", Georgia, serif';
const BODY = '"Archivo Variable", "Segoe UI", system-ui, sans-serif';
const MONO = '"Spline Sans Mono Variable", Consolas, monospace';

/**
 * The recipe the stills were captured with. `frame` is the shader's clock in
 * milliseconds; with `speed={0}` the same frame always gives the same picture.
 */
const RECIPE = {
  repetition: num("repetition", 1),
  softness: num("softness", 1),
  distortion: num("distortion", 0.6),
  contour: num("contour", 0.34),
  angle: num("angle", 70),
  shiftRed: num("shiftRed", 0),
  shiftBlue: num("shiftBlue", 0),
  frame: num("frame", 4800),
  /** Animation speed in the studio view; stills and reduced motion use 0. */
  speed: num("speed", 0.25),
  /** 1: remap the shader's grey to the ink ramp below. 0: the shader as it comes. */
  map: num("map", 1) === 1,
} as const;

/**
 * LiquidMetal paints stripes between a fixed near-white and a fixed near-black
 * and can only colour-burn a tint over them, so on its own the highlights stay
 * white: that is chrome, whatever the tint. The studio therefore reads the
 * shader as a grey map and prints it in ink: darkest grey to ink-900, lightest
 * to chart-500, never lighter. Dark to light:
 */
const INK_RAMP = [ink[900], ink[900], ink[800], chart[700], chart[700], chart[600], chart[500]];

function channel(hex: string, shift: number): number {
  return ((parseInt(hex.slice(1), 16) >> shift) & 255) / 255;
}

/** An SVG filter: luminance, then the ink ramp. Alpha is left alone. */
function InkMap({ id }: { id: string }) {
  const table = (shift: number) => INK_RAMP.map((c) => channel(c, shift).toFixed(4)).join(" ");
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues={table(16)} />
          <feFuncG type="table" tableValues={table(8)} />
          <feFuncB type="table" tableValues={table(0)} />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}

type Subject = { url: string; aspect: number };

/** "ORCA" in Fraunces Black, the app's own self-hosted face, on a transparent canvas. */
async function drawWord(): Promise<Subject> {
  const size = 640;
  const font = `900 ${size}px "Fraunces Variable"`;
  await document.fonts.load(font, "ORCA");
  await document.fonts.ready;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  const m = probe.measureText("ORCA");
  const pad = 90; // room for the shader's edge field
  const w = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2;
  const h = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  ctx.fillStyle = ink[900];
  ctx.fillText("ORCA", pad + m.actualBoundingBoxLeft, pad + m.actualBoundingBoxAscent);
  return { url: canvas.toDataURL("image/png"), aspect: w / h };
}

/** The compass mark from public/icon.svg, without its paper tile. */
async function drawMark(): Promise<Subject> {
  const svg = (await (await fetch("/icon.svg")).text())
    .replace(/<rect[^>]*\/>/, "")
    // the inner ring and second wave are drawn at part strength; ink is ink
    .replace(/ opacity="[^"]*"/g, "");
  const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const img = new Image();
  img.src = blobUrl;
  await img.decode();
  const side = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  canvas.getContext("2d")!.drawImage(img, 0, 0, side, side);
  URL.revokeObjectURL(blobUrl);
  return { url: canvas.toDataURL("image/png"), aspect: 1 };
}

const subjects = { word: drawWord, mark: drawMark } as const;

function useSubject(kind: keyof typeof subjects): Subject | null {
  const [subject, setSubject] = useState<Subject | null>(null);
  useEffect(() => {
    let alive = true;
    subjects[kind]().then((s) => {
      if (alive) setSubject(s);
    });
    return () => {
      alive = false;
    };
  }, [kind]);
  return subject;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * One subject in wet ink. `still` freezes it on the recipe's frame; reduced
 * motion does the same whatever the caller asked for.
 */
function Ink({
  kind,
  width,
  still = false,
  map = RECIPE.map,
  style,
}: {
  kind: keyof typeof subjects;
  width: string;
  still?: boolean;
  map?: boolean;
  style?: CSSProperties;
}) {
  const subject = useSubject(kind);
  const reduced = useReducedMotion();
  const filterId = useId().replace(/:/g, "");
  return (
    <div style={{ width, aspectRatio: String(subject?.aspect ?? (kind === "mark" ? 1 : 2.6)), ...style }}>
      {map && <InkMap id={filterId} />}
      {subject && (
        <LiquidMetal
          image={subject.url}
          // The sheet shows through: the page behind is the paper token.
          colorBack={alpha(paper[100], 0)}
          // With the ink map the shader only supplies light and dark; without
          // it, the closest the shader comes alone is a burn in chart teal.
          colorTint={map ? paper[50] : chart[700]}
          repetition={RECIPE.repetition}
          softness={RECIPE.softness}
          distortion={RECIPE.distortion}
          contour={RECIPE.contour}
          angle={RECIPE.angle}
          shiftRed={RECIPE.shiftRed}
          shiftBlue={RECIPE.shiftBlue}
          speed={still || reduced ? 0 : RECIPE.speed}
          frame={RECIPE.frame}
          fit="contain"
          scale={1}
          style={{
            width: "100%",
            height: "100%",
            filter: map ? `url(#${filterId})` : undefined,
          }}
        />
      )}
    </div>
  );
}

/** The sheet: paper, with the graticule ruled at `grid` pixels. */
function sheet(grid: string): CSSProperties {
  const line = alpha(chart[500], 0.06);
  return {
    background: [
      `repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px ${grid})`,
      `repeating-linear-gradient(0deg, ${line} 0 1px, transparent 1px ${grid})`,
      paper[100],
    ].join(", "),
  };
}

/** The foot of a still: contours running into the layered swell. */
function Foot({ zoom }: { zoom: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: `${100 / zoom}%`,
        transform: `scale(${zoom})`,
        transformOrigin: "bottom left",
        color: chart[500],
      }}
    >
      <ContourDivider />
      <WaveDivider />
    </div>
  );
}

/** The social image, 1200 by 630. */
function OgCard() {
  return (
    <div style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", ...sheet("105px") }}>
      {/* the neatline: a strong rule, a faint one inside it, the sea kept within */}
      <div style={{ position: "absolute", inset: 22, border: `1px solid ${rule.strong}` }} />
      <div
        style={{
          position: "absolute",
          inset: 27,
          border: `1px solid ${rule.faint}`,
          overflow: "hidden",
        }}
      >
        <Foot zoom={1.1} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 52 }}>
        <Ink kind="word" width="520px" still style={{ marginLeft: -30 }} />
        {/* the sea-surface symbol, as .wave-rule draws it */}
        <svg width="300" height="8" style={{ display: "block", margin: "4px 0 20px" }} aria-hidden="true">
          <defs>
            <pattern id="og-wave" width="14" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 5 Q3.5 1 7 5 T14 5" fill="none" stroke={chart[500]} strokeOpacity="0.55" />
            </pattern>
          </defs>
          <rect width="300" height="8" fill="url(#og-wave)" />
        </svg>
        <h1
          style={{
            margin: 0,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: ink[900],
          }}
        >
          Ten agents read the sea.
          <br />
          One safe, <span style={{ color: chart[600] }}>explainable</span> decision.
        </h1>
        <p
          style={{
            margin: "20px 0 0",
            fontFamily: BODY,
            fontSize: 23,
            lineHeight: 1.3,
            color: ink[700],
          }}
        >
          Marine decision support for India’s fishers
        </p>
        <p
          style={{
            margin: "10px 0 0",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: chart[700],
          }}
        >
          SIH26176 · Smart India Hackathon 2026
        </p>
      </div>
      <Ink kind="mark" width="280px" still style={{ position: "absolute", right: 92, top: 96 }} />
    </div>
  );
}

/**
 * The iOS startup image. Sized in viewport units so one layout serves every
 * device size. No words but the name: a still cannot follow the language.
 */
function Splash() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: paper[100] }}>
      <div
        style={{
          position: "absolute",
          inset: "0 0 12vh 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ink kind="mark" width="30vw" still />
        <Ink kind="word" width="62vw" still style={{ marginTop: "1vw" }} />
      </div>
      <Foot zoom={window.innerWidth / 430} />
    </div>
  );
}

/** The mark alone on paper, for a 512 by 512 capture. */
function MarkTile() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "grid", placeItems: "center", background: paper[100] }}>
      <Ink kind="mark" width="82vmin" still />
    </div>
  );
}

function WordTile() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "grid", placeItems: "center", background: paper[100] }}>
      <Ink kind="word" width="88vw" still={query.get("live") !== "1"} />
    </div>
  );
}

const label: CSSProperties = {
  margin: "0 0 6px",
  fontFamily: MONO,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: chart[700],
};

function Studio() {
  const reduced = useReducedMotion();
  return (
    <main style={{ minHeight: "100vh", padding: "28px 36px 60px", color: ink[700], fontFamily: BODY, ...sheet("130px") }}>
      <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, color: ink[900] }}>
        Wet ink on the wordmark
      </h1>
      <p style={{ margin: "6px 0 26px", maxWidth: 720, fontSize: 14, lineHeight: 1.55 }}>
        LiquidMetal as an authoring tool. The app ships the stills, never the shader.
        {reduced ? " Reduced motion is on, so everything here is still." : " The first row moves; the rest are the frozen frame the stills use."}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1fr)", gap: 28, alignItems: "end" }}>
        <div>
          <p style={label}>Ink map · {reduced ? "still" : "moving"}</p>
          <Ink kind="word" width="100%" />
        </div>
        <div>
          <p style={label}>The mark</p>
          <Ink kind="mark" width="100%" />
        </div>
        <div>
          <p style={label}>Ink map · frame {RECIPE.frame}</p>
          <Ink kind="word" width="100%" still />
        </div>
        <div>
          <p style={label}>Frame {RECIPE.frame}</p>
          <Ink kind="mark" width="100%" still />
        </div>
        <div>
          <p style={label}>The shader alone · tint chart-700</p>
          <Ink kind="word" width="100%" still map={false} />
        </div>
        <div>
          <p style={label}>The shader alone</p>
          <Ink kind="mark" width="100%" still map={false} />
        </div>
      </div>
      <pre style={{ margin: "28px 0 0", fontFamily: MONO, fontSize: 11, lineHeight: 1.6, color: ink[500] }}>
        {JSON.stringify(RECIPE)}
      </pre>
    </main>
  );
}

const views = { studio: Studio, word: WordTile, mark: MarkTile, og: OgCard, splash: Splash } as const;

/** The view the query string asks for; the studio itself by default. */
export default function InkStudio() {
  const View = views[(query.get("view") ?? "studio") as keyof typeof views] ?? Studio;
  return <View />;
}
