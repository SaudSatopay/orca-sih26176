/**
 * Strands — https://reactbits.dev/animations/strands
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: the wake under the closing call strip. Three quiet
 * strands of chart teal braiding and parting like a boat's wake at night.
 * Changes from the original: token palette (chart-700, chart-500, chart-300)
 * instead of the rainbow; the glass-lens pass removed (no render target, no
 * second program); the envelope held to its one central lobe (the
 * original cosine repeats across a wide strip, which put strands behind the
 * copy and the buttons); intensity and glow lowered so it stays a wake, not
 * a light show; the loop, DPR cap and context release come from the shared
 * night stage (nightGl.ts).
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { WAKE_SHAPE } from "../components/landing/nightPaths";
import { hexToVec3, nightDpr, releaseContext, useNightScene } from "./nightGl";

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const WAKE = {
  colors: [chart[700], chart[500], chart[300], chart[500]],
  speed: 0.22,
  thickness: 0.55,
  glow: 1.6,
  hueShift: 0,
  saturation: 1,
  opacity: 0.9,
  /** count, amplitude, waviness, taper, spread, intensity, scale: shared with the poster. */
  ...WAKE_SHAPE,
} as const;

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;
out vec4 fragColor;

const float PI = 3.14159265;

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);
  float e = 0.06 + uIntensity * 0.94;
  // one lobe only: the original cosine repeats across a wide strip
  float env = abs(uv.x * 1.3) < 0.5 ? pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper) : 0.0;
  vec3 col = vec3(0.0);
  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;
    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;
    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;
    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;
    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;
    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += samplePalette(h) * g * env;
  }
  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);
  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * uOpacity, alpha);
}
`;

function palette(colors: readonly string[]): number[][] {
  return Array.from({ length: MAX_COLORS }, (_, i) => hexToVec3(colors[i] ?? colors[colors.length - 1]));
}

export default function Strands(props: EffectProps) {
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

    const geometry = new Triangle(gl);
    // the vertex shader reads position only
    delete geometry.attributes.uv;
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uColors: { value: palette(WAKE.colors) },
        uColorCount: { value: Math.min(WAKE.colors.length, MAX_COLORS) },
        uStrandCount: { value: Math.min(WAKE.count, MAX_STRANDS) },
        uSpeed: { value: WAKE.speed },
        uAmplitude: { value: WAKE.amplitude },
        uWaviness: { value: WAKE.waviness },
        uThickness: { value: WAKE.thickness },
        uGlow: { value: WAKE.glow },
        uTaper: { value: WAKE.taper },
        uSpread: { value: WAKE.spread },
        uHueShift: { value: WAKE.hueShift },
        uIntensity: { value: WAKE.intensity },
        uOpacity: { value: WAKE.opacity },
        uScale: { value: WAKE.scale },
        uSaturation: { value: WAKE.saturation },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    return {
      canvas,
      resize(w, h) {
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      },
      draw(t) {
        program.uniforms.uTime.value = t;
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
