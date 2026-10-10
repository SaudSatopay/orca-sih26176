import{r as se,j as fe,q as ae}from"./index-DjJDsFw2.js";import{u as ve,r as Z,h as $,p as pe,b as he,n as de}from"./nightGl-DJM6f3HT.js";import{R as me,T as ge,M as N,P as _}from"./Triangle-DIsCpGZW.js";import{T as xe}from"./Texture-BkQWYNP2.js";import{R as ee}from"./RenderTarget-BJHc8Cd7.js";const l={pattern:"dot",wave:"swell",color:ae[500],spacing:9,markSize:.72,depth:.5,light:0,shine:.9,contrast:1.15,speed:.45,scale:1.2,direction:100,opacity:.34,fade:"center",fadeSize:.55,cursorSize:60,cursorStrength:.5},ye={dot:0,square:1,plus:2,line:3},we={silk:0,swell:1,ripple:2},Se={none:0,edges:1,center:2,bottom:3,top:4},Fe=520,te=8,be=60,ke=45e5,r=(R,F,w)=>Math.min(Math.max(R,F),w),U=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Ae=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uSize;
uniform float uDpr;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform int uWave;
uniform float uTime;
uniform float uUnit;
uniform vec2 uHeading;
uniform float uAmp;
uniform float uDepth;
uniform vec3 uLight;
uniform float uShine;
uniform float uContrast;
uniform float uInk;
uniform float uOpacity;
uniform int uFade;
uniform float uFadeSize;
uniform float uAppear;
uniform sampler2D tRipple;
uniform float uRipple;
out vec4 fragColor;

const float FOLDS = 5.5;

