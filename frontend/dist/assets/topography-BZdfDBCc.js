import{r as x,j as M,q as g}from"./index-BfeaCYFr.js";import{a as B,r as y,b as D}from"./GlSlot-BzyMxFmQ.js";import{R as z,P as F,M as S,T}from"./Triangle-DIsCpGZW.js";import"./App-DYFk5p4c.js";import"./locate-BPNyf_JK.js";import"./MarineMap-D6yD6ymD.js";import"./cn-ew9kF1hN.js";const k=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,E=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uOpacity;
uniform float uMorph;
uniform vec3 uShallow;
uniform vec3 uDeep;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  // keep the contours round on a wide, short band
  uv.x *= iResolution.x / max(iResolution.y, 1.0) * 0.16;
  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;
  float fv = field(suv);
  float f = fv * uBands;
  float fr = fract(f);
  float lineDist = min(fr, 1.0 - fr);
  float aa = fwidth(f) + 0.0001;
  float line = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);
  // every fifth contour is an index contour, drawn a little heavier
  float index = step(mod(floor(f + 0.5), 5.0), 0.5);
  float depth = clamp(fv / (uMorph * 2.5 + 0.001), 0.0, 1.0);
  vec3 ink = mix(uShallow, uDeep, depth);
  float a = line * uOpacity * mix(0.75, 1.25, index);
  fragColor = vec4(ink * a, a);
}
`,P=[[1,-2,3,-4],[9,-8,7,-6],[5,2,5,-5],[-1,-3,8,9]];function H({bands:u=2.4,thickness:s=.03,opacity:f=.45,speed:c=.08,scale:v=1.15}){const m=x.useRef(null);return x.useEffect(()=>{const a=m.current;if(!a)return;const i=new z({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,B)}),o=i.gl;o.clearColor(0,0,0,0);const n=o.canvas;n.style.width="100%",n.style.height="100%",n.style.display="block",a.appendChild(n);const h=3,r=new F(o,{vertex:k,fragment:E,uniforms:{iResolution:{value:new Float32Array([1,1])},uBands:{value:u},uThickness:{value:s},uScale:{value:v},uOpacity:{value:f},uMorph:{value:h},uShallow:{value:new Float32Array(y(g[500]))},uDeep:{value:new Float32Array(y(g[700]))},uCtrlA:{value:new Float32Array(4)},uCtrlB:{value:new Float32Array(4)},uCtrlC:{value:new Float32Array(4)},uCtrlD:{value:new Float32Array(4)}}}),R=new S(o,{geometry:new T(o),program:r}),b=[r.uniforms.uCtrlA,r.uniforms.uCtrlB,r.uniforms.uCtrlC,r.uniforms.uCtrlD].map(e=>e.value),p=e=>{for(let t=0;t<4;t++)for(let l=0;l<4;l++){const C=P[t][l];b[t][l]=h*Math.sin(e*c*Math.sin(C*.05)+C)}i.render({scene:R})},d=()=>{const e=a.getBoundingClientRect();i.setSize(Math.max(1,Math.floor(e.width)),Math.max(1,Math.floor(e.height)));const t=r.uniforms.iResolution.value;t[0]=o.drawingBufferWidth,t[1]=o.drawingBufferHeight},w=new ResizeObserver(d);w.observe(a),d(),p(0);const A=D(a,p);return()=>{var e;A(),w.disconnect(),n.remove(),(e=o.getExtension("WEBGL_lose_context"))==null||e.loseContext()}},[u,s,f,c,v]),M.jsx("div",{ref:m,className:"h-full w-full overflow-hidden"})}export{H as default};
