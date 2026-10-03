/*
 * Topography — from React Bits (https://reactbits.dev/backgrounds/topography),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a living bathymetric chart. Depth contours in chart teal
 * drift slowly on the paper, at low intensity, behind a panel's header. One
 * WebGL context, released on unmount; frames are capped at 30 a second and
 * stop entirely while the band is off-screen or the tab is hidden
 * (`runWhileSeen`). No pointer play, no grain, no pixelation: the original's
 * playground knobs are gone and the colours come from the tokens. Mounted
 * only through `GlSlot`, which applies the console's effects gate.
 */
import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { chart } from "../../tokens";
import { GL_DPR, rgb, runWhileSeen } from "../console/glGate";

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// The original's field and contour pass, kept; the colour pass is reduced to
// one ink at one opacity, with the deeper contours drawn a step darker.
const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uOpacity;
uniform float uMorph;
uniform vec3 uShallow;
uniform vec3 uDeep;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  // keep the contours round on a wide, short band
  uv.x *= iResolution.x / max(iResolution.y, 1.0) * 0.16;
  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;
  float fv = field(suv);
  float f = fv * uBands;
  float fr = fract(f);
  float lineDist = min(fr, 1.0 - fr);
  float aa = fwidth(f) + 0.0001;
  float line = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);
  // every fifth contour is an index contour, drawn a little heavier
  float index = step(mod(floor(f + 0.5), 5.0), 0.5);
  float depth = clamp(fv / (uMorph * 2.5 + 0.001), 0.0, 1.0);
  vec3 ink = mix(uShallow, uDeep, depth);
  float a = line * uOpacity * mix(0.75, 1.25, index);
  fragColor = vec4(ink * a, a);
}
`;

const CTRL = [
  [1, -2, 3, -4],
  [9, -8, 7, -6],
  [5, 2, 5, -5],
  [-1, -3, 8, 9],
];

export interface TopographyProps {
  /** Contour lines per unit of depth. */
  bands?: number;
  /** Line half-width in contour units. */
  thickness?: number;
  /** Overall strength on the paper, 0–1. */
  opacity?: number;
  /** How fast the sea bed reshapes. */
  speed?: number;
  scale?: number;
}

export default function Topography({
  bands = 2.4,
  thickness = 0.03,
  opacity = 0.45,
  speed = 0.08,
  scale = 1.15,
}: TopographyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, GL_DPR),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const morph = 3;
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        uBands: { value: bands },
        uThickness: { value: thickness },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMorph: { value: morph },
        uShallow: { value: new Float32Array(rgb(chart[500])) },
        uDeep: { value: new Float32Array(rgb(chart[700])) },
        uCtrlA: { value: new Float32Array(4) },
        uCtrlB: { value: new Float32Array(4) },
        uCtrlC: { value: new Float32Array(4) },
        uCtrlD: { value: new Float32Array(4) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const ctrl = [program.uniforms.uCtrlA, program.uniforms.uCtrlB, program.uniforms.uCtrlC, program.uniforms.uCtrlD].map(
      (u) => u.value as Float32Array,
    );

    const draw = (time: number) => {
      for (let g = 0; g < 4; g++)
        for (let j = 0; j < 4; j++) {
          const i = CTRL[g][j];
          ctrl[g][j] = morph * Math.sin(time * speed * Math.sin(i * 0.05) + i);
        }
      renderer.render({ scene: mesh });
    };

    const size = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(r.width)), Math.max(1, Math.floor(r.height)));
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };
    const ro = new ResizeObserver(size);
    ro.observe(host);
    size();
    draw(0); // a first frame at once: the band is never empty while it waits

    const stop = runWhileSeen(host, draw);
    return () => {
      stop();
      ro.disconnect();
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [bands, thickness, opacity, speed, scale]);

  return <div ref={ref} className="h-full w-full overflow-hidden" />;
}
