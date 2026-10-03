/**
 * Pattern Waves — https://reactbits.dev/backgrounds/pattern-waves
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: a halftone sea printed on the paper. A lit, slowly
 * swelling surface rendered as a screen of chart-teal dots on transparent
 * paper, at a low contrast that keeps it a print, not a picture — the way a
 * chart engraver would shade open water. It runs on a PAPER section (the
 * one day band among the night ones). Changes from the original: one
 * preset (the "ocean" swell, dot screen) instead of six; the glyph atlas
 * removed; token colour only (chart-500 marks on a transparent ground, so
 * the sheet shows between the dots); pointer ripples listened for on the
 * section, not the window; DPR capped at 1.5 inside the original pixel
 * budget; the loop and context release come from the shared night stage
 * (nightGl.ts).
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, RenderTarget, Texture, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { bandOf, hexToVec3, nightDpr, prefersStill, releaseContext, useNightScene } from "./nightGl";

type PatternKind = "dot" | "square" | "plus" | "line";
type WaveKind = "silk" | "swell" | "ripple";
type FadeKind = "none" | "edges" | "center" | "bottom" | "top";

/** The print, in one place. */
const HALFTONE: {
  pattern: PatternKind;
  wave: WaveKind;
  color: string;
  spacing: number;
  markSize: number;
  depth: number;
  light: number;
  shine: number;
  contrast: number;
  speed: number;
  scale: number;
  direction: number;
  opacity: number;
  fade: FadeKind;
  fadeSize: number;
  cursorSize: number;
  cursorStrength: number;
} = {
  pattern: "dot",
  wave: "swell",
  color: chart[500],
  spacing: 9,
  markSize: 0.72,
  depth: 0.5,
  light: 0,
  shine: 0.9,
  contrast: 1.15,
  speed: 0.45,
  scale: 1.2,
  direction: 100,
  opacity: 0.34,
  fade: "center",
  fadeSize: 0.55,
  cursorSize: 60,
  cursorStrength: 0.5,
};

const PATTERNS: Record<PatternKind, number> = { dot: 0, square: 1, plus: 2, line: 3 };
const WAVES: Record<WaveKind, number> = { silk: 0, swell: 1, ripple: 2 };
const FADES: Record<FadeKind, number> = { none: 0, edges: 1, center: 2, bottom: 3, top: 4 };
const WAVE_UNIT = 520;
const RIPPLE_CELL = 8;
const RIPPLE_RATE = 60;
const PIXEL_BUDGET = 4.5e6;
const INTRO_SECONDS = 2;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface RippleField {
  width: number;
  height: number;
  read: RenderTarget;
  write: RenderTarget;
}

const passVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fieldFragment = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uSize;
uniform float uDpr;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform int uWave;
uniform float uTime;
uniform float uUnit;
uniform vec2 uHeading;
uniform float uAmp;
uniform float uDepth;
uniform vec3 uLight;
uniform float uShine;
uniform float uContrast;
uniform float uInk;
uniform float uOpacity;
uniform int uFade;
uniform float uFadeSize;
uniform float uAppear;
uniform sampler2D tRipple;
uniform float uRipple;
out vec4 fragColor;

const float FOLDS = 5.5;

