/**
 * SplashInk — wet ink blooming in the water under the landing.
 *
 * Source: React Bits, SplashCursor (TypeScript + Tailwind edition),
 * https://reactbits.dev/r/SplashCursor-TS-TW.json — itself after Pavel
 * Dobryakov's WebGL fluid simulation.
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md.
 *
 * Adapted for ORCA:
 *   - dye in the four marine inks only (splashRecipe.ts, from the tokens), no
 *     rainbow; the dye carries its density in alpha and is drawn as
 *     premultiplied ink over a transparent canvas, so dense ink darkens the
 *     paper instead of glowing on it;
 *   - the display shader caps coverage per pixel so the ink never takes more
 *     than `maxLoss` of the paper's luminance where there are words (a
 *     coarse keep-out mask of the text on screen, painted on a 2D canvas),
 *     so body text over it keeps 4.5:1; on bare paper it may go to
 *     `openLoss` and read as ink;
 *   - quiet: smaller, softer splats, ink that thins out in about two and a
 *     half seconds, sim 128, dye at most 1024 on its long side, DPR at most 1.5;
 *   - zero work at rest: the loop runs only while the pointer moves and the
 *     ink fades, then clears and stops; the next movement starts it again;
 *   - mouse and pen only, no click splat, no touch;
 *   - an effect behind EffectSlot (gate, lease, poster): it opens one WebGL
 *     context under the slot's lease, loses it on unmount, steps aside when
 *     asked once its ink has faded, and says so if anything fails;
 *   - no console output; the canvas is `aria-hidden` and takes no pointer
 *     events (splash.css).
 */
import { useEffect, useRef } from "react";
import type { EffectProps } from "./EffectSlot";
import { RESIDUAL_CAP, SPLASH, SPLASH_INKS, SPLASH_PAPER, rgbOf, settled, textBoxes } from "./splashRecipe";
import { noteFrame } from "./ledger";
import { paper } from "../tokens";

/** While the ink runs, the words' mask is repainted at least this often. */
const MASK_EVERY_MS = 250;

type GL = WebGLRenderingContext | WebGL2RenderingContext;
type RGB = [number, number, number];

interface Fbo {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
  attach: (unit: number) => number;
}

interface DoubleFbo {
  width: number;
  height: number;
  texelX: number;
  texelY: number;
  read: Fbo;
  write: Fbo;
  swap: () => void;
}

interface Format {
  internal: number;
  format: number;
}

const BASE_VERTEX = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const CLEAR = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
`;

/**
 * Ink on paper. The dye holds ink colour times density in rgb and the
 * density in alpha. Coverage grows with density (and a little at a bloom's
 * rim), but never past the coverage at which this ink would take more than
 * its budget of the paper's luminance (uTextLoss where the keep-out mask
 * says there are words, uOpenLoss on bare paper), solved per pixel by
 * bisection, in display space, the way the page composites it. Output is
 * premultiplied.
 */
const DISPLAY = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform sampler2D uMask;
  uniform vec3 uPaper;
  uniform float uTextLoss;
  uniform float uOpenLoss;
  uniform float uGain;
  uniform float uEdge;

  float lum (vec3 s) {
    vec3 lo = s / 12.92;
    vec3 hi = pow((s + 0.055) / 1.055, vec3(2.4));
    vec3 l = mix(lo, hi, step(0.04045, s));
    return dot(l, vec3(0.2126, 0.7152, 0.0722));
  }

  void main () {
    vec4 d = texture2D(uTexture, vUv);
    float density = max(d.a, 0.0);
    if (density < 0.002) { gl_FragColor = vec4(0.0); return; }
    vec3 ink = clamp(d.rgb / density, 0.0, 1.0);
    float rim = abs(texture2D(uTexture, vR).a - texture2D(uTexture, vL).a)
              + abs(texture2D(uTexture, vT).a - texture2D(uTexture, vB).a);
    float want = 1.0 - exp(-uGain * (density + uEdge * rim));
    // Words on screen (the keep-out mask, 1 under text): the ink thins to
    // the text budget there, and blooms to the open budget on bare paper.
    float words = texture2D(uMask, vUv).a;
    float floorLum = lum(uPaper) * (1.0 - mix(uOpenLoss, uTextLoss, words));
    float lo = 0.0;
    float hi = 1.0;
    for (int i = 0; i < 8; i++) {
      float m = 0.5 * (lo + hi);
      if (lum(mix(uPaper, ink, m)) >= floorLum) lo = m; else hi = m;
    }
    float a = want * lo;
    gl_FragColor = vec4(ink * a, a);
  }
`;

