/*
 * PaperCrumple — from React Bits (https://reactbits.dev/micro/paper-crumple),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the sheet is an illustrative marine bulletin
 * (public/sheets/bulletin.webp, this origin); paper, light and shadow from
 * tokens.ts; written against three 0.169 (the project's pin; React Bits
 * targets 0.180: the context is released with `forceContextLoss`, which
 * `dispose` alone does not do); the crumple is driven three ways: press and
 * hold on the paper (it follows the pointer and smooths out on release), a
 * hover that starts to buckle it, and the section's real button (through
 * ShowcaseContext), which crumples it into a ball and rolls the ball to the
 * corner so the plain answer beneath can be read. The canvas sits under an
 * `aria-hidden` slot; that button is the keyboard path. The slot's contract
 * (EffectSlot.tsx): nothing drawn while `!active`, `onReady` after the first
 * frame with the bulletin on it, `onFail` on context loss or a missing image,
 * the context released on unmount, device pixel ratio at most 1.5, and frames
 * only while the paper is moving.
 */
import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import type { EffectProps } from "./EffectSlot";
import { ink, paper, sheen } from "../tokens";
import { BULLETIN, ShowcaseContext } from "../components/landing/sheets";

const DPR_CAP = 1.5;
/** The paper's size on the table, CSS px; it shrinks to fit the stage. */
const PAPER_W = 376;
const PAPER_H = 470;
const CRUMPLE = 0.88;
const HOVER_BUCKLE = 0.07;
const CRUMPLE_S = 0.55;
const RELEASE_S = 0.42;
const FOLDS = 6;
const SHARPNESS = 0.6;
const WRINKLE = 0.65;
const CREASE = 0.22;
const DRAG_TILT_DEG = 10;
const SEED = 7;
const DETAIL = 52;

type Spring = { value: number; target: number; velocity: number };
const spring = (value = 0): Spring => ({ value, target: value, velocity: 0 });
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function advance(s: Spring, dt: number, duration: number, instant: boolean) {
  if (instant || duration <= 0) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  const omega = 8 / Math.max(0.06, duration);
  const offset = s.value - s.target;
  const term = s.velocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  s.value = s.target + (offset + term * dt) * decay;
  s.velocity = (s.velocity - omega * term * dt) * decay;
  if (Math.abs(s.value - s.target) < 0.0001 && Math.abs(s.velocity) < 0.001) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  return true;
}

