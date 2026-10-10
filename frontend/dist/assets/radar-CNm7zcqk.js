import{r as v,j as w,q as R}from"./index-CpfvkMBS.js";import{a as S,r as k,b as x}from"./GlSlot-UAK9CBMB.js";import{R as C,P as T,M as y,T as b}from"./Triangle-DIsCpGZW.js";import"./App-DDN6fqNx.js";import"./locate-CqtasRz3.js";import"./MarineMap-CTd3rutA.js";import"./cn-ew9kF1hN.js";const A=`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,M=`
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
`;function j({centreX:n=.55,centreY:u=0,scale:r=.9,sweepSpeed:l=1.6,opacity:f=.5}){const c=v.useRef(null);return v.useEffect(()=>{const o=c.current;if(!o)return;const s=new C({alpha:!0,premultipliedAlpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,S)}),e=s.gl;e.clearColor(0,0,0,0);const a=e.canvas;a.style.width="100%",a.style.height="100%",a.style.display="block",o.appendChild(a);const i=new T(e,{vertex:A,fragment:M,uniforms:{uTime:{value:0},uResolution:{value:[1,1,1]},uCentre:{value:[n,u]},uScale:{value:r},uRingCount:{value:5},uSpokeCount:{value:12},uRingThickness:{value:.035},uSpokeThickness:{value:.006},uSweepSpeed:{value:l},uSweepWidth:{value:7},uFalloff:{value:.35},uOpacity:{value:f},uColor:{value:k(R[500])}}}),d=new y(e,{geometry:new b(e),program:i}),p=()=>{const t=o.getBoundingClientRect();s.setSize(Math.max(1,Math.floor(t.width)),Math.max(1,Math.floor(t.height))),i.uniforms.uResolution.value=[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height]},m=new ResizeObserver(p);m.observe(o),p();const h=t=>{i.uniforms.uTime.value=t,s.render({scene:d})};h(0);const g=x(o,h);return()=>{var t;g(),m.disconnect(),a.remove(),(t=e.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[n,u,r,l,f]),w.jsx("div",{ref:c,className:"h-full w-full overflow-hidden"})}export{j as default};
