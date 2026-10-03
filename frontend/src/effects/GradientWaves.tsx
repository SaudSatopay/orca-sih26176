/**
 * Gradient Waves — https://reactbits.dev/backgrounds/gradient-waves
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: the Night watch band's sea. A raymarched swell rolling
 * toward a hazy horizon on the band's ink-900 night, the water in chart-700
 * with chart-300 crests fading into chart-300 haze, so the band reads as
 * the same sea the paper sections chart by day. Changes from the original:
 * token colours only; the camera levelled (horizon straight, at the middle
 * of a canvas pinned to the band's foot) and the fog deepened so the near
 * swell shows; a third of the pace; no grain (the page has its own); no
 * pointer parallax (the cursor
 * belongs to the plankton trail); the loop, DPR cap, context release and
 * first-frame handshake come from the shared night stage (nightGl.ts).
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { hexToVec3, nightDpr, releaseContext, useNightScene } from "./nightGl";

/** The look, in one place: the numbers the band was tuned with. */
const WAVES = {
  horizon: chart[300],
  water: chart[700],
  crest: chart[300],
  /** A slow swell, not a storm: a third of the original pace. */
  speed: 0.14,
  amplitude: 2.1,
  waveScale: 0.55,
  waveRatio: 0.9,
  swell: 30,
  turbulence: 18,
  tilt: 1.52,
  zoom: 1.25,
  height: 0.5,
  fogDepth: 30,
  steps: 56,
  brightness: 1.0,
  opacity: 1.0,
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
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * alpha, alpha);
}
`;

export default function GradientWaves(props: EffectProps) {
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
        uSpeed: { value: WAVES.speed },
        uAmplitude: { value: WAVES.amplitude },
        uWaveScale: { value: WAVES.waveScale },
        uWaveRatio: { value: WAVES.waveRatio },
        uSwell: { value: WAVES.swell },
        uTurbulence: { value: WAVES.turbulence },
        uTilt: { value: WAVES.tilt },
        uZoom: { value: WAVES.zoom },
        uHeight: { value: WAVES.height },
        uFogDepth: { value: WAVES.fogDepth },
        uSteps: { value: WAVES.steps },
        uBrightness: { value: WAVES.brightness },
        uOpacity: { value: WAVES.opacity },
        uHorizonColor: { value: hexToVec3(WAVES.horizon) },
        uWaveColor: { value: hexToVec3(WAVES.water) },
        uCrestColor: { value: hexToVec3(WAVES.crest) },
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