uvec3 scramble(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

vec3 lattice(vec3 corner) {
  uvec3 h = scramble(uvec3(ivec3(corner) + 4096));
  return vec3(h & 65535u) / 32767.5 - 1.0;
}

float gradientNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(lattice(i), f);
  float n100 = dot(lattice(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(lattice(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(lattice(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(lattice(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(lattice(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(lattice(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(lattice(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
}

vec2 turn(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

float surface(vec2 p, float t) {
  if (uWave == 0) {
    vec2 side = vec2(-uHeading.y, uHeading.x);
    float u = dot(p, uHeading);
    float v = dot(p, side);
    float bend = gradientNoise(vec3(v * 0.85, u * 0.3, t * 0.05)) * 1.7 + 0.4 * sin(v * 1.6 + t * 0.2);
    float phase = u * FOLDS + bend - t * 0.45;
    float swell = 0.6 + 0.4 * gradientNoise(vec3(u * 0.55 + 3.0, v * 0.45, t * 0.04));
    float fold = sin(phase) + 0.32 * sin(2.0 * phase + 1.3);
    float ripple = 0.16 * sin(u * FOLDS * 2.5 + bend * 1.9 - t * 0.9 + 2.1);
    return (fold + ripple) * swell;
  }
  if (uWave == 1) {
    float bend = gradientNoise(vec3(p * 0.6, t * 0.05)) * 0.6;
    float phase = dot(p, uHeading) * 15.0 + bend * 2.2 - t * 1.4;
    float swell = sin(phase) + 0.3 * sin(2.0 * phase - 0.8);
    float roll = 0.75 + 0.25 * gradientNoise(vec3(p * 0.9 + 11.0, t * 0.05));
    return 0.8 * swell * roll;
  }
  float r = length(p + uHeading * 1.2);
  float bend = gradientNoise(vec3(p * 1.2, t * 0.05)) * 0.1;
  return sin((r + bend) * 9.0 - t * 1.8) * (0.45 + 0.55 * exp(-(r - 0.6) * 0.8));
}

float heightAt(vec2 css) {
  float h = surface((css - 0.5 * uSize) / uUnit, uTime) * uAmp;
  if (uRipple > 0.0) h += texture(tRipple, css / uSize).r * uRipple;
  return h;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 center = uOrigin + (cell + 0.5) * uPitch;
  vec2 css = center / uDpr;
  vec2 uv = css / uSize;
  float e = max(uPitch.y / uDpr, 4.0);
  float h = heightAt(css);
  float hx = (heightAt(css + vec2(e, 0.0)) - heightAt(css - vec2(e, 0.0))) / (2.0 * e);
  float hy = (heightAt(css + vec2(0.0, e)) - heightAt(css - vec2(0.0, e))) / (2.0 * e);
  vec2 grad = vec2(hx, hy) * uUnit * uDepth * 0.4;
  vec3 n = normalize(vec3(-grad, 1.0));

  float diffuse = clamp(dot(n, uLight), 0.0, 1.0);
  vec3 halfway = normalize(uLight + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(n, halfway), 0.0, 1.0), 160.0) * uShine * 1.15;
  float hollow = 0.7 + 0.3 * clamp(h * 0.5 + 0.5, 0.0, 1.0);
  float tone = clamp(diffuse * hollow * 0.78 + spec, 0.0, 1.0);
  tone = clamp((tone - 0.42) * uContrast + 0.42, 0.0, 1.0);

  float level = uInk > 0.5 ? pow(clamp(1.0 - tone / 0.46, 0.0, 1.0), 2.4) * 0.72 : pow(tone, 2.2);
  float emphasis = uInk > 0.5 ? smoothstep(0.55, 0.95, level) : clamp(spec * 1.6, 0.0, 1.0);

  float fade = 1.0;
  vec2 c = uv * 2.0 - 1.0;
  if (uFade == 1) {
    fade = 1.0 - smoothstep(1.0 - uFadeSize, 1.18, length(c));
  } else if (uFade == 2) {
    fade = mix(0.05, 1.0, smoothstep(0.08, 0.08 + uFadeSize, length(c * vec2(1.0, 1.35))));
  } else if (uFade == 3) {
    fade = smoothstep(0.0, uFadeSize, uv.y);
  } else if (uFade == 4) {
    fade = smoothstep(0.0, uFadeSize, 1.0 - uv.y);
  }

  float reach = length(css - 0.5 * uSize) / max(0.5 * length(uSize), 1.0);
  float appear = smoothstep(reach - 0.05, reach + 0.3, uAppear * 1.35);

  float alpha = uOpacity * fade * appear * (0.22 + 0.78 * level);
  float lift = clamp(h * uDepth * 0.42, -0.48, 0.48);
  fragColor = vec4(level, alpha, emphasis, lift + 0.5);
}
`,ze=`#version 300 es
precision highp float;
uniform sampler2D tState;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uImpulse;
uniform float uDamping;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec2 state = texture(tState, uv).rg;
  float left = texture(tState, uv - vec2(uTexel.x, 0.0)).r;
  float right = texture(tState, uv + vec2(uTexel.x, 0.0)).r;
  float below = texture(tState, uv - vec2(0.0, uTexel.y)).r;
  float above = texture(tState, uv + vec2(0.0, uTexel.y)).r;
  float next = ((left + right + below + above) * 0.5 - state.g) * uDamping;
  vec2 p = uv * uSize;
  vec2 segment = uTo - uFrom;
  float along = clamp(dot(p - uFrom, segment) / max(dot(segment, segment), 1e-4), 0.0, 1.0);
  float d = length(p - uFrom - segment * along) / uRadius;
  next -= uImpulse * exp(-d * d * 2.0);
  fragColor = vec4(next, state.r, 0.0, 1.0);
}
`,Te=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D tField;
uniform sampler2D tAtlas;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform vec2 uGrid;
uniform int uPattern;
uniform float uMarkSize;
uniform float uStroke;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec4 uBackground;
uniform vec3 uAtlas;
out vec4 fragColor;

float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float coverage(vec2 local, float level) {
  float span = uPitch.y * uMarkSize;
  float area = max(sqrt(level), 0.14);
  if (uPattern == 0) {
    return clamp(0.5 - (length(local) - 0.5 * span * area), 0.0, 1.0);
  }
  if (uPattern == 1) {
    float extent = 0.5 * span * area;
    return clamp(0.5 - box(local, vec2(extent), extent * 0.3), 0.0, 1.0);
  }
  if (uPattern == 2) {
    float arm = 0.5 * span * mix(0.3, 1.0, level);
    float width = 0.5 * uStroke;
    return clamp(0.5 - min(box(local, vec2(arm, width), width), box(local, vec2(width, arm), width)), 0.0, 1.0);
  }
  if (uAtlas.z < 1.0) return 0.0;
  vec2 g = local / span + 0.5;
  if (g.x < 0.0 || g.y < 0.0 || g.x > 1.0 || g.y > 1.0) return 0.0;
  float index = min(floor(level * uAtlas.z), uAtlas.z - 1.0);
  vec2 tile = vec2(mod(index, uAtlas.x), floor(index / uAtlas.x));
  vec2 atlasUv = (tile + vec2(g.x, 1.0 - g.y)) / uAtlas.xy;
  vec2 texel = 1.0 / (span * uAtlas.xy);
  return textureGrad(tAtlas, atlasUv, vec2(texel.x, 0.0), vec2(0.0, texel.y)).a;
}

vec4 lineInk(vec2 rel) {
  float fx = rel.x / uPitch.x - 0.5;
  float c0 = clamp(floor(fx), 0.0, uGrid.x - 1.0);
  float c1 = min(c0 + 1.0, uGrid.x - 1.0);
  float t = clamp(fx - c0, 0.0, 1.0);
  float row = floor(rel.y / uPitch.y);
  vec4 ink = vec4(0.0);
  for (int k = -1; k <= 1; k++) {
    float cy = row + float(k);
    if (cy < 0.0 || cy >= uGrid.y) continue;
    vec4 a = texelFetch(tField, ivec2(int(c0), int(cy)), 0);
    vec4 b = texelFetch(tField, ivec2(int(c1), int(cy)), 0);
    vec4 f = mix(a, b, t);
    if (f.g < 0.002) continue;
    float y = (cy + 0.5 + f.a - 0.5) * uPitch.y;
    float slope = (b.a - a.a) * uPitch.y / uPitch.x;
    float thickness = max(uStroke, uPitch.y * uMarkSize * f.r);
    float d = abs(rel.y - y) / sqrt(1.0 + slope * slope) - 0.5 * thickness;
    float alpha = clamp(0.5 - d, 0.0, 1.0) * f.g;
    if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
  }
  return ink;
}

void main() {
  vec2 rel = gl_FragCoord.xy - uOrigin;
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 ink = vec4(0.0);
  if (uPattern == 3) {
    ink = lineInk(rel);
  } else {
    float cx = floor(rel.x / uPitch.x);
    float row = floor(rel.y / uPitch.y);
    if (cx >= 0.0 && cx < uGrid.x) {
      for (int k = -1; k <= 1; k++) {
        float cy = row + float(k);
        if (cy < 0.0 || cy >= uGrid.y) continue;
        vec4 f = texelFetch(tField, ivec2(int(cx), int(cy)), 0);
        if (f.g < 0.002) continue;
        vec2 center = (vec2(cx, cy) + 0.5) * uPitch + vec2(0.0, (f.a - 0.5) * uPitch.y);
        float alpha = coverage(rel - center, f.r) * f.g;
        if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
      }
    }
  }
  fragColor = ink + background * (1.0 - ink.a);
}
`;function Ce(R){const F=se.useRef(null);return ve(F,R,(w,E)=>{const u=new me({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),i=u.gl;if(!u.isWebgl2)return Z(i),null;const G=i;i.clearColor(0,0,0,0);const L=i.canvas;L.setAttribute("aria-hidden","true"),w.appendChild(L);const C=new ge(i),b=new xe(i),ie=!!i.getExtension("EXT_color_buffer_float"),h=t=>{i.deleteFramebuffer(t.buffer),i.deleteTexture(t.texture.texture)},W=(t,a)=>new ee(i,{width:t,height:a,depth:!1,minFilter:i.NEAREST,magFilter:i.NEAREST}),B=(t,a)=>new ee(i,{width:t,height:a,depth:!1,type:G.HALF_FLOAT,format:i.RGBA,internalFormat:G.RGBA16F,minFilter:i.LINEAR,magFilter:i.LINEAR});let f=W(1,1),o=null;const n={uSize:{value:[1,1]},uDpr:{value:1},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uWave:{value:we[l.wave]},uTime:{value:0},uUnit:{value:Fe*r(l.scale,.2,5)},uHeading:{value:[1,0]},uAmp:{value:0},uDepth:{value:r(l.depth,0,1.5)},uLight:{value:[0,0,1]},uShine:{value:r(l.shine,0,2)},uContrast:{value:r(l.contrast,.3,3)},uInk:{value:1},uOpacity:{value:r(l.opacity,0,1)},uFade:{value:Se[l.fade]},uFadeSize:{value:r(l.fadeSize,.05,1)},uAppear:{value:0},tRipple:{value:b},uRipple:{value:0}},le=new N(i,{geometry:C,program:new _(i,{vertex:U,fragment:Ae,uniforms:n,depthTest:!1,depthWrite:!1})}),v={tState:{value:b},uTexel:{value:[1,1]},uSize:{value:[1,1]},uFrom:{value:[0,0]},uTo:{value:[0,0]},uRadius:{value:r(l.cursorSize,8,400)},uImpulse:{value:0},uDamping:{value:.975}},oe=new N(i,{geometry:C,program:new _(i,{vertex:U,fragment:ze,uniforms:v,depthTest:!1,depthWrite:!1})}),D=ye[l.pattern],d={tField:{value:f.texture},tAtlas:{value:b},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uGrid:{value:[1,1]},uPattern:{value:D},uMarkSize:{value:r(l.markSize,.05,1)},uStroke:{value:2},uColor:{value:$(l.color)},uAccent:{value:$(ae[700])},uBackground:{value:[0,0,0,0]},uAtlas:{value:[1,1,0]}},re=new N(i,{geometry:C,program:new _(i,{vertex:U,fragment:Te,uniforms:d,depthTest:!1,depthWrite:!1})}),I=pe(),H=l.direction*Math.PI/180,X=(l.direction+180+r(l.light,-90,90))*Math.PI/180;n.uHeading.value=[Math.cos(H),Math.sin(H)],n.uLight.value=[Math.cos(X)*.78,Math.sin(X)*.78,.62];let S=1,m=1,q=0,Y=0,g=!1,k=0,O=!1;const e={x:0,y:0,inside:!1,placed:!1,lastX:0,lastY:0,burst:0},ne=()=>{if(!ie)return;const t=r(Math.ceil(S/te),4,512),a=r(Math.ceil(m/te),4,512);o&&o.width===t&&o.height===a||(o&&(h(o.read),h(o.write)),o={width:t,height:a,read:B(t,a),write:B(t,a)},g=!1)},ue=()=>{o&&([o.read,o.write].forEach(t=>{u.bindFramebuffer(t),i.viewport(0,0,t.width,t.height),i.clear(i.COLOR_BUFFER_BIT)}),u.bindFramebuffer())},ce=(t,a)=>{k=Math.min(k+a*be,4);const c=r(l.cursorStrength,0,1),s=Math.hypot(e.x-e.lastX,e.y-e.lastY);let y=(e.inside?Math.min(s/14,1)*.35*c:0)+e.burst*c;for(e.burst=0,v.uTexel.value=[1/t.width,1/t.height],v.uSize.value=[S,m],v.uFrom.value=[e.lastX,m-e.lastY],v.uTo.value=[e.x,m-e.y];k>=1;){k-=1,v.tState.value=t.read.texture,v.uImpulse.value=y,u.render({scene:oe,target:t.write,clear:!1});const A=t.read;t.read=t.write,t.write=A,y=0}e.lastX=e.x,e.lastY=e.y},x=he(w),V=t=>{const a=w.getBoundingClientRect(),c=t.clientX-a.left,s=t.clientY-a.top;return{x:c,y:s,inside:c>=0&&s>=0&&c<=a.width&&s<=a.height}},j=t=>{const a=V(t);e.x=a.x,e.y=a.y,a.inside!==e.inside&&(e.placed=!1),e.inside=a.inside,a.inside&&E()},J=t=>{const a=V(t);a.inside&&(e.x=a.x,e.y=a.y,e.inside||(e.lastX=a.x,e.lastY=a.y),e.burst=1.2,E())},K=()=>{e.inside=!1,e.placed=!1,E()};return x.addEventListener("pointermove",j,{passive:!0}),x.addEventListener("pointerdown",J,{passive:!0}),x.addEventListener("pointerleave",K),{canvas:L,resize(t,a){S=t,m=a,u.dpr=Math.min(de(),Math.sqrt(ke/(t*a))),u.setSize(t,a),ne()},moving:()=>!I||O,draw(t,a){const c=performance.now();I||(q+=a*l.speed);const s=!I&&!!o&&l.cursorStrength>0;s&&e.inside&&!e.placed&&(e.lastX=e.x,e.lastY=e.y,e.placed=!0),s&&(e.inside||e.burst>0)&&(Y=c+5e3),O=s&&c<Y,O&&o?(ce(o,a),g=!0):g&&(ue(),g=!1);const y=i.canvas.width,A=i.canvas.height,z=y/S,p=Math.max(4,Math.round(r(l.spacing,4,120)*z)),T=D===3?Math.max(2,Math.round(p/4)):p,P=Math.min(4096,Math.ceil(y/T)+1),M=Math.min(4096,Math.ceil(A/p)+2),Q=[Math.floor((y-P*T)/2),Math.floor((A-M*p)/2)];(f.width!==P||f.height!==M)&&(h(f),f=W(P,M),d.tField.value=f.texture),n.uSize.value=[S,m],n.uDpr.value=z,n.uOrigin.value=Q,n.uPitch.value=[T,p],n.uTime.value=q,n.uAmp.value=1,n.uAppear.value=1,n.tRipple.value=o&&g?o.read.texture:b,n.uRipple.value=g?.32:0,u.render({scene:le,target:f}),d.uOrigin.value=Q,d.uPitch.value=[T,p],d.uGrid.value=[P,M],d.uStroke.value=D===3?.9*z:Math.max(1.1*z,p*.08),u.render({scene:re})},dispose(){x.removeEventListener("pointermove",j),x.removeEventListener("pointerdown",J),x.removeEventListener("pointerleave",K),o&&(h(o.read),h(o.write)),h(f),Z(i)}}}),fe.jsx("div",{ref:F,className:"nb-fill"})}export{Ce as default};
