/**
 * Web Threads — https://reactbits.dev/backgrounds/web-threads
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: "Ten agents. One thread." Ten glowing sine threads, one
 * per agent in the crew, loose on the left where the specialists read their
 * own part of the sea and pinched together on the right where the risk
 * engine ties them into one decision. Changes from the original: token
 * colours (chart-500 to chart-300, chart-100 where they cross); the thread
 * count is the crew size; no grain, no pointer pull and no light mode; the
 * glow is kept low so the band's copy above and below stays at 4.5:1 or
 * better; the loop, DPR cap and context release come from the shared night
 * stage (nightGl.ts).
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { THREAD_SHAPE } from "../components/landing/nightPaths";
import { hexToVec3, nightDpr, releaseContext, useNightScene } from "./nightGl";

const THREADS = {
  color1: chart[500],
  color2: chart[300],
  color3: chart[100],
  speed: 0.16,
  /** One thread per agent, the knot and the swing: shared with the poster. */
  threadCount: THREAD_SHAPE.count,
  frequency: THREAD_SHAPE.frequency,
  spread: THREAD_SHAPE.spread,
  taper: THREAD_SHAPE.taper,
  position: THREAD_SHAPE.position,
  /** 2: pinched at the right edge, loose at the left. */
  fanMode: 2,
  glow: 0.011,
  falloff: 0.72,
  thickness: 1.0,
  brightness: 0.55,
  opacity: 0.9,
  mirror: 0,
} as const;

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uThreadCount;
uniform float uFrequency;
uniform float uSpread;
uniform float uTaper;
uniform float uPosition;
uniform float uFanMode;
uniform float uGlow;
uniform float uFalloff;
uniform float uThickness;
uniform float uBrightness;
uniform float uOpacity;
uniform float uMirror;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

#define TAU 6.28318530718
#define MAX_THREADS 10

float glow(float x, float str, float dist) {
  return dist / pow(max(x, 1e-4), str);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float n = max(uThreadCount, 1.0);
  float pinchX = uFanMode < 0.5 ? 0.5 : (uFanMode < 1.5 ? 0.0 : 1.0);
  float spreadDx = uSpread * abs(uv.x - pinchX);
  float baseT = iTime * uSpeed;
  float tauOverN = TAU / n;
  float mirror = uMirror > 0.5 ? sign(pinchX - uv.x) : 1.0;
  float invThickness = 1.0 / max(uThickness, 0.01);
  float xFreq = uv.x * uFrequency;
  float yOff = uv.y - uPosition;
  float ciScale = n > 1.0 ? 1.0 / (n - 1.0) : 0.0;

  vec3 col = vec3(0.0);
  float gsum = 0.0;
  for (int idx = 0; idx < MAX_THREADS; idx++) {
    float i = float(idx);
    if (i >= n) break;
    float amplitude = spreadDx * (1.0 + i * uTaper);
    float phase = (baseT + i * tauOverN) * mirror;
    float sdf = abs(yOff + sin(xFreq + phase) * amplitude) * invThickness;
    float g = glow(sdf, uFalloff, uGlow);
    col += g * mix(uColor1, uColor2, i * ciScale);
    gsum += g;
  }
  float coreAmt = smoothstep(0.5, 2.2, gsum);
  col = mix(col, uColor3 * gsum, coreAmt * 0.5);
  col *= uBrightness;
  float alpha = clamp(gsum, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * alpha, alpha);
}
`;

export default function WebThreads(props: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, props, (el) => {
    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: nightDpr(),
    });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      releaseContext(gl);
      return null;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        uSpeed: { value: THREADS.speed },
        uThreadCount: { value: THREADS.threadCount },
        uFrequency: { value: THREADS.frequency },
        uSpread: { value: THREADS.spread },
        uTaper: { value: THREADS.taper },
        uPosition: { value: THREADS.position },
        uFanMode: { value: THREADS.fanMode },
        uGlow: { value: THREADS.glow },
        uFalloff: { value: THREADS.falloff },
        uThickness: { value: THREADS.thickness },
        uBrightness: { value: THREADS.brightness },
        uOpacity: { value: THREADS.opacity },
        uMirror: { value: THREADS.mirror },
        uColor1: { value: hexToVec3(THREADS.color1) },
        uColor2: { value: hexToVec3(THREADS.color2) },
        uColor3: { value: hexToVec3(THREADS.color3) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    return {
      canvas,
      resize(w, h) {
        renderer.setSize(w, h);
        program.uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      },
      draw(t) {
        program.uniforms.iTime.value = t;
        renderer.render({ scene: mesh });
      },
      dispose() {
        program.remove();
        releaseContext(gl);
      },
    };
  });
  return <div ref={host} className="nb-fill" />;
}
