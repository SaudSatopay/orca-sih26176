/*
 * Radar — from React Bits (https://reactbits.dev/backgrounds/radar),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the crew's sweep while a question is out. Range rings,
 * bearing spokes and one turning sweep, printed in chart teal straight onto
 * the paper (the shader writes teal at the strength of the signal and leaves
 * the rest of the sheet showing through, where the original painted a black
 * or white ground). One WebGL context, released on unmount (the sheet
 * unmounts it the moment the answer lands); at most 30 frames a second and
 * none while off-screen or on a hidden tab. No pointer play. Mounted only
 * through `GlSlot`, which applies the console's effects gate.
 */
import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { chart } from "../../tokens";
import { GL_DPR, rgb, runWhileSeen } from "../console/glGate";

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uCentre;
uniform float uScale;
uniform float uRingCount;
uniform float uSpokeCount;
uniform float uRingThickness;
uniform float uSpokeThickness;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uFalloff;
uniform float uOpacity;
uniform vec3 uColor;

#define TAU 6.28318530718

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st = st * 2.0 - 1.0;
  st -= uCentre;
  st.x *= uResolution.x / uResolution.y;
  st *= uScale;

  float dist = length(st);
  float theta = atan(st.y, st.x);

  // fixed range rings, as a chart prints them; only the sweep turns
  float ringDist = abs(fract(dist * uRingCount) - 0.5);
  float ring = (1.0 - smoothstep(0.0, uRingThickness, ringDist)) * 0.55;

  float spokeAngle = abs(fract(theta * uSpokeCount / TAU + 0.5) - 0.5) * TAU / uSpokeCount;
  float spoke = (1.0 - smoothstep(0.0, uSpokeThickness, spokeAngle * dist)) * smoothstep(0.0, 0.1, dist) * 0.4;

  // the sweep trails behind its leading edge, clockwise
  float a = mod(-theta - uTime * uSweepSpeed, TAU) / TAU;
  float sweep = pow(1.0 - a, uSweepWidth);

  float fade = smoothstep(1.02, 0.86, dist) * pow(max(1.0 - dist, 0.0), uFalloff);
  float signal = clamp((ring + spoke + sweep) * fade * uOpacity, 0.0, 1.0);
  gl_FragColor = vec4(uColor * signal, signal);
}
`;

export interface RadarProps {
  /** Where the radar sits, -1..1 across its box from the centre. */
  centreX?: number;
  /** -1..1 up its box from the centre. */
  centreY?: number;
  scale?: number;
  /** Turns a second. */
  sweepSpeed?: number;
  opacity?: number;
}

export default function Radar({ centreX = 0.55, centreY = 0, scale = 0.9, sweepSpeed = 1.6, opacity = 0.5 }: RadarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, GL_DPR),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uCentre: { value: [centreX, centreY] },
        uScale: { value: scale },
        uRingCount: { value: 5 },
        uSpokeCount: { value: 12 },
        uRingThickness: { value: 0.035 },
        uSpokeThickness: { value: 0.006 },
        uSweepSpeed: { value: sweepSpeed },
        uSweepWidth: { value: 7 },
        uFalloff: { value: 0.35 },
        uOpacity: { value: opacity },
        uColor: { value: rgb(chart[500]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const size = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(r.width)), Math.max(1, Math.floor(r.height)));
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
    };
    const ro = new ResizeObserver(size);
    ro.observe(host);
    size();

    const draw = (time: number) => {
      program.uniforms.uTime.value = time;
      renderer.render({ scene: mesh });
    };
    draw(0);
    const stop = runWhileSeen(host, draw);
    return () => {
      stop();
      ro.disconnect();
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [centreX, centreY, scale, sweepSpeed, opacity]);

  return <div ref={ref} className="h-full w-full overflow-hidden" />;
}
