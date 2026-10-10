import{r as v,j as h,q as l}from"./index-DjJDsFw2.js";import{j as r}from"./App-psYlHEEz.js";import{u as g,n as x,r as f,h as n}from"./nightGl-DJM6f3HT.js";import{R as T,P as C,M as y,T as w}from"./Triangle-DIsCpGZW.js";import"./locate-sQlP5Fd0.js";import"./MarineMap-BO1rF4Ml.js";import"./cn-ew9kF1hN.js";const o={color1:l[500],color2:l[300],color3:l[100],speed:.16,threadCount:r.count,frequency:r.frequency,spread:r.spread,taper:r.taper,position:r.position,fanMode:2,glow:.011,falloff:.72,thickness:1,brightness:.55,opacity:.9,mirror:0},S=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,A=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uThreadCount;
uniform float uFrequency;
uniform float uSpread;
uniform float uTaper;
uniform float uPosition;
uniform float uFanMode;
uniform float uGlow;
uniform float uFalloff;
uniform float uThickness;
uniform float uBrightness;
uniform float uOpacity;
uniform float uMirror;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

#define TAU 6.28318530718
#define MAX_THREADS 10

float glow(float x, float str, float dist) {
  return dist / pow(max(x, 1e-4), str);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float n = max(uThreadCount, 1.0);
  float pinchX = uFanMode < 0.5 ? 0.5 : (uFanMode < 1.5 ? 0.0 : 1.0);
  float spreadDx = uSpread * abs(uv.x - pinchX);
  float baseT = iTime * uSpeed;
  float tauOverN = TAU / n;
  float mirror = uMirror > 0.5 ? sign(pinchX - uv.x) : 1.0;
  float invThickness = 1.0 / max(uThickness, 0.01);
  float xFreq = uv.x * uFrequency;
  float yOff = uv.y - uPosition;
  float ciScale = n > 1.0 ? 1.0 / (n - 1.0) : 0.0;

  vec3 col = vec3(0.0);
  float gsum = 0.0;
  for (int idx = 0; idx < MAX_THREADS; idx++) {
    float i = float(idx);
    if (i >= n) break;
    float amplitude = spreadDx * (1.0 + i * uTaper);
    float phase = (baseT + i * tauOverN) * mirror;
    float sdf = abs(yOff + sin(xFreq + phase) * amplitude) * invThickness;
    float g = glow(sdf, uFalloff, uGlow);
    col += g * mix(uColor1, uColor2, i * ciScale);
    gsum += g;
  }
  float coreAmt = smoothstep(0.5, 2.2, gsum);
  col = mix(col, uColor3 * gsum, coreAmt * 0.5);
  col *= uBrightness;
  float alpha = clamp(gsum, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * alpha, alpha);
}
`;function E(c){const s=v.useRef(null);return g(s,c,m=>{const a=new T({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:x()}),e=a.gl;if(!a.isWebgl2)return f(e),null;e.clearColor(0,0,0,0);const u=e.canvas;u.setAttribute("aria-hidden","true"),m.appendChild(u);const i=new C(e,{vertex:S,fragment:A,uniforms:{iTime:{value:0},iResolution:{value:[1,1]},uSpeed:{value:o.speed},uThreadCount:{value:o.threadCount},uFrequency:{value:o.frequency},uSpread:{value:o.spread},uTaper:{value:o.taper},uPosition:{value:o.position},uFanMode:{value:o.fanMode},uGlow:{value:o.glow},uFalloff:{value:o.falloff},uThickness:{value:o.thickness},uBrightness:{value:o.brightness},uOpacity:{value:o.opacity},uMirror:{value:o.mirror},uColor1:{value:n(o.color1)},uColor2:{value:n(o.color2)},uColor3:{value:n(o.color3)}}}),p=new y(e,{geometry:new w(e),program:i});return{canvas:u,resize(t,d){a.setSize(t,d),i.uniforms.iResolution.value=[e.drawingBufferWidth,e.drawingBufferHeight]},draw(t){i.uniforms.iTime.value=t,a.render({scene:p})},dispose(){i.remove(),f(e)}}}),h.jsx("div",{ref:s,className:"nb-fill"})}export{E as default};
