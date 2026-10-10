import{r as ue,j as fe,n as pe,p as he}from"./index-CT5eUvR4.js";import{s as ve}from"./App-DmZvsOsm.js";import{u as de,n as ee,r as te,h as oe,p as me}from"./nightGl-CVVRDPnz.js";import{R as ge,P as xe,M as we,T as ye}from"./Triangle-DIsCpGZW.js";import{T as ae}from"./Texture-BkQWYNP2.js";import"./locate-DCM2hKkk.js";import"./MarineMap-C6pC32pR.js";import"./cn-ew9kF1hN.js";const ce=560,L=4,V=1e20,N=5,J=3,Me=4e6,F={color:he[50],glowColor:pe.extreme,scale:.62,intensity:.95,glow:.9,thickness:1.4,strands:3,bend:.5,crackle:1.2,arcs:.8,flicker:.45,fill:0,speed:1.4,cursorIntensity:.7,cursorRadius:90},ne=(u,c,e,n,o)=>{let t=0;e[0]=0,n[0]=-V,n[1]=V;for(let a=1;a<o;a++){let v=(u[a]+a*a-(u[e[t]]+e[t]*e[t]))/(2*a-2*e[t]);for(;v<=n[t];)t--,v=(u[a]+a*a-(u[e[t]]+e[t]*e[t]))/(2*a-2*e[t]);t++,e[t]=a,n[t]=v,n[t+1]=V}t=0;for(let a=0;a<o;a++){for(;n[t+1]<a;)t++;c[a]=(a-e[t])*(a-e[t])+u[e[t]]}},re=(u,c,e)=>{const n=Math.max(c,e),o=new Float64Array(n),t=new Float64Array(n),a=new Int32Array(n),v=new Float64Array(n+1);for(let l=0;l<c;l++){for(let i=0;i<e;i++)o[i]=u[i*c+l];ne(o,t,a,v,e);for(let i=0;i<e;i++)u[i*c+l]=t[i]}for(let l=0;l<e;l++){for(let i=0;i<c;i++)o[i]=u[l*c+i];ne(o,t,a,v,c);for(let i=0;i<c;i++)u[l*c+i]=t[i]}},le=(u,c,e,n,o,t)=>{const a=1/(2*t+1);let v=0;for(let l=0;l<=t&&l<o;l++)v+=u[e+l*n];for(let l=0;l<o;l++)c[e+l*n]=v*a,l+t+1<o&&(v+=u[e+(l+t+1)*n]),l-t>=0&&(v-=u[e+(l-t)*n])},ie=(u,c,e,n)=>{const o=new Float32Array(c*e);for(let t=0;t<3;t++){for(let a=0;a<e;a++)le(u,o,a*c,1,c,n);for(let a=0;a<c;a++)le(o,u,a,c,e,n)}},be=(u,c,e)=>{const n=new Float32Array(c*e);let o=0;for(let r=0;r<c*e;r++)u[r*4+3]<250&&o++;if(o>c*e*.01){for(let r=0;r<c*e;r++)n[r]=u[r*4+3]/255;return n}let t=0,a=0,v=0,l=0;const i=r=>{t+=u[r*4],a+=u[r*4+1],v+=u[r*4+2],l++};for(let r=0;r<c;r++)i(r),i((e-1)*c+r);for(let r=0;r<e;r++)i(r*c),i(r*c+c-1);t/=l,a/=l,v/=l;for(let r=0;r<c*e;r++){const b=Math.max(Math.abs(u[r*4]-t),Math.abs(u[r*4+1]-a),Math.abs(u[r*4+2]-v));n[r]=Math.min(1,Math.max(0,(b-24)/48))}return n},se=(u,c,e)=>{const{field:n,width:o,height:t}=u,a=Math.min(Math.max(c,.5),o-.5),v=Math.min(Math.max(e,.5),t-.5),l=Math.min(Math.floor(a-.5),o-2),i=Math.min(Math.floor(v-.5),t-2),r=a-.5-l,b=v-.5-i,d=i*o+l,A=n[d]+(n[d+1]-n[d])*r,j=n[d+o]+(n[d+o+1]-n[d+o])*r;return A+(j-A)*b+Math.hypot(c-a,e-v)},ke=u=>{const c=u.naturalWidth||u.width,e=u.naturalHeight||u.height;if(!c||!e)return null;const n=ce/Math.max(c,e),o=Math.max(2,Math.round(c*n)),t=Math.max(2,Math.round(e*n)),a=document.createElement("canvas");a.width=o,a.height=t;const v=a.getContext("2d",{willReadFrequently:!0});if(!v)return null;v.drawImage(u,0,0,o,t);const l=be(v.getImageData(0,0,o,t).data,o,t);let i=o,r=t,b=-1,d=-1;for(let s=0;s<t;s++)for(let y=0;y<o;y++)l[s*o+y]<=.01||(y<i&&(i=y),y>b&&(b=y),s<r&&(r=s),s>d&&(d=s));if(b<0)return null;const A=b-i+1,j=d-r+1,S=Math.ceil(Math.max(A,j)*.25)+2,h=A+S*2,p=j+S*2,x=new Float32Array(h*p),T=new Float32Array(h*p);for(let s=0;s<p;s++)for(let y=0;y<h;y++){const f=y-S+i,E=s-S+r,W=f>=0&&E>=0&&f<o&&E<t?l[E*o+f]:0,G=s*h+y;if(W>=1)x[G]=0,T[G]=V;else if(W<=0)x[G]=V,T[G]=0;else{const U=.5-W;x[G]=U>0?U*U:0,T[G]=U<0?U*U:0}}re(x,h,p),re(T,h,p);const g=new Float32Array(h*p);for(let s=0;s<h*p;s++)g[s]=Math.sqrt(x[s])-Math.sqrt(T[s]);const R=[];for(let s=1;s<p-1;s++)for(let y=1;y<h-1;y++){const f=s*h+y,E=g[f];if(E>0||g[f-1]<=0&&g[f+1]<=0&&g[f-h]<=0&&g[f+h]<=0)continue;const W=g[f+1]-g[f-1],G=g[f+h]-g[f-h],U=Math.hypot(W,G)||1;R.push(y+.5-E*W/U,s+.5-E*G/U)}const I=Math.max(1,Math.ceil(R.length/2/3e3))*2,P=[];for(let s=0;s<R.length;s+=I)P.push(R[s],R[s+1]);const $=Math.max(A,j),D=Math.ceil($*.7/L),q=Math.ceil(A/L)+D*2,H=Math.ceil(j/L)+D*2,_=new Float32Array(q*H);for(let s=0;s<p;s++){const y=Math.floor((s-S)/L)+D;for(let f=0;f<h;f++){const E=Math.floor((f-S)/L)+D;_[y*q+E]+=Math.exp(-Math.abs(g[s*h+f])/1.5)/(L*L)}}const Y=_.slice(),O=Math.max(1,Math.round($*.035/L)),B=Math.max(2,Math.round($*.13/L));ie(_,q,H,O),ie(Y,q,H,B);const k=Math.sqrt(2*Math.PI*(O*O+O))*L/3,w=Math.sqrt(2*Math.PI*(B*B+B))*L/3,z=new Float32Array(q*H*2);for(let s=0;s<q*H;s++)z[s*2]=_[s]*k,z[s*2+1]=Y[s]*w;return{field:g,edges:P,width:h,height:p,pad:S,logoWidth:A,logoHeight:j,glow:z,glowWidth:q,glowHeight:H,glowOffset:S-D*L}},K=(u,c,e)=>{const{edges:n,logoWidth:o,logoHeight:t}=u,a=n.length/2;if(a<2)return null;const v=Math.max(o,t);let l=Math.floor(Math.random()*a);if(e){let b=!1;for(let d=0;d<40&&!b;d++){const A=Math.floor(Math.random()*a);Math.hypot(n[A*2]-e.x,n[A*2+1]-e.y)<e.radius&&(l=A,b=!0)}if(!b)return null}const i=n[l*2],r=n[l*2+1];for(let b=0;b<24;b++){const d=Math.floor(Math.random()*a),A=n[d*2],j=n[d*2+1],S=Math.hypot(A-i,j-r);if(S<v*.08||S>v*.3)continue;const h=-(j-r)/S,p=(A-i)/S,x=S*(.2+Math.random()*.3),T=(i+A)/2,g=(r+j)/2,R=se(u,T+h*x,g+p*x),I=se(u,T-h*x,g-p*x);if(!(Math.max(R,I)<=0))return{ax:i,ay:r,bx:A,by:j,bow:R>=I?x:-x,seed:1+Math.random()*60,born:c,life:.35+Math.random()*.45}}return null},Fe=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Ae=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tFieldFrom;
uniform sampler2D tGlowFrom;
uniform sampler2D tFieldTo;
uniform sampler2D tGlowTo;
uniform vec4 uMapFrom;
uniform vec4 uSizeFrom;
uniform vec4 uMapTo;
uniform vec4 uSizeTo;
uniform float uMorph;
uniform vec2 uResolution;
uniform float uUnit;
uniform float uTime;
uniform float uPresence;
uniform vec3 uHover;
uniform float uHoverRadius;
uniform vec4 uPulses[${J}];
uniform float uPulseBoost;
uniform float uFlash;
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uGlow;
uniform float uThickness;
uniform float uStrands;
uniform float uBend;
uniform float uCrackle;
uniform float uFlicker;
uniform float uFill;
uniform float uInk;
uniform vec4 uArcEnds[${N}];
uniform vec4 uArcShape[${N}];

