import{r as de,j as ge,q as fe}from"./index-CEvtErrO.js";import{u as me,r as se,h as ne,p as xe,b as Ee,n as Te}from"./nightGl-C0M1HIUh.js";import{R as Re,T as be,M as q,P as V}from"./Triangle-CvCRX4L3.js";import{T as J}from"./Texture-BkQWYNP2.js";class ue{constructor(a,{width:s=a.canvas.width,height:n=a.canvas.height,target:c=a.FRAMEBUFFER,color:r=1,depth:x=!0,stencil:g=!1,depthTexture:N=!1,wrapS:R=a.CLAMP_TO_EDGE,wrapT:U=a.CLAMP_TO_EDGE,wrapR:m=a.CLAMP_TO_EDGE,minFilter:D=a.LINEAR,magFilter:k=D,type:h=a.UNSIGNED_BYTE,format:l=a.RGBA,internalFormat:f=l,unpackAlignment:H,premultiplyAlpha:p}={}){this.gl=a,this.width=s,this.height=n,this.depth=x,this.stencil=g,this.buffer=this.gl.createFramebuffer(),this.target=c,this.gl.renderer.bindFramebuffer(this),this.textures=[];const w=[];for(let v=0;v<r;v++)this.textures.push(new J(a,{width:s,height:n,wrapS:R,wrapT:U,wrapR:m,minFilter:D,magFilter:k,type:h,format:l,internalFormat:f,unpackAlignment:H,premultiplyAlpha:p,flipY:!1,generateMipmaps:!1})),this.textures[v].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+v,this.gl.TEXTURE_2D,this.textures[v].texture,0),w.push(this.gl.COLOR_ATTACHMENT0+v);w.length>1&&this.gl.renderer.drawBuffers(w),this.texture=this.textures[0],N&&(this.gl.renderer.isWebgl2||this.gl.renderer.getExtension("WEBGL_depth_texture"))?(this.depthTexture=new J(a,{width:s,height:n,minFilter:this.gl.NEAREST,magFilter:this.gl.NEAREST,format:this.stencil?this.gl.DEPTH_STENCIL:this.gl.DEPTH_COMPONENT,internalFormat:a.renderer.isWebgl2?this.stencil?this.gl.DEPTH24_STENCIL8:this.gl.DEPTH_COMPONENT16:this.gl.DEPTH_COMPONENT,type:this.stencil?this.gl.UNSIGNED_INT_24_8:this.gl.UNSIGNED_INT}),this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.stencil?this.gl.DEPTH_STENCIL_ATTACHMENT:this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(x&&!g&&(this.depthBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,s,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this.depthBuffer)),g&&!x&&(this.stencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,s,n),this.gl.framebufferRenderbuffer(this.target,this.gl.STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.stencilBuffer)),x&&g&&(this.depthStencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,s,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.depthStencilBuffer))),this.gl.renderer.bindFramebuffer({target:this.target})}setSize(a,s){if(!(this.width===a&&this.height===s)){this.width=a,this.height=s,this.gl.renderer.bindFramebuffer(this);for(let n=0;n<this.textures.length;n++)this.textures[n].width=a,this.textures[n].height=s,this.textures[n].needsUpdate=!0,this.textures[n].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+n,this.gl.TEXTURE_2D,this.textures[n].texture,0);this.depthTexture?(this.depthTexture.width=a,this.depthTexture.height=s,this.depthTexture.needsUpdate=!0,this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(this.depthBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,a,s)),this.stencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,a,s)),this.depthStencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,a,s))),this.gl.renderer.bindFramebuffer({target:this.target})}}}const u={pattern:"dot",wave:"swell",color:fe[500],spacing:9,markSize:.72,depth:.5,light:0,shine:.9,contrast:1.15,speed:.45,scale:1.2,direction:100,opacity:.34,fade:"center",fadeSize:.55,cursorSize:60,cursorStrength:.5},Fe={dot:0,square:1,plus:2,line:3},Se={silk:0,swell:1,ripple:2},ye={none:0,edges:1,center:2,bottom:3,top:4},Ae=520,oe=8,Ne=60,De=45e5,we=2,o=(C,a,s)=>Math.min(Math.max(C,a),s),j=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Pe=`#version 300 es
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
`,Me=`#version 300 es
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
`,_e=`#version 300 es
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
`;function ze(C){const a=de.useRef(null);return me(a,C,(s,n)=>{const c=new Re({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),r=c.gl;if(!c.isWebgl2)return se(r),null;const x=r;r.clearColor(0,0,0,0);const g=r.canvas;g.setAttribute("aria-hidden","true"),s.appendChild(g);const N=new be(r),R=new J(r),U=!!r.getExtension("EXT_color_buffer_float"),m=t=>{r.deleteFramebuffer(t.buffer),r.deleteTexture(t.texture.texture)},D=(t,i)=>new ue(r,{width:t,height:i,depth:!1,minFilter:r.NEAREST,magFilter:r.NEAREST}),k=(t,i)=>new ue(r,{width:t,height:i,depth:!1,type:x.HALF_FLOAT,format:r.RGBA,internalFormat:x.RGBA16F,minFilter:r.LINEAR,magFilter:r.LINEAR});let h=D(1,1),l=null;const f={uSize:{value:[1,1]},uDpr:{value:1},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uWave:{value:Se[u.wave]},uTime:{value:0},uUnit:{value:Ae*o(u.scale,.2,5)},uHeading:{value:[1,0]},uAmp:{value:0},uDepth:{value:o(u.depth,0,1.5)},uLight:{value:[0,0,1]},uShine:{value:o(u.shine,0,2)},uContrast:{value:o(u.contrast,.3,3)},uInk:{value:1},uOpacity:{value:o(u.opacity,0,1)},uFade:{value:ye[u.fade]},uFadeSize:{value:o(u.fadeSize,.05,1)},uAppear:{value:0},tRipple:{value:R},uRipple:{value:0}},H=new q(r,{geometry:N,program:new V(r,{vertex:j,fragment:Pe,uniforms:f,depthTest:!1,depthWrite:!1})}),p={tState:{value:R},uTexel:{value:[1,1]},uSize:{value:[1,1]},uFrom:{value:[0,0]},uTo:{value:[0,0]},uRadius:{value:o(u.cursorSize,8,400)},uImpulse:{value:0},uDamping:{value:.975}},w=new q(r,{geometry:N,program:new V(r,{vertex:j,fragment:Me,uniforms:p,depthTest:!1,depthWrite:!1})}),v=Fe[u.pattern],b={tField:{value:h.texture},tAtlas:{value:R},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uGrid:{value:[1,1]},uPattern:{value:v},uMarkSize:{value:o(u.markSize,.05,1)},uStroke:{value:2},uColor:{value:ne(u.color)},uAccent:{value:ne(fe[700])},uBackground:{value:[0,0,0,0]},uAtlas:{value:[1,1,0]}},ce=new q(r,{geometry:N,program:new V(r,{vertex:j,fragment:_e,uniforms:b,depthTest:!1,depthWrite:!1})}),P=xe(),K=u.direction*Math.PI/180,Q=(u.direction+180+o(u.light,-90,90))*Math.PI/180;f.uHeading.value=[Math.cos(K),Math.sin(K)],f.uLight.value=[Math.cos(Q)*.78,Math.sin(Q)*.78,.62];let M=1,F=1,Z=0,_=P?1:0,$=0,S=!1,B=0,G=!1;const e={x:0,y:0,inside:!1,placed:!1,lastX:0,lastY:0,burst:0},he=()=>{if(!U)return;const t=o(Math.ceil(M/oe),4,512),i=o(Math.ceil(F/oe),4,512);l&&l.width===t&&l.height===i||(l&&(m(l.read),m(l.write)),l={width:t,height:i,read:k(t,i),write:k(t,i)},S=!1)},ve=()=>{l&&([l.read,l.write].forEach(t=>{c.bindFramebuffer(t),r.viewport(0,0,t.width,t.height),r.clear(r.COLOR_BUFFER_BIT)}),c.bindFramebuffer())},pe=(t,i)=>{B=Math.min(B+i*Ne,4);const d=o(u.cursorStrength,0,1),E=Math.hypot(e.x-e.lastX,e.y-e.lastY);let A=(e.inside?Math.min(E/14,1)*.35*d:0)+e.burst*d;for(e.burst=0,p.uTexel.value=[1/t.width,1/t.height],p.uSize.value=[M,F],p.uFrom.value=[e.lastX,F-e.lastY],p.uTo.value=[e.x,F-e.y];B>=1;){B-=1,p.tState.value=t.read.texture,p.uImpulse.value=A,c.render({scene:w,target:t.write,clear:!1});const X=t.read;t.read=t.write,t.write=X,A=0}e.lastX=e.x,e.lastY=e.y},y=Ee(s),ee=t=>{const i=s.getBoundingClientRect(),d=t.clientX-i.left,E=t.clientY-i.top;return{x:d,y:E,inside:d>=0&&E>=0&&d<=i.width&&E<=i.height}},te=t=>{const i=ee(t);e.x=i.x,e.y=i.y,i.inside!==e.inside&&(e.placed=!1),e.inside=i.inside,i.inside&&n()},ie=t=>{const i=ee(t);i.inside&&(e.x=i.x,e.y=i.y,e.inside||(e.lastX=i.x,e.lastY=i.y),e.burst=1.2,n())},re=()=>{e.inside=!1,e.placed=!1,n()};return y.addEventListener("pointermove",te,{passive:!0}),y.addEventListener("pointerdown",ie,{passive:!0}),y.addEventListener("pointerleave",re),{canvas:g,resize(t,i){M=t,F=i,c.dpr=Math.min(Te(),Math.sqrt(De/(t*i))),c.setSize(t,i),he()},moving:()=>!P||_<1||G,draw(t,i){const d=performance.now();P||(Z+=i*u.speed),_=P?1:Math.min(1,_+i/we);const E=1-Math.pow(1-o(_/.75,0,1),3),A=o((_-.1)/.9,0,1),X=A*A*(3-2*A),W=!P&&!!l&&u.cursorStrength>0;W&&e.inside&&!e.placed&&(e.lastX=e.x,e.lastY=e.y,e.placed=!0),W&&(e.inside||e.burst>0)&&($=d+5e3),G=W&&d<$,G&&l?(pe(l,i),S=!0):S&&(ve(),S=!1);const Y=r.canvas.width,ae=r.canvas.height,L=Y/M,T=Math.max(4,Math.round(o(u.spacing,4,120)*L)),z=v===3?Math.max(2,Math.round(T/4)):T,O=Math.min(4096,Math.ceil(Y/z)+1),I=Math.min(4096,Math.ceil(ae/T)+2),le=[Math.floor((Y-O*z)/2),Math.floor((ae-I*T)/2)];(h.width!==O||h.height!==I)&&(m(h),h=D(O,I),b.tField.value=h.texture),f.uSize.value=[M,F],f.uDpr.value=L,f.uOrigin.value=le,f.uPitch.value=[z,T],f.uTime.value=Z,f.uAmp.value=X,f.uAppear.value=E,f.tRipple.value=l&&S?l.read.texture:R,f.uRipple.value=S?.32:0,c.render({scene:H,target:h}),b.uOrigin.value=le,b.uPitch.value=[z,T],b.uGrid.value=[O,I],b.uStroke.value=v===3?.9*L:Math.max(1.1*L,T*.08),c.render({scene:ce})},dispose(){y.removeEventListener("pointermove",te),y.removeEventListener("pointerdown",ie),y.removeEventListener("pointerleave",re),l&&(m(l.read),m(l.write)),m(h),se(r)}}}),ge.jsx("div",{ref:a,className:"nb-fill"})}export{ze as default};
