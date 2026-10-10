var S=e=>{throw TypeError(e)};var N=(e,r,t)=>r.has(e)||S("Cannot "+t);var E=(e,r,t)=>r.has(e)?S("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t);var T=(e,r,t)=>(N(e,r,"access private method"),t);import{q as P,v as L}from"./App-DYFk5p4c.js";import{p as M}from"./index-BfeaCYFr.js";import"./locate-BPNyf_JK.js";import"./MarineMap-D6yD6ymD.js";import"./cn-ew9kF1hN.js";const z=`
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_texcoord = a_texcoord;
}
`,U=`
precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_resolution;     /* lens size, CSS px */
uniform vec2 u_textureSize;    /* texture region size, CSS px */
uniform vec2 u_center;         /* lens centre in texture region coords, CSS px */
uniform float u_radius;        /* corner radius, CSS px */
uniform float u_magnify;       /* >1 magnifies the body of the lens */
uniform float u_blurRadius;    /* px */
uniform float u_edgeIntensity; /* px of outward displacement at the edge */
uniform float u_edgeDistance;  /* 1/px decay of the edge term */
uniform float u_rimIntensity;  /* px of outward displacement at the rim */
uniform float u_rimDistance;   /* 1/px decay of the rim term */
uniform float u_cornerBoost;   /* px of extra displacement in the corners */
uniform float u_rippleEffect;  /* px of perpendicular ripple at the rim */
uniform vec3 u_tint;
uniform float u_tintOpacity;
varying vec2 v_texcoord;

/* Signed distance from the rounded-rectangle edge, px; negative inside. */
float roundedRectDistance(vec2 coord, vec2 size, float radius) {
  vec2 center = size * 0.5;
  vec2 pixelCoord = coord * size;
  vec2 toCorner = abs(pixelCoord - center) - (center - radius);
  float outsideCorner = length(max(toCorner, 0.0));
  float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
  return outsideCorner + insideCorner - radius;
}

/* ORCA: the true outward normal of the rounded-rect SDF. The library used
   normalize(coord - centre), which on a wide, short lens points sideways
   even at the bottom edge, splaying everything near the rim into whiskers.
   Here a pixel near a straight edge displaces straight through it, and only
   the corner arcs blend the two axes. */
vec2 rectNormal(vec2 coord, vec2 size, float radius) {
  vec2 center = size * 0.5;
  vec2 p = coord * size - center;
  vec2 d = abs(p) - (center - radius);
  if (max(d.x, d.y) > 0.0) {
    vec2 c = max(d, 0.0);
    vec2 s = vec2(p.x >= 0.0 ? 1.0 : -1.0, p.y >= 0.0 ? 1.0 : -1.0);
    return normalize(c * s + vec2(0.0001));
  }
  if (d.x > d.y) return vec2(p.x >= 0.0 ? 1.0 : -1.0, 0.0);
  return vec2(0.0, p.y >= 0.0 ? 1.0 : -1.0);
}

