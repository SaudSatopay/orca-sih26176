var Re=Object.defineProperty;var ge=(n,c,s)=>c in n?Re(n,c,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[c]=s;var re=(n,c,s)=>ge(n,typeof c!="symbol"?c+"":c,s);import{h as le,q as oe,p as fe,r as $,j as ye}from"./index-BrVKMo8h.js";import{n as _e}from"./App-BuYQlpw9.js";import"./locate-VNaoAq9T.js";import"./MarineMap-Bh6iazYk.js";import"./cn-ew9kF1hN.js";const v={simResolution:128,dyeLongSide:1024,dprCap:1.5,densityDissipation:2,velocityDissipation:1.4,pressure:.1,pressureIterations:20,curl:3,splatRadius:.12,splatForce:2600,splatAmount:.22,gain:3.5,edge:24,maxLoss:.09,openLoss:.32,maskScale:8,maskBlur:12,maskPad:24,inkChangeHz:2,idleMs:3e3},De=[le[900],oe[700],oe[600],oe[500]],ie=fe[100];function Z(n){const c=parseInt(n.slice(1),16);return[(c>>16&255)/255,(c>>8&255)/255,(c&255)/255]}function se([n,c,s]){const p=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4;return .2126*p(n)+.7152*p(c)+.0722*p(s)}function Ae(n,c=ie,s=v.maxLoss){const p=Z(c),e=Z(n),h=se(p)*(1-s);let f=0,x=1;for(let F=0;F<16;F++){const E=(f+x)/2,S=p.map((B,d)=>B+(e[d]-B)*E);se(S)>=h?f=E:x=E}return f}function Fe(n,c,s){const p=[],e=n.createTreeWalker(n.body,NodeFilter.SHOW_TEXT,{acceptNode:f=>f.nodeValue&&f.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}),h=n.createRange();for(let f=e.nextNode();f;f=e.nextNode()){h.selectNodeContents(f);for(const x of Array.from(h.getClientRects()))x.width<1||x.height<1||x.bottom<0||x.top>s||x.right<0||x.left>c||p.push({left:x.left,top:x.top,right:x.right,bottom:x.bottom})}return h.detach(),p}const we=.5/255/(v.gain*Ae(le[900],ie,v.openLoss)),Le=9/v.gain;function Ue(n,c,s){return n-c>=v.idleMs&&s<=we}const be=250,Se=`
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`,Be=`
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
`,Ce=`
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform sampler2D uMask;
  uniform vec3 uPaper;
  uniform float uTextLoss;
  uniform float uOpenLoss;
  uniform float uGain;
  uniform float uEdge;

  float lum (vec3 s) {
    vec3 lo = s / 12.92;
    vec3 hi = pow((s + 0.055) / 1.055, vec3(2.4));
    vec3 l = mix(lo, hi, step(0.04045, s));
    return dot(l, vec3(0.2126, 0.7152, 0.0722));
  }

  void main () {
    vec4 d = texture2D(uTexture, vUv);
    float density = max(d.a, 0.0);
    if (density < 0.002) { gl_FragColor = vec4(0.0); return; }
    vec3 ink = clamp(d.rgb / density, 0.0, 1.0);
    float rim = abs(texture2D(uTexture, vR).a - texture2D(uTexture, vL).a)
              + abs(texture2D(uTexture, vT).a - texture2D(uTexture, vB).a);
    float want = 1.0 - exp(-uGain * (density + uEdge * rim));
    // Words on screen (the keep-out mask, 1 under text): the ink thins to
    // the text budget there, and blooms to the open budget on bare paper.
    float words = texture2D(uMask, vUv).a;
    float floorLum = lum(uPaper) * (1.0 - mix(uOpenLoss, uTextLoss, words));
    float lo = 0.0;
    float hi = 1.0;
    for (int i = 0; i < 8; i++) {
      float m = 0.5 * (lo + hi);
      if (lum(mix(uPaper, ink, m)) >= floorLum) lo = m; else hi = m;
    }
    float a = want * lo;
    gl_FragColor = vec4(ink * a, a);
  }
`,Pe=`
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec4 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    gl_FragColor = texture2D(uTarget, vUv) + exp(-dot(p, p) / radius) * color;
  }
`,Me=`
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }
  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    gl_FragColor = result / (1.0 + dissipation * dt);
  }
`,Ne=`
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`,Ie=`
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
  }
`,Xe=`
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`,Ge=`
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`,Ve=`
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`,ke=()=>new Promise(n=>setTimeout(n,0));async function Oe(n,c){const s=n.getExtension("KHR_parallel_shader_compile");if(!s)return;const p=performance.now();for(;!c.every(e=>n.getProgramParameter(e,s.COMPLETION_STATUS_KHR));){if(n.isContextLost()||performance.now()-p>5e3)return;await new Promise(e=>setTimeout(e,16))}}async function ze(n){const c={alpha:!0,premultipliedAlpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1,powerPreference:"low-power"},s=n.getContext("webgl2",c),p=s??n.getContext("webgl",c);if(!p)throw new Error("no WebGL");const e=p,h=s!=null;let f,x;if(h)s.getExtension("EXT_color_buffer_float"),f=!!s.getExtension("OES_texture_float_linear"),x=s.HALF_FLOAT;else{const r=e.getExtension("OES_texture_half_float");f=!!e.getExtension("OES_texture_half_float_linear"),x=(r==null?void 0:r.HALF_FLOAT_OES)??0}if(!x)throw new Error("no half-float textures");const F=(r,t)=>{const i=e.createTexture(),u=e.createFramebuffer();if(!i||!u)return!1;e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,x,null),e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0);const m=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(u),e.deleteTexture(i),m},E=r=>{for(const[t,i]of r)if(F(t,i))return{internal:t,format:i};throw new Error("no renderable texture format")},S=E(h?[[s.RGBA16F,e.RGBA]]:[[e.RGBA,e.RGBA]]),B=h?E([[s.RG16F,s.RG],[s.RGBA16F,e.RGBA]]):S,d=h?E([[s.R16F,s.RED],[s.RG16F,s.RG],[s.RGBA16F,e.RGBA]]):S;if(await ke(),e.isContextLost())throw new Error("context lost");const w=[],I=[],_=(r,t,i=[])=>{const u=e.createShader(r);if(!u)throw new Error("no shader");return e.shaderSource(u,i.map(m=>`#define ${m}
`).join("")+t),e.compileShader(u),w.push(u),u},z=_(e.VERTEX_SHADER,Se);class L{constructor(t){re(this,"program");re(this,"uniforms",{});const i=e.createProgram();if(!i)throw new Error("no program");e.attachShader(i,z),e.attachShader(i,t),e.bindAttribLocation(i,0,"aPosition"),e.linkProgram(i),this.program=i,I.push(i)}finish(){if(!e.getProgramParameter(this.program,e.LINK_STATUS))throw new Error("program did not link");const t=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let i=0;i<t;i++){const u=e.getActiveUniform(this.program,i);u&&(this.uniforms[u.name]=e.getUniformLocation(this.program,u.name))}}bind(){e.useProgram(this.program)}}const V=new L(_(e.FRAGMENT_SHADER,Be)),C=new L(_(e.FRAGMENT_SHADER,Pe)),T=new L(_(e.FRAGMENT_SHADER,Me,f?[]:["MANUAL_FILTERING"])),H=new L(_(e.FRAGMENT_SHADER,Ne)),Y=new L(_(e.FRAGMENT_SHADER,Ie)),X=new L(_(e.FRAGMENT_SHADER,Xe)),k=new L(_(e.FRAGMENT_SHADER,Ge)),O=new L(_(e.FRAGMENT_SHADER,Ve)),U=new L(_(e.FRAGMENT_SHADER,Ce)),J=[V,C,T,H,Y,X,k,O,U];if(await Oe(e,I),e.isContextLost())throw new Error("context lost");J.forEach(r=>r.finish());const R=e.createBuffer(),P=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,R),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,P),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),e.disable(e.BLEND);const l=(r,t=!1)=>{r?(e.viewport(0,0,r.width,r.height),e.bindFramebuffer(e.FRAMEBUFFER,r.fbo)):(e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.bindFramebuffer(e.FRAMEBUFFER,null)),t&&(e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)},D=(r,t,i,u)=>{e.activeTexture(e.TEXTURE0);const m=e.createTexture(),o=e.createFramebuffer();if(!m||!o)throw new Error("no framebuffer");return e.bindTexture(e.TEXTURE_2D,m),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i.internal,r,t,0,i.format,x,null),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,m,0),e.viewport(0,0,r,t),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{texture:m,fbo:o,width:r,height:t,texelX:1/r,texelY:1/t,attach(N){return e.activeTexture(e.TEXTURE0+N),e.bindTexture(e.TEXTURE_2D,m),N}}},G=(r,t,i,u)=>{const m={width:r,height:t,texelX:1/r,texelY:1/t,read:D(r,t,i,u),write:D(r,t,i,u),swap(){const o=m.read;m.read=m.write,m.write=o}};return m},b=r=>{e.deleteTexture(r.texture),e.deleteFramebuffer(r.fbo)},M=f?e.LINEAR:e.NEAREST;let y=null,g=null,W=null,K=null,q=null;const me=()=>{const r=e.drawingBufferWidth,t=e.drawingBufferHeight,i=Math.max(r,t)/Math.max(1,Math.min(r,t)),u=v.simResolution,m=Math.round(u*i),o=Math.min(v.dyeLongSide,Math.max(r,t)),N=Math.max(1,Math.round(o/i));return r>=t?{sim:[m,u],dye:[o,N]}:{sim:[u,m],dye:[N,o]}},ve=()=>{for(const i of[y,g,q])i&&[i.read,i.write].forEach(b);for(const i of[W,K])i&&b(i);const{sim:r,dye:t}=me();y=G(t[0],t[1],S,M),g=G(r[0],r[1],B,M),W=D(r[0],r[1],d,e.NEAREST),K=D(r[0],r[1],d,e.NEAREST),q=G(r[0],r[1],d,e.NEAREST)},ne=()=>{const r=Math.min(window.devicePixelRatio||1,v.dprCap),t=Math.max(1,Math.floor(n.clientWidth*r)),i=Math.max(1,Math.floor(n.clientHeight*r));return n.width===t&&n.height===i&&y?!1:(n.width=t,n.height=i,ve(),!0)},a=(r,t,i)=>{const u=r.uniforms[t];u&&i(u)},ee=Z(ie),j=e.createTexture();if(!j)throw new Error("no mask texture");e.bindTexture(e.TEXTURE_2D,j),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));function de(r){e.bindTexture(e.TEXTURE_2D,j),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1)}function xe(r){const t=g;e.disable(e.BLEND),Y.bind(),a(Y,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),a(Y,"uVelocity",o=>e.uniform1i(o,t.read.attach(0))),l(K),X.bind(),a(X,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),a(X,"uVelocity",o=>e.uniform1i(o,t.read.attach(0))),a(X,"uCurl",o=>e.uniform1i(o,K.attach(1))),a(X,"curl",o=>e.uniform1f(o,v.curl)),a(X,"dt",o=>e.uniform1f(o,r)),l(t.write),t.swap(),H.bind(),a(H,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),a(H,"uVelocity",o=>e.uniform1i(o,t.read.attach(0))),l(W);const i=q;V.bind(),a(V,"uTexture",o=>e.uniform1i(o,i.read.attach(0))),a(V,"value",o=>e.uniform1f(o,v.pressure)),l(i.write),i.swap(),k.bind(),a(k,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),a(k,"uDivergence",o=>e.uniform1i(o,W.attach(0)));for(let o=0;o<v.pressureIterations;o++)a(k,"uPressure",N=>e.uniform1i(N,i.read.attach(1))),l(i.write),i.swap();O.bind(),a(O,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),a(O,"uPressure",o=>e.uniform1i(o,i.read.attach(0))),a(O,"uVelocity",o=>e.uniform1i(o,t.read.attach(1))),l(t.write),t.swap(),T.bind(),a(T,"texelSize",o=>e.uniform2f(o,t.texelX,t.texelY)),f||a(T,"dyeTexelSize",o=>e.uniform2f(o,t.texelX,t.texelY));const u=t.read.attach(0);a(T,"uVelocity",o=>e.uniform1i(o,u)),a(T,"uSource",o=>e.uniform1i(o,u)),a(T,"dt",o=>e.uniform1f(o,r)),a(T,"dissipation",o=>e.uniform1f(o,v.velocityDissipation)),l(t.write),t.swap();const m=y;f||a(T,"dyeTexelSize",o=>e.uniform2f(o,m.texelX,m.texelY)),a(T,"uVelocity",o=>e.uniform1i(o,t.read.attach(0))),a(T,"uSource",o=>e.uniform1i(o,m.read.attach(1))),a(T,"dissipation",o=>e.uniform1f(o,v.densityDissipation)),l(m.write),m.swap()}function Ee(){const r=y;U.bind(),a(U,"texelSize",t=>e.uniform2f(t,r.texelX,r.texelY)),a(U,"uTexture",t=>e.uniform1i(t,r.read.attach(0))),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,j),a(U,"uMask",t=>e.uniform1i(t,1)),a(U,"uPaper",t=>e.uniform3f(t,ee[0],ee[1],ee[2])),a(U,"uTextLoss",t=>e.uniform1f(t,v.maxLoss)),a(U,"uOpenLoss",t=>e.uniform1f(t,v.openLoss)),a(U,"uGain",t=>e.uniform1f(t,v.gain)),a(U,"uEdge",t=>e.uniform1f(t,v.edge)),l(null,!0)}const te=()=>n.width/n.height,pe=()=>{const r=v.splatRadius/100;return te()>1?r*te():r};function he(r,t,i,u,m){const o=g,N=y;C.bind(),a(C,"aspectRatio",A=>e.uniform1f(A,te())),a(C,"point",A=>e.uniform2f(A,r,t)),a(C,"radius",A=>e.uniform1f(A,pe())),a(C,"uTarget",A=>e.uniform1i(A,o.read.attach(0))),a(C,"color",A=>e.uniform4f(A,i,u,0,0)),l(o.write),o.swap();const Q=v.splatAmount;a(C,"uTarget",A=>e.uniform1i(A,N.read.attach(0))),a(C,"color",A=>e.uniform4f(A,m[0]*Q,m[1]*Q,m[2]*Q,Q)),l(N.write),N.swap()}function ae(){for(const r of[y,g,q])if(r)for(const t of[r.read,r.write])e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,t.width,t.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT);e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)}function Te(){var r;for(const t of[y,g,q])t&&[t.read,t.write].forEach(b);for(const t of[W,K])t&&b(t);e.deleteTexture(j),I.forEach(t=>e.deleteProgram(t)),w.forEach(t=>e.deleteShader(t)),e.deleteBuffer(R),e.deleteBuffer(P),(r=e.getExtension("WEBGL_lose_context"))==null||r.loseContext()}return ne(),ae(),{fit:ne,step:xe,draw:Ee,splat:he,still:ae,setMask:de,dispose:Te,lost:()=>e.isContextLost()}}const ce=De.map(Z),ue=()=>ce[Math.floor(Math.random()*ce.length)];function Je({active:n,onReady:c,onFail:s,yieldRequested:p,onYield:e}){const h=$.useRef(null),f=$.useRef({active:n,onReady:c,onFail:s,yieldRequested:p,onYield:e}),x=$.useRef(()=>{});return $.useEffect(()=>{f.current={active:n,onReady:c,onFail:s,yieldRequested:p,onYield:e},x.current()}),$.useEffect(()=>{const F=h.current;if(!F)return;const E=document.createElement("canvas");E.className="splash-canvas",E.setAttribute("aria-hidden","true"),F.appendChild(E);const S=()=>{var w,I;return(I=(w=E.getContext("webgl2")??E.getContext("webgl"))==null?void 0:w.getExtension("WEBGL_lose_context"))==null?void 0:I.loseContext()};let B=!1,d=null;return ze(E).then(w=>{B?w.dispose():d=He(w,E,f,x)},()=>{S(),B||f.current.onFail()}),()=>{B=!0,d?d():S(),F.removeChild(E)}},[]),ye.jsx("div",{ref:h,className:"splash-live"})}function He(n,c,s,p){var J;const e=(J=window.matchMedia)==null?void 0:J.call(window,"(prefers-reduced-motion: reduce)");let h=0,f=!1,x=0,F=-1/0,E=0,S=0,B=ue();const d={x:0,y:0,dx:0,dy:0,moved:!1,seen:!1},w=document.createElement("canvas"),I=document.createElement("canvas"),_=w.getContext("2d"),z=I.getContext("2d");let L=-1/0,V={x:NaN,y:NaN};const C=R=>{if(!z||!_||!(window.scrollX!==V.x||window.scrollY!==V.y)&&R-L<be)return;L=R,V={x:window.scrollX,y:window.scrollY};const l=v.maskScale,D=v.maskPad,G=c.clientWidth,b=c.clientHeight,M=Math.max(1,Math.ceil(G/l)),y=Math.max(1,Math.ceil(b/l));for(const g of[w,I])(g.width!==M||g.height!==y)&&(g.width=M,g.height=y);_.clearRect(0,0,M,y),_.fillStyle=fe[50];for(const g of Fe(document,G,b))_.fillRect((g.left-D)/l,(g.top-D)/l,(g.right-g.left+2*D)/l,(g.bottom-g.top+2*D)/l);z.clearRect(0,0,M,y),z.filter=`blur(${v.maskBlur/l}px)`,z.drawImage(w,0,0),z.filter="none",n.setMask(I)},T=()=>{f=!1,cancelAnimationFrame(h)},H=R=>{var l,D;if(h=0,!f)return;if(n.lost()){T(),s.current.onFail();return}const P=Math.min((R-x)/1e3,1/60);if(x=R,n.fit(),C(R),d.moved&&(d.moved=!1,R-S>1e3/v.inkChangeHz&&(B=ue(),S=R),n.splat(d.x,d.y,d.dx*v.splatForce,d.dy*v.splatForce,B),E=Math.min(E+v.splatAmount,Le)),n.step(P),n.draw(),_e("splash"),E/=1+v.densityDissipation*P,Ue(performance.now(),F,E)){n.still(),E=0,T(),s.current.yieldRequested&&((D=(l=s.current).onYield)==null||D.call(l));return}h=requestAnimationFrame(H)};p.current=()=>{const{active:R,yieldRequested:P,onYield:l}=s.current;if(!f&&P&&E===0){l==null||l();return}if(f||!R||document.hidden||e!=null&&e.matches){f&&(!R||document.hidden)&&T();return}E===0&&performance.now()-F>=v.idleMs||(f=!0,x=performance.now(),h=requestAnimationFrame(H))};const Y=R=>{if(R.pointerType==="touch"||s.current.yieldRequested)return;const P=c.clientWidth||1,l=c.clientHeight||1,D=R.clientX/P,G=1-R.clientY/l,b=P/l;if(d.seen){let M=D-d.x,y=G-d.y;b<1&&(M*=b),b>1&&(y/=b),d.dx=M,d.dy=y,d.moved=M!==0||y!==0}d.x=D,d.y=G,d.seen=!0,d.moved&&(F=performance.now(),p.current())},X=()=>{d.seen=!1},k=()=>p.current();window.addEventListener("pointermove",Y,{passive:!0}),document.documentElement.addEventListener("pointerleave",X),document.addEventListener("visibilitychange",k);const O=()=>{T(),s.current.onFail()};c.addEventListener("webglcontextlost",O);const U=requestAnimationFrame(()=>s.current.onReady());return()=>{cancelAnimationFrame(U),T(),p.current=()=>{},window.removeEventListener("pointermove",Y),document.documentElement.removeEventListener("pointerleave",X),document.removeEventListener("visibilitychange",k),c.removeEventListener("webglcontextlost",O),n.dispose()}}export{Je as default};
