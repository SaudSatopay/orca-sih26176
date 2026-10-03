/**
 * Glow Cursor — https://reactbits.dev/animations/glow-cursor
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: bioluminescent plankton. A soft teal light trail that
 * follows the pointer inside the Night watch band ONLY — it listens on the
 * band, clamps to the band's box and fades when the pointer leaves or rests;
 * the page cursor belongs to another effect. Changes from the original:
 * token colours (chart-300 head, chart-500 tail); no white hotspot and a
 * capped peak (45 percent) so the brightest trail pixel still leaves the
 * band's chart-100 and paper-50 copy at 4.5:1 or better; premultiplied
 * output with no blending (the original blended its alpha twice, which
 * squared it and drowned the trail); no film grain; the
 * loop sleeps once the trail has faded (zero frames while the pointer is
 * still), and the shared night stage (nightGl.ts) gives it the slot's
 * active flag, the DPR cap and the context release.
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { bandOf, hexToVec3, nightDpr, releaseContext, useNightScene } from "./nightGl";

const MAX_POINTS = 48;

const PLANKTON = {
  color: chart[300],
  secondaryColor: chart[500],
  trailLength: 40,
  trailWidth: 10,
  trailTaper: 0.85,
  followSpeed: 0.14,
  glowIntensity: 1.4,
  glowSpread: 1.3,
  /** The peak alpha of the trail over the ink ground. */
  opacity: 0.45,
  pulseSpeed: 0.8,
  idleTimeout: 900,
  fadeDuration: 1100,
} as const;

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
#define MAX_POINTS ${MAX_POINTS}
uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uTime;
uniform float uFade;
varying vec2 vUv;

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.12;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    strongest = max(strongest, intensity);
    colorSum += mix(uColor, uSecondaryColor, progress) * intensity;
    colorWeight += intensity;
  }

  float alpha = clamp(strongest, 0.0, 1.0) * uOpacity * uFade;
  if (alpha < 0.002) discard;
  // premultiplied, over a cleared buffer, no blending: the page sees exactly
  // \`alpha\` of the trail colour over the band (the original blended the
  // alpha twice, which squared it)
  gl_FragColor = vec4(colorSum / max(colorWeight, 0.0001) * alpha, alpha);
}
`;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export default function GlowCursor(props: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, props, (el, wake) => {
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, dpr: nightDpr() });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);

    const pointData = new Array(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: PLANKTON.trailLength },
        uColor: { value: hexToVec3(PLANKTON.color) },
        uSecondaryColor: { value: hexToVec3(PLANKTON.secondaryColor) },
        uTrailWidth: { value: PLANKTON.trailWidth },
        uTaper: { value: PLANKTON.trailTaper },
        uGlowIntensity: { value: PLANKTON.glowIntensity },
        uGlowSpread: { value: PLANKTON.glowSpread },
        uOpacity: { value: PLANKTON.opacity },
        uPulseSpeed: { value: PLANKTON.pulseSpeed },
        uTime: { value: 0 },
        uFade: { value: 0 },
      },
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = 1;
    let height = 1;
    let seeded = false;
    let inside = false;
    let fade = 0;
    let lastInput = 0;

    // The band, not the window: the trail lives and dies at its edges.
    const band = bandOf(el);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = el.getBoundingClientRect();
      const x = clamp(e.clientX - r.left, 0, r.width);
      const y = clamp(r.height - (e.clientY - r.top), 0, r.height);
      if (!seeded) {
        for (const p of points) {
          p.x = x;
          p.y = y;
        }
        head.x = x;
        head.y = y;
        seeded = true;
      }
      target.x = x;
      target.y = y;
      inside = true;
      lastInput = performance.now();
      wake();
    };
    const onLeave = () => {
      inside = false;
      lastInput = performance.now();
      wake();
    };
    band.addEventListener("pointermove", onMove);
    band.addEventListener("pointerenter", onMove);
    band.addEventListener("pointerleave", onLeave);

    return {
      canvas,
      resize(w, h) {
        width = w;
        height = h;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [width, height];
      },
      draw(t, dt) {
        const step = Math.min(dt * 60, 3);
        if (seeded) {
          const headEase = 1 - Math.pow(1 - PLANKTON.followSpeed, step);
          const chainEase = 1 - Math.pow(1 - (0.28 + PLANKTON.followSpeed * 0.35), step);
          head.x += (target.x - head.x) * headEase;
          head.y += (target.y - head.y) * headEase;
          points[0].x = head.x;
          points[0].y = head.y;
          for (let i = 1; i < MAX_POINTS; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * chainEase;
            points[i].y += (points[i - 1].y - points[i].y) * chainEase;
          }
          for (let i = 0; i < MAX_POINTS; i++) {
            pointData[i * 2] = points[i].x;
            pointData[i * 2 + 1] = points[i].y;
          }
        }
        const resting = !inside || performance.now() - lastInput > PLANKTON.idleTimeout;
        const goal = seeded && !resting ? 1 : 0;
        fade += (goal - fade) * Math.min(1, ((16.667 * step) / PLANKTON.fadeDuration) * 7);
        if (fade < 0.002 && goal === 0) fade = 0;
        program.uniforms.uTime.value = t;
        program.uniforms.uFade.value = fade;
        renderer.render({ scene: mesh });
      },
      // Asleep once the trail has gone dark and nothing is moving it.
      moving: () => fade > 0 || (inside && performance.now() - lastInput <= PLANKTON.idleTimeout),
      dispose() {
        band.removeEventListener("pointermove", onMove);
        band.removeEventListener("pointerenter", onMove);
        band.removeEventListener("pointerleave", onLeave);
        program.remove();
        releaseContext(gl);
      },
    };
  });
  return <div ref={host} className="nb-fill" />;
}
