import { useEffect, useId, useRef, useState } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";
import type { EffectProps } from "./EffectSlot";
import { capPixels, inkSpeed, LUMA_MATRIX, rampTable, RECIPE, WORD } from "./inkRamp";
import { alpha, ink, paper } from "../tokens";

/**
 * Effect 1 — the wet-ink wordmark, live. Its own chunk: nothing outside this
 * module imports the shader library, so visitors the gate turns away never
 * fetch it. The shader is handed the wordmark as an image and read back
 * through the ink ramp (inkRamp.ts); the poster underneath (InkWordmark.tsx)
 * is the finished design and returns the moment anything here gives up.
 */

/**
 * "ORCA" in Fraunces Black, the app's own self-hosted face, on a transparent
 * canvas — lifted from the studio (frontend/studio/InkStudio.tsx). Measured at
 * runtime so the letters are never clipped; WORD carries the same numbers for
 * the poster.
 */
async function drawWord(): Promise<string> {
  const font = `900 ${WORD.size}px "Fraunces Variable"`;
  await document.fonts.load(font, WORD.text);
  await document.fonts.ready;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) throw new Error("no 2d context for the wordmark");
  probe.font = font;
  const m = probe.measureText(WORD.text);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + WORD.pad * 2;
  canvas.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + WORD.pad * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context for the wordmark");
  ctx.font = font;
  // Any opaque ink: the shader reads the shape, the ramp prints the colour.
  ctx.fillStyle = ink[900];
  ctx.fillText(WORD.text, WORD.pad + m.actualBoundingBoxLeft, WORD.pad + m.actualBoundingBoxAscent);
  return canvas.toDataURL("image/png");
}

/** How long the first frame may take before the poster is declared the answer. */
const FIRST_FRAME_TIMEOUT = 10_000;

type Box = { w: number; h: number };

export default function InkLive({ active, onReady, onFail }: EffectProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [reduced, setReduced] = useState(
    () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [hidden, setHidden] = useState(() => document.hidden);
  const filterId = useId().replace(/:/g, "");

  // The slot hands fresh callbacks on every render; the lifecycle effects
  // below must not re-run (and release the context!) over an identity change.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  // The subject: drawn once, after the face is really loaded.
  useEffect(() => {
    let alive = true;
    drawWord()
      .then((url) => {
        if (alive) setSubject(url);
      })
      .catch(() => onFailRef.current());
    return () => {
      alive = false;
    };
  }, []);

  // The box, for the pixel budget; re-read when the page is resized.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      setBox((prev) =>
        prev && Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height },
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The double locks: reduced motion and a hidden tab each force speed 0
  // even if the gate's answer is somehow stale.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // The first frame: the slot swaps the poster out only once the canvas has
  // really drawn. On the way out, the context is released by hand, so leaving
  // the landing frees it instead of waiting for the collector.
  useEffect(() => {
    if (!subject) return;
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    let canvas: HTMLCanvasElement | null = null;
    const lost = () => onFailRef.current();
    const started = performance.now();
    const look = () => {
      canvas = el.querySelector("canvas");
      if (canvas && canvas.width > 0) {
        canvas.addEventListener("webglcontextlost", lost);
        raf = requestAnimationFrame(() => onReadyRef.current());
      } else if (performance.now() - started > FIRST_FRAME_TIMEOUT) {
        onFailRef.current();
      } else {
        raf = requestAnimationFrame(look);
      }
    };
    raf = requestAnimationFrame(look);
    return () => {
      cancelAnimationFrame(raf);
      if (!canvas) return;
      canvas.removeEventListener("webglcontextlost", lost);
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      (gl as WebGLRenderingContext | null)
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext();
    };
  }, [subject]);

  return (
    <div ref={wrap} className="ink-live-fill">
      {/* The ink ramp: luminance, then one table per channel (inkRamp.ts). */}
      <svg width="0" height="0" className="ink-defs" aria-hidden="true" focusable="false">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={LUMA_MATRIX} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={rampTable(16)} />
            <feFuncG type="table" tableValues={rampTable(8)} />
            <feFuncB type="table" tableValues={rampTable(0)} />
          </feComponentTransfer>
        </filter>
      </svg>
      {subject && box && (
        <LiquidMetal
          image={subject}
          // The sheet shows through: the page behind is the paper token.
          colorBack={alpha(paper[100], 0)}
          // With the ink map the shader only supplies light and dark.
          colorTint={paper[50]}
          repetition={RECIPE.repetition}
          softness={RECIPE.softness}
          distortion={RECIPE.distortion}
          contour={RECIPE.contour}
          angle={RECIPE.angle}
          shiftRed={RECIPE.shiftRed}
          shiftBlue={RECIPE.shiftBlue}
          speed={inkSpeed(active, reduced, hidden)}
          frame={RECIPE.frame}
          fit="contain"
          scale={1}
          minPixelRatio={1}
          maxPixelCount={capPixels(box.w, box.h)}
          suspendWhenProcessingImage
          style={{ width: "100%", height: "100%", filter: `url(#${filterId})` }}
        />
      )}
    </div>
  );
}