function randomSource(seed: number) {
  let value = seed | 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let n = Math.imul(value ^ (value >>> 15), 1 | value);
    n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The whole crumple, simulated once: a cloth of hinged triangles squeezed
 * into a ball, sampled into 64 frames, plus the creased sheet it leaves when
 * smoothed out again. Unchanged from React Bits.
 */
function createPaperPath(
  rest: Float32Array,
  triangles: number[],
  shortSide: number,
  density: number,
  sharpness: number,
  depth: number,
  seed: number,
) {
  const count = rest.length / 3;
  const points = Float64Array.from(rest);
  const previous = Float64Array.from(rest);
  const before = Float64Array.from(rest);
  const edges: number[] = [];
  const hinges: number[] = [];
  const adjacency = new Map<number, { a: number; b: number; opposite: number }>();
  const random = randomSource(seed);
  const guides = Array.from({ length: density }, () => {
    const angle = random() * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle), phase: random() * Math.PI * 2, weight: random() * 0.6 + 0.4 };
  });
  for (let t = 0; t < triangles.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      const a = triangles[t + k];
      const b = triangles[t + ((k + 1) % 3)];
      const opposite = triangles[t + ((k + 2) % 3)];
      const key = Math.min(a, b) * count + Math.max(a, b);
      const other = adjacency.get(key);
      if (!other) {
        adjacency.set(key, { a, b, opposite });
        const length = Math.hypot(rest[a * 3] - rest[b * 3], rest[a * 3 + 1] - rest[b * 3 + 1]);
        edges.push(a * 3, b * 3, length);
      } else {
        const c = other.opposite * 3;
        const d = opposite * 3;
        const length = Math.hypot(rest[c] - rest[d], rest[c + 1] - rest[d + 1]);
        const mx = (rest[c] + rest[d]) * 0.5;
        const my = (rest[c + 1] + rest[d + 1]) * 0.5;
        let weakness = 0;
        for (const guide of guides) {
          const distance = Math.abs(Math.sin(((mx * guide.x + my * guide.y) / shortSide) * 4 + guide.phase));
          weakness = Math.max(weakness, Math.exp(-distance * distance * 80) * guide.weight);
        }
        hinges.push(c, d, length, 0.12 + (1 - weakness) * 0.75);
      }
    }
  }
  const spacing = Math.sqrt((shortSide * shortSide) / count);
  const thickness = shortSide * 0.008;
  const samples: Float32Array[] = [rest.slice()];
  const frameCount = 64;
  const stepsPerFrame = 3;
  const totalSteps = frameCount * stepsPerFrame;
  let initialRadius = 0;
  for (let i = 0; i < rest.length; i += 3)
    initialRadius = Math.max(initialRadius, Math.hypot(rest[i] / 0.94, rest[i + 1] / 1.02));
  initialRadius *= 1.02;

  function constrain(list: number[], stride: number, stiffness: number, reverse: boolean) {
    for (let n = 0; n < list.length; n += stride) {
      const edge = reverse ? list.length - stride - n : n;
      const a = list[edge];
      const b = list[edge + 1];
      const dx = points[b] - points[a];
      const dy = points[b + 1] - points[a + 1];
      const dz = points[b + 2] - points[a + 2];
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (length < 0.000001) continue;
      const weight = stride === 4 ? list[edge + 3] : 1;
      const amount = (1 - list[edge + 2] / length) * 0.5 * stiffness * weight;
      points[a] += dx * amount;
      points[b] -= dx * amount;
      points[a + 1] += dy * amount;
      points[b + 1] -= dy * amount;
      points[a + 2] += dz * amount;
      points[b + 2] -= dz * amount;
    }
  }

  function separateLayers() {
    const margin = thickness * 2;
    for (let t = 0; t < triangles.length; t += 3) {
      const a = triangles[t] * 3;
      const b = triangles[t + 1] * 3;
      const c = triangles[t + 2] * 3;
      const ax = points[a];
      const ay = points[a + 1];
      const az = points[a + 2];
      const bx = points[b] - ax;
      const by = points[b + 1] - ay;
      const bz = points[b + 2] - az;
      const cx = points[c] - ax;
      const cy = points[c + 1] - ay;
      const cz = points[c + 2] - az;
      let nx = by * cz - bz * cy;
      let ny = bz * cx - bx * cz;
      let nz = bx * cy - by * cx;
      const length = Math.hypot(nx, ny, nz);
      if (length < 0.0000001) continue;
      nx /= length;
      ny /= length;
      nz /= length;
      const minX = Math.min(ax, points[b], points[c]) - margin;
      const maxX = Math.max(ax, points[b], points[c]) + margin;
      const minY = Math.min(ay, points[b + 1], points[c + 1]) - margin;
      const maxY = Math.max(ay, points[b + 1], points[c + 1]) + margin;
      const minZ = Math.min(az, points[b + 2], points[c + 2]) - margin;
      const maxZ = Math.max(az, points[b + 2], points[c + 2]) + margin;
      const bb = bx * bx + by * by + bz * bz;
      const cc = cx * cx + cy * cy + cz * cz;
      const bc = bx * cx + by * cy + bz * cz;
      const determinant = bb * cc - bc * bc;
      if (determinant < 0.0000000001) continue;
      for (let p = 0; p < points.length; p += 3) {
        if (p === a || p === b || p === c) continue;
        if (
          points[p] < minX ||
          points[p] > maxX ||
          points[p + 1] < minY ||
          points[p + 1] > maxY ||
          points[p + 2] < minZ ||
          points[p + 2] > maxZ
        )
          continue;
        const rx = rest[p] - (rest[a] + rest[b] + rest[c]) / 3;
        const ry = rest[p + 1] - (rest[a + 1] + rest[b + 1] + rest[c + 1]) / 3;
        if (rx * rx + ry * ry < spacing * spacing * 6) continue;
        const dx = points[p] - ax;
        const dy = points[p + 1] - ay;
        const dz = points[p + 2] - az;
        const distance = dx * nx + dy * ny + dz * nz;
        const previousDistance =
          (before[p] - before[a]) * nx + (before[p + 1] - before[a + 1]) * ny + (before[p + 2] - before[a + 2]) * nz;
        const side = previousDistance >= 0 ? 1 : -1;
        if (distance * side >= thickness || Math.abs(distance) > margin) continue;
        const pb = dx * bx + dy * by + dz * bz;
        const pc = dx * cx + dy * cy + dz * cz;
        const u = (cc * pb - bc * pc) / determinant;
        const v = (bb * pc - bc * pb) / determinant;
        if (u < 0 || v < 0 || u + v > 1) continue;
        const w = 1 - u - v;
        const correction = (thickness * side - distance) / (1 + w * w + u * u + v * v);
        for (let axis = 0; axis < 3; axis++) {
          const normal = axis === 0 ? nx : axis === 1 ? ny : nz;
          const movement = normal * correction;
          points[p + axis] += movement;
          points[a + axis] -= movement * w;
          points[b + axis] -= movement * u;
          points[c + axis] -= movement * v;
        }
      }
    }
  }

  for (let step = 1; step <= totalSteps; step++) {
    const progress = step / totalSteps;
    const compression = progress * progress * (3 - 2 * progress);
    const radius = initialRadius * (1 - compression) + shortSide * (0.19 - depth * 0.025) * compression;
    before.set(points);
    for (let i = 0; i < points.length; i += 3) {
      const x = rest[i] / shortSide;
      const y = rest[i + 1] / shortSide;
      let buckle = 0;
      for (const guide of guides) buckle += Math.sin((x * guide.x + y * guide.y) * 5 + guide.phase) * guide.weight;
      for (let axis = 0; axis < 3; axis++) {
        const velocity = (points[i + axis] - previous[i + axis]) * 0.55;
        previous[i + axis] = points[i + axis];
        points[i + axis] += clamp(velocity, -spacing * 0.15, spacing * 0.15);
      }
      points[i + 2] += (buckle / density) * shortSide * 0.0007 * Math.sin(progress * Math.PI);
    }
    for (let pass = 0; pass < 18; pass++) {
      constrain(hinges, 4, 0.45 * (1 - sharpness * 0.4), pass % 2 === 0);
      for (let i = 0; i < points.length; i += 3) {
        const x = points[i] / 0.94;
        const y = points[i + 1] / 1.02;
        const z = points[i + 2] / 0.86;
        const distance = Math.hypot(x, y, z);
        if (distance > radius) {
          const push = (1 - radius / distance) * 0.55;
          points[i] -= points[i] * push;
          points[i + 1] -= points[i + 1] * push;
          points[i + 2] -= points[i + 2] * push;
        }
      }
      constrain(edges, 3, 1, pass % 2 !== 0);
      if (pass === 8 || pass === 17) separateLayers();
    }
    for (let h = 0; h < hinges.length; h += 4) {
      const a = hinges[h];
      const b = hinges[h + 1];
      const length = Math.hypot(points[a] - points[b], points[a + 1] - points[b + 1], points[a + 2] - points[b + 2]);
      if (length < hinges[h + 2] * 0.86) hinges[h + 2] += (length - hinges[h + 2]) * 0.12;
    }
    if (step % stepsPerFrame === 0) samples.push(Float32Array.from(points));
  }
  const folded = Float64Array.from(points);
  for (let step = 1; step <= 80; step++) {
    const t = step / 80;
    const unfold = t * t * (3 - 2 * t);
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < points.length; i++) {
        const target = folded[i] + (rest[i] - folded[i]) * unfold;
        points[i] += (target - points[i]) * (i % 3 === 2 ? 0.04 : 0.22);
      }
      constrain(hinges, 4, 0.7, pass % 2 === 0);
      constrain(edges, 3, 1, pass % 2 !== 0);
    }
  }
  return { samples, creased: Float32Array.from(points) };
}

