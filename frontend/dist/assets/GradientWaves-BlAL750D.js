import{r as p,j as d,q as u}from"./index-BrVKMo8h.js";import{u as h,n as g,r as n,h as l}from"./nightGl-lttkDTNu.js";import{R as x,P as y,M as T,T as S}from"./Triangle-DIsCpGZW.js";const e={horizon:u[300],water:u[700],crest:u[300],speed:.14,amplitude:2.1,waveScale:.55,waveRatio:.9,swell:30,turbulence:18,tilt:1.52,zoom:1.25,height:.5,fogDepth:30,steps:56,brightness:1,opacity:1},w=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,C=`#version 300 es
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
`;function z(c){const s=p.useRef(null);return h(s,c,v=>{const t=new x({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:g()}),o=t.gl;if(!t.isWebgl2)return n(o),null;o.clearColor(0,0,0,0);const i=o.canvas;i.setAttribute("aria-hidden","true"),v.appendChild(i);const a=new y(o,{vertex:w,fragment:C,uniforms:{iTime:{value:0},iResolution:{value:[1,1]},uSpeed:{value:e.speed},uAmplitude:{value:e.amplitude},uWaveScale:{value:e.waveScale},uWaveRatio:{value:e.waveRatio},uSwell:{value:e.swell},uTurbulence:{value:e.turbulence},uTilt:{value:e.tilt},uZoom:{value:e.zoom},uHeight:{value:e.height},uFogDepth:{value:e.fogDepth},uSteps:{value:e.steps},uBrightness:{value:e.brightness},uOpacity:{value:e.opacity},uHorizonColor:{value:l(e.horizon)},uWaveColor:{value:l(e.water)},uCrestColor:{value:l(e.crest)}}}),f=new T(o,{geometry:new S(o),program:a});return{canvas:i,resize(r,m){t.setSize(r,m),a.uniforms.iResolution.value=[o.drawingBufferWidth,o.drawingBufferHeight]},draw(r){a.uniforms.iTime.value=r,t.render({scene:f})},dispose(){a.remove(),n(o)}}}),d.jsx("div",{ref:s,className:"nb-fill"})}export{z as default};