void main() {
  vec2 coord = v_texcoord;
  vec2 lensPx = (coord - 0.5) * u_resolution;

  /* ORCA: magnification — the sample converges toward the lens centre. */
  vec2 pagePx = u_center + lensPx / u_magnify;

  float sd = roundedRectDistance(coord, u_resolution, u_radius);
  float distIn = max(-sd, 0.0);
  vec2 shapeNormal = rectNormal(coord, u_resolution, u_radius);

  float edge = exp(-distIn * u_edgeDistance) * u_edgeIntensity;
  float rim = exp(-distIn * u_rimDistance) * u_rimIntensity;

  float cornerX = min(coord.x, 1.0 - coord.x) * u_resolution.x;
  float cornerY = min(coord.y, 1.0 - coord.y) * u_resolution.y;
  float corner = exp(-max(cornerX, cornerY) * 0.3) * u_cornerBoost;

  vec2 displace = shapeNormal * (edge + rim + corner);
  vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
  displace += perpendicular * sin(distIn * 0.8) * u_rippleEffect * exp(-distIn * u_rimDistance);

  vec2 texCoord = (pagePx + displace) / u_textureSize;

  /* Small gaussian blur, px-stepped: anti-aliasing of the refracted sample. */
  vec4 color = vec4(0.0);
  float sigma = max(u_blurRadius * 0.5, 0.25);
  vec2 texel = 1.0 / u_textureSize;
  float totalWeight = 0.0;
  for (float i = -2.0; i <= 2.0; i += 1.0) {
    for (float j = -2.0; j <= 2.0; j += 1.0) {
      float d = length(vec2(i, j));
      if (d > 2.5) continue;
      float w = exp(-(d * d) / (2.0 * sigma * sigma));
      color += texture2D(u_image, texCoord + vec2(i, j) * texel * u_blurRadius) * w;
      totalWeight += w;
    }
  }
  color /= totalWeight;

  /* ORCA: one flat tint from a design token; no white haze. */
  color.rgb = mix(color.rgb, u_tint, u_tintOpacity);

  float mask = 1.0 - smoothstep(-0.75, 0.75, sd);
  gl_FragColor = vec4(color.rgb * mask, mask);
}
`;var y,b;class O{constructor(r){E(this,y);this.dpr=r.dpr||1,this.radius=r.radius??3,this.magnify=r.magnify??1.12,this.tint=r.tint??{r:1,g:1,b:1},this.tintOpacity=r.tintOpacity??0,this.controls=r.controls||{},this.textureSize=r.textureSize,this.disposed=!1,this.canvas=document.createElement("canvas");const t=this.canvas.getContext("webgl",{preserveDrawingBuffer:!0,antialias:!1})||this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer:!0});if(!t)throw new Error("WebGL not supported");this.gl=t;const i=T(this,y,b).call(this,z,U);if(!i)throw new Error("shader failed to build");this.program=i,t.useProgram(i),this.positionBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);const n=t.getAttribLocation(i,"a_position");t.enableVertexAttribArray(n),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0),this.texcoordBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.texcoordBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,1,1,1,0,0,0,0,1,1,1,0]),t.STATIC_DRAW);const o=t.getAttribLocation(i,"a_texcoord");t.enableVertexAttribArray(o),t.vertexAttribPointer(o,2,t.FLOAT,!1,0,0),this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,r.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const a=c=>t.getUniformLocation(i,c);this.u={resolution:a("u_resolution"),textureSize:a("u_textureSize"),center:a("u_center"),radius:a("u_radius"),magnify:a("u_magnify"),blurRadius:a("u_blurRadius"),edgeIntensity:a("u_edgeIntensity"),edgeDistance:a("u_edgeDistance"),rimIntensity:a("u_rimIntensity"),rimDistance:a("u_rimDistance"),cornerBoost:a("u_cornerBoost"),rippleEffect:a("u_rippleEffect"),tint:a("u_tint"),tintOpacity:a("u_tintOpacity")};const s=this.controls;t.uniform2f(this.u.textureSize,this.textureSize.width,this.textureSize.height),t.uniform1f(this.u.radius,this.radius),t.uniform1f(this.u.magnify,this.magnify),t.uniform1f(this.u.blurRadius,s.blurRadius??.8),t.uniform1f(this.u.edgeIntensity,s.edgeIntensity??5),t.uniform1f(this.u.edgeDistance,s.edgeDistance??.16),t.uniform1f(this.u.rimIntensity,s.rimIntensity??9),t.uniform1f(this.u.rimDistance,s.rimDistance??.55),t.uniform1f(this.u.cornerBoost,s.cornerBoost??2),t.uniform1f(this.u.rippleEffect,s.rippleEffect??0),t.uniform3f(this.u.tint,this.tint.r,this.tint.g,this.tint.b),t.uniform1f(this.u.tintOpacity,this.tintOpacity),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.uniform1i(a("u_image"),0),t.clearColor(0,0,0,0)}setView({width:r,height:t,centerX:i,centerY:n}){const o=this.gl;this.viewWidth=r,this.viewHeight=t,this.canvas.width=Math.max(1,Math.round(r*this.dpr)),this.canvas.height=Math.max(1,Math.round(t*this.dpr)),o.viewport(0,0,this.canvas.width,this.canvas.height),o.uniform2f(this.u.resolution,r,t),o.uniform2f(this.u.center,i,n)}render(){const r=this.gl;r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,6)}copyStill(){const r=document.createElement("canvas");r.width=this.canvas.width,r.height=this.canvas.height;const t=r.getContext("2d");if(!t)throw new Error("2d context unavailable");return t.drawImage(this.canvas,0,0),r}dispose(){if(this.disposed)return;this.disposed=!0;const r=this.gl;r.deleteTexture(this.texture),r.deleteBuffer(this.positionBuffer),r.deleteBuffer(this.texcoordBuffer),r.deleteProgram(this.program);const t=r.getExtension("WEBGL_lose_context");t&&t.loseContext(),this.gl=null,this.canvas=null}}y=new WeakSet,b=function(r,t){const i=this.gl,n=(c,l)=>{const f=i.createShader(c);return i.shaderSource(f,l),i.compileShader(f),i.getShaderParameter(f,i.COMPILE_STATUS)?f:null},o=n(i.VERTEX_SHADER,r),a=n(i.FRAGMENT_SHADER,t);if(!o||!a)return null;const s=i.createProgram();return i.attachShader(s,o),i.attachShader(s,a),i.linkProgram(s),i.getProgramParameter(s,i.LINK_STATUS)?s:null};const g=2;function m(e){const r=[];let t=0,i=0;for(let n=0;n<e.length;n++){const o=e[n];o==="("?t++:o===")"?t--:o===","&&t===0&&(r.push(e.slice(i,n).trim()),i=n+1)}return r.push(e.slice(i).trim()),r.filter(Boolean)}function k(e){const r=[];let t=0,i=0;for(let n=0;n<e.length;n++){const o=e[n];o==="("?t++:o===")"?t--:/\s/.test(o)&&t===0&&(n>i&&r.push(e.slice(i,n)),i=n+1)}return e.length>i&&r.push(e.slice(i)),r}function x(e,r){const t=e.trim(),i=t.match(/^calc\(\s*(-?[\d.]+)%\s*([+-])\s*(-?[\d.]+)px\s*\)$/);if(i){const n=parseFloat(i[1])/100*r,o=parseFloat(i[3]);return i[2]==="+"?n+o:n-o}return t.endsWith("%")?parseFloat(t)/100*r:parseFloat(t)||0}function R(e,r){const t=[];for(const i of e){const n=i.match(/^((?:rgba?|hsla?)\([^)]*\)|\w+)\s*(.*)$/);if(!n)continue;const o=n[1],a=n[2].trim()?n[2].trim().split(/\s+/):[];a.length===0&&t.push({color:o,at:NaN});for(const s of a)t.push({color:o,at:x(s,r)})}if(t.length===0)return t;Number.isNaN(t[0].at)&&(t[0].at=0),Number.isNaN(t[t.length-1].at)&&(t[t.length-1].at=r);for(let i=1;i<t.length-1;i++)if(Number.isNaN(t[i].at)){let n=i;for(;Number.isNaN(t[n].at);)n++;const o=(t[n].at-t[i-1].at)/(n-i+1);for(let a=i;a<n;a++)t[a].at=t[i-1].at+o*(a-i+1)}return t}function v(e){const r=e.match(/^rgba?\([^)]*,\s*([\d.]+)\s*\)$/);return r?parseFloat(r[1])===0:e==="transparent"}function C(e){const r=t=>{const i=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);return i?`${i[1]}, ${i[2]}, ${i[3]}`:null};return e.map((t,i)=>{if(!v(t.color))return t;const n=[...e.slice(i+1),...e.slice(0,i).reverse()].find(a=>!v(a.color))??t,o=r(n.color);return o?{...t,color:`rgba(${o}, 0)`}:t})}function X(e,r,t,i){const n=r.match(/^(-?[\d.]+)deg\s*,\s*([\s\S]*)$/);if(!n)return!1;const o=(parseFloat(n[1])%360+360)%360;if(o!==0&&o!==90&&o!==180&&o!==270)return!1;const a=o===90||o===270?t.w:t.h,s=R(m(n[2]),a);if(s.length<2)return!1;const c=s[s.length-1].at;if(!(c>0))return!1;const l=[];for(let u=0;u<s.length-1;u++){const d=s[u],h=s[u+1];d.color===h.color&&!v(d.color)&&h.at>d.at&&l.push({from:d.at,to:h.at,color:d.color})}if(!l.length)return!0;const f=o===90||o===270;for(let u=0;u*c<a+c;u++)for(const d of l){const h=u*c+d.from,p=u*c+d.to;if(!(h>a))if(e.fillStyle=d.color,f){const w=o===90?h:t.w-p;e.fillRect(w+t.ox,0,p-h,i.height)}else{const w=o===0?t.h-p:h;e.fillRect(0,w+t.oy,i.width,p-h)}}return!0}function G(e,r,t,i){const n=r.match(/^(-?[\d.]+)deg\s*,\s*([\s\S]*)$/);if(!n)return!1;const o=(parseFloat(n[1])%360+360)%360;if(o!==0&&o!==90&&o!==180&&o!==270)return!1;const a=o===90||o===270?t.w:t.h,s=C(R(m(n[2]),a));if(s.length<2)return!1;let c;o===0?c=e.createLinearGradient(0,t.h+t.oy,0,t.oy):o===180?c=e.createLinearGradient(0,t.oy,0,t.h+t.oy):o===90?c=e.createLinearGradient(t.ox,0,t.w+t.ox,0):c=e.createLinearGradient(t.w+t.ox,0,t.ox,0);for(const l of s)c.addColorStop(Math.min(1,Math.max(0,l.at/a)),l.color);return e.fillStyle=c,e.fillRect(0,0,i.width,i.height),!0}function W(e,r,t,i){const n=r.match(/^([\d.]+)%\s+([\d.]+)%\s+at\s+(-?[\d.]+)%\s+(-?[\d.]+)%\s*,\s*([\s\S]*)$/);if(!n)return!1;const o=parseFloat(n[1])/100*t.w,a=parseFloat(n[2])/100*t.h,s=parseFloat(n[3])/100*t.w+t.ox,c=parseFloat(n[4])/100*t.h+t.oy;if(!(o>0)||!(a>0))return!1;const l=C(R(m(n[5]),o));if(l.length<2)return!1;e.save(),e.translate(s,c),e.scale(1,a/o);const f=e.createRadialGradient(0,0,0,0,0,o);for(const u of l)f.addColorStop(Math.min(1,Math.max(0,u.at/o)),u.color);return e.fillStyle=f,e.fillRect(-s,-c*o/a,i.width+Math.abs(s)*2,(i.height+Math.abs(c)*2)*o/a),e.restore(),!0}const I=new Map;function $(e){let r=I.get(e);return r||(r=new Promise((t,i)=>{const n=new Image;n.onload=()=>t(n),n.onerror=()=>i(new Error("backdrop image failed")),n.src=e}),I.set(e,r)),r}async function Y(e,r,t,i){if(!r.startsWith("data:"))return!1;const n=await $(r),o=k(t.trim()),a=x(o[0]??"0%",i.w-n.width),s=x(o[1]??"0%",i.h-n.height);return e.drawImage(n,a+i.ox,s+i.oy),!0}async function _(e,r,t,i){const n=m(r.backgroundImage);if(n.length===1&&n[0]==="none")return;const o=m(r.backgroundPosition);for(let a=n.length-1;a>=0;a--){const s=n[a],c=s.match(/^url\(["']?([\s\S]*?)["']?\)$/);if(c){await Y(e,c[1],o[a%o.length]??"0% 0%",t);continue}const l=s.match(/^(repeating-linear-gradient|linear-gradient|radial-gradient)\(([\s\S]*)\)$/);l&&(l[1]==="repeating-linear-gradient"?X(e,l[2],t,i):l[1]==="linear-gradient"?G(e,l[2],t,i):W(e,l[2],t,i))}}function A(e){const r=document.createElement("canvas");r.width=Math.max(1,Math.round(e.width*g)),r.height=Math.max(1,Math.round(e.height*g));const t=r.getContext("2d");if(!t)throw new Error("2d context unavailable");return t.scale(g,g),{canvas:r,ctx:t}}async function j(e,r){const{canvas:t,ctx:i}=A(e),n=getComputedStyle(document.body);i.fillStyle=n.backgroundColor,i.fillRect(0,0,e.width,e.height);const o={w:window.innerWidth,h:window.innerHeight,ox:window.scrollX-e.x,oy:window.scrollY-e.y},a=document.querySelector(".sheet-ground");return a?await _(i,getComputedStyle(a),o,e):await _(i,n,o,e),await _(i,getComputedStyle(document.body,"::before"),o,e),r&&P(i,r.x-e.x,r.baseY-e.y,r.width),{canvas:t,width:e.width,height:e.height}}function V(e,r,t){const{canvas:i,ctx:n}=A(e);return n.fillStyle=getComputedStyle(r).backgroundColor,n.fillRect(0,0,e.width,e.height),L(n,t.x-e.x,t.y-e.y,t.width),{canvas:i,width:e.width,height:e.height}}function H(){const e=parseInt(M[50].slice(1),16);return{r:(e>>16&255)/255,g:(e>>8&255)/255,b:(e&255)/255}}const q=.04;function D(e,r){let t=1/0,i=1/0,n=-1/0,o=-1/0;for(const a of e)t=Math.min(t,a.x),i=Math.min(i,a.y),n=Math.max(n,a.x+a.width),o=Math.max(o,a.y+a.height);return{x:t-r,y:i-r,width:n-t+r*2,height:o-i+r*2}}function B(e,r,t,i,n){const o=new O({texture:e.canvas,textureSize:{width:e.width,height:e.height},dpr:n,radius:i.radius,magnify:i.magnify,tint:H(),tintOpacity:q,controls:i.controls});try{return t.map(a=>(o.setView({width:a.width,height:a.height,centerX:a.x+a.width/2-r.x,centerY:a.y+a.height/2-r.y}),o.render(),o.copyStill()))}finally{o.dispose()}}function F(){return new Promise(e=>{const r=window;r.requestIdleCallback?r.requestIdleCallback(()=>e(),{timeout:300}):window.setTimeout(e,0)})}async function rt(e){const r=performance.now(),t=D(e.lenses,24),i=V(t,e.sheetEl,e.strip);return await F(),{stills:B(i,t,e.lenses,{radius:3,magnify:1.18,controls:{blurRadius:.7,edgeIntensity:1.1,edgeDistance:.3,rimIntensity:3,rimDistance:.85,cornerBoost:.5}},e.dpr),backdrop:i.canvas,ms:performance.now()-r}}async function it(e){const r=performance.now(),t=D([e.lens],56),i=await j(t,e.rule);return await F(),{stills:B(i,t,[e.lens],{radius:2,magnify:1.12,controls:{blurRadius:.7,edgeIntensity:1,edgeDistance:.3,rimIntensity:2.6,rimDistance:.8,cornerBoost:.5}},e.dpr),backdrop:i.canvas,ms:performance.now()-r}}export{it as armOpen,rt as armTabs};
