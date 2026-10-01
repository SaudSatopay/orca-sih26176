import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
// One drei piece, by its own path: fat lines, so the contour ink has a width.
import { Line } from "@react-three/drei/core/Line";
import { BufferAttribute, Color, PlaneGeometry, SRGBColorSpace, type Group } from "three";
import type { EffectProps } from "./EffectSlot";
import { ReliefInk } from "./ReliefPoster";
import { LEVELS, VIEW, bandOf, depthAt, heightAt, reliefChart, tintOf, type Lean, type Polyline } from "./bathymetry";
import { chart as teal, ink, paper } from "../tokens";

/**
 * Effect 2 — the relief sheet: the poster lifted off the paper.
 *
 * The same field the poster draws (bathymetry.ts), as layers of paper seen
 * from above by an orthographic camera, with one light raking across it from
 * the north-east. WebGL draws only what needs light: the paper and the
 * contour ink lying on it. Everything printed over the sea bed, words
 * included, is the poster's own SVG ink (`ReliefInk`), laid on the relief
 * through the same projection, so the dashes of the plotted course keep
 * running in CSS without a single WebGL frame.
 *
 * The view is plan-oblique: the plan never moves, each point only slides by
 * its height times the lean. At rest the sheet leans away a little; the
 * pointer leans it a few degrees more, and that is the whole interaction.
 * `frameloop="demand"`: a frame is drawn when the lean changes and at no
 * other time.
 */

/** The lean at rest, and how far the pointer may add to it either way. */
const REST: Lean = { x: 0.06, y: 0.36 };
const REACH = { x: 0.2, y: 0.16 };
/** The paper runs past the frame, so a leaning sheet never shows its edge. */
const OVER = { x: 0.08, y: 0.2 };
const CELLS = { x: 288, y: 184 };
/**
 * The light: from the north-east, low, so each layer of paper shades the one
 * below it. The two powers are chosen so level paper shows close to its own colour.
 */
const SUN: [number, number, number] = [96, 100, 84];
const SUN_POWER = 2.8;
const SKY_POWER = 1.55;

/** A token as display-space red, green and blue, 0 to 1. */
function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * The colour of each band, land first. The wash is mixed the way the poster's
 * SVG mixes it (in display space), so the two drawings are the same colours.
 */
function bandColours(): Color[] {
  const sea = rgb(paper[50]);
  const wash = rgb(teal[500]);
  const land = rgb(paper[200]);
  const out = [new Color().setRGB(land[0], land[1], land[2], SRGBColorSpace)];
  for (let band = 0; band <= LEVELS.length; band++) {
    const t = tintOf(band);
    out.push(
      new Color().setRGB(
        sea[0] + (wash[0] - sea[0]) * t,
        sea[1] + (wash[1] - sea[1]) * t,
        sea[2] + (wash[2] - sea[2]) * t,
        SRGBColorSpace,
      ),
    );
  }
  return out;
}

/** The paper: a plane displaced by the field, coloured by depth band like the poster. */
function buildPaper(): PlaneGeometry {
  const geometry = new PlaneGeometry(VIEW.w * (1 + 2 * OVER.x), VIEW.h * (1 + 2 * OVER.y), CELLS.x, CELLS.y);
  const position = geometry.getAttribute("position") as BufferAttribute;
  const colours = new Float32Array(position.count * 3);
  const bands = bandColours();
  for (let n = 0; n < position.count; n++) {
    const u = position.getX(n) / VIEW.w + 0.5;
    const v = 0.5 - position.getY(n) / VIEW.h;
    position.setZ(n, heightAt(u, v));
    const c = bands[bandOf(depthAt(u, v)) + 1];
    colours[n * 3] = c.r;
    colours[n * 3 + 1] = c.g;
    colours[n * 3 + 2] = c.b;
  }
  geometry.setAttribute("color", new BufferAttribute(colours, 3));
  return geometry;
}

/** Polylines as pairs of points lying just proud of the paper. */
function segmentsOf(lines: readonly Polyline[]): [number, number, number][] {
  const out: [number, number, number][] = [];
  const at = ([u, v]: readonly [number, number]): [number, number, number] => [
    (u - 0.5) * VIEW.w,
    (0.5 - v) * VIEW.h,
    heightAt(u, v) + 0.25,
  ];
  for (const line of lines) {
    const pts = line.closed ? [...line.points, line.points[0]] : line.points;
    for (let n = 1; n < pts.length; n++) out.push(at(pts[n - 1]), at(pts[n]));
  }
  return out;
}

