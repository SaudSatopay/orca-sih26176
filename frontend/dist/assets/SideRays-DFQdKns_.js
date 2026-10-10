import{r as u,j as p,H as y,q as v}from"./index-CT5eUvR4.js";import{u as m,n as g,h as n,r as h}from"./nightGl-CVVRDPnz.js";import{R,P as C,M as S,T as x}from"./Triangle-DIsCpGZW.js";const o={rayColor1:v[300],rayColor2:y,speed:.5,intensity:4.5,spread:1.6,flipX:0,flipY:0,tilt:0,saturation:1,blend:.55,falloff:1,opacity:.85,sharpness:2},T=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`,b=`precision highp float;
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
}`;function A(f){const l=u.useRef(null);return m(l,f,c=>{const r=new R({dpr:g(),alpha:!0}),e=r.gl;e.clearColor(0,0,0,0);const t=e.canvas;t.setAttribute("aria-hidden","true"),c.appendChild(t);const a=new C(e,{vertex:T,fragment:b,uniforms:{iTime:{value:0},iResolution:{value:[1,1]},iSpeed:{value:o.speed},iRayColor1:{value:n(o.rayColor1)},iRayColor2:{value:n(o.rayColor2)},iIntensity:{value:o.intensity},iSpread:{value:o.spread},iFlipX:{value:o.flipX},iFlipY:{value:o.flipY},iTilt:{value:o.tilt},iSaturation:{value:o.saturation},iBlend:{value:o.blend},iFalloff:{value:o.falloff},iOpacity:{value:o.opacity},iSharp:{value:o.sharpness}}}),d=new S(e,{geometry:new x(e),program:a});return{canvas:t,resize(i,s){r.setSize(i,s),a.uniforms.iResolution.value=[i*r.dpr,s*r.dpr]},draw(i){a.uniforms.iTime.value=i,r.render({scene:d})},dispose(){a.remove(),h(e)}}}),p.jsx("div",{ref:l,className:"nb-fill"})}export{A as default};
