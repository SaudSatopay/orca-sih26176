/**
 * Side Rays — https://reactbits.dev/backgrounds/side-rays
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: the warning band's light. Rays fall from the band's
 * top-right corner like a lighthouse beam sweeping over a night sea, in
 * chart-300 and the pale `sea` token. Changes from the original: token
 * colours; the beams sharpened (a power on each ray's strength) so they
 * read as shafts rather than one glow; the band draws them over its right
 * three fifths only, feathered (index.css .nb-rays), so no ray ever crosses
 * the copy; a slower sweep; the loop, DPR cap and
 * context release come from the shared night stage (nightGl.ts) instead of
 * its own observer, which re-created the context on every scroll.
 */
import { useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { EffectProps } from "./EffectSlot";
import { chart, sea } from "../tokens";
import { hexToVec3, nightDpr, releaseContext, useNightScene } from "./nightGl";

const RAYS = {
  rayColor1: chart[300],
  rayColor2: sea,
  /** A slow sweep: a fifth of the original speed. */
  speed: 0.5,
  intensity: 4.5,
  spread: 1.6,
  /** top-right */
  flipX: 0,
  flipY: 0,
  tilt: 0,
  saturation: 1.0,
  blend: 0.55,
  falloff: 1.0,
  opacity: 0.85,
  /** 1 is the original soft glow; higher separates the beams. */
  sharpness: 2,
} as const;

const vertex = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = /* glsl */ `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;
uniform float iSharp;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  // ORCA: the beams sharpened (a power on the strength), so they read as
  // separate shafts of light rather than one glow
  vec4 rays1 = vec4(iRayColor1, 1.0) * pow(rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed), iSharp);
  vec4 rays2 = vec4(iRayColor2, 1.0) * pow(rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2), iSharp);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export default function SideRays(props: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, props, (el) => {
    const renderer = new Renderer({ dpr: nightDpr(), alpha: true });
    const gl = renderer.gl;
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
        iSpeed: { value: RAYS.speed },
        iRayColor1: { value: hexToVec3(RAYS.rayColor1) },
        iRayColor2: { value: hexToVec3(RAYS.rayColor2) },
        iIntensity: { value: RAYS.intensity },
        iSpread: { value: RAYS.spread },
        iFlipX: { value: RAYS.flipX },
        iFlipY: { value: RAYS.flipY },
        iTilt: { value: RAYS.tilt },
        iSaturation: { value: RAYS.saturation },
        iBlend: { value: RAYS.blend },
        iFalloff: { value: RAYS.falloff },
        iOpacity: { value: RAYS.opacity },
        iSharp: { value: RAYS.sharpness },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    return {
      canvas,
      resize(w, h) {
        renderer.setSize(w, h);
        program.uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
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