/** Adds a Gaussian of `color` at `point`: velocity (rg) or ink (rgb + density in a). */
const SPLAT = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec4 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    gl_FragColor = texture2D(uTarget, vUv) + exp(-dot(p, p) / radius) * color;
  }
`;

const ADVECTION = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }
  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    gl_FragColor = result / (1.0 + dissipation * dt);
  }
`;

const DIVERGENCE = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;

const CURL = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
  }
`;

const VORTICITY = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const PRESSURE = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

/** A macrotask's pause. */
const pause = () => new Promise<void>((done) => setTimeout(done, 0));

/**
 * Wait, without blocking, until every program has finished linking, where
 * the browser can say so (KHR_parallel_shader_compile). Elsewhere the first
 * status query simply waits for the driver, as it always did.
 */
async function linked(gl: GL, programs: WebGLProgram[]): Promise<void> {
  const ext = gl.getExtension("KHR_parallel_shader_compile");
  if (!ext) return;
  const started = performance.now();
  while (!programs.every((p) => gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR))) {
    if (gl.isContextLost() || performance.now() - started > 5000) return;
    await new Promise<void>((done) => setTimeout(done, 16));
  }
}

/**
 * One WebGL fluid, owned by one canvas. Built in a few short tasks (the
 * shaders link off the main thread). `dispose()` frees everything and loses
 * the context.
 */
async function createFluid(canvas: HTMLCanvasElement) {
  const params: WebGLContextAttributes = {
    alpha: true,
    premultipliedAlpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  };
  const gl2 = canvas.getContext("webgl2", params);
  const found: GL | null = gl2 ?? (canvas.getContext("webgl", params) as WebGLRenderingContext | null);
  if (!found) throw new Error("no WebGL");
  const gl: GL = found;
  const isGL2 = gl2 != null;

  let linear: boolean;
  let halfFloat: number;
  if (isGL2) {
    gl2.getExtension("EXT_color_buffer_float");
    linear = !!gl2.getExtension("OES_texture_float_linear");
    halfFloat = gl2.HALF_FLOAT;
  } else {
    const hf = gl.getExtension("OES_texture_half_float");
    linear = !!gl.getExtension("OES_texture_half_float_linear");
    halfFloat = hf?.HALF_FLOAT_OES ?? 0;
  }
  if (!halfFloat) throw new Error("no half-float textures");

  const renderable = (internal: number, format: number): boolean => {
    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) return false;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, halfFloat, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    return ok;
  };
  const pick = (candidates: [number, number][]): Format => {
    for (const [internal, format] of candidates) if (renderable(internal, format)) return { internal, format };
    throw new Error("no renderable texture format");
  };
  const rgba = isGL2 ? pick([[gl2.RGBA16F, gl.RGBA]]) : pick([[gl.RGBA, gl.RGBA]]);
  const rg = isGL2 ? pick([[gl2.RG16F, gl2.RG], [gl2.RGBA16F, gl.RGBA]]) : rgba;
  const r = isGL2 ? pick([[gl2.R16F, gl2.RED], [gl2.RG16F, gl2.RG], [gl2.RGBA16F, gl.RGBA]]) : rgba;

  // Let the page breathe between the context and the shaders: two short
  // tasks, not one long one.
  await pause();
  if (gl.isContextLost()) throw new Error("context lost");

  const shaders: WebGLShader[] = [];
  const programs: WebGLProgram[] = [];
  // Compiles and links are only issued here; nothing asks for their status
  // until they are done (KHR_parallel_shader_compile), so the browser does
  // the work off the main thread instead of in one long task.
  const compile = (type: number, source: string, defines: string[] = []): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("no shader");
    gl.shaderSource(shader, defines.map((d) => `#define ${d}\n`).join("") + source);
    gl.compileShader(shader);
    shaders.push(shader);
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, BASE_VERTEX);

  class Program {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null> = {};
    constructor(fragment: WebGLShader) {
      const program = gl.createProgram();
      if (!program) throw new Error("no program");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, "aPosition");
      gl.linkProgram(program);
      this.program = program;
      programs.push(program);
    }
    /** Once linked: check it, and learn where its uniforms are. */
    finish() {
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error("program did not link");
      const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(this.program, i);
        if (info) this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
      }
    }
    bind() {
      gl.useProgram(this.program);
    }
  }

  const clear = new Program(compile(gl.FRAGMENT_SHADER, CLEAR));
  const splatP = new Program(compile(gl.FRAGMENT_SHADER, SPLAT));
  const advection = new Program(compile(gl.FRAGMENT_SHADER, ADVECTION, linear ? [] : ["MANUAL_FILTERING"]));
  const divergenceP = new Program(compile(gl.FRAGMENT_SHADER, DIVERGENCE));
  const curlP = new Program(compile(gl.FRAGMENT_SHADER, CURL));
  const vorticity = new Program(compile(gl.FRAGMENT_SHADER, VORTICITY));
  const pressureP = new Program(compile(gl.FRAGMENT_SHADER, PRESSURE));
  const gradient = new Program(compile(gl.FRAGMENT_SHADER, GRADIENT_SUBTRACT));
  const display = new Program(compile(gl.FRAGMENT_SHADER, DISPLAY));
  const every = [clear, splatP, advection, divergenceP, curlP, vorticity, pressureP, gradient, display];
  await linked(gl, programs);
  if (gl.isContextLost()) throw new Error("context lost");
  every.forEach((p) => p.finish());

  const quad = gl.createBuffer();
  const index = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.disable(gl.BLEND);

  const blit = (target: Fbo | null, wipe = false) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    if (wipe) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  const createFbo = (w: number, h: number, f: Format, filter: number): Fbo => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!texture || !fbo) throw new Error("no framebuffer");
    textures.push(texture);
    framebuffers.push(fbo);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, f.internal, w, h, 0, f.format, halfFloat, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelX: 1 / w,
      texelY: 1 / h,
      attach(unit: number) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return unit;
      },
    };
  };
  const createDouble = (w: number, h: number, f: Format, filter: number): DoubleFbo => {
    const pair: DoubleFbo = {
      width: w,
      height: h,
      texelX: 1 / w,
      texelY: 1 / h,
      read: createFbo(w, h, f, filter),
      write: createFbo(w, h, f, filter),
      swap() {
        const t = pair.read;
        pair.read = pair.write;
        pair.write = t;
      },
    };
    return pair;
  };
  const freeFbo = (f: Fbo) => {
    gl.deleteTexture(f.texture);
    gl.deleteFramebuffer(f.fbo);
  };

  const filter = linear ? gl.LINEAR : gl.NEAREST;
  let dye: DoubleFbo | null = null;
  let velocity: DoubleFbo | null = null;
  let divergence: Fbo | null = null;
  let curl: Fbo | null = null;
  let pressure: DoubleFbo | null = null;

  /** Grid sizes for the canvas's shape: sim by its short side, dye capped on its long side. */
  const sizes = () => {
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;
    const aspect = Math.max(w, h) / Math.max(1, Math.min(w, h));
    const simShort = SPLASH.simResolution;
    const simLong = Math.round(simShort * aspect);
    const dyeLong = Math.min(SPLASH.dyeLongSide, Math.max(w, h));
    const dyeShort = Math.max(1, Math.round(dyeLong / aspect));
    return w >= h
      ? { sim: [simLong, simShort], dye: [dyeLong, dyeShort] }
      : { sim: [simShort, simLong], dye: [dyeShort, dyeLong] };
  };

  const allocate = () => {
    for (const pair of [dye, velocity, pressure]) if (pair) [pair.read, pair.write].forEach(freeFbo);
    for (const one of [divergence, curl]) if (one) freeFbo(one);
    const { sim, dye: d } = sizes();
    dye = createDouble(d[0], d[1], rgba, filter);
    velocity = createDouble(sim[0], sim[1], rg, filter);
    divergence = createFbo(sim[0], sim[1], r, gl.NEAREST);
    curl = createFbo(sim[0], sim[1], r, gl.NEAREST);
    pressure = createDouble(sim[0], sim[1], r, gl.NEAREST);
  };

  const fit = (): boolean => {
    const dpr = Math.min(window.devicePixelRatio || 1, SPLASH.dprCap);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h && dye) return false;
    canvas.width = w;
    canvas.height = h;
    // The ink is let go on a resize: re-sampling it is not worth the work.
    allocate();
    return true;
  };

  const set = (p: Program, name: string, fn: (loc: WebGLUniformLocation) => void) => {
    const loc = p.uniforms[name];
    if (loc) fn(loc);
  };

  const paper = rgbOf(SPLASH_PAPER);

  // The words-on-screen mask (painted on a 2D canvas by the component),
  // sampled with linear filtering so each keep-out has a soft edge. Until
  // the first paint it is one texel of "words everywhere": the strict budget.
  const maskTexture = gl.createTexture();
  if (!maskTexture) throw new Error("no mask texture");
  textures.push(maskTexture);
  gl.bindTexture(gl.TEXTURE_2D, maskTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

  /** Upload a freshly painted mask (top row first, as a canvas is). */
  function setMask(source: HTMLCanvasElement) {
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  function step(dt: number) {
    const v = velocity!;
    gl.disable(gl.BLEND);

    curlP.bind();
    set(curlP, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    set(curlP, "uVelocity", (l) => gl.uniform1i(l, v.read.attach(0)));
    blit(curl);

    vorticity.bind();
    set(vorticity, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    set(vorticity, "uVelocity", (l) => gl.uniform1i(l, v.read.attach(0)));
    set(vorticity, "uCurl", (l) => gl.uniform1i(l, curl!.attach(1)));
    set(vorticity, "curl", (l) => gl.uniform1f(l, SPLASH.curl));
    set(vorticity, "dt", (l) => gl.uniform1f(l, dt));
    blit(v.write);
    v.swap();

    divergenceP.bind();
    set(divergenceP, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    set(divergenceP, "uVelocity", (l) => gl.uniform1i(l, v.read.attach(0)));
    blit(divergence);

    const p = pressure!;
    clear.bind();
    set(clear, "uTexture", (l) => gl.uniform1i(l, p.read.attach(0)));
    set(clear, "value", (l) => gl.uniform1f(l, SPLASH.pressure));
    blit(p.write);
    p.swap();

    pressureP.bind();
    set(pressureP, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    set(pressureP, "uDivergence", (l) => gl.uniform1i(l, divergence!.attach(0)));
    for (let i = 0; i < SPLASH.pressureIterations; i++) {
      set(pressureP, "uPressure", (l) => gl.uniform1i(l, p.read.attach(1)));
      blit(p.write);
      p.swap();
    }

    gradient.bind();
    set(gradient, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    set(gradient, "uPressure", (l) => gl.uniform1i(l, p.read.attach(0)));
    set(gradient, "uVelocity", (l) => gl.uniform1i(l, v.read.attach(1)));
    blit(v.write);
    v.swap();

    advection.bind();
    set(advection, "texelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    if (!linear) set(advection, "dyeTexelSize", (l) => gl.uniform2f(l, v.texelX, v.texelY));
    const vid = v.read.attach(0);
    set(advection, "uVelocity", (l) => gl.uniform1i(l, vid));
    set(advection, "uSource", (l) => gl.uniform1i(l, vid));
    set(advection, "dt", (l) => gl.uniform1f(l, dt));
    set(advection, "dissipation", (l) => gl.uniform1f(l, SPLASH.velocityDissipation));
    blit(v.write);
    v.swap();

    const d = dye!;
    if (!linear) set(advection, "dyeTexelSize", (l) => gl.uniform2f(l, d.texelX, d.texelY));
    set(advection, "uVelocity", (l) => gl.uniform1i(l, v.read.attach(0)));
    set(advection, "uSource", (l) => gl.uniform1i(l, d.read.attach(1)));
    set(advection, "dissipation", (l) => gl.uniform1f(l, SPLASH.densityDissipation));
    blit(d.write);
    d.swap();
  }

  function draw() {
    const d = dye!;
    display.bind();
    set(display, "texelSize", (l) => gl.uniform2f(l, d.texelX, d.texelY));
    set(display, "uTexture", (l) => gl.uniform1i(l, d.read.attach(0)));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    set(display, "uMask", (l) => gl.uniform1i(l, 1));
    set(display, "uPaper", (l) => gl.uniform3f(l, paper[0], paper[1], paper[2]));
    set(display, "uTextLoss", (l) => gl.uniform1f(l, SPLASH.maxLoss));
    set(display, "uOpenLoss", (l) => gl.uniform1f(l, SPLASH.openLoss));
    set(display, "uGain", (l) => gl.uniform1f(l, SPLASH.gain));
    set(display, "uEdge", (l) => gl.uniform1f(l, SPLASH.edge));
    blit(null, true);
  }

  const aspect = () => canvas.width / canvas.height;
  const radius = () => {
    const base = SPLASH.splatRadius / 100;
    return aspect() > 1 ? base * aspect() : base;
  };

  function splat(x: number, y: number, dx: number, dy: number, ink: RGB) {
    const v = velocity!;
    const d = dye!;
    splatP.bind();
    set(splatP, "aspectRatio", (l) => gl.uniform1f(l, aspect()));
    set(splatP, "point", (l) => gl.uniform2f(l, x, y));
    set(splatP, "radius", (l) => gl.uniform1f(l, radius()));
    set(splatP, "uTarget", (l) => gl.uniform1i(l, v.read.attach(0)));
    set(splatP, "color", (l) => gl.uniform4f(l, dx, dy, 0, 0));
    blit(v.write);
    v.swap();
    const a = SPLASH.splatAmount;
    set(splatP, "uTarget", (l) => gl.uniform1i(l, d.read.attach(0)));
    set(splatP, "color", (l) => gl.uniform4f(l, ink[0] * a, ink[1] * a, ink[2] * a, a));
    blit(d.write);
    d.swap();
  }

  /** Back to still, clear water: every field zeroed and the canvas transparent. */
  function still() {
    for (const pair of [dye, velocity, pressure]) {
      if (!pair) continue;
      for (const f of [pair.read, pair.write]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
        gl.viewport(0, 0, f.width, f.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function dispose() {
    for (const f of [dye, velocity, pressure]) if (f) [f.read, f.write].forEach(freeFbo);
    for (const f of [divergence, curl]) if (f) freeFbo(f);
    gl.deleteTexture(maskTexture);
    programs.forEach((p) => gl.deleteProgram(p));
    shaders.forEach((s) => gl.deleteShader(s));
    gl.deleteBuffer(quad);
    gl.deleteBuffer(index);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  fit();
  still();
  return { fit, step, draw, splat, still, setMask, dispose, lost: () => gl.isContextLost() };
}

type Fluid = Awaited<ReturnType<typeof createFluid>>;

const INKS: RGB[] = SPLASH_INKS.map(rgbOf);
const randomInk = (): RGB => INKS[Math.floor(Math.random() * INKS.length)];

export default function SplashInk({ active, onReady, onFail, yieldRequested, onYield }: EffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const props = useRef({ active, onReady, onFail, yieldRequested, onYield });
  /** Set by the mount effect: starts the loop if there is anything to do. */
  const wake = useRef<() => void>(() => {});
  useEffect(() => {
    props.current = { active, onReady, onFail, yieldRequested, onYield };
    wake.current();
  });

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // A canvas per mount: a lost context never comes back, so a remount (or
    // StrictMode's rehearsal) must not inherit the last one's canvas.
    const canvas = document.createElement("canvas");
    canvas.className = "splash-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    /** Let go of whatever context the canvas has, at once. */
    const lose = () =>
      (canvas.getContext("webgl2") ?? canvas.getContext("webgl"))?.getExtension("WEBGL_lose_context")?.loseContext();
    let gone = false;
    let stop: (() => void) | null = null;
    createFluid(canvas).then(
      (fluid) => {
        if (gone) fluid.dispose();
        else stop = runFluid(fluid, canvas, props, wake);
      },
      () => {
        lose();
        if (!gone) props.current.onFail();
      },
    );
    return () => {
      gone = true;
      // A fluid still being built has its context taken from under it; its
      // build then gives up on the lost context.
      if (stop) stop();
      else lose();
      host.removeChild(canvas);
    };
  }, []);

  return <div ref={ref} className="splash-live" />;
}

/** The running splash on a built fluid. Returns the teardown. */
function runFluid(
  fluid: Fluid,
  canvas: HTMLCanvasElement,
  props: { current: Pick<EffectProps, "active" | "onReady" | "onFail" | "yieldRequested" | "onYield"> },
  wake: { current: () => void },
): () => void {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let raf = 0;
  let running = false;
  let last = 0;
  let lastMove = -Infinity;
  /** An upper bound on the densest ink anywhere: what is left to fade. */
  let residual = 0;
  let inkSince = 0;
  let ink = randomInk();
  const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, seen: false };

  // Where the words are: a coarse 2D mask, repainted while the ink runs
  // (when the page scrolls, and a few times a second for anything that
  // moves on its own), never at rest.
  const raw = document.createElement("canvas");
  const mask = document.createElement("canvas");
  const draft = raw.getContext("2d");
  const pen = mask.getContext("2d");
  let maskAt = -Infinity;
  let maskScroll = { x: NaN, y: NaN };
  const paintMask = (now: number) => {
    if (!pen || !draft) return;
    const moved = window.scrollX !== maskScroll.x || window.scrollY !== maskScroll.y;
    if (!moved && now - maskAt < MASK_EVERY_MS) return;
    maskAt = now;
    maskScroll = { x: window.scrollX, y: window.scrollY };
    const s = SPLASH.maskScale;
    const pad = SPLASH.maskPad;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const mw = Math.max(1, Math.ceil(w / s));
    const mh = Math.max(1, Math.ceil(h / s));
    for (const c of [raw, mask]) {
      if (c.width !== mw || c.height !== mh) {
        c.width = mw;
        c.height = mh;
      }
    }
    draft.clearRect(0, 0, mw, mh);
    // Only coverage matters (the shader reads the mask's alpha): "words here".
    draft.fillStyle = paper[50];
    for (const b of textBoxes(document, w, h)) {
      draft.fillRect((b.left - pad) / s, (b.top - pad) / s, (b.right - b.left + 2 * pad) / s, (b.bottom - b.top + 2 * pad) / s);
    }
    // Softened, so the ink thins out around the words like a halo, not a box.
    pen.clearRect(0, 0, mw, mh);
    pen.filter = `blur(${SPLASH.maskBlur / s}px)`;
    pen.drawImage(raw, 0, 0);
    pen.filter = "none";
    fluid.setMask(mask);
  };

  const sleep = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;
    if (fluid.lost()) {
      sleep();
      props.current.onFail();
      return;
    }
    const dt = Math.min((now - last) / 1000, 1 / 60);
    last = now;
    fluid.fit();
    paintMask(now);
    if (pointer.moved) {
      pointer.moved = false;
      if (now - inkSince > 1000 / SPLASH.inkChangeHz) {
        ink = randomInk();
        inkSince = now;
      }
      fluid.splat(pointer.x, pointer.y, pointer.dx * SPLASH.splatForce, pointer.dy * SPLASH.splatForce, ink);
      residual = Math.min(residual + SPLASH.splatAmount, RESIDUAL_CAP);
    }
    fluid.step(dt);
    fluid.draw();
    noteFrame("splash");
    residual /= 1 + SPLASH.densityDissipation * dt;
    if (settled(performance.now(), lastMove, residual)) {
      // Faded: clear water, no loop. The next movement starts it again.
      fluid.still();
      residual = 0;
      sleep();
      if (props.current.yieldRequested) props.current.onYield?.();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  wake.current = () => {
    const { active: on, yieldRequested: asked, onYield: give } = props.current;
    if (!running && asked && residual === 0) {
      give?.();
      return;
    }
    if (running || !on || document.hidden || reduced?.matches) {
      if (running && (!on || document.hidden)) {
        // Out of sight: stop where it is; the ink waits for the reader to return.
        sleep();
      }
      return;
    }
    if (residual === 0 && performance.now() - lastMove >= SPLASH.idleMs) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch" || props.current.yieldRequested) return;
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const x = e.clientX / w;
    const y = 1 - e.clientY / h;
    const aspect = w / h;
    if (pointer.seen) {
      let dx = x - pointer.x;
      let dy = y - pointer.y;
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;
      pointer.dx = dx;
      pointer.dy = dy;
      pointer.moved = dx !== 0 || dy !== 0;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.seen = true;
    if (!pointer.moved) return;
    lastMove = performance.now();
    wake.current();
  };
  // The pointer leaving the window must not read as a jump on its return.
  const onLeave = () => {
    pointer.seen = false;
  };
  const onVisibility = () => wake.current();

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  const lost = () => {
    sleep();
    props.current.onFail();
  };
  canvas.addEventListener("webglcontextlost", lost);

  // The water is clear and the canvas transparent: that is the first frame.
  const first = requestAnimationFrame(() => props.current.onReady());

  return () => {
    cancelAnimationFrame(first);
    sleep();
    wake.current = () => {};
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", lost);
    fluid.dispose();
  };
}