function Scene({
  active,
  wrap,
  onLean,
  onReady,
  onFail,
}: EffectProps & { wrap: RefObject<HTMLDivElement>; onLean: (lean: Lean) => void }) {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const frameloop = useThree((s) => s.frameloop);
  const sheet = useRef<Group>(null);
  const lean = useRef<Lean>({ ...REST });
  const target = useRef<Lean>({ ...REST });
  const ready = useRef(false);
  const live = useRef(active);
  useEffect(() => {
    live.current = active;
    // Out of view the sheet goes back to rest, so it is still when it returns.
    if (!active) target.current = { ...REST };
  }, [active]);

  const geometry = useMemo(() => buildPaper(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const lines = useMemo(() => {
    const all = reliefChart();
    return {
      fine: segmentsOf(all.lines.filter((l) => l.level % 20 !== 10)),
      index: segmentsOf(all.lines.filter((l) => l.level % 20 === 10)),
      coast: segmentsOf(all.coast),
    };
  }, []);

  // The one frame a resize, or the loop being switched back on, needs.
  useEffect(() => {
    invalidate();
  }, [size, invalidate, frameloop]);

  // The pointer leans the sheet; leaving lets it settle back.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      if (!live.current || e.pointerType === "touch") return;
      const box = el.getBoundingClientRect();
      const px = ((e.clientX - box.left) / box.width) * 2 - 1;
      const py = ((e.clientY - box.top) / box.height) * 2 - 1;
      target.current = { x: REST.x + px * REACH.x, y: REST.y - py * REACH.y };
      invalidate();
    };
    const leave = () => {
      target.current = { ...REST };
      invalidate();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [wrap, invalidate]);

  // A lost context is the poster again.
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onFail);
    return () => canvas.removeEventListener("webglcontextlost", onFail);
  }, [gl, onFail]);

  useFrame((state, dt) => {
    const now = lean.current;
    const want = target.current;
    const ease = 1 - Math.exp(-Math.min(dt, 0.05) * 9);
    const far = Math.abs(want.x - now.x) + Math.abs(want.y - now.y);
    if (far < 0.002) {
      now.x = want.x;
      now.y = want.y;
    } else {
      now.x += (want.x - now.x) * ease;
      now.y += (want.y - now.y) * ease;
      state.invalidate(); // still settling: one more frame, then none
    }
    // The lean is a shear: x and y slide by height, the plan stays put. The
    // scale makes one sheet unit the same number of pixels as in the poster.
    const group = sheet.current;
    if (group) {
      const s = state.size.width / VIEW.w;
      group.matrix.set(s, 0, s * now.x, 0, 0, s, s * now.y, 0, 0, 0, s, 0, 0, 0, 0, 1);
      group.matrixWorldNeedsUpdate = true;
    }
    onLean({ x: now.x, y: now.y });
    if (!ready.current) {
      ready.current = true;
      // This frame is drawn straight after the callback returns.
      window.setTimeout(onReady, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={SKY_POWER} />
      <directionalLight position={SUN} intensity={SUN_POWER} />
      <group ref={sheet} matrixAutoUpdate={false}>
        <mesh geometry={geometry}>
          <meshLambertMaterial vertexColors flatShading />
        </mesh>
        <Line segments points={lines.fine} color={ink[500]} lineWidth={0.9} transparent opacity={0.6} depthTest={false} />
        <Line segments points={lines.index} color={ink[500]} lineWidth={1.4} transparent opacity={0.78} depthTest={false} />
        <Line segments points={lines.coast} color={ink[500]} lineWidth={1.5} depthTest={false} />
      </group>
    </>
  );
}

/** Where the scene reports the lean it has just drawn. */
type LeanSink = { current: (lean: Lean) => void };

/**
 * The poster's ink, laid on the relief. It keeps the lean as its own state, so
 * a leaning sheet re-renders this layer and nothing else: the canvas element
 * above it is never re-rendered by the pointer.
 */
function LiveInk({ sinkRef }: { sinkRef: LeanSink }) {
  const [lean, setLean] = useState<Lean>(REST);
  useEffect(() => {
    sinkRef.current = (next) => setLean((prev) => (prev.x === next.x && prev.y === next.y ? prev : next));
    return () => {
      sinkRef.current = () => {};
    };
  }, [sinkRef]);
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="relief-ink">
      <ReliefInk lean={lean} />
    </svg>
  );
}

const DPR: [number, number] = [1, 1.5];
const GL = { antialias: true, powerPreference: "high-performance" } as const;
const CAMERA = { position: [0, 0, 200] as [number, number, number], near: 1, far: 400 };
// The canvas takes no pointer events of its own, so it need not track the page's scroll.
const RESIZE = { scroll: false };

export default function ReliefSheet({ active, onReady, onFail }: EffectProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const sink = useRef<(lean: Lean) => void>(() => {});
  const [drawn, setDrawn] = useState(false);
  const report = useCallback((next: Lean) => sink.current(next), []);
  const ready = () => {
    setDrawn(true);
    onReady();
  };

  return (
    <div ref={wrap} className="relief-live">
      {/* The first frame is drawn wherever the sheet is, so it is ready before
          it scrolls into view; after that, nothing is drawn while it is out of
          view or the tab is hidden. */}
      <Canvas
        orthographic
        flat
        frameloop={active || !drawn ? "demand" : "never"}
        dpr={DPR}
        gl={GL}
        camera={CAMERA}
        resize={RESIZE}
      >
        <Scene active={active} wrap={wrap} onLean={report} onReady={ready} onFail={onFail} />
      </Canvas>
      <LiveInk sinkRef={sink} />
    </div>
  );
}
