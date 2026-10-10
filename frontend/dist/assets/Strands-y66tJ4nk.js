import{r as h,j as g,q as i}from"./index-CxrltWmD.js";import{W as x}from"./App-BOawlzj3.js";import{u as S,n as C,r as m,h as y}from"./nightGl-BzGYI06s.js";import{R as w,T,P as b,M as A}from"./Triangle-DIsCpGZW.js";import"./locate-B462hFv-.js";import"./MarineMap-Dy_uJntJ.js";import"./cn-ew9kF1hN.js";const p=12,f=8,e={colors:[i[700],i[500],i[300],i[500]],speed:.22,thickness:.55,glow:1.6,hueShift:0,saturation:1,opacity:.9,...x},R=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,k=`#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${f}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;
out vec4 fragColor;

const float PI = 3.14159265;

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);
  float e = 0.06 + uIntensity * 0.94;
  // one lobe only: the original cosine repeats across a wide strip
  float env = abs(uv.x * 1.3) < 0.5 ? pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper) : 0.0;
  vec3 col = vec3(0.0);
  for (int i = 0; i < ${p}; i++) {
    if (i >= uStrandCount) break;
    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;
    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;
    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;
    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;
    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += samplePalette(h) * g * env;
  }
  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);
  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * uOpacity, alpha);
}
`;function I(o){return Array.from({length:f},(l,n)=>y(o[n]??o[o.length-1]))}function q(o){const l=h.useRef(null);return S(l,o,n=>{const a=new w({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:C()}),t=a.gl;if(!a.isWebgl2)return m(t),null;t.clearColor(0,0,0,0);const r=t.canvas;r.setAttribute("aria-hidden","true"),n.appendChild(r);const c=new T(t);delete c.attributes.uv;const u=new b(t,{vertex:R,fragment:k,uniforms:{uTime:{value:0},uResolution:{value:[1,1]},uColors:{value:I(e.colors)},uColorCount:{value:Math.min(e.colors.length,f)},uStrandCount:{value:Math.min(e.count,p)},uSpeed:{value:e.speed},uAmplitude:{value:e.amplitude},uWaviness:{value:e.waviness},uThickness:{value:e.thickness},uGlow:{value:e.glow},uTaper:{value:e.taper},uSpread:{value:e.spread},uHueShift:{value:e.hueShift},uIntensity:{value:e.intensity},uOpacity:{value:e.opacity},uScale:{value:e.scale},uSaturation:{value:e.saturation}}}),d=new A(t,{geometry:c,program:u});return{canvas:r,resize(s,v){a.setSize(s,v),u.uniforms.uResolution.value=[t.drawingBufferWidth,t.drawingBufferHeight]},draw(s){u.uniforms.uTime.value=s,a.render({scene:d})},dispose(){u.remove(),m(t)}}}),g.jsx("div",{ref:l,className:"nb-fill"})}export{q as default};