interface Driver {
  setActive: (on: boolean) => void;
  setCrumpled: (on: boolean) => void;
}

export default function PaperCrumple({ active, onReady, onFail }: EffectProps) {
  const { crumpled } = useContext(ShowcaseContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const driver = useRef<Driver | null>(null);
  const callbacks = useRef({ onReady, onFail });
  useEffect(() => {
    callbacks.current = { onReady, onFail };
  });

  useEffect(() => {
    const root = rootRef.current;
    const hit = hitRef.current;
    if (!root || !hit) return;
    // A canvas of its own for every mount: a context lost on purpose at
    // unmount must never be the one the next mount is handed.
    const canvas = document.createElement("canvas");
    canvas.className = "pointer-events-none absolute inset-0 block h-full w-full";
    root.prepend(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      callbacks.current.onFail();
      return;
    }

    const aspect = PAPER_H / PAPER_W;
    const shortSide = Math.min(1, aspect);
    const resolution = Math.round(clamp(DETAIL / 4, 8, 24));
    const columns = Math.max(8, Math.round(resolution / Math.max(1, aspect)));
    const rows = Math.max(8, Math.round(resolution * Math.min(1, aspect)));
    const rng = randomSource(SEED);
    const count = (columns + 1) * (rows + 1);
    const original = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const indices: number[] = [];
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= columns; col++) {
        const index = row * (columns + 1) + col;
        const u = (col + (col > 0 && col < columns ? (rng() - 0.5) * 0.5 : 0)) / columns;
        const v = (row + (row > 0 && row < rows ? (rng() - 0.5) * 0.5 : 0)) / rows;
        original[index * 3] = u - 0.5;
        original[index * 3 + 1] = (v - 0.5) * aspect;
        uvs[index * 2] = u;
        uvs[index * 2 + 1] = v;
        if (col < columns && row < rows) {
          const a = index;
          const b = index + 1;
          const c = index + columns + 1;
          const d = c + 1;
          if (rng() > 0.5) indices.push(a, b, d, a, d, c);
          else indices.push(a, b, c, b, d, c);
        }
      }
    }
    const paperPath = createPaperPath(original, indices, shortSide, FOLDS, SHARPNESS, WRINKLE, SEED);
    // Half the ball's widest span at the button's crumple, in paper units.
    const ballHalf = (() => {
      const last = paperPath.samples[Math.round(CRUMPLE * (paperPath.samples.length - 1))];
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < last.length; i += 3) {
        minX = Math.min(minX, last[i]);
        maxX = Math.max(maxX, last[i]);
        minY = Math.min(minY, last[i + 1]);
        maxY = Math.max(maxY, last[i + 1]);
      }
      return Math.max(maxX - minX, maxY - minY) / 2;
    })();
    const renderPositions = new Float32Array(indices.length * 3);
    const renderNormals = new Float32Array(indices.length * 3);
    const renderUvs = new Float32Array(indices.length * 2);
    const faceNormals = new Float32Array(indices.length);
    const incidentFaces: number[][] = Array.from({ length: count }, () => []);
    for (let i = 0; i < indices.length; i++) {
      renderUvs[i * 2] = uvs[indices[i] * 2];
      renderUvs[i * 2 + 1] = uvs[indices[i] * 2 + 1];
      incidentFaces[indices[i]].push(Math.floor(i / 3) * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(renderPositions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("normal", new THREE.BufferAttribute(renderNormals, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("uv", new THREE.BufferAttribute(renderUvs, 2));

    // Paper grain for the bump map.
    const grainData = new Uint8Array(128 * 128 * 4);
    for (let i = 0; i < grainData.length; i += 4) {
      const value = 100 + Math.floor(rng() * 155);
      grainData[i] = grainData[i + 1] = grainData[i + 2] = value;
      grainData[i + 3] = 255;
    }
    const grain = new THREE.DataTexture(grainData, 128, 128);
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(5, 5 * aspect);
    grain.magFilter = THREE.LinearFilter;
    grain.minFilter = THREE.LinearFilter;
    grain.needsUpdate = true;

    const materialOptions = {
      roughness: 0.92,
      metalness: 0,
      bumpMap: grain,
      bumpScale: 0.08 * 0.32,
      alphaTest: 0.04,
      alphaToCoverage: true,
      flatShading: false,
    };
    const frontMaterial = new THREE.MeshStandardMaterial({ ...materialOptions, side: THREE.FrontSide });
    const backMaterial = new THREE.MeshStandardMaterial({
      ...materialOptions,
      side: THREE.BackSide,
      color: new THREE.Color(paper[50]),
    });
    const lighting = { value: 0 };
    for (const material of [frontMaterial, backMaterial]) {
      const stock = material === backMaterial;
      material.onBeforeCompile = (shader) => {
        shader.uniforms.paperLighting = lighting;
        shader.fragmentShader = "uniform float paperLighting;\n" + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          `
          #include <map_fragment>
          #ifdef USE_MAP
            if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
            ${stock ? "diffuseColor.rgb = diffuse;" : ""}
          #endif
        `,
        );
        // Flat paper shows its print exactly as the poster does; the light
        // comes in as it folds.
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <opaque_fragment>",
          `
          outgoingLight = mix(diffuseColor.rgb, outgoingLight, paperLighting);
          #include <opaque_fragment>
        `,
        );
      };
      material.customProgramCacheKey = () => `orca-paper-${stock ? "stock" : "print"}`;
    }
    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      alphaTest: 0.04,
      side: THREE.DoubleSide,
    });
    depthMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #include <map_fragment>
        #ifdef USE_MAP
          if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
        #endif
      `,
      );
    };

    const sheet = new THREE.Group();
    const front = new THREE.Mesh(geometry, frontMaterial);
    const back = new THREE.Mesh(geometry, backMaterial);
    front.castShadow = true;
    front.receiveShadow = true;
    back.receiveShadow = true;
    front.customDepthMaterial = depthMaterial;
    sheet.add(front, back);
    const scene = new THREE.Scene();
    scene.add(sheet);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
    scene.add(new THREE.HemisphereLight(new THREE.Color(sheen), new THREE.Color(paper[400]), 1.35));
    const light = new THREE.DirectionalLight(new THREE.Color(paper[50]), 1.8);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0002;
    light.shadow.normalBias = 0.6;
    light.shadow.radius = 3;
    scene.add(light, light.target);
    const floorGeometry = new THREE.PlaneGeometry(1, 1);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.1, depthWrite: false, color: new THREE.Color(ink[900]) });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    scene.add(floor);
    renderer.setClearColor(new THREE.Color(paper[50]), 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const amount = spring();
    const memory = spring();
    const posX = spring();
    const posY = spring();
    const tiltX = spring();
    const tiltY = spring();
    const springs = [amount, memory, posX, posY, tiltX, tiltY];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const anchor = new THREE.Vector3();
    const world = new THREE.Vector3();
    const corner = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const weights = new THREE.Vector3(1, 0, 0);
    let gripIndices = [Math.floor(count / 2), 0, 0];
    let viewportWidth = 1;
    let viewportHeight = 1;
    let scale = PAPER_W;
    let pointerX = 0;
    let pointerY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastMove = 0;
    let speedX = 0;
    let speedY = 0;
    let held = false;
    let balled = false;
    let pointerId: number | null = null;
    let peak = 0;
    let disposed = false;
    let ready = false;
    let readySent = false;
    let on = false;
    let contextLost = false;
    let frame = 0;
    let lastTime = 0;
    let previousAmount = -1;
    let previousMemory = -1;
    const texture = { current: null as THREE.Texture | null };

    function deform() {
      if (amount.value === previousAmount && memory.value === previousMemory) return;
      previousAmount = amount.value;
      previousMemory = memory.value;
      const fold = clamp(amount.value, 0, 1);
      const at = fold * (paperPath.samples.length - 1);
      const lower = Math.floor(at);
      const upper = Math.min(lower + 1, paperPath.samples.length - 1);
      const mix = at - lower;
      const from = paperPath.samples[lower];
      const to = paperPath.samples[upper];
      for (let i = 0; i < positions.length; i++) {
        positions[i] = from[i] + (to[i] - from[i]) * mix;
        positions[i] += (paperPath.creased[i] - original[i]) * memory.value * (1 - fold);
      }
      for (let face = 0; face < indices.length; face += 3) {
        const ia = indices[face] * 3;
        const ib = indices[face + 1] * 3;
        const ic = indices[face + 2] * 3;
        const bx = positions[ib] - positions[ia];
        const by = positions[ib + 1] - positions[ia + 1];
        const bz = positions[ib + 2] - positions[ia + 2];
        const cx = positions[ic] - positions[ia];
        const cy = positions[ic + 1] - positions[ia + 1];
        const cz = positions[ic + 2] - positions[ia + 2];
        const nx = by * cz - bz * cy;
        const ny = bz * cx - bx * cz;
        const nz = bx * cy - by * cx;
        const length = Math.hypot(nx, ny, nz) || 1;
        faceNormals[face] = nx / length;
        faceNormals[face + 1] = ny / length;
        faceNormals[face + 2] = nz / length;
      }
      for (let i = 0; i < indices.length; i++) {
        const source = indices[i] * 3;
        const face = Math.floor(i / 3) * 3;
        let nx = 0;
        let ny = 0;
        let nz = 0;
        for (const neighbor of incidentFaces[indices[i]]) {
          const dot =
            faceNormals[face] * faceNormals[neighbor] +
            faceNormals[face + 1] * faceNormals[neighbor + 1] +
            faceNormals[face + 2] * faceNormals[neighbor + 2];
          const weight = THREE.MathUtils.smoothstep(dot, 0.88 - (1 - SHARPNESS) * 0.18, 0.98);
          nx += faceNormals[neighbor] * weight;
          ny += faceNormals[neighbor + 1] * weight;
          nz += faceNormals[neighbor + 2] * weight;
        }
        const length = Math.hypot(nx, ny, nz) || 1;
        renderPositions[i * 3] = positions[source];
        renderPositions[i * 3 + 1] = positions[source + 1];
        renderPositions[i * 3 + 2] = positions[source + 2];
        renderNormals[i * 3] = nx / length;
        renderNormals[i * 3 + 1] = ny / length;
        renderNormals[i * 3 + 2] = nz / length;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
      lighting.value = THREE.MathUtils.smoothstep(fold + memory.value, 0, 0.4);
    }

    function placeHitTarget() {
      const bounds = geometry.boundingBox;
      if (!bounds) return;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(
          i & 1 ? bounds.max.x : bounds.min.x,
          i & 2 ? bounds.max.y : bounds.min.y,
          i & 4 ? bounds.max.z : bounds.min.z,
        );
        corner.applyMatrix4(sheet.matrixWorld).project(camera);
        const x = ((corner.x + 1) * viewportWidth) / 2;
        const y = ((1 - corner.y) * viewportHeight) / 2;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
      hit!.style.transform = `translate3d(${minX}px, ${minY}px, 0)`;
      hit!.style.width = `${Math.max(24, maxX - minX)}px`;
      hit!.style.height = `${Math.max(24, maxY - minY)}px`;
    }

    function setPointer(x: number, y: number) {
      pointer.set((x / viewportWidth) * 2 - 1, 1 - (y / viewportHeight) * 2);
      raycaster.setFromCamera(pointer, camera);
    }

    function render(time: number) {
      frame = 0;
      if (disposed || !ready || contextLost || !on || document.hidden) return;
      const dt = lastTime ? Math.min(0.04, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      let moving = false;
      const duration = held || balled ? CRUMPLE_S : RELEASE_S;
      for (const s of springs) moving = advance(s, dt, s === amount || s === memory ? duration : 0.42, false) || moving;
      peak = Math.max(peak, amount.value);
      deform();
      sheet.rotation.set(tiltX.value, tiltY.value, 0);
      if (held) {
        // The paper follows the pointer by the point that was grabbed.
        const attribute = geometry.attributes.position;
        anchor.set(0, 0, 0);
        for (let i = 0; i < 3; i++) {
          a.fromBufferAttribute(attribute as THREE.BufferAttribute, gripIndices[i]);
          anchor.addScaledVector(a, weights.getComponent(i));
        }
        anchor.multiplyScalar(scale).applyEuler(sheet.rotation);
        plane.constant = -anchor.z;
        setPointer(pointerX, pointerY);
        if (raycaster.ray.intersectPlane(plane, world)) {
          posX.value = posX.target = world.x - anchor.x;
          posY.value = posY.target = world.y - anchor.y;
          posX.velocity = posY.velocity = 0;
        }
      }
      sheet.position.set(posX.value, posY.value, 0);
      sheet.updateMatrixWorld(true);
      const shadowBounds = geometry.boundingBox;
      if (shadowBounds) {
        let backZ = Infinity;
        for (let i = 0; i < 8; i++) {
          corner.set(
            i & 1 ? shadowBounds.max.x : shadowBounds.min.x,
            i & 2 ? shadowBounds.max.y : shadowBounds.min.y,
            i & 4 ? shadowBounds.max.z : shadowBounds.min.z,
          );
          corner.applyMatrix4(sheet.matrixWorld);
          backZ = Math.min(backZ, corner.z);
        }
        floor.position.z = backZ - scale * shortSide * 0.08;
      }
      renderer.render(scene, camera);
      placeHitTarget();
      if (!readySent) {
        readySent = true;
        callbacks.current.onReady();
      }
      if (moving) wake();
    }

    function wake() {
      if (!frame && !disposed && ready && on && !document.hidden && !contextLost) frame = requestAnimationFrame(render);
    }

    /** Where the ball rests when the button crumples it: the stage's lower left corner. */
    function cornerTarget() {
      const ball = ballHalf * scale + 8;
      posX.target = -Math.max(0, viewportWidth / 2 - ball - 20);
      posY.target = -Math.max(0, viewportHeight / 2 - ball - 20);
    }

    function resize() {
      const rect = root!.getBoundingClientRect();
      viewportWidth = Math.max(1, rect.width);
      viewportHeight = Math.max(1, rect.height);
      scale = PAPER_W * Math.min(1, Math.max(1, viewportWidth - 48) / PAPER_W, Math.max(1, viewportHeight - 48) / PAPER_H);
      sheet.scale.setScalar(scale);
      camera.aspect = viewportWidth / viewportHeight;
      camera.position.z = viewportHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(viewportWidth, viewportHeight, false);
      const reach = Math.max(viewportWidth, viewportHeight);
      const angle = THREE.MathUtils.degToRad(-35);
      light.position.set(Math.sin(angle) * reach, Math.cos(angle) * reach, reach * 4);
      light.shadow.camera.left = light.shadow.camera.bottom = -reach;
      light.shadow.camera.right = light.shadow.camera.top = reach;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = reach * 6;
      light.shadow.camera.updateProjectionMatrix();
      floor.position.z = -scale * shortSide * 0.12;
      floor.scale.set(viewportWidth * 4, viewportHeight * 4, 1);
      if (balled && !held) cornerTarget();
      else if (!held) {
        const limitX = Math.max(0, (viewportWidth - scale) / 2 - 16);
        const limitY = Math.max(0, (viewportHeight - scale * aspect) / 2 - 16);
        posX.value = posX.target = clamp(posX.value, -limitX, limitX);
        posY.value = posY.target = clamp(posY.value, -limitY, limitY);
      }
      wake();
    }

    /** The hold ends: smooth out (with the creases it earned), or stay a ball. */
    function finish() {
      if (!held) return;
      held = false;
      root!.removeAttribute("data-held");
      const captured = pointerId;
      pointerId = null;
      if (captured !== null && hit!.hasPointerCapture(captured)) hit!.releasePointerCapture(captured);
      tiltX.target = tiltY.target = 0;
      if (balled) {
        // A ball the reader dragged stays where it was dropped, inside the stage.
        const limitX = Math.max(0, viewportWidth / 2 - 60);
        const limitY = Math.max(0, viewportHeight / 2 - 60);
        posX.target = clamp(posX.value, -limitX, limitX);
        posY.target = clamp(posY.value, -limitY, limitY);
      } else {
        amount.target = 0;
        memory.target = Math.max(memory.value, peak * CREASE);
        posX.target = posY.target = 0;
      }
      wake();
    }

    function setBalled(next: boolean) {
      if (next === balled) return;
      balled = next;
      if (balled) {
        peak = Math.max(peak, amount.value);
        amount.target = CRUMPLE;
        tiltX.target = tiltY.target = 0;
        cornerTarget();
      } else {
        amount.target = 0;
        memory.target = Math.max(memory.value, Math.max(peak, CRUMPLE) * CREASE);
        posX.target = posY.target = 0;
        tiltX.target = tiltY.target = 0;
      }
      wake();
    }

    function pointerDown(event: PointerEvent) {
      if (!ready || held || event.button !== 0 || !event.isPrimary) return;
      const rect = root!.getBoundingClientRect();
      pointerX = lastX = event.clientX - rect.left;
      pointerY = lastY = event.clientY - rect.top;
      setPointer(pointerX, pointerY);
      sheet.updateMatrixWorld(true);
      const intersection = raycaster.intersectObjects([front, back], false)[0];
      if (!intersection?.face) return;
      event.preventDefault();
      const { face } = intersection;
      gripIndices = [face.a, face.b, face.c];
      const attribute = geometry.attributes.position as THREE.BufferAttribute;
      a.fromBufferAttribute(attribute, face.a);
      b.fromBufferAttribute(attribute, face.b);
      c.fromBufferAttribute(attribute, face.c);
      THREE.Triangle.getBarycoord(sheet.worldToLocal(intersection.point.clone()), a, b, c, weights);
      pointerId = event.pointerId;
      speedX = speedY = 0;
      lastMove = performance.now();
      hit!.setPointerCapture(event.pointerId);
      held = true;
      peak = amount.value;
      amount.target = CRUMPLE;
      root!.setAttribute("data-held", "");
      wake();
    }
    function pointerMove(event: PointerEvent) {
      if (!held || event.pointerId !== pointerId) return;
      const rect = root!.getBoundingClientRect();
      const now = performance.now();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dt = Math.max(0.008, (now - lastMove) / 1000);
      speedX = (x - lastX) / dt;
      speedY = (y - lastY) / dt;
      lastX = x;
      lastY = y;
      lastMove = now;
      pointerX = clamp(x, 12, viewportWidth - 12);
      pointerY = clamp(y, 12, viewportHeight - 12);
      const maxTilt = THREE.MathUtils.degToRad(DRAG_TILT_DEG);
      tiltX.target = clamp(speedY / 1800, -1, 1) * maxTilt;
      tiltY.target = clamp(speedX / 1800, -1, 1) * maxTilt;
      wake();
    }
    function pointerUp(event: PointerEvent) {
      if (event.pointerId === pointerId) finish();
    }
    // A hover starts to buckle the sheet, an invitation to press.
    function pointerEnter() {
      if (held || balled || !ready) return;
      amount.target = HOVER_BUCKLE;
      wake();
    }
    function pointerLeave() {
      if (held || balled) return;
      amount.target = 0;
      wake();
    }
    function cancel() {
      finish();
    }
    function visibility() {
      lastTime = 0;
      if (document.hidden) cancel();
      else wake();
    }
    function loseContext(event: Event) {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      if (!disposed) callbacks.current.onFail();
    }

    hit.addEventListener("pointerdown", pointerDown);
    hit.addEventListener("pointermove", pointerMove);
    hit.addEventListener("pointerup", pointerUp);
    hit.addEventListener("pointercancel", pointerUp);
    hit.addEventListener("lostpointercapture", pointerUp);
    hit.addEventListener("pointerenter", pointerEnter);
    hit.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", loseContext);
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    deform();
    resize();

    const loader = new THREE.TextureLoader();
    loader.load(
      BULLETIN.src,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        texture.current = loaded;
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        frontMaterial.map = loaded;
        backMaterial.map = loaded;
        depthMaterial.map = loaded;
        frontMaterial.needsUpdate = backMaterial.needsUpdate = depthMaterial.needsUpdate = true;
        ready = true;
        wake();
      },
      undefined,
      () => {
        if (!disposed) callbacks.current.onFail();
      },
    );

    driver.current = {
      setActive(next) {
        on = next;
        lastTime = 0;
        if (on) wake();
        else {
          cancel();
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      setCrumpled: setBalled,
    };

    return () => {
      disposed = true;
      driver.current = null;
      cancelAnimationFrame(frame);
      if (pointerId !== null && hit.hasPointerCapture(pointerId)) hit.releasePointerCapture(pointerId);
      observer.disconnect();
      hit.removeEventListener("pointerdown", pointerDown);
      hit.removeEventListener("pointermove", pointerMove);
      hit.removeEventListener("pointerup", pointerUp);
      hit.removeEventListener("pointercancel", pointerUp);
      hit.removeEventListener("lostpointercapture", pointerUp);
      hit.removeEventListener("pointerenter", pointerEnter);
      hit.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", loseContext);
      geometry.dispose();
      floorGeometry.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      depthMaterial.dispose();
      floorMaterial.dispose();
      grain.dispose();
      texture.current?.dispose();
      light.shadow.dispose();
      renderer.dispose();
      // three 0.169's dispose() keeps the context; the slot wants it back.
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    driver.current?.setActive(active);
  }, [active]);
  useEffect(() => {
    driver.current?.setCrumpled(crumpled);
  }, [crumpled]);

  return (
    <div ref={rootRef} className="bulletin-live absolute inset-0 overflow-hidden">
      <div ref={hitRef} className="bulletin-grip absolute left-0 top-0" />
    </div>
  );
}