uvec3 scramble(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

vec3 lattice(vec3 corner) {
  uvec3 h = scramble(uvec3(ivec3(corner) + 4096));
  return vec3(h & 65535u) / 32767.5 - 1.0;
}

float gradientNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(lattice(i), f);
  float n100 = dot(lattice(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(lattice(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(lattice(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(lattice(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(lattice(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(lattice(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(lattice(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
}

vec2 turn(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

float surface(vec2 p, float t) {
  if (uWave == 0) {
    vec2 side = vec2(-uHeading.y, uHeading.x);
    float u = dot(p, uHeading);
    float v = dot(p, side);
    float bend = gradientNoise(vec3(v * 0.85, u * 0.3, t * 0.05)) * 1.7 + 0.4 * sin(v * 1.6 + t * 0.2);
    float phase = u * FOLDS + bend - t * 0.45;
    float swell = 0.6 + 0.4 * gradientNoise(vec3(u * 0.55 + 3.0, v * 0.45, t * 0.04));
    float fold = sin(phase) + 0.32 * sin(2.0 * phase + 1.3);
    float ripple = 0.16 * sin(u * FOLDS * 2.5 + bend * 1.9 - t * 0.9 + 2.1);
    return (fold + ripple) * swell;
  }
  if (uWave == 1) {
    float bend = gradientNoise(vec3(p * 0.6, t * 0.05)) * 0.6;
    float phase = dot(p, uHeading) * 15.0 + bend * 2.2 - t * 1.4;
    float swell = sin(phase) + 0.3 * sin(2.0 * phase - 0.8);
    float roll = 0.75 + 0.25 * gradientNoise(vec3(p * 0.9 + 11.0, t * 0.05));
    return 0.8 * swell * roll;
  }
  float r = length(p + uHeading * 1.2);
  float bend = gradientNoise(vec3(p * 1.2, t * 0.05)) * 0.1;
  return sin((r + bend) * 9.0 - t * 1.8) * (0.45 + 0.55 * exp(-(r - 0.6) * 0.8));
}

float heightAt(vec2 css) {
  float h = surface((css - 0.5 * uSize) / uUnit, uTime) * uAmp;
  if (uRipple > 0.0) h += texture(tRipple, css / uSize).r * uRipple;
  return h;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 center = uOrigin + (cell + 0.5) * uPitch;
  vec2 css = center / uDpr;
  vec2 uv = css / uSize;
  float e = max(uPitch.y / uDpr, 4.0);
  float h = heightAt(css);
  float hx = (heightAt(css + vec2(e, 0.0)) - heightAt(css - vec2(e, 0.0))) / (2.0 * e);
  float hy = (heightAt(css + vec2(0.0, e)) - heightAt(css - vec2(0.0, e))) / (2.0 * e);
  vec2 grad = vec2(hx, hy) * uUnit * uDepth * 0.4;
  vec3 n = normalize(vec3(-grad, 1.0));

  float diffuse = clamp(dot(n, uLight), 0.0, 1.0);
  vec3 halfway = normalize(uLight + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(n, halfway), 0.0, 1.0), 160.0) * uShine * 1.15;
  float hollow = 0.7 + 0.3 * clamp(h * 0.5 + 0.5, 0.0, 1.0);
  float tone = clamp(diffuse * hollow * 0.78 + spec, 0.0, 1.0);
  tone = clamp((tone - 0.42) * uContrast + 0.42, 0.0, 1.0);

  float level = uInk > 0.5 ? pow(clamp(1.0 - tone / 0.46, 0.0, 1.0), 2.4) * 0.72 : pow(tone, 2.2);
  float emphasis = uInk > 0.5 ? smoothstep(0.55, 0.95, level) : clamp(spec * 1.6, 0.0, 1.0);

  float fade = 1.0;
  vec2 c = uv * 2.0 - 1.0;
  if (uFade == 1) {
    fade = 1.0 - smoothstep(1.0 - uFadeSize, 1.18, length(c));
  } else if (uFade == 2) {
    fade = mix(0.05, 1.0, smoothstep(0.08, 0.08 + uFadeSize, length(c * vec2(1.0, 1.35))));
  } else if (uFade == 3) {
    fade = smoothstep(0.0, uFadeSize, uv.y);
  } else if (uFade == 4) {
    fade = smoothstep(0.0, uFadeSize, 1.0 - uv.y);
  }

  float reach = length(css - 0.5 * uSize) / max(0.5 * length(uSize), 1.0);
  float appear = smoothstep(reach - 0.05, reach + 0.3, uAppear * 1.35);

  float alpha = uOpacity * fade * appear * (0.22 + 0.78 * level);
  float lift = clamp(h * uDepth * 0.42, -0.48, 0.48);
  fragColor = vec4(level, alpha, emphasis, lift + 0.5);
}
`;

const rippleFragment = `#version 300 es
precision highp float;
uniform sampler2D tState;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uImpulse;
uniform float uDamping;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec2 state = texture(tState, uv).rg;
  float left = texture(tState, uv - vec2(uTexel.x, 0.0)).r;
  float right = texture(tState, uv + vec2(uTexel.x, 0.0)).r;
  float below = texture(tState, uv - vec2(0.0, uTexel.y)).r;
  float above = texture(tState, uv + vec2(0.0, uTexel.y)).r;
  float next = ((left + right + below + above) * 0.5 - state.g) * uDamping;
  vec2 p = uv * uSize;
  vec2 segment = uTo - uFrom;
  float along = clamp(dot(p - uFrom, segment) / max(dot(segment, segment), 1e-4), 0.0, 1.0);
  float d = length(p - uFrom - segment * along) / uRadius;
  next -= uImpulse * exp(-d * d * 2.0);
  fragColor = vec4(next, state.r, 0.0, 1.0);
}
`;

const markFragment = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D tField;
uniform sampler2D tAtlas;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform vec2 uGrid;
uniform int uPattern;
uniform float uMarkSize;
uniform float uStroke;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec4 uBackground;
uniform vec3 uAtlas;
out vec4 fragColor;

float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float coverage(vec2 local, float level) {
  float span = uPitch.y * uMarkSize;
  float area = max(sqrt(level), 0.14);
  if (uPattern == 0) {
    return clamp(0.5 - (length(local) - 0.5 * span * area), 0.0, 1.0);
  }
  if (uPattern == 1) {
    float extent = 0.5 * span * area;
    return clamp(0.5 - box(local, vec2(extent), extent * 0.3), 0.0, 1.0);
  }
  if (uPattern == 2) {
    float arm = 0.5 * span * mix(0.3, 1.0, level);
    float width = 0.5 * uStroke;
    return clamp(0.5 - min(box(local, vec2(arm, width), width), box(local, vec2(width, arm), width)), 0.0, 1.0);
  }
  if (uAtlas.z < 1.0) return 0.0;
  vec2 g = local / span + 0.5;
  if (g.x < 0.0 || g.y < 0.0 || g.x > 1.0 || g.y > 1.0) return 0.0;
  float index = min(floor(level * uAtlas.z), uAtlas.z - 1.0);
  vec2 tile = vec2(mod(index, uAtlas.x), floor(index / uAtlas.x));
  vec2 atlasUv = (tile + vec2(g.x, 1.0 - g.y)) / uAtlas.xy;
  vec2 texel = 1.0 / (span * uAtlas.xy);
  return textureGrad(tAtlas, atlasUv, vec2(texel.x, 0.0), vec2(0.0, texel.y)).a;
}

vec4 lineInk(vec2 rel) {
  float fx = rel.x / uPitch.x - 0.5;
  float c0 = clamp(floor(fx), 0.0, uGrid.x - 1.0);
  float c1 = min(c0 + 1.0, uGrid.x - 1.0);
  float t = clamp(fx - c0, 0.0, 1.0);
  float row = floor(rel.y / uPitch.y);
  vec4 ink = vec4(0.0);
  for (int k = -1; k <= 1; k++) {
    float cy = row + float(k);
    if (cy < 0.0 || cy >= uGrid.y) continue;
    vec4 a = texelFetch(tField, ivec2(int(c0), int(cy)), 0);
    vec4 b = texelFetch(tField, ivec2(int(c1), int(cy)), 0);
    vec4 f = mix(a, b, t);
    if (f.g < 0.002) continue;
    float y = (cy + 0.5 + f.a - 0.5) * uPitch.y;
    float slope = (b.a - a.a) * uPitch.y / uPitch.x;
    float thickness = max(uStroke, uPitch.y * uMarkSize * f.r);
    float d = abs(rel.y - y) / sqrt(1.0 + slope * slope) - 0.5 * thickness;
    float alpha = clamp(0.5 - d, 0.0, 1.0) * f.g;
    if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
  }
  return ink;
}

void main() {
  vec2 rel = gl_FragCoord.xy - uOrigin;
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 ink = vec4(0.0);
  if (uPattern == 3) {
    ink = lineInk(rel);
  } else {
    float cx = floor(rel.x / uPitch.x);
    float row = floor(rel.y / uPitch.y);
    if (cx >= 0.0 && cx < uGrid.x) {
      for (int k = -1; k <= 1; k++) {
        float cy = row + float(k);
        if (cy < 0.0 || cy >= uGrid.y) continue;
        vec4 f = texelFetch(tField, ivec2(int(cx), int(cy)), 0);
        if (f.g < 0.002) continue;
        vec2 center = (vec2(cx, cy) + 0.5) * uPitch + vec2(0.0, (f.a - 0.5) * uPitch.y);
        float alpha = coverage(rel - center, f.r) * f.g;
        if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
      }
    }
  }
  fragColor = ink + background * (1.0 - ink.a);
}
`;

export default function PatternWaves(props: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, props, (el, wake) => {
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      releaseContext(gl);
      return null;
    }
    const gl2 = gl as unknown as WebGL2RenderingContext;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);

    const geometry = new Triangle(gl);
    const blank = new Texture(gl);
    const floatTargets = !!gl.getExtension("EXT_color_buffer_float");
    const dispose = (target: RenderTarget) => {
      gl.deleteFramebuffer(target.buffer);
      gl.deleteTexture(target.texture.texture);
    };
    const fieldTargetFor = (w: number, h: number) =>
      new RenderTarget(gl, { width: w, height: h, depth: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST });
    const rippleTargetFor = (w: number, h: number) =>
      new RenderTarget(gl, {
        width: w,
        height: h,
        depth: false,
        type: gl2.HALF_FLOAT,
        format: gl.RGBA,
        internalFormat: gl2.RGBA16F,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });

    let fieldTarget = fieldTargetFor(1, 1);
    let ripple: RippleField | null = null;

    const fieldUniforms = {
      uSize: { value: [1, 1] },
      uDpr: { value: 1 },
      uOrigin: { value: [0, 0] },
      uPitch: { value: [1, 1] },
      uWave: { value: WAVES[HALFTONE.wave] },
      uTime: { value: 0 },
      uUnit: { value: WAVE_UNIT * clamp(HALFTONE.scale, 0.2, 5) },
      uHeading: { value: [1, 0] },
      uAmp: { value: 0 },
      uDepth: { value: clamp(HALFTONE.depth, 0, 1.5) },
      uLight: { value: [0, 0, 1] },
      uShine: { value: clamp(HALFTONE.shine, 0, 2) },
      uContrast: { value: clamp(HALFTONE.contrast, 0.3, 3) },
      // chart teal on transparent paper is dark marks on light: ink mode
      uInk: { value: 1 },
      uOpacity: { value: clamp(HALFTONE.opacity, 0, 1) },
      uFade: { value: FADES[HALFTONE.fade] },
      uFadeSize: { value: clamp(HALFTONE.fadeSize, 0.05, 1) },
      uAppear: { value: 0 },
      tRipple: { value: blank },
      uRipple: { value: 0 },
    };
    const fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: passVertex,
        fragment: fieldFragment,
        uniforms: fieldUniforms,
        depthTest: false,
        depthWrite: false,
      }),
    });

    const rippleUniforms = {
      tState: { value: blank },
      uTexel: { value: [1, 1] },
      uSize: { value: [1, 1] },
      uFrom: { value: [0, 0] },
      uTo: { value: [0, 0] },
      uRadius: { value: clamp(HALFTONE.cursorSize, 8, 400) },
      uImpulse: { value: 0 },
      uDamping: { value: 0.975 },
    };
    const rippleMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: passVertex,
        fragment: rippleFragment,
        uniforms: rippleUniforms,
        depthTest: false,
        depthWrite: false,
      }),
    });

    const patternIndex = PATTERNS[HALFTONE.pattern];
    const markUniforms = {
      tField: { value: fieldTarget.texture },
      tAtlas: { value: blank },
      uOrigin: { value: [0, 0] },
      uPitch: { value: [1, 1] },
      uGrid: { value: [1, 1] },
      uPattern: { value: patternIndex },
      uMarkSize: { value: clamp(HALFTONE.markSize, 0.05, 1) },
      uStroke: { value: 2 },
      uColor: { value: hexToVec3(HALFTONE.color) },
      // emphasis (the shaded faces) prints in the deeper chart ink
      uAccent: { value: hexToVec3(chart[700]) },
      uBackground: { value: [0, 0, 0, 0] },
      // no glyph atlas: pattern 4 is not used
      uAtlas: { value: [1, 1, 0] },
    };
    const markMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: passVertex,
        fragment: markFragment,
        uniforms: markUniforms,
        depthTest: false,
        depthWrite: false,
      }),
    });

    const still = prefersStill();
    const heading = (HALFTONE.direction * Math.PI) / 180;
    const lightAngle = ((HALFTONE.direction + 180 + clamp(HALFTONE.light, -90, 90)) * Math.PI) / 180;
    fieldUniforms.uHeading.value = [Math.cos(heading), Math.sin(heading)];
    fieldUniforms.uLight.value = [Math.cos(lightAngle) * 0.78, Math.sin(lightAngle) * 0.78, 0.62];

    let width = 1;
    let height = 1;
    let time = 0;
    let introClock = still ? 1 : 0;
    let rippleUntil = 0;
    let rippleLive = false;
    let rippleClock = 0;
    let rippleActive = false;
    const pointer = { x: 0, y: 0, inside: false, placed: false, lastX: 0, lastY: 0, burst: 0 };

    const buildRipple = () => {
      if (!floatTargets) return;
      const w = clamp(Math.ceil(width / RIPPLE_CELL), 4, 512);
      const h = clamp(Math.ceil(height / RIPPLE_CELL), 4, 512);
      if (ripple && ripple.width === w && ripple.height === h) return;
      if (ripple) {
        dispose(ripple.read);
        dispose(ripple.write);
      }
      ripple = { width: w, height: h, read: rippleTargetFor(w, h), write: rippleTargetFor(w, h) };
      rippleLive = false;
    };

    const clearRipple = () => {
      if (!ripple) return;
      [ripple.read, ripple.write].forEach((target) => {
        renderer.bindFramebuffer(target);
        gl.viewport(0, 0, target.width, target.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
      renderer.bindFramebuffer();
    };

    const stepRipple = (f: RippleField, dt: number) => {
      rippleClock = Math.min(rippleClock + dt * RIPPLE_RATE, 4);
      const strength = clamp(HALFTONE.cursorStrength, 0, 1);
      const moved = Math.hypot(pointer.x - pointer.lastX, pointer.y - pointer.lastY);
      let impulse = (pointer.inside ? Math.min(moved / 14, 1) * 0.35 * strength : 0) + pointer.burst * strength;
      pointer.burst = 0;
      rippleUniforms.uTexel.value = [1 / f.width, 1 / f.height];
      rippleUniforms.uSize.value = [width, height];
      rippleUniforms.uFrom.value = [pointer.lastX, height - pointer.lastY];
      rippleUniforms.uTo.value = [pointer.x, height - pointer.y];
      while (rippleClock >= 1) {
        rippleClock -= 1;
        rippleUniforms.tState.value = f.read.texture;
        rippleUniforms.uImpulse.value = impulse;
        renderer.render({ scene: rippleMesh, target: f.write, clear: false });
        const next = f.read;
        f.read = f.write;
        f.write = next;
        impulse = 0;
      }
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;
    };

    // The section, not the window: the sea answers the pointer only over itself.
    const band = bandOf(el);
    const locate = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return { x, y, inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
    };
    const onMove = (e: PointerEvent) => {
      const spot = locate(e);
      pointer.x = spot.x;
      pointer.y = spot.y;
      if (spot.inside !== pointer.inside) pointer.placed = false;
      pointer.inside = spot.inside;
      if (spot.inside) wake();
    };
    const onDown = (e: PointerEvent) => {
      const spot = locate(e);
      if (!spot.inside) return;
      pointer.x = spot.x;
      pointer.y = spot.y;
      if (!pointer.inside) {
        pointer.lastX = spot.x;
        pointer.lastY = spot.y;
      }
      pointer.burst = 1.2;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.placed = false;
      wake();
    };
    band.addEventListener("pointermove", onMove, { passive: true });
    band.addEventListener("pointerdown", onDown, { passive: true });
    band.addEventListener("pointerleave", onLeave);

    return {
      canvas,
      resize(w, h) {
        width = w;
        height = h;
        renderer.dpr = Math.min(nightDpr(), Math.sqrt(PIXEL_BUDGET / (w * h)));
        renderer.setSize(w, h);
        buildRipple();
      },
      moving: () => !still || introClock < 1 || rippleActive,
      draw(_t, dt) {
        const now = performance.now();
        if (!still) time += dt * HALFTONE.speed;
        introClock = still ? 1 : Math.min(1, introClock + dt / INTRO_SECONDS);
        const appear = 1 - Math.pow(1 - clamp(introClock / 0.75, 0, 1), 3);
        const rise = clamp((introClock - 0.1) / 0.9, 0, 1);
        const amp = rise * rise * (3 - 2 * rise);

        const rippling = !still && !!ripple && HALFTONE.cursorStrength > 0;
        if (rippling && pointer.inside && !pointer.placed) {
          pointer.lastX = pointer.x;
          pointer.lastY = pointer.y;
          pointer.placed = true;
        }
        if (rippling && (pointer.inside || pointer.burst > 0)) rippleUntil = now + 5000;
        rippleActive = rippling && now < rippleUntil;
        if (rippleActive && ripple) {
          stepRipple(ripple, dt);
          rippleLive = true;
        } else if (rippleLive) {
          clearRipple();
          rippleLive = false;
        }

        const canvasW = gl.canvas.width;
        const canvasH = gl.canvas.height;
        const dpr = canvasW / width;
        const pitchY = Math.max(4, Math.round(clamp(HALFTONE.spacing, 4, 120) * dpr));
        const pitchX = patternIndex === 3 ? Math.max(2, Math.round(pitchY / 4)) : pitchY;
        const cols = Math.min(4096, Math.ceil(canvasW / pitchX) + 1);
        const rows = Math.min(4096, Math.ceil(canvasH / pitchY) + 2);
        const origin = [Math.floor((canvasW - cols * pitchX) / 2), Math.floor((canvasH - rows * pitchY) / 2)];
        if (fieldTarget.width !== cols || fieldTarget.height !== rows) {
          dispose(fieldTarget);
          fieldTarget = fieldTargetFor(cols, rows);
          markUniforms.tField.value = fieldTarget.texture;
        }

        fieldUniforms.uSize.value = [width, height];
        fieldUniforms.uDpr.value = dpr;
        fieldUniforms.uOrigin.value = origin;
        fieldUniforms.uPitch.value = [pitchX, pitchY];
        fieldUniforms.uTime.value = time;
        fieldUniforms.uAmp.value = amp;
        fieldUniforms.uAppear.value = appear;
        fieldUniforms.tRipple.value = ripple && rippleLive ? ripple.read.texture : blank;
        fieldUniforms.uRipple.value = rippleLive ? 0.32 : 0;
        renderer.render({ scene: fieldMesh, target: fieldTarget });

        markUniforms.uOrigin.value = origin;
        markUniforms.uPitch.value = [pitchX, pitchY];
        markUniforms.uGrid.value = [cols, rows];
        markUniforms.uStroke.value = patternIndex === 3 ? 0.9 * dpr : Math.max(1.1 * dpr, pitchY * 0.08);
        renderer.render({ scene: markMesh });
      },
      dispose() {
        band.removeEventListener("pointermove", onMove);
        band.removeEventListener("pointerdown", onDown);
        band.removeEventListener("pointerleave", onLeave);
        if (ripple) {
          dispose(ripple.read);
          dispose(ripple.write);
        }
        dispose(fieldTarget);
        releaseContext(gl);
      },
    };
  });
  return <div ref={host} className="nb-fill" />;
}