in vec2 vUv;
out vec4 fragColor;

uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float fieldAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z;
  vec2 c = clamp(f, vec2(0.5), size.xy - 0.5);
  return (textureLod(tex, c / size.xy, 0.0).r + length(f - c)) * map.z;
}

vec2 glowAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z - map.w;
  return textureLod(tex, f / (size.zw * ${L}.0), 0.0).rg;
}

float shape(vec2 p, float k) {
  float to = fieldAt(tFieldTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(fieldAt(tFieldFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec2 aura(vec2 p, float k) {
  vec2 to = glowAt(tGlowTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(glowAt(tGlowFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec4 corner(ivec2 c, uint seed) {
  uint h = scramble(uint(c.x) * 0x8da6b343u + uint(c.y) * 0xd8163841u + seed * 0xcb1ab31fu);
  return vec4(uvec4(h, h >> 8u, h >> 16u, h >> 24u) & 255u) / 127.5 - 1.0;
}

vec2 drift(vec2 p, uint seed, out mat2 jac) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  ivec2 c = ivec2(i);
  vec4 ga = corner(c, seed);
  vec4 gb = corner(c + ivec2(1, 0), seed);
  vec4 gc = corner(c + ivec2(0, 1), seed);
  vec4 gd = corner(c + ivec2(1, 1), seed);
  vec2 fb = f - vec2(1.0, 0.0);
  vec2 fc = f - vec2(0.0, 1.0);
  vec2 fd = f - vec2(1.0);
  vec2 va = vec2(dot(ga.xy, f), dot(ga.zw, f));
  vec2 vb = vec2(dot(gb.xy, fb), dot(gb.zw, fb));
  vec2 vc = vec2(dot(gc.xy, fc), dot(gc.zw, fc));
  vec2 vd = vec2(dot(gd.xy, fd), dot(gd.zw, fd));
  vec2 k = va - vb - vc + vd;
  vec4 g = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd);
  jac = mat2(
    g.xy + du * (u.yx * k.x + vec2(vb.x - va.x, vc.x - va.x)),
    g.zw + du * (u.yx * k.y + vec2(vb.y - va.y, vc.y - va.y))
  );
  return va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
}

float wobble(vec2 p, uint seed) {
  mat2 jac;
  return drift(p, seed, jac).x;
}

vec2 ripple(vec2 p, out float surge) {
  vec2 push = vec2(0.0);
  surge = 0.0;
  float width = uUnit * 10.0;
  for (int i = 0; i < ${J}; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.w <= 0.0) continue;
    vec2 d = p - pulse.xy;
    float dist = length(d);
    float front = (dist - pulse.z * uUnit * 150.0) / width;
    float env = exp(-front * front) * pulse.w * exp(-pulse.z * 1.7) * smoothstep(0.0, uUnit * 8.0, dist);
    push += d / max(dist, 1.0) * env * cos(front * 2.2) * uUnit * 7.5;
    surge += env;
  }
  return push;
}

vec2 wander(vec2 p, float t, uint seed, float reachScale, out mat2 jac, out vec2 sway) {
  vec2 q = p / uUnit;
  mat2 ja;
  mat2 jb;
  mat2 jc;
  mat2 jd;
  vec2 a = drift(q * 0.028 + vec2(t * 0.29, t * 0.21), seed, ja);
  vec2 b = drift(q * 0.085 + a * 0.4 + vec2(t * 0.83, -t * 0.61) + 17.0, seed + 1u, jb);
  vec2 c = drift(p / 9.0 + b * 0.6 + vec2(t * 1.9, t * 1.3) + 5.0, seed + 2u, jc);
  vec2 d = drift(p / 4.1 + vec2(-t * 2.7, t * 2.2) + 11.0, seed + 3u, jd);
  float bendAmp = uBend * 8.0 * reachScale;
  float rippleAmp = uBend * 3.2 * reachScale;
  float crinkleAmp = uCrackle * 1.5 * reachScale;
  jac = ja * (0.028 * bendAmp) + jb * (0.085 * rippleAmp) + jc * (crinkleAmp / 9.0) + jd * (crinkleAmp * 0.35 / 4.1);
  sway = (a * bendAmp + b * rippleAmp) * uUnit;
  return sway + (c + d * 0.35) * crinkleAmp;
}

vec2 glowShape(float line, float spread, float w) {
  float x = abs(line);
  float y = abs(spread);
  return vec2(exp(-x * x / (w * w * 0.5)) + exp(-y / (w * 2.2)) * 0.6, exp(-y / (w * 4.5)) * 0.5);
}

void addArc(vec2 p, vec4 ends, vec4 info, float t, inout vec3 light, inout float energy, inout float hot) {
  if (info.y < 0.002) return;
  vec2 ab = ends.zw - ends.xy;
  float len = max(length(ab), 1.0);
  vec2 dir = ab / len;
  vec2 rel = p - ends.xy;
  float s = dot(rel, dir);
  float h = dot(rel, vec2(-dir.y, dir.x));
  float margin = abs(info.x) + uCrackle * (2.0 + len * 0.08) + uThickness * 12.0 + 10.0;
  if (s < -margin || s > len + margin || abs(h) > margin) return;
  float u = clamp(s / len, 0.0, 1.0);
  float taper = sin(3.14159265 * u);
  float bendSlope = s > 0.0 && s < len ? 3.14159265 / len * cos(3.14159265 * u) : 0.0;
  float beyond = max(-s, 0.0) + max(s - len, 0.0);
  for (int c = 0; c < 2; c++) {
    uint seed = uint(info.z * 131.0) + uint(c) * 29u + 7u;
    float jag = 0.0;
    float jagSlope = 0.0;
    float wave = max(len * 0.3, 14.0);
    float weight = uCrackle * (1.5 + len * 0.05) * (c == 0 ? 1.0 : 1.5);
    for (int o = 0; o < 3; o++) {
      mat2 jac;
      float n = drift(vec2(s / wave + info.z * 3.0, t * (1.4 + float(o) * 1.1)), seed + uint(o), jac).x;
      jag += n * weight;
      jagSlope += jac[0].x * weight / wave;
      wave *= 0.42;
      weight *= 0.4;
    }
    float offset = (info.x + jag) * taper;
    float offsetSlope = (info.x + jag) * bendSlope + jagSlope * taper;
    float across = (h - offset) / sqrt(1.0 + offsetSlope * offsetSlope);
    float gap = length(vec2(beyond, across));
    float w = uThickness * (c == 0 ? 0.9 : 0.6);
    vec2 g = glowShape(gap, gap, w);
    float k = info.y * (c == 0 ? 1.0 : 0.45);
    light += (uColor * g.x + uGlowColor * g.y * uGlow) * k;
    energy += (g.x + g.y * uGlow) * k;
    hot += exp(-gap * gap / (w * w * 0.16)) * k * (c == 0 ? 1.0 : 0.0);
  }
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
  float t = uTime;
  vec3 light = vec3(0.0);
  float energy = 0.0;
  float hot = 0.0;

  float surge;
  vec2 pr = p - ripple(p, surge);
  float k = uMorph >= 1.0 ? 1.0 : smoothstep(0.0, 1.0, clamp(uMorph * 1.7 - 0.35 + 0.35 * wobble(p / uUnit * 0.018, 41u), 0.0, 1.0));
  float transit = uMorph >= 1.0 ? 0.0 : sin(3.14159265 * uMorph);
  float base = shape(pr, k);

  vec2 toHover = p - uHover.xy;
  float heat = min(uHover.z * exp(-dot(toHover, toHover) / (uHoverRadius * uHoverRadius)) + surge * 1.4 + transit * 0.5, 2.0);
  float heatCap = min(uHover.z + uPulseBoost * 1.4 + transit * 0.5, 2.0);
  float breath = 1.0 + uFlicker * 0.6 * wobble(vec2(t * 2.1, 7.0), 3u);
  float grow = uPresence;

  float edge = abs(base);
  vec2 halo = aura(pr, k);
  float ink = uInk;
  float bloom = (halo.x * 0.16 + halo.y * 0.08) * (1.0 - ink * 0.65) * uGlow * (1.0 + heat * 1.2);
  float body = smoothstep(0.75, -0.75, base) * uFill * (0.06 + 1.2 * min(halo.x, 1.0)) * (1.0 + heat * 0.5);
  light += uGlowColor * bloom * grow * grow;
  energy += bloom * grow * grow;

  float reachScale = mix(0.15, 1.0, grow) * (1.0 + heat * 0.9);
  float reach = (uUnit * uBend * 16.0 + uCrackle * 3.0) * (1.0 + heatCap * 0.9) + uThickness * 20.0 + 8.0;
  if (edge < reach && grow > 0.0) {
    float fade = smoothstep(reach, reach * 0.55, edge);
    vec2 q = pr / uUnit;
    float count = min(uStrands + heat * 2.5, 6.0);
    float limit = min(uStrands + heatCap * 2.5, 6.0);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      if (fi >= limit) break;
      float present = clamp(count - fi, 0.0, 1.0);
      if (present <= 0.0) continue;
      uint seed = uint(i) * 7u + 3u;
      mat2 jac;
      vec2 sway;
      float lead = i == 0 ? 1.0 : 0.0;
      vec2 warped = pr + wander(pr, t * (1.0 + fi * 0.19), seed, reachScale * mix(0.6 + fi * 0.2, 0.7, lead), jac, sway);
      float dw = shape(warped, k);
      vec2 slope = vec2(shape(warped + vec2(1.0, 0.0), k), shape(warped + vec2(0.0, 1.0), k)) - dw;
      float d = dw / max(length(slope + jac * slope), 0.3);
      float spread = shape(pr + sway, k);
      float swell = 0.5 + 0.5 * wobble(q * 0.06 + vec2(t * 0.9, fi * 5.1 - t * 0.6), seed + 8u);
      float w = uThickness * mix(0.5, 1.0, lead) * (0.5 + swell);
      float vis = mix(0.3 + 0.45 * smoothstep(-0.25, 0.2, wobble(q * 0.035 + vec2(t * 0.21, fi * 3.7), seed + 5u)), 1.0, lead);
      float spark = 1.0 - uFlicker * 0.3 * (0.5 + 0.5 * wobble(vec2(t * 6.0, fi * 2.3), seed + 6u));
      float weight = max(vis, heat * 0.85) * spark * fade * present * (0.7 + 0.6 * swell);
      vec2 g = glowShape(d, spread, w) * weight;
      float soft = mix(1.0, mix(0.5, 1.0, lead), ink);
      vec3 stroke = mix(uColor, uGlowColor, ink * (1.0 - lead) * 0.65);
      float haze = uGlow * (1.0 + heat) * (1.0 - ink * 0.7);
      light += stroke * g.x * soft + uGlowColor * g.y * haze;
      energy += g.x * soft + g.y * haze;
      hot += exp(-d * d / (w * w * 0.16)) * lead * weight;
    }
    light *= grow;
    energy *= grow;
  }

  for (int i = 0; i < ${N}; i++) addArc(pr, uArcEnds[i], uArcShape[i], t, light, energy, hot);

  float gain = uIntensity * breath * (1.0 + heat * 0.45) * (1.0 + uFlash * 0.3) * 1.4;
  float alpha = 1.0 - exp(-energy * gain);
  vec3 color = mix(1.0 - exp(-light * gain), alpha * light / max(energy, 1e-4), ink);
  color = mix(color, vec3(alpha), clamp(hot * grow, 0.0, 1.0) * ink * 0.85);
  float tint = (1.0 - exp(-body * gain * 1.2)) * grow * grow * (1.0 - ink * 0.82);
  color += uGlowColor * tint * (1.0 - alpha);
  alpha += tint * (1.0 - alpha);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  alpha = clamp(alpha + grain, 0.0, 1.0);
  fragColor = vec4(clamp(color + grain, 0.0, alpha), alpha);
}
`;function Le(u){const c=ue.useRef(null);return de(c,u,e=>{const n=new ge({dpr:ee(),alpha:!0,premultipliedAlpha:!0,antialias:!1}),o=n.gl;if(!n.isWebgl2)return te(o),null;const t=o;o.clearColor(0,0,0,0);const a=o.canvas;a.setAttribute("aria-hidden","true"),e.appendChild(a);const v=new ae(o,{image:new Float32Array([1e3]),width:1,height:1,internalFormat:t.R16F,format:t.RED,type:o.FLOAT,minFilter:o.LINEAR,magFilter:o.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1}),l=new ae(o,{image:new Float32Array([0,0]),width:1,height:1,internalFormat:t.RG16F,format:t.RG,type:o.FLOAT,minFilter:o.LINEAR,magFilter:o.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1}),i=new Array(N*4).fill(0),r=new Array(N*4).fill(0),b=new Array(J*4).fill(0),d={tFieldFrom:{value:v},tGlowFrom:{value:l},tFieldTo:{value:v},tGlowTo:{value:l},uMapFrom:{value:[0,0,1,0]},uSizeFrom:{value:[1,1,1,1]},uMapTo:{value:[0,0,1,0]},uSizeTo:{value:[1,1,1,1]},uMorph:{value:1},uResolution:{value:[1,1]},uUnit:{value:1},uTime:{value:0},uPresence:{value:0},uHover:{value:[0,0,0]},uHoverRadius:{value:F.cursorRadius},uPulses:{value:b},uPulseBoost:{value:0},uFlash:{value:0},uColor:{value:oe(F.color)},uGlowColor:{value:oe(F.glowColor)},uIntensity:{value:F.intensity},uGlow:{value:F.glow},uThickness:{value:F.thickness},uStrands:{value:F.strands},uBend:{value:F.bend},uCrackle:{value:F.crackle},uFlicker:{value:F.flicker},uFill:{value:F.fill},uInk:{value:0},uArcEnds:{value:i},uArcShape:{value:r}},A=new xe(o,{vertex:Fe,fragment:Ae,uniforms:d,depthTest:!1,depthWrite:!1}),j=new we(o,{geometry:new ye(o),program:A}),S=me(),h={x:0,y:0,over:!1},p={x:0,y:0,vx:0,vy:0,power:0},x=[],T=[];let g=null,R=null,I=S?1:0,P=0,$=1,D=1,q=!1;const H=new Image;H.decoding="async",H.onload=()=>{if(!q){try{g=ke(H)}catch{g=null}g&&(v.image=g.field,v.width=g.width,v.height=g.height,v.needsUpdate=!0,l.image=g.glow,l.width=g.glowWidth,l.height=g.glowHeight,l.needsUpdate=!0)}},H.src=ve(ce);const _=k=>{const w=Math.max(1e-4,Math.min($*F.scale/k.logoWidth,D*F.scale/k.logoHeight));return{fit:w,ox:$/2-(k.pad+k.logoWidth/2)*w,oy:D/2-(k.pad+k.logoHeight/2)*w,unit:Math.max(k.logoWidth,k.logoHeight)*w/100}},Y=k=>{const w=e.getBoundingClientRect();h.x=k.clientX-w.left,h.y=k.clientY-w.top,h.over=!0},O=k=>{Y(k),!S&&(T.push({x:h.x,y:h.y,born:performance.now()}),T.length>J&&T.shift(),R={x:h.x,y:h.y})},B=()=>{h.over=!1};return e.addEventListener("pointermove",Y),e.addEventListener("pointerdown",O),e.addEventListener("pointerleave",B),e.addEventListener("pointercancel",B),{canvas:a,resize(k,w){$=k,D=w,n.dpr=Math.min(ee(),Math.sqrt(Me/(k*w))),n.setSize(k,w),d.uResolution.value=[k,w]},drawn:()=>g!==null,draw(k,w){const z=g;if(!z)return;const s=performance.now();I=Math.min(1,I+w/1.4);const y=I*I*(3-2*I),f=_(z),E=h.over;E&&p.power<.01&&(p.x=h.x,p.y=h.y,p.vx=0,p.vy=0),p.vx+=((h.x-p.x)*120-p.vx*19)*w,p.vy+=((h.y-p.y)*120-p.vy*19)*w,p.x+=p.vx*w,p.y+=p.vy*w,p.power+=((E?1:0)-p.power)*(1-Math.exp(-w/(E?.3:.55))),P+=w*F.speed*(S?.2:1);for(let m=x.length-1;m>=0;m--)P-x[m].born>x[m].life&&x.splice(m,1);const W=m=>({x:(m.x-f.ox)/f.fit,y:(m.y-f.oy)/f.fit,radius:Math.max(1,F.cursorRadius)/f.fit});if(R&&F.arcs>0)for(let m=0;m<3&&x.length<N;m++){const M=K(z,P,W(R));M&&x.push(M)}if(R=null,!S&&y>.8&&x.length<N){const m=w*F.speed*F.arcs;if(Math.random()<m*6*p.power*F.cursorIntensity){const M=K(z,P,W(p));M&&x.push(M)}else if(Math.random()<m*2.2){const M=K(z,P,null);M&&x.push(M)}}for(let m=0;m<N;m++){const M=m*4,C=x[m];if(!C){r[M+1]=0;continue}const X=(P-C.born)/C.life;i[M]=f.ox+C.ax*f.fit,i[M+1]=f.oy+C.ay*f.fit,i[M+2]=f.ox+C.bx*f.fit,i[M+3]=f.oy+C.by*f.fit,r[M]=C.bow*f.fit,r[M+1]=Math.sin(Math.PI*Math.min(1,Math.max(0,X)))*y,r[M+2]=C.seed}let G=0,U=0;for(let m=T.length-1;m>=0;m--)(s-T[m].born)/1e3>2&&T.splice(m,1);for(let m=0;m<J;m++){const M=m*4,C=T[m];if(!C){b[M+3]=0;continue}const X=(s-C.born)/1e3;b[M]=C.x,b[M+1]=C.y,b[M+2]=X,b[M+3]=1,G=Math.max(G,Math.exp(-X*1.7)),U+=Math.exp(-X*7)}const Q=[f.ox,f.oy,f.fit,z.glowOffset],Z=[z.width,z.height,z.glowWidth,z.glowHeight];d.uMapTo.value=Q,d.uSizeTo.value=Z,d.uMapFrom.value=Q,d.uSizeFrom.value=Z,d.uUnit.value=f.unit,d.uTime.value=P,d.uPresence.value=y,d.uHover.value=[p.x,p.y,p.power*F.cursorIntensity],d.uPulseBoost.value=G,d.uFlash.value=U,d.uFlicker.value=S?0:F.flicker,n.render({scene:j})},dispose(){q=!0,H.onload=null,e.removeEventListener("pointermove",Y),e.removeEventListener("pointerdown",O),e.removeEventListener("pointerleave",B),e.removeEventListener("pointercancel",B),A.remove(),te(o)}}}),fe.jsx("div",{ref:c,className:"nb-fill nb-storm-live"})}export{Le as default};
