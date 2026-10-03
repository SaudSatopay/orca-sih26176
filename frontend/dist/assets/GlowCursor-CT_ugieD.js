import{r as G,j as _,q as O}from"./index-CjR-5aiH.js";import{u as F,n as X,h as R,b as D,r as U}from"./nightGl-CV1cDSgc.js";import{R as j,P as q,M as z,T as B}from"./Triangle-DIsCpGZW.js";const m=48,t={color:O[300],secondaryColor:O[500],trailLength:40,trailWidth:10,trailTaper:.85,followSpeed:.14,glowIntensity:1.4,glowSpread:1.3,opacity:.45,pulseSpeed:.8,idleTimeout:900,fadeDuration:1100},K=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,V=`
precision highp float;
#define MAX_POINTS ${m}
uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uTime;
uniform float uFade;
varying vec2 vUv;

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.12;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    strongest = max(strongest, intensity);
    colorSum += mix(uColor, uSecondaryColor, progress) * intensity;
    colorWeight += intensity;
  }

  float alpha = clamp(strongest, 0.0, 1.0) * uOpacity * uFade;
  if (alpha < 0.002) discard;
  // premultiplied, over a cleared buffer, no blending: the page sees exactly
  // \`alpha\` of the trail colour over the band (the original blended the
  // alpha twice, which squared it)
  gl_FragColor = vec4(colorSum / max(colorWeight, 0.0001) * alpha, alpha);
}
`,W=(w,v,f)=>Math.min(Math.max(w,v),f);function J(w){const v=G.useRef(null);return F(v,w,(f,b)=>{const S=new j({alpha:!0,premultipliedAlpha:!0,dpr:X()}),l=S.gl;l.clearColor(0,0,0,0);const P=l.canvas;P.setAttribute("aria-hidden","true"),f.appendChild(P);const C=new Array(m*2).fill(0),o=Array.from({length:m},()=>({x:0,y:0})),h={x:0,y:0},i={x:0,y:0},c=new q(l,{vertex:K,fragment:V,uniforms:{uResolution:{value:[1,1]},uPoints:{value:C},uPointCount:{value:t.trailLength},uColor:{value:R(t.color)},uSecondaryColor:{value:R(t.secondaryColor)},uTrailWidth:{value:t.trailWidth},uTaper:{value:t.trailTaper},uGlowIntensity:{value:t.glowIntensity},uGlowSpread:{value:t.glowSpread},uOpacity:{value:t.opacity},uPulseSpeed:{value:t.pulseSpeed},uTime:{value:0},uFade:{value:0}},transparent:!1,depthTest:!1,depthWrite:!1}),N=new z(l,{geometry:new B(l),program:c});let M=1,E=1,g=!1,x=!1,s=0,y=0;const u=D(f),T=n=>{if(n.pointerType!=="mouse"&&n.pointerType!=="pen")return;const a=f.getBoundingClientRect(),r=W(n.clientX-a.left,0,a.width),p=W(a.height-(n.clientY-a.top),0,a.height);if(!g){for(const d of o)d.x=r,d.y=p;i.x=r,i.y=p,g=!0}h.x=r,h.y=p,x=!0,y=performance.now(),b()},I=()=>{x=!1,y=performance.now(),b()};return u.addEventListener("pointermove",T),u.addEventListener("pointerenter",T),u.addEventListener("pointerleave",I),{canvas:P,resize(n,a){M=n,E=a,S.setSize(n,a),c.uniforms.uResolution.value=[M,E]},draw(n,a){const r=Math.min(a*60,3);if(g){const L=1-Math.pow(1-t.followSpeed,r),A=1-Math.pow(1-(.28+t.followSpeed*.35),r);i.x+=(h.x-i.x)*L,i.y+=(h.y-i.y)*L,o[0].x=i.x,o[0].y=i.y;for(let e=1;e<m;e++)o[e].x+=(o[e-1].x-o[e].x)*A,o[e].y+=(o[e-1].y-o[e].y)*A;for(let e=0;e<m;e++)C[e*2]=o[e].x,C[e*2+1]=o[e].y}const p=!x||performance.now()-y>t.idleTimeout,d=g&&!p?1:0;s+=(d-s)*Math.min(1,16.667*r/t.fadeDuration*7),s<.002&&d===0&&(s=0),c.uniforms.uTime.value=n,c.uniforms.uFade.value=s,S.render({scene:N})},moving:()=>s>0||x&&performance.now()-y<=t.idleTimeout,dispose(){u.removeEventListener("pointermove",T),u.removeEventListener("pointerenter",T),u.removeEventListener("pointerleave",I),c.remove(),U(l)}}}),_.jsx("div",{ref:v,className:"nb-fill"})}export{J as default};
