/*
 * FlexCarousel — from React Bits (https://reactbits.dev/components/flex-carousel),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the items are ORCA's own sheets (public/sheets, this
 * origin), a calm "arch" bend with little dispersion, panel radius, no intro
 * flourish, no wheel capture (the page keeps its vertical scroll), and the
 * caption is ORCA's mono label in the reader's language. The slot's contract
 * (EffectSlot.tsx): nothing drawn while `!active`, `onReady` once every sheet
 * is on the first frame, `onFail` on context loss, the context released on
 * unmount, device pixel ratio at most 1.5. The row drifts on its own (one
 * sheet every few seconds), but between drifts no frame is drawn: the next
 * step is a timer, not a spinning loop. It sits under an `aria-hidden` slot;
 * the poster beneath carries the images, their alt text and the captions.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { Mesh, Plane, Program, RenderTarget, Renderer, Texture, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { paper } from "../tokens";
import { SHEETS, ShowcaseContext, type Sheet } from "../components/landing/sheets";
import { SHOWCASE } from "../i18n/showcase";

const DPR_CAP = 1.5;
const PIXEL_BUDGET = 4.5e6;
const TAPS = 12;
const CARD_HEIGHT = 0.64;
const GAP = 18;
const RADIUS = 3;
const SQUEEZE = 0.18;
const INTERVAL_S = 3.6;
/** After the reader touches the row, it waits this long before drifting again. */
const IDLE_MS = 3000;

/** The "arch" bend, quieter: sheets lift as they pass the middle, colour barely splits. */
const LENS = { width: 0.8, height: 0.8, tilt: 0, roundness: 1, bend: 0.26, reach: 0.36, curl: 1, dispersion: 0.12 };

const vec3 = (hex: string): number[] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const wrap = (value: number, size: number) => ((((value + size / 2) % size) + size) % size) - size / 2;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const cardVertex = /* glsl */ `#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;

const cardFragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;
float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`;

const lensVertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const lensFragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
out vec4 fragColor;
void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);
  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 shifted = uv + (vec2(0.0, -lift) - swirl) / uResolution;
  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));
  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${TAPS}; i++) {
      float s = (float(i) + 0.5) / float(${TAPS});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }
  fragColor = color;
}
`;

interface Slot {
  item: Sheet;
  texture: Texture;
  aspect: number;
  loaded: boolean;
  failed: boolean;
  ready: number;
  color: number[];
  image: number[];
  dispose: () => void;
}

interface Metrics {
  cardH: number;
  widths: number[];
  centers: number[];
  loop: number;
}

interface Hit {
  index: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export default function FlexCarousel({ active, onReady, onFail }: EffectProps) {
  const { language } = useContext(ShowcaseContext);
  const t = SHOWCASE[language] ?? SHOWCASE.en;
  const hostRef = useRef<HTMLDivElement>(null);
  const engine = useRef<{ setActive: (on: boolean) => void } | null>(null);
  const callbacks = useRef({ onReady, onFail });
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    callbacks.current = { onReady, onFail };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, DPR_CAP),
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
      });
    } catch {
      callbacks.current.onFail();
      return undefined;
    }
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      callbacks.current.onFail();
      return undefined;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.prepend(canvas);

    let alive = true;
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      if (alive) callbacks.current.onFail();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const placeholder = vec3(paper[200]);
    const cardProgram = new Program(gl, {
      vertex: cardVertex,
      fragment: cardFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMap: { value: new Texture(gl) },
        uRect: { value: [0, 0, 1, 1] },
        uResolution: { value: [1, 1] },
        uSize: { value: [1, 1] },
        uImage: { value: [1, 1] },
        uRadius: { value: RADIUS },
        uAlpha: { value: 1 },
        uReady: { value: 0 },
        uDpr: { value: 1 },
        uPlaceholder: { value: placeholder },
      },
    });
    cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });

    const target = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR_MIPMAP_LINEAR,
      magFilter: gl.LINEAR,
    });
    const lensUniforms = {
      tScene: { value: target.texture },
      uResolution: { value: [1, 1] },
      uDpr: { value: 1 },
      uCenter: { value: [0, 0] },
      uHalf: { value: [1, 1] },
      uAngle: { value: (LENS.tilt * Math.PI) / 180 },
      uExponent: { value: 2 + Math.pow(1 - clamp01(LENS.roundness), 1.5) * 10 },
      uInner: { value: 60 },
      uOuter: { value: 80 },
      uFlow: { value: 0 },
      uCurl: { value: LENS.curl },
      uDispersion: { value: LENS.dispersion * 0.12 },
      uStrength: { value: 1 },
    };
    const lensMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: lensVertex,
        fragment: lensFragment,
        uniforms: lensUniforms,
        depthTest: false,
        depthWrite: false,
      }),
    });

    const anisotropy = renderer.getExtension("EXT_texture_filter_anisotropic") ? 8 : 0;

    let width = 1;
    let height = 1;
    let pos = 0;
    let vel = 0;
    let goal = 0;
    let raf = 0;
    let wakeTimer = 0;
    let last = performance.now();
    let on = false;
    let dirty = true;
    let readySent = false;
    let activeIndex = -1;
    let interactedAt = -Infinity;
    let autoplayAt = performance.now();
    let energy = 0;
    let lastPos = 0;
    let layout: Metrics | null = null;
    let hits: Hit[] = [];
    const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
    const pointer = {
      x: 0,
      y: 0,
      over: false,
      down: false,
      id: -1,
      startX: 0,
      startY: 0,
      startPos: 0,
      dragging: false,
      touch: false,
      samples: [] as { x: number; t: number }[],
    };

    const loadSlot = (item: Sheet): Slot => {
      const texture = new Texture(gl, {
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        anisotropy,
      });
      const slot: Slot = {
        item,
        texture,
        aspect: item.width / item.height,
        loaded: false,
        failed: false,
        ready: 0,
        color: placeholder,
        image: [item.width, item.height],
        dispose: () => {},
      };
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (!alive) return;
        texture.image = image;
        texture.update();
        slot.image = [image.naturalWidth || 1, image.naturalHeight || 1];
        slot.aspect = slot.image[0] / slot.image[1];
        slot.loaded = true;
        dirty = true;
        start();
      };
      image.onerror = () => {
        if (!alive) return;
        slot.failed = true;
        dirty = true;
        start();
      };
      image.src = item.src;
      slot.dispose = () => {
        image.onload = null;
        image.onerror = null;
        gl.deleteTexture(texture.texture);
      };
      return slot;
    };
    const slots: Slot[] = SHEETS.map(loadSlot);

    const metrics = (): Metrics => {
      const cardH = Math.max(24, CARD_HEIGHT * height);
      const widths = slots.map((slot) => slot.aspect * cardH);
      const centers: number[] = [];
      let cursor = 0;
      for (const w of widths) {
        centers.push(cursor + w / 2);
        cursor += w + GAP;
      }
      return { cardH, widths, centers, loop: Math.max(cursor, 1) };
    };
    const nearest = (m: Metrics, at: number) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < m.centers.length; i++) {
        const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };
    const snapPoint = (m: Metrics, at: number) => at + wrap(m.centers[nearest(m, at)] - at, m.loop);
    const remap = (from: Metrics, to: Metrics, at: number) => {
      const i = nearest(from, at);
      const offset = wrap(at - from.centers[i], from.loop);
      const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
      return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
    };
    const step = (m: Metrics, delta: number) => {
      let at = snapPoint(m, goal);
      let index = nearest(m, at);
      const n = m.centers.length;
      for (let k = 0; k < Math.abs(delta); k++) {
        const next = (index + (delta > 0 ? 1 : n - 1)) % n;
        at +=
          delta > 0
            ? m.widths[index] / 2 + GAP + m.widths[next] / 2
            : -(m.widths[next] / 2 + GAP + m.widths[index] / 2);
        index = next;
      }
      goal = at;
      dirty = true;
      start();
    };
    const closeFocus = () => {
      focus.pending = -1;
      if (focus.target === 0) return false;
      focus.target = 0;
      dirty = true;
      start();
      return true;
    };

    /** The next drift, as a timer: no frames are drawn while the row rests. */
    const scheduleDrift = (now: number) => {
      window.clearTimeout(wakeTimer);
      const wait = Math.max(INTERVAL_S * 1000 - (now - autoplayAt), IDLE_MS - (now - interactedAt), 60);
      wakeTimer = window.setTimeout(() => {
        wakeTimer = 0;
        start();
      }, wait);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive || !on) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const m = metrics();
      const n = slots.length;
      let animating = false;

      if (layout && layout.loop !== m.loop) {
        pos = remap(layout, m, pos);
        goal = remap(layout, m, goal);
        pointer.startPos = pos + (pointer.x - pointer.startX);
        animating = true;
      }
      layout = m;

      if (!pointer.dragging) {
        const stiffness = 55;
        const damping = 2 * Math.sqrt(stiffness);
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          vel += (stiffness * (goal - pos) - damping * vel) * h;
          pos += vel * h;
        }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
          pos = goal;
          vel = 0;
        } else animating = true;
      } else animating = true;

      if (Math.abs(pos) > m.loop * 8) {
        const shift = Math.round(pos / m.loop) * m.loop;
        pos -= shift;
        goal -= shift;
        pointer.startPos -= shift;
      }

      const nowIndex = nearest(m, pos);
      if (nowIndex !== activeIndex) {
        activeIndex = nowIndex;
        setCurrent(nowIndex);
      }
      if (focus.pending >= 0 && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) {
        if (nowIndex === focus.pending) {
          focus.index = nowIndex;
          focus.target = 1;
        }
        focus.pending = -1;
      }

      const settled = slots.every((s) => s.loaded || s.failed);
      const drifting =
        settled &&
        focus.target === 0 &&
        focus.t < 0.01 &&
        !pointer.over &&
        !pointer.down &&
        Math.abs(goal - pos) < 1 &&
        now - interactedAt > IDLE_MS;
      if (drifting && now - autoplayAt > INTERVAL_S * 1000) {
        autoplayAt = now;
        step(m, 1);
        animating = true;
      }

      const travel = Math.abs(pos - lastPos) / dt;
      lastPos = pos;
      const energyTarget = Math.min(travel / 2600, 1);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)));
      // A trace of squeeze left is not worth a frame: let it go to rest.
      if (energy < 0.01 && energyTarget === 0) energy = 0;
      else animating = true;

      const fk = 64;
      focus.v += (fk * (focus.target - focus.t) - 2 * Math.sqrt(fk) * focus.v) * dt;
      focus.t += focus.v * dt;
      if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
        focus.t = focus.target;
        focus.v = 0;
      } else animating = true;
      const focusEase = easeInOut(clamp01(focus.t));
      const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
      const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));

      for (const slot of slots) {
        if (slot.loaded && slot.ready < 1) {
          slot.ready = Math.min(1, slot.ready + dt / 0.45);
          animating = true;
        }
      }

      if (dirty || animating || pointer.dragging) {
        dirty = false;
        hits = [];
        const dpr = renderer.dpr;
        const homeX = width / 2;
        const homeY = height / 2;
        cardProgram.uniforms.uResolution.value = [width, height];
        cardProgram.uniforms.uDpr.value = dpr;
        const squash = 1 - SQUEEZE * energy;
        const draws: { i: number; rel: number; x: number; cw: number; ch: number; alpha: number }[] = [];
        for (let i = 0; i < n; i++) {
          const w = m.widths[i];
          const baseRel = wrap(m.centers[i] - pos, m.loop);
          for (let k = -3; k <= 3; k++) {
            const rel = baseRel + k * m.loop;
            if (Math.abs(rel) - w / 2 > width + 40) continue;
            let x = homeX + rel;
            let scale = squash;
            let alpha = 1;
            if (focus.t > 0) {
              if (i === focus.index && Math.abs(rel) < w) scale *= 1 + (focusScale - 1) * focusEase;
              else {
                const part = easeInOut(clamp01(focus.t) * 1.25 - Math.min(Math.abs(rel) / width, 1) * 0.25);
                x += Math.sign(rel) * part * width * 0.7;
                alpha *= 1 - part;
              }
            }
            const cw = w * scale;
            if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
            draws.push({ i, rel, x, cw, ch: m.cardH * scale, alpha });
          }
        }
        draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
        let first = true;
        for (const d of draws) {
          const slot = slots[d.i];
          cardProgram.uniforms.tMap.value = slot.texture;
          cardProgram.uniforms.uRect.value = [d.x, homeY, d.cw + 2, d.ch + 2];
          cardProgram.uniforms.uSize.value = [d.cw, d.ch];
          cardProgram.uniforms.uImage.value = slot.image;
          cardProgram.uniforms.uAlpha.value = d.alpha;
          cardProgram.uniforms.uReady.value = slot.ready;
          cardProgram.uniforms.uPlaceholder.value = slot.color;
          renderer.render({ scene: cardMesh, target, clear: first });
          first = false;
          hits.push({ index: d.i, x0: d.x - d.cw / 2, x1: d.x + d.cw / 2, y0: homeY - d.ch / 2, y1: homeY + d.ch / 2 });
        }
        if (first) {
          renderer.bindFramebuffer(target);
          gl.viewport(0, 0, target.width, target.height);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        renderer.bindFramebuffer();
        target.texture.bind();
        gl.generateMipmap(gl.TEXTURE_2D);

        const halfW = (LENS.width * width) / 2;
        const halfH = (LENS.height * width) / 2;
        const inner = Math.max(4, LENS.reach * (halfW + halfH) * 0.5);
        lensUniforms.uResolution.value = [width, height];
        lensUniforms.uDpr.value = dpr;
        lensUniforms.uCenter.value = [homeX, homeY];
        lensUniforms.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)];
        lensUniforms.uInner.value = inner;
        lensUniforms.uOuter.value = inner * 1.6;
        lensUniforms.uFlow.value = LENS.bend * (halfW + halfH) * 0.45;
        lensUniforms.uStrength.value = 1 - focusEase;
        renderer.render({ scene: lensMesh });

        if (settled && !readySent) {
          readySent = true;
          if (slots.every((s) => s.failed)) callbacks.current.onFail();
          else callbacks.current.onReady();
        }
      }

      host.toggleAttribute("data-zoom", focus.target > 0);
      if (animating || !settled || pointer.down) raf = requestAnimationFrame(frame);
      else scheduleDrift(now);
    };

    function start() {
      if (raf || !alive || !on) return;
      window.clearTimeout(wakeTimer);
      wakeTimer = 0;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const localPoint = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      const [x, y] = localPoint(e);
      Object.assign(pointer, {
        down: true,
        id: e.pointerId,
        touch: e.pointerType === "touch",
        startX: x,
        startY: y,
        x,
        y,
        startPos: pos,
        dragging: false,
        samples: [{ x, t: performance.now() }],
      });
      interactedAt = performance.now();
      if (Math.abs(vel) > 40) {
        goal = pos;
        vel = 0;
      }
      dirty = true;
      start();
    };
    const onPointerMove = (e: PointerEvent) => {
      const [x, y] = localPoint(e);
      pointer.x = x;
      pointer.y = y;
      pointer.over = true;
      if (pointer.down && e.pointerId === pointer.id) {
        const dx = x - pointer.startX;
        const dy = y - pointer.startY;
        const slop = pointer.touch ? 10 : 5;
        if (!pointer.dragging) {
          if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
            pointer.down = false;
            return;
          }
          if (Math.abs(dx) > slop) {
            pointer.dragging = true;
            pointer.startX = x;
            pointer.startPos = pos;
            closeFocus();
            try {
              host.setPointerCapture(e.pointerId);
            } catch {
              /* still dragging without capture */
            }
            host.setAttribute("data-dragging", "");
          }
        }
        if (pointer.dragging) {
          pos = pointer.startPos - (x - pointer.startX);
          goal = pos;
          vel = 0;
          const now = performance.now();
          pointer.samples.push({ x, t: now });
          while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
          start();
        }
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      pointer.down = false;
      host.removeAttribute("data-dragging");
      const m = metrics();
      interactedAt = performance.now();
      if (pointer.dragging) {
        pointer.dragging = false;
        const now = performance.now();
        const a = pointer.samples[0];
        const b = pointer.samples[pointer.samples.length - 1];
        let velocity = 0;
        if (a && b && b.t > a.t && now - b.t < 70) velocity = -((b.x - a.x) / (b.t - a.t)) * 1000;
        vel = velocity;
        const landing = snapPoint(m, pos + velocity * 0.32);
        goal = landing;
        if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1) step(m, velocity > 0 ? 1 : -1);
        start();
        return;
      }
      if (closeFocus()) return;
      const [x, y] = localPoint(e);
      const hit = hits.find((h) => x >= h.x0 && x <= h.x1 && y >= h.y0 && y <= h.y1);
      if (!hit) return;
      if (hit.index === activeIndex && Math.abs(goal - pos) < 2) {
        focus.index = hit.index;
        focus.target = 1;
      } else {
        goal = snapPoint(m, pos + ((hit.x0 + hit.x1) / 2 - width / 2));
        focus.pending = hit.index;
      }
      dirty = true;
      start();
    };
    const onPointerLeave = () => {
      pointer.over = false;
      dirty = true;
      start();
    };
    const onPointerCancel = () => {
      pointer.down = false;
      pointer.dragging = false;
      host.removeAttribute("data-dragging");
      goal = snapPoint(metrics(), pos);
      start();
    };
    // Only a sideways wheel (a trackpad swipe) moves the row; the page keeps
    // its vertical scroll.
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      interactedAt = performance.now();
      if (closeFocus()) return;
      goal += Math.max(-120, Math.min(120, e.deltaX * (e.deltaMode === 1 ? 16 : 1))) * 1.25;
      window.clearTimeout(wakeTimer);
      wakeTimer = window.setTimeout(() => {
        goal = snapPoint(metrics(), goal);
        start();
      }, 150);
      start();
    };

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointercancel", onPointerCancel);
    host.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      width = Math.max(1, host.clientWidth);
      height = Math.max(1, host.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
      lensUniforms.tScene.value = target.texture;
      dirty = true;
      start();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    engine.current = {
      setActive(next) {
        on = next;
        if (on) {
          dirty = true;
          start();
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
          window.clearTimeout(wakeTimer);
          wakeTimer = 0;
        }
      },
    };

    return () => {
      alive = false;
      on = false;
      engine.current = null;
      cancelAnimationFrame(raf);
      window.clearTimeout(wakeTimer);
      resizeObserver.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointercancel", onPointerCancel);
      host.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("webglcontextlost", onLost);
      slots.forEach((slot) => slot.dispose());
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  useEffect(() => {
    engine.current?.setActive(active);
  }, [active]);

  const item = SHEETS[current] ?? SHEETS[0];
  return (
    <div ref={hostRef} className="sheets-flow-live absolute inset-0 select-none overflow-hidden">
      <div className="sheets-flow-caption">
        <span className="label !text-ink-700">{t.sheets[item.id].caption}</span>
        <span className="font-mono text-label tabular-nums text-ink-500">
          {String(current + 1).padStart(2, "0")} / {String(SHEETS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
