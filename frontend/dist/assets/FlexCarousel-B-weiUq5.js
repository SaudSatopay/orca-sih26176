import{r as z,j as ie,p as lt}from"./index-Q5qHpzbn.js";import{S as it,k as ce,l as Ye}from"./App-Diq0nh4G.js";import{G as ct,R as ut,P as Ve,M as $e,T as dt}from"./Triangle-DIsCpGZW.js";import{T as Ke}from"./Texture-BkQWYNP2.js";import{R as ft}from"./RenderTarget-BJHc8Cd7.js";import"./locate-D9KGdhRM.js";import"./MarineMap-CwVgjvPw.js";import"./cn-ew9kF1hN.js";class Le extends ct{constructor(d,{width:X=1,height:Y=1,widthSegments:F=1,heightSegments:U=1,attributes:N={}}={}){const E=F,x=U,T=(E+1)*(x+1),k=E*x*6,l=new Float32Array(T*3),p=new Float32Array(T*3),i=new Float32Array(T*2),b=k>65536?new Uint32Array(k):new Uint16Array(k);Le.buildPlane(l,p,i,b,X,Y,0,E,x),Object.assign(N,{position:{size:3,data:l},normal:{size:3,data:p},uv:{size:2,data:i},index:{data:b}}),super(d,N)}static buildPlane(d,X,Y,F,U,N,E,x,T,k=0,l=1,p=2,i=1,b=-1,h=0,D=0){const q=h,R=U/x,fe=N/T;for(let v=0;v<=T;v++){let P=v*fe-N/2;for(let L=0;L<=x;L++,h++){let pe=L*R-U/2;if(d[h*3+k]=pe*i,d[h*3+l]=P*b,d[h*3+p]=E/2,X[h*3+k]=0,X[h*3+l]=0,X[h*3+p]=E>=0?1:-1,Y[h*2]=L/x,Y[h*2+1]=1-v/T,v===T||L===x)continue;let g=q+L+v*(x+1),I=q+L+(v+1)*(x+1),c=q+L+(v+1)*(x+1)+1,A=q+L+v*(x+1)+1;F[D*6]=g,F[D*6+1]=I,F[D*6+2]=A,F[D*6+3]=I,F[D*6+4]=c,F[D*6+5]=A,D++}}}}const Qe=1.5,pt=45e5,Ze=12,mt=.64,Ie=18,vt=3,ht=.18,Je=3.6,et=3e3,O={width:.8,height:.8,tilt:0,roundness:1,bend:.26,reach:.36,curl:1,dispersion:.12},gt=C=>{const d=parseInt(C.slice(1),16);return[(d>>16&255)/255,(d>>8&255)/255,(d&255)/255]},ue=(C,d)=>((C+d/2)%d+d)%d-d/2,de=C=>Math.min(Math.max(C,0),1),tt=C=>{const d=de(C);return d<.5?4*d*d*d:1-Math.pow(-2*d+2,3)/2},xt=`#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`,wt=`#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;
float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`,Mt=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,yt=`#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
out vec4 fragColor;
void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);
  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 shifted = uv + (vec2(0.0, -lift) - swirl) / uResolution;
  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));
  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${Ze}; i++) {
      float s = (float(i) + 0.5) / float(${Ze});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }
  fragColor = color;
}
`;function Ct({active:C,onReady:d,onFail:X}){const{language:Y}=z.useContext(it),F=Ye[Y]??Ye.en,U=z.useRef(null),N=z.useRef(null),E=z.useRef({onReady:d,onFail:X}),[x,T]=z.useState(0);z.useEffect(()=>{E.current={onReady:d,onFail:X}}),z.useEffect(()=>{var Ue;const l=U.current;if(!l)return;let p;try{p=new ut({dpr:Math.min(window.devicePixelRatio||1,Qe),alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1})}catch{E.current.onFail();return}const i=p.gl;if(!p.isWebgl2){(Ue=i.getExtension("WEBGL_lose_context"))==null||Ue.loseContext(),E.current.onFail();return}i.clearColor(0,0,0,0);const b=i.canvas;b.style.display="block",b.style.width="100%",b.style.height="100%",l.prepend(b);let h=!0;const D=e=>{e.preventDefault(),cancelAnimationFrame(W),W=0,h&&E.current.onFail()};b.addEventListener("webglcontextlost",D);const q=gt(lt[200]),R=new Ve(i,{vertex:xt,fragment:wt,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{tMap:{value:new Ke(i)},uRect:{value:[0,0,1,1]},uResolution:{value:[1,1]},uSize:{value:[1,1]},uImage:{value:[1,1]},uRadius:{value:vt},uAlpha:{value:1},uReady:{value:0},uDpr:{value:1},uPlaceholder:{value:q}}});R.setBlendFunc(i.ONE,i.ONE_MINUS_SRC_ALPHA);const fe=new $e(i,{geometry:new Le(i),program:R}),v=new ft(i,{width:2,height:2,depth:!1,minFilter:i.LINEAR_MIPMAP_LINEAR,magFilter:i.LINEAR}),P={tScene:{value:v.texture},uResolution:{value:[1,1]},uDpr:{value:1},uCenter:{value:[0,0]},uHalf:{value:[1,1]},uAngle:{value:O.tilt*Math.PI/180},uExponent:{value:2+Math.pow(1-de(O.roundness),1.5)*10},uInner:{value:60},uOuter:{value:80},uFlow:{value:0},uCurl:{value:O.curl},uDispersion:{value:O.dispersion*.12},uStrength:{value:1}},L=new $e(i,{geometry:new dt(i),program:new Ve(i,{vertex:Mt,fragment:yt,uniforms:P,depthTest:!1,depthWrite:!1})}),pe=p.getExtension("EXT_texture_filter_anisotropic")?8:0;let g=1,I=1,c=0,A=0,m=0,W=0,_=0,me=performance.now(),J=!1,S=!0,Se=!1,ve=-1,ee=-1/0,he=performance.now(),V=0,Ce=0,te=null,ge=[];const s={index:-1,pending:-1,t:0,v:0,target:0},o={x:0,y:0,over:!1,down:!1,id:-1,startX:0,startY:0,startPos:0,dragging:!1,touch:!1,samples:[]},nt=e=>{const t=new Ke(i,{generateMipmaps:!0,minFilter:i.LINEAR_MIPMAP_LINEAR,magFilter:i.LINEAR,anisotropy:pe}),n={item:e,texture:t,aspect:e.width/e.height,loaded:!1,failed:!1,ready:0,color:q,image:[e.width,e.height],dispose:()=>{}},a=new Image;return a.decoding="async",a.onload=()=>{h&&(t.image=a,t.update(),n.image=[a.naturalWidth||1,a.naturalHeight||1],n.aspect=n.image[0]/n.image[1],n.loaded=!0,S=!0,w())},a.onerror=()=>{h&&(n.failed=!0,S=!0,w())},a.src=e.src,n.dispose=()=>{a.onload=null,a.onerror=null,i.deleteTexture(t.texture)},n},B=ce.map(nt),oe=()=>{const e=Math.max(24,mt*I),t=B.map(r=>r.aspect*e),n=[];let a=0;for(const r of t)n.push(a+r/2),a+=r+Ie;return{cardH:e,widths:t,centers:n,loop:Math.max(a,1)}},ae=(e,t)=>{let n=0,a=1/0;for(let r=0;r<e.centers.length;r++){const f=Math.abs(ue(e.centers[r]-t,e.loop));f<a&&(a=f,n=r)}return n},ne=(e,t)=>t+ue(e.centers[ae(e,t)]-t,e.loop),Fe=(e,t,n)=>{const a=ae(e,n),r=ue(n-e.centers[a],e.loop);return Math.round((n-r-e.centers[a])/e.loop)*t.loop+t.centers[a]+r*(t.widths[a]/e.widths[a])},Te=(e,t)=>{let n=ne(e,m),a=ae(e,n);const r=e.centers.length;for(let f=0;f<Math.abs(t);f++){const M=(a+(t>0?1:r-1))%r;n+=t>0?e.widths[a]/2+Ie+e.widths[M]/2:-(e.widths[M]/2+Ie+e.widths[a]/2),a=M}m=n,S=!0,w()},xe=()=>(s.pending=-1,s.target===0?!1:(s.target=0,S=!0,w(),!0)),ot=e=>{window.clearTimeout(_);const t=Math.max(Je*1e3-(e-he),et-(e-ee),60);_=window.setTimeout(()=>{_=0,w()},t)},De=e=>{if(W=0,!h||!J)return;const t=Math.min(.05,Math.max(.001,(e-me)/1e3));me=e;const n=oe(),a=B.length;let r=!1;if(te&&te.loop!==n.loop&&(c=Fe(te,n,c),m=Fe(te,n,m),o.startPos=c+(o.x-o.startX),r=!0),te=n,o.dragging)r=!0;else{const re=2*Math.sqrt(55),j=Math.ceil(t/(1/240)),se=t/j;for(let Q=0;Q<j;Q++)A+=(55*(m-c)-re*A)*se,c+=A*se;Math.abs(m-c)<.05&&Math.abs(A)<.5?(c=m,A=0):r=!0}if(Math.abs(c)>n.loop*8){const y=Math.round(c/n.loop)*n.loop;c-=y,m-=y,o.startPos-=y}const f=ae(n,c);f!==ve&&(ve=f,T(f)),s.pending>=0&&Math.abs(m-c)<1.5&&Math.abs(A)<30&&(f===s.pending&&(s.index=f,s.target=1),s.pending=-1);const M=B.every(y=>y.loaded||y.failed);M&&s.target===0&&s.t<.01&&!o.over&&!o.down&&Math.abs(m-c)<1&&e-ee>et&&e-he>Je*1e3&&(he=e,Te(n,1),r=!0);const G=Math.abs(c-Ce)/t;Ce=c;const K=Math.min(G/2600,1);V+=(K-V)*(1-Math.exp(-t/(K>V?.07:.35))),V<.01&&K===0?V=0:r=!0;const qe=64;s.v+=(qe*(s.target-s.t)-2*Math.sqrt(qe)*s.v)*t,s.t+=s.v*t,Math.abs(s.target-s.t)<5e-4&&Math.abs(s.v)<.001?(s.t=s.target,s.v=0):r=!0;const Be=tt(de(s.t)),at=s.index>=0&&s.index<a?n.widths[s.index]:n.cardH,rt=Math.max(1,Math.min(1.3,I*.84/n.cardH,g*.92/at));for(const y of B)y.loaded&&y.ready<1&&(y.ready=Math.min(1,y.ready+t/.45),r=!0);if(S||r||o.dragging){S=!1,ge=[];const y=p.dpr,re=g/2,j=I/2;R.uniforms.uResolution.value=[g,I],R.uniforms.uDpr.value=y;const se=1-ht*V,Q=[];for(let u=0;u<a;u++){const H=n.widths[u],st=ue(n.centers[u]-c,n.loop);for(let Ee=-3;Ee<=3;Ee++){const Z=st+Ee*n.loop;if(Math.abs(Z)-H/2>g+40)continue;let le=re+Z,Re=se,Ae=1;if(s.t>0)if(u===s.index&&Math.abs(Z)<H)Re*=1+(rt-1)*Be;else{const je=tt(de(s.t)*1.25-Math.min(Math.abs(Z)/g,1)*.25);le+=Math.sign(Z)*je*g*.7,Ae*=1-je}const Pe=H*Re;Ae<=.001||le+Pe/2<-40||le-Pe/2>g+40||Q.push({i:u,rel:Z,x:le,cw:Pe,ch:n.cardH*Re,alpha:Ae})}}Q.sort((u,H)=>Math.abs(H.rel)-Math.abs(u.rel));let Me=!0;for(const u of Q){const H=B[u.i];R.uniforms.tMap.value=H.texture,R.uniforms.uRect.value=[u.x,j,u.cw+2,u.ch+2],R.uniforms.uSize.value=[u.cw,u.ch],R.uniforms.uImage.value=H.image,R.uniforms.uAlpha.value=u.alpha,R.uniforms.uReady.value=H.ready,R.uniforms.uPlaceholder.value=H.color,p.render({scene:fe,target:v,clear:Me}),Me=!1,ge.push({index:u.i,x0:u.x-u.cw/2,x1:u.x+u.cw/2,y0:j-u.ch/2,y1:j+u.ch/2})}Me&&(p.bindFramebuffer(v),i.viewport(0,0,v.width,v.height),i.clear(i.COLOR_BUFFER_BIT)),p.bindFramebuffer(),v.texture.bind(),i.generateMipmap(i.TEXTURE_2D);const ye=O.width*g/2,be=O.height*g/2,Ge=Math.max(4,O.reach*(ye+be)*.5);P.uResolution.value=[g,I],P.uDpr.value=y,P.uCenter.value=[re,j],P.uHalf.value=[Math.max(ye,1),Math.max(be,1)],P.uInner.value=Ge,P.uOuter.value=Ge*1.6,P.uFlow.value=O.bend*(ye+be)*.45,P.uStrength.value=1-Be,p.render({scene:L}),M&&!Se&&(Se=!0,B.every(u=>u.failed)?E.current.onFail():E.current.onReady())}l.toggleAttribute("data-zoom",s.target>0),r||!M||o.down?W=requestAnimationFrame(De):ot(e)};function w(){W||!h||!J||(window.clearTimeout(_),_=0,me=performance.now(),W=requestAnimationFrame(De))}const we=e=>{const t=l.getBoundingClientRect();return[e.clientX-t.left,e.clientY-t.top]},_e=e=>{if(e.button>0)return;const[t,n]=we(e);Object.assign(o,{down:!0,id:e.pointerId,touch:e.pointerType==="touch",startX:t,startY:n,x:t,y:n,startPos:c,dragging:!1,samples:[{x:t,t:performance.now()}]}),ee=performance.now(),Math.abs(A)>40&&(m=c,A=0),S=!0,w()},He=e=>{const[t,n]=we(e);if(o.x=t,o.y=n,o.over=!0,o.down&&e.pointerId===o.id){const a=t-o.startX,r=n-o.startY,f=o.touch?10:5;if(!o.dragging){if(o.touch&&Math.abs(r)>f&&Math.abs(r)>Math.abs(a)){o.down=!1;return}if(Math.abs(a)>f){o.dragging=!0,o.startX=t,o.startPos=c,xe();try{l.setPointerCapture(e.pointerId)}catch{}l.setAttribute("data-dragging","")}}if(o.dragging){c=o.startPos-(t-o.startX),m=c,A=0;const M=performance.now();for(o.samples.push({x:t,t:M});o.samples.length>2&&M-o.samples[0].t>100;)o.samples.shift();w()}}},Ne=e=>{if(!o.down||e.pointerId!==o.id)return;o.down=!1,l.removeAttribute("data-dragging");const t=oe();if(ee=performance.now(),o.dragging){o.dragging=!1;const f=performance.now(),M=o.samples[0],$=o.samples[o.samples.length-1];let G=0;M&&$&&$.t>M.t&&f-$.t<70&&(G=-(($.x-M.x)/($.t-M.t))*1e3),A=G;const K=ne(t,c+G*.32);m=K,Math.abs(G)>400&&Math.abs(K-c)<1&&Te(t,G>0?1:-1),w();return}if(xe())return;const[n,a]=we(e),r=ge.find(f=>n>=f.x0&&n<=f.x1&&a>=f.y0&&a<=f.y1);r&&(r.index===ve&&Math.abs(m-c)<2?(s.index=r.index,s.target=1):(m=ne(t,c+((r.x0+r.x1)/2-g/2)),s.pending=r.index),S=!0,w())},We=()=>{o.over=!1,S=!0,w()},Xe=()=>{o.down=!1,o.dragging=!1,l.removeAttribute("data-dragging"),m=ne(oe(),c),w()},ke=e=>{e.ctrlKey||Math.abs(e.deltaX)<=Math.abs(e.deltaY)||(e.preventDefault(),ee=performance.now(),!xe()&&(m+=Math.max(-120,Math.min(120,e.deltaX*(e.deltaMode===1?16:1)))*1.25,window.clearTimeout(_),_=window.setTimeout(()=>{m=ne(oe(),m),w()},150),w()))};l.addEventListener("pointerdown",_e),l.addEventListener("pointermove",He),l.addEventListener("pointerup",Ne),l.addEventListener("pointerleave",We),l.addEventListener("pointercancel",Xe),l.addEventListener("wheel",ke,{passive:!1});const ze=()=>{g=Math.max(1,l.clientWidth),I=Math.max(1,l.clientHeight),p.dpr=Math.min(window.devicePixelRatio||1,Qe,Math.sqrt(pt/(g*I))),p.setSize(g,I),v.setSize(Math.max(2,Math.round(g*p.dpr)),Math.max(2,Math.round(I*p.dpr))),P.tScene.value=v.texture,S=!0,w()},Oe=new ResizeObserver(ze);return Oe.observe(l),ze(),N.current={setActive(e){J=e,J?(S=!0,w()):(cancelAnimationFrame(W),W=0,window.clearTimeout(_),_=0)}},()=>{var e;h=!1,J=!1,N.current=null,cancelAnimationFrame(W),window.clearTimeout(_),Oe.disconnect(),l.removeEventListener("pointerdown",_e),l.removeEventListener("pointermove",He),l.removeEventListener("pointerup",Ne),l.removeEventListener("pointerleave",We),l.removeEventListener("pointercancel",Xe),l.removeEventListener("wheel",ke),b.removeEventListener("webglcontextlost",D),B.forEach(t=>t.dispose()),(e=i.getExtension("WEBGL_lose_context"))==null||e.loseContext(),b.parentNode&&b.parentNode.removeChild(b)}},[]),z.useEffect(()=>{var l;(l=N.current)==null||l.setActive(C)},[C]);const k=ce[x]??ce[0];return ie.jsx("div",{ref:U,className:"sheets-flow-live absolute inset-0 select-none overflow-hidden",children:ie.jsxs("div",{className:"sheets-flow-caption",children:[ie.jsx("span",{className:"label !text-ink-700",children:F.sheets[k.id].caption}),ie.jsxs("span",{className:"font-mono text-label tabular-nums text-ink-500",children:[String(x+1).padStart(2,"0")," / ",String(ce.length).padStart(2,"0")]})]})})}export{Ct as default};
