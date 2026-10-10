import{r as h,j as ae,H as ne,q as oe}from"./index-Dy8YFV_R.js";import{o as re}from"./App-Dfy-iion.js";import{R as ie,G as se,P as X,M as Y,T as ce}from"./Triangle-DIsCpGZW.js";import{T as le}from"./Texture-BkQWYNP2.js";import{R as ue}from"./RenderTarget-BJHc8Cd7.js";import"./locate-CbxLr1kd.js";import"./MarineMap-CBHpMJ03.js";import"./cn-ew9kF1hN.js";const g=100,J=.4,F=1.5,ve=Math.log(500),fe=1.5,me=120,pe=.055,de=1,he=4,ge=4,xe=2.4,K=14,ye=.1,we=.16,Q=E=>{const f=parseInt(E.slice(1),16);return[(f>>16&255)/255,(f>>8&255)/255,(f&255)/255]},Te=`
precision highp float;
attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;
varying vec2 vUv;
varying float vOpacity;
void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`,Ae=`
precision highp float;
varying vec2 vUv;
varying float vOpacity;
uniform float uRings;
const float PI = 3.141592653589793;
const float EDGE = 0.006737947;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;
  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);
  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`,Ee=`
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Se=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uGlint;
uniform float uTintAmount;
const float TAU = 6.283185307179586;
vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}
void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = coverUV(vUv);
  float theta = amount * uSwirl * TAU;
  vec2 push = vec2(sin(theta), cos(theta)) * amount * uStrength;
  vec3 color = texture2D(uTexture, base + push).rgb;
  color = mix(color, color * uTint * 1.9, clamp(amount * 1.6, 0.0, 1.0) * uTintAmount);
  float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
  float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
  vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
  vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
  float raw = pow(max(dot(normal, light), 0.0), 22.0);
  float flatSpec = pow(max(light.z, 0.0), 22.0);
  color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
  gl_FragColor = vec4(color, 1.0);
}
`;function _e({active:E,onReady:f,onFail:z}){const G=h.useRef(null),b=h.useRef(null),x=h.useRef({onReady:f,onFail:z});return h.useEffect(()=>{x.current={onReady:f,onFail:z}}),h.useEffect(()=>{const o=G.current;if(!o)return;let y;try{y=new ie({alpha:!1,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,fe)})}catch{x.current.onFail();return}const e=y.gl,c=e.canvas;c.style.width="100%",c.style.height="100%",c.style.display="block",o.appendChild(c);let m=!1,l=!1,w=!1,C=!1,n=0,T=0,p=1,d=1;const N=t=>{t.preventDefault(),cancelAnimationFrame(n),n=0,m||x.current.onFail()};c.addEventListener("webglcontextlost",N);const P=new le(e,{generateMipmaps:!1,minFilter:e.LINEAR,magFilter:e.LINEAR,wrapS:e.CLAMP_TO_EDGE,wrapT:e.CLAMP_TO_EDGE}),M=new Float32Array(g*2),O=new Float32Array(g*2),S=new Float32Array(g),U=Array.from({length:g},()=>({x:0,y:0,scale:F,target:F,opacity:0}));let L=0;const R=new se(e,{position:{size:2,data:new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])},uv:{size:2,data:new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1])},iOffset:{instanced:1,size:2,data:M},iScale:{instanced:1,size:2,data:O},iOpacity:{instanced:1,size:1,data:S}}),I=new X(e,{vertex:Te,fragment:Ae,uniforms:{uRings:{value:he}},transparent:!0,depthTest:!1,depthWrite:!1,cullFace:!1});I.setBlendFunc(e.ONE,e.ONE);const Z=new Y(e,{geometry:R,program:I,frustumCulled:!1}),_=new ue(e,{width:2,height:2,depth:!1,minFilter:e.LINEAR,magFilter:e.LINEAR,wrapS:e.CLAMP_TO_EDGE,wrapT:e.CLAMP_TO_EDGE}),D={uTexture:{value:P},uDisplacement:{value:_.texture},uResolution:{value:[1,1]},uTextureSize:{value:[1,1]},uTexel:{value:[1,1]},uTint:{value:Q(oe[500])},uHighlight:{value:Q(ne)},uStrength:{value:pe},uSwirl:{value:de},uGlint:{value:we},uTintAmount:{value:ye}},$=new Y(e,{geometry:new ce(e),program:new X(e,{vertex:Ee,fragment:Se,uniforms:D,depthTest:!1,depthWrite:!1})}),ee=()=>U.some(t=>t.opacity>0),te=t=>{const r=T?Math.min(.05,(t-T)/1e3):0;T=t;const u=1-Math.exp(-r*1.09),v=Math.exp(-r*ve/xe);for(let a=0;a<g;a+=1){const i=U[a];if(i.opacity<=0){S[a]=0;continue}if(i.opacity*=v,i.scale+=(i.target-i.scale)*u,i.opacity<.002){i.opacity=0,S[a]=0;continue}const j=i.scale*me/2;M[a*2]=i.x/p*2-1,M[a*2+1]=i.y/d*2-1,O[a*2]=j/p*2,O[a*2+1]=j/d*2,S[a]=i.opacity}R.attributes.iOffset.needsUpdate=!0,R.attributes.iScale.needsUpdate=!0,R.attributes.iOpacity.needsUpdate=!0,y.render({scene:Z,target:_,clear:!0}),y.render({scene:$}),w&&!C&&(C=!0,x.current.onReady())},A=t=>{n=0,!(m||!l)&&(te(t),ee()?n=requestAnimationFrame(A):T=0)},H=()=>{!n&&!m&&l&&w&&(n=requestAnimationFrame(A))},W=()=>{p=Math.max(1,o.clientWidth),d=Math.max(1,o.clientHeight),y.setSize(p,d),D.uResolution.value=[p,d];const t=Math.max(2,Math.round(p*J)),r=Math.max(2,Math.round(d*J));_.setSize(t,r),D.uTexel.value=[1/t,1/r],H(),!n&&l&&w&&(n=requestAnimationFrame(A))},q=new ResizeObserver(W);q.observe(o),W();const s=new window.Image;s.decoding="async",s.onload=()=>{m||(P.image=s,D.uTextureSize.value=[s.naturalWidth||1,s.naturalHeight||1],w=!0,l&&!n&&(n=requestAnimationFrame(A)))},s.onerror=()=>{m||x.current.onFail()},s.src=re("ask").src;let V=-1e4,k=-1e4;const B=t=>{if(!l)return;const r=o.getBoundingClientRect(),u=t.clientX-r.left,v=r.height-(t.clientY-r.top);if(u<0||v<0||u>r.width||v>r.height||Math.abs(u-V)<=K&&Math.abs(v-k)<=K)return;V=u,k=v;const a=U[L];L=(L+1)%g,a.x=u,a.y=v,a.scale=F,a.target=F*ge,a.opacity=1,H()};return o.addEventListener("pointermove",B,{passive:!0}),b.current={setActive(t){if(l=t,!l){cancelAnimationFrame(n),n=0,T=0;return}w&&!n&&(n=requestAnimationFrame(A))}},()=>{var t;m=!0,b.current=null,cancelAnimationFrame(n),q.disconnect(),o.removeEventListener("pointermove",B),c.removeEventListener("webglcontextlost",N),s.onload=null,s.onerror=null,c.parentNode===o&&o.removeChild(c),(t=e.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[]),h.useEffect(()=>{var o;(o=b.current)==null||o.setActive(E)},[E]),ae.jsx("div",{ref:G,className:"sheet-ripple absolute inset-0 overflow-hidden"})}export{_e as default};
