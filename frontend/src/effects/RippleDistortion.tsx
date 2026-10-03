/*
 * RippleDistortion — from React Bits
 * (https://reactbits.dev/animations/ripple-distortion), MIT + Commons Clause,
 * Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the image is ORCA's own Ask sheet (the cyclone off
 * Paradip), served from this origin; kept in full colour, a faint
 * chart-teal tint and a sheen glint from tokens.ts; the slot's contract
 * (EffectSlot.tsx): nothing drawn while `!active`, `onReady` after the first
 * frame with the sheet in it, `onFail` on context loss, the context released
 * on unmount, device pixel ratio at most 1.5. The loop runs only while there
 * is water moving: once the last ripple has faded it stops, so a still sheet
 * costs no frames at all.
 */
import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, RenderTarget, Renderer, Texture, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart, sheen } from "../tokens";
import { sheet } from "../components/landing/sheets";

const MAX_WAVES = 100;
const FIELD_SCALE = 0.4;
const START_SCALE = 1.5;
const LIFE_CONSTANT = Math.log(500);
const DPR_CAP = 1.5;

const BRUSH = 120;
const STRENGTH = 0.055;
const SWIRL = 1;
const RINGS = 4;
const SPREAD = 4;
const FADE = 2.4;
const SPACING = 14;
const TINT_AMOUNT = 0.1;
const GLINT = 0.16;

/** `#RRGGBB` as a vec3 in 0..1 for a shader uniform. */
const vec3 = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const waveVertex = /* glsl */ `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;
varying vec2 vUv;
varying float vOpacity;
void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`;

const waveFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying float vOpacity;
uniform float uRings;
const float PI = 3.141592653589793;
const float EDGE = 0.006737947;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;
  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);
  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`;

const screenVertex = /* glsl */ `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const compositeFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uGlint;
uniform float uTintAmount;
const float TAU = 6.283185307179586;
vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}
void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = coverUV(vUv);
  float theta = amount * uSwirl * TAU;
  vec2 push = vec2(sin(theta), cos(theta)) * amount * uStrength;
  vec3 color = texture2D(uTexture, base + push).rgb;
  color = mix(color, color * uTint * 1.9, clamp(amount * 1.6, 0.0, 1.0) * uTintAmount);
  float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
  float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
  vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
  vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
  float raw = pow(max(dot(normal, light), 0.0), 22.0);
  float flatSpec = pow(max(light.z, 0.0), 22.0);
  color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
  gl_FragColor = vec4(color, 1.0);
}
`;

interface Wave {
  x: number;
  y: number;
  scale: number;
  target: number;
  opacity: number;
}

export default function RippleDistortion({ active, onReady, onFail }: EffectProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const engine = useRef<{ setActive: (on: boolean) => void } | null>(null);
  const callbacks = useRef({ onReady, onFail });
  useEffect(() => {
    callbacks.current = { onReady, onFail };
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, DPR_CAP),
      });
    } catch {
      callbacks.current.onFail();
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    let disposed = false;
    let on = false;
    let loaded = false;
    let readySent = false;
    let raf = 0;
    let previousTime = 0;
    let width = 1;
    let height = 1;

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      if (!disposed) callbacks.current.onFail();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const imageTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    const offsets = new Float32Array(MAX_WAVES * 2);
    const scales = new Float32Array(MAX_WAVES * 2);
    const opacities = new Float32Array(MAX_WAVES);
    const waves: Wave[] = Array.from({ length: MAX_WAVES }, () => ({
      x: 0,
      y: 0,
      scale: START_SCALE,
      target: START_SCALE,
      opacity: 0,
    }));
    let current = 0;

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]) },
      iOffset: { instanced: 1, size: 2, data: offsets },
      iScale: { instanced: 1, size: 2, data: scales },
      iOpacity: { instanced: 1, size: 1, data: opacities },
    });
    const waveProgram = new Program(gl, {
      vertex: waveVertex,
      fragment: waveFragment,
      uniforms: { uRings: { value: RINGS } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
    });
    waveProgram.setBlendFunc(gl.ONE, gl.ONE);
    const waveMesh = new Mesh(gl, { geometry, program: waveProgram, frustumCulled: false });

    const displacement = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    const composite = {
      uTexture: { value: imageTexture },
      uDisplacement: { value: displacement.texture },
      uResolution: { value: [1, 1] },
      uTextureSize: { value: [1, 1] },
      uTexel: { value: [1, 1] },
      uTint: { value: vec3(chart[500]) },
      uHighlight: { value: vec3(sheen) },
      uStrength: { value: STRENGTH },
      uSwirl: { value: SWIRL },
      uGlint: { value: GLINT },
      uTintAmount: { value: TINT_AMOUNT },
    };
    const compositeMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: compositeFragment,
        uniforms: composite,
        depthTest: false,
        depthWrite: false,
      }),
    });

    const anyWater = () => waves.some((w) => w.opacity > 0);

    const draw = (now: number) => {
      const delta = previousTime ? Math.min(0.05, (now - previousTime) / 1000) : 0;
      previousTime = now;
      const growth = 1 - Math.exp(-delta * 1.09);
      const decay = Math.exp((-delta * LIFE_CONSTANT) / FADE);
      for (let i = 0; i < MAX_WAVES; i += 1) {
        const wave = waves[i];
        if (wave.opacity <= 0) {
          opacities[i] = 0;
          continue;
        }
        wave.opacity *= decay;
        wave.scale += (wave.target - wave.scale) * growth;
        if (wave.opacity < 0.002) {
          wave.opacity = 0;
          opacities[i] = 0;
          continue;
        }
        const half = (wave.scale * BRUSH) / 2;
        offsets[i * 2] = (wave.x / width) * 2 - 1;
        offsets[i * 2 + 1] = (wave.y / height) * 2 - 1;
        scales[i * 2] = (half / width) * 2;
        scales[i * 2 + 1] = (half / height) * 2;
        opacities[i] = wave.opacity;
      }
      geometry.attributes.iOffset.needsUpdate = true;
      geometry.attributes.iScale.needsUpdate = true;
      geometry.attributes.iOpacity.needsUpdate = true;
      renderer.render({ scene: waveMesh, target: displacement, clear: true });
      renderer.render({ scene: compositeMesh });
      if (loaded && !readySent) {
        readySent = true;
        callbacks.current.onReady();
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (disposed || !on) return;
      draw(now);
      // Keep going only while water is still moving: a still sheet is free.
      if (anyWater()) raf = requestAnimationFrame(loop);
      else previousTime = 0;
    };
    const wake = () => {
      if (!raf && !disposed && on && loaded) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height);
      composite.uResolution.value = [width, height];
      const fieldW = Math.max(2, Math.round(width * FIELD_SCALE));
      const fieldH = Math.max(2, Math.round(height * FIELD_SCALE));
      displacement.setSize(fieldW, fieldH);
      composite.uTexel.value = [1 / fieldW, 1 / fieldH];
      wake();
      // One frame even with no water, so the sheet is redrawn at the new size.
      if (!raf && on && loaded) raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      imageTexture.image = image;
      composite.uTextureSize.value = [image.naturalWidth || 1, image.naturalHeight || 1];
      loaded = true;
      if (on && !raf) raf = requestAnimationFrame(loop);
    };
    image.onerror = () => {
      if (!disposed) callbacks.current.onFail();
    };
    image.src = sheet("ask").src;

    let previousX = -1e4;
    let previousY = -1e4;
    const onMove = (event: PointerEvent) => {
      if (!on) return;
      const rect = mount.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = rect.height - (event.clientY - rect.top);
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) return;
      if (Math.abs(px - previousX) <= SPACING && Math.abs(py - previousY) <= SPACING) return;
      previousX = px;
      previousY = py;
      const wave = waves[current];
      current = (current + 1) % MAX_WAVES;
      wave.x = px;
      wave.y = py;
      wave.scale = START_SCALE;
      wave.target = START_SCALE * SPREAD;
      wave.opacity = 1;
      wake();
    };
    mount.addEventListener("pointermove", onMove, { passive: true });

    engine.current = {
      setActive(next) {
        on = next;
        if (!on) {
          cancelAnimationFrame(raf);
          raf = 0;
          previousTime = 0;
          return;
        }
        // Back in view: draw the sheet once (and any water still moving).
        if (loaded && !raf) raf = requestAnimationFrame(loop);
      },
    };

    return () => {
      disposed = true;
      engine.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      image.onload = null;
      image.onerror = null;
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    engine.current?.setActive(active);
  }, [active]);

  return <div ref={mountRef} className="sheet-ripple absolute inset-0 overflow-hidden" />;
}
