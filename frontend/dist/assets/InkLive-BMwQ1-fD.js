var ae=Object.defineProperty;var ce=(t,e,i)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var l=(t,e,i)=>ce(t,typeof e!="symbol"?e+"":e,i);import{r as _,j as z,p as q,k as le,h as ue}from"./index-C4X3Cmmq.js";import{w as de,x as $,y as C,z as he,A as fe,E as L}from"./App-19WGD7QQ.js";import"./locate-C86viPRp.js";import"./MarineMap-jrD8s9Kp.js";import"./cn-ew9kF1hN.js";const pe=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,K=1920*1080*4;let me=class{constructor(e,i,o,c,s=0,n=0,r=2,p=K,d=[]){l(this,"parentElement");l(this,"canvasElement");l(this,"gl");l(this,"program",null);l(this,"uniformLocations",{});l(this,"fragmentShader");l(this,"rafId",null);l(this,"lastRenderTime",0);l(this,"currentFrame",0);l(this,"speed",0);l(this,"currentSpeed",0);l(this,"providedUniforms");l(this,"mipmaps",[]);l(this,"hasBeenDisposed",!1);l(this,"resolutionChanged",!0);l(this,"textures",new Map);l(this,"minPixelRatio");l(this,"maxPixelCount");l(this,"isSafari",xe());l(this,"uniformCache",{});l(this,"textureUnitMap",new Map);l(this,"ownerDocument");l(this,"initProgram",()=>{const e=ge(this.gl,pe,this.fragmentShader);e&&(this.program=e)});l(this,"setupPositionAttribute",()=>{const e=this.gl.getAttribLocation(this.program,"a_position"),i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i);const o=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(o),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)});l(this,"setupUniforms",()=>{const e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([i,o])=>{if(e[i]=this.gl.getUniformLocation(this.program,i),o instanceof HTMLImageElement){const c=`${i}AspectRatio`;e[c]=this.gl.getUniformLocation(this.program,c)}}),this.uniformLocations=e});l(this,"renderScale",1);l(this,"parentWidth",0);l(this,"parentHeight",0);l(this,"parentDevicePixelWidth",0);l(this,"parentDevicePixelHeight",0);l(this,"devicePixelsSupported",!1);l(this,"intersectionObserver",null);l(this,"isInViewport",!0);l(this,"resizeObserver",null);l(this,"setupResizeObserver",()=>{this.resizeObserver=new ResizeObserver(([e])=>{var i;if(e!=null&&e.borderBoxSize[0]){const o=(i=e.devicePixelContentBoxSize)==null?void 0:i[0];o!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=o.inlineSize,this.parentDevicePixelHeight=o.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)});l(this,"setupIntersectionObserver",()=>{const e=this.ownerDocument.defaultView;e!=null&&e.IntersectionObserver&&(this.intersectionObserver=new e.IntersectionObserver(([i])=>{this.isInViewport=(i==null?void 0:i.isIntersecting)??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))});l(this,"handleVisualViewportChange",()=>{var e;(e=this.resizeObserver)==null||e.disconnect(),this.setupResizeObserver()});l(this,"handleResize",()=>{let e=0,i=0;const o=Math.max(1,window.devicePixelRatio),c=(visualViewport==null?void 0:visualViewport.scale)??1;if(this.devicePixelsSupported){const f=Math.max(1,this.minPixelRatio/o);e=this.parentDevicePixelWidth*f*c,i=this.parentDevicePixelHeight*f*c}else{let f=Math.max(o,this.minPixelRatio)*c;if(this.isSafari){const h=_e(this.ownerDocument);f*=Math.max(1,h)}e=Math.round(this.parentWidth)*f,i=Math.round(this.parentHeight)*f}const s=Math.sqrt(this.maxPixelCount)/Math.sqrt(e*i),n=Math.min(1,s),r=Math.round(e*n),p=Math.round(i*n),d=r/Math.round(this.parentWidth);(this.canvasElement.width!==r||this.canvasElement.height!==p||this.renderScale!==d)&&(this.renderScale=d,this.canvasElement.width=r,this.canvasElement.height=p,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))});l(this,"render",e=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}const i=e-this.lastRenderTime;this.lastRenderTime=e,this.currentSpeed!==0&&(this.currentFrame+=i*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null});l(this,"requestRender",()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)});l(this,"setTextureUniform",(e,i)=>{if(!i.complete||i.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);const o=this.textures.get(e);o&&this.gl.deleteTexture(o),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);const c=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+c);const s=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,s),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,i),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));const n=this.gl.getError();if(n!==this.gl.NO_ERROR||s===null){console.error("Paper Shaders: WebGL error when uploading texture:",n);return}this.textures.set(e,s);const r=this.uniformLocations[e];if(r){this.gl.uniform1i(r,c);const p=`${e}AspectRatio`,d=this.uniformLocations[p];if(d){const f=i.naturalWidth/i.naturalHeight;this.gl.uniform1f(d,f)}}});l(this,"areUniformValuesEqual",(e,i)=>e===i?!0:Array.isArray(e)&&Array.isArray(i)&&e.length===i.length?e.every((o,c)=>this.areUniformValuesEqual(o,i[c])):!1);l(this,"setUniformValues",e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([i,o])=>{let c=o;if(o instanceof HTMLImageElement&&(c=`${o.src.slice(0,200)}|${o.naturalWidth}x${o.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[i],c))return;this.uniformCache[i]=c;const s=this.uniformLocations[i];if(!s){console.warn(`Uniform location for ${i} not found`);return}if(o instanceof HTMLImageElement)this.setTextureUniform(i,o);else if(Array.isArray(o)){let n=null,r=null;if(o[0]!==void 0&&Array.isArray(o[0])){const p=o[0].length;if(o.every(d=>d.length===p))n=o.flat(),r=p;else{console.warn(`All child arrays must be the same length for ${i}`);return}}else n=o,r=n.length;switch(r){case 2:this.gl.uniform2fv(s,n);break;case 3:this.gl.uniform3fv(s,n);break;case 4:this.gl.uniform4fv(s,n);break;case 9:this.gl.uniformMatrix3fv(s,!1,n);break;case 16:this.gl.uniformMatrix4fv(s,!1,n);break;default:console.warn(`Unsupported uniform array length: ${r}`)}}else typeof o=="number"?this.gl.uniform1f(s,o):typeof o=="boolean"?this.gl.uniform1i(s,o?1:0):console.warn(`Unsupported uniform type for ${i}: ${typeof o}`)})});l(this,"getCurrentFrame",()=>this.currentFrame);l(this,"setFrame",e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())});l(this,"setSpeed",(e=1)=>{this.speed=e,this.updateCurrentSpeed()});l(this,"updateCurrentSpeed",()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)});l(this,"setCurrentSpeed",e=>{this.currentSpeed=e,this.rafId===null&&e!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&e===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)});l(this,"setMaxPixelCount",(e=K)=>{this.maxPixelCount=e,this.handleResize()});l(this,"setMinPixelRatio",(e=2)=>{this.minPixelRatio=e,this.handleResize()});l(this,"setUniforms",e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())});l(this,"handleDocumentVisibilityChange",()=>{this.updateCurrentSpeed()});l(this,"dispose",()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport==null||visualViewport.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount});if((e==null?void 0:e.nodeType)===1)this.parentElement=e;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const S=this.ownerDocument.createElement("style");S.innerHTML=ve,S.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(S)}const f=this.ownerDocument.createElement("canvas");this.canvasElement=f,this.parentElement.prepend(f),this.fragmentShader=i,this.providedUniforms=o,this.mipmaps=d,this.currentFrame=n,this.minPixelRatio=r,this.maxPixelCount=p;const h=f.getContext("webgl2",c);if(!h)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=h,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport==null||visualViewport.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(s),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}};function Q(t,e,i){const o=t.createShader(e);return o?(t.shaderSource(o,i),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.error("An error occurred compiling the shaders: "+t.getShaderInfoLog(o)),t.deleteShader(o),null)):null}function ge(t,e,i){const o=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT),c=o?o.precision:null;c&&c<23&&(e=e.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));const s=Q(t,t.VERTEX_SHADER,e),n=Q(t,t.FRAGMENT_SHADER,i);if(!s||!n)return null;const r=t.createProgram();return r?(t.attachShader(r,s),t.attachShader(r,n),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)?(t.detachShader(r,s),t.detachShader(r,n),t.deleteShader(s),t.deleteShader(n),r):(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(r)),t.deleteProgram(r),t.deleteShader(s),t.deleteShader(n),null)):null}const ve=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function xe(){const t=navigator.userAgent.toLowerCase();return t.includes("safari")&&!t.includes("chrome")&&!t.includes("android")}function _e(t){const e=(visualViewport==null?void 0:visualViewport.scale)??1,i=(visualViewport==null?void 0:visualViewport.width)??window.innerWidth,o=window.innerWidth-t.documentElement.clientWidth,c=e*i+o,s=outerWidth/c,n=Math.round(100*s);return n%5===0?n/100:n===33?1/3:n===67?2/3:n===133?4/3:s}const be={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},we={none:0,contain:1,cover:2},Re=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,ye=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,Se=`
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`,Ue=`
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,Ee=`#version 300 es
precision mediump float;

uniform sampler2D u_image;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;

${Re}
${ye}
${Ue}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  // u_contour is applied in 2 separate ranges:
  // - 0 to .4 sets the edge hardness, saturated above .4 (both branches below)
  // - .5 to 1 warps the stripes direction along the edges, inactive below .5 (see u_contour range 2)
  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  // u_contour range 2
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${Se}

  fragColor = vec4(color, opacity);
}
`,re={workingSize:512,iterations:40};function Z(t){const e=document.createElement("canvas"),i=e.getContext("2d"),o=typeof t=="string"&&t.startsWith("blob:");return new Promise((c,s)=>{if(!t||!i){s(new Error("Invalid file or canvas context"));return}const n=o&&fetch(t).then(p=>p.headers.get("Content-Type")),r=new Image;r.crossOrigin="anonymous",performance.now(),r.onload=async()=>{let p;const d=await n;d?p=d==="image/svg+xml":typeof t=="string"?p=t.endsWith(".svg")||t.startsWith("data:image/svg+xml"):p=t.type==="image/svg+xml";let f=r.width||r.naturalWidth,h=r.height||r.naturalHeight;if(p){const R=f/h;f>h?(f=4096,h=4096/R):(h=4096,f=4096*R),r.width=f,r.height=h}const S=Math.min(f,h),x=re.workingSize/S,a=Math.round(f*x),u=Math.round(h*x);e.width=f,e.height=h;const m=document.createElement("canvas");m.width=a,m.height=u;const w=m.getContext("2d");w.drawImage(r,0,0,a,u),performance.now();const b=w.getImageData(0,0,a,u).data,g=new Uint8Array(a*u),A=new Uint8Array(a*u);for(let v=0,R=0;v<b.length;v+=4,R++){const I=b[v+3]===0?0:1;g[R]=I}const P=[],O=[];for(let v=0;v<u;v++)for(let R=0;R<a;R++){const U=v*a+R;if(!g[U])continue;let I=!1;R===0||R===a-1||v===0||v===u-1?I=!0:I=!g[U-1]||!g[U+1]||!g[U-a]||!g[U+a]||!g[U-a-1]||!g[U-a+1]||!g[U+a-1]||!g[U+a+1],I?(A[U]=1,P.push(U)):O.push(U)}const M=Be(g,A,new Uint32Array(O),new Uint32Array(P),a,u);performance.now();const j=Ae(M,g,A,a,u);let F=0,W;for(let v=0;v<O.length;v++){const R=O[v];j[R]>F&&(F=j[R])}const k=document.createElement("canvas");k.width=a,k.height=u;const D=k.getContext("2d"),T=D.createImageData(a,u);for(let v=0;v<u;v++)for(let R=0;R<a;R++){const U=v*a+R,I=U*4;if(!g[U])T.data[I]=255,T.data[I+1]=255,T.data[I+2]=255,T.data[I+3]=0;else{const N=255*(1-j[U]/F);T.data[I]=N,T.data[I+1]=N,T.data[I+2]=N,T.data[I+3]=255}}D.putImageData(T,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(k,0,0,a,u,0,0,f,h);const V=i.getImageData(0,0,f,h),X=document.createElement("canvas");X.width=f,X.height=h;const Y=X.getContext("2d");Y.drawImage(r,0,0,f,h);const ne=Y.getImageData(0,0,f,h);for(let v=0;v<V.data.length;v+=4){const R=ne.data[v+3],U=V.data[v+3];R===0?(V.data[v]=255,V.data[v+1]=0):(V.data[v]=U===0?0:V.data[v],V.data[v+1]=R),V.data[v+2]=255,V.data[v+3]=255}i.putImageData(V,0,0),W=V,e.toBlob(v=>{if(!v){s(new Error("Failed to create PNG blob"));return}c({imageData:W,pngBlob:v})},"image/png")},r.onerror=()=>s(new Error("Failed to load image")),r.src=typeof t=="string"?t:URL.createObjectURL(t)})}function Be(t,e,i,o,c,s){const n=i.length,r=new Int32Array(n*4);for(let p=0;p<n;p++){const d=i[p],f=d%c,h=Math.floor(d/c);r[p*4+0]=f<c-1&&t[d+1]?d+1:-1,r[p*4+1]=f>0&&t[d-1]?d-1:-1,r[p*4+2]=h>0&&t[d-c]?d-c:-1,r[p*4+3]=h<s-1&&t[d+c]?d+c:-1}return{interiorPixels:i,boundaryPixels:o,pixelCount:n,neighborIndices:r}}function Ae(t,e,i,o,c){const s=re.iterations,n=.01,r=new Float32Array(o*c),{interiorPixels:p,neighborIndices:d,pixelCount:f}=t;performance.now();const h=1.9,S=[],B=[];for(let x=0;x<f;x++){const a=p[x],u=a%o,m=Math.floor(a/o);(u+m)%2===0?S.push(x):B.push(x)}for(let x=0;x<s;x++){for(const a of S){const u=p[a],m=d[a*4+0],w=d[a*4+1],E=d[a*4+2],b=d[a*4+3];let g=0;m>=0&&(g+=r[m]),w>=0&&(g+=r[w]),E>=0&&(g+=r[E]),b>=0&&(g+=r[b]);const A=(n+g)/4;r[u]=h*A+(1-h)*r[u]}for(const a of B){const u=p[a],m=d[a*4+0],w=d[a*4+1],E=d[a*4+2],b=d[a*4+3];let g=0;m>=0&&(g+=r[m]),w>=0&&(g+=r[w]),E>=0&&(g+=r[E]),b>=0&&(g+=r[b]);const A=(n+g)/4;r[u]=h*A+(1-h)*r[u]}}return r}const Ie={none:0,circle:1,daisy:2,diamond:3,metaballs:4};function J(t){if(Array.isArray(t))return t.length===4?t:t.length===3?[...t,1]:G;if(typeof t!="string")return G;let e,i,o,c=1;if(t.startsWith("#"))[e,i,o,c]=Ve(t);else if(t.startsWith("rgb")){const s=Te(t);if(s===null)return G;[e,i,o,c]=s}else if(t.startsWith("hsl")){const s=ze(t);if(s===null)return G;[e,i,o,c]=Me(s)}else return console.error("Unsupported color format",t),G;return[H(e,0,1),H(i,0,1),H(o,0,1),H(c,0,1)]}function Ve(t){if(t=t.replace(/^#/,""),(t.length===3||t.length===4)&&(t=t.split("").map(s=>s+s).join("")),t.length===6&&(t=t+"ff"),!/^[0-9a-f]{8}$/i.test(t))return console.warn("Invalid hex color"),G;const e=parseInt(t.slice(0,2),16)/255,i=parseInt(t.slice(2,4),16)/255,o=parseInt(t.slice(4,6),16)/255,c=parseInt(t.slice(6,8),16)/255;return[e,i,o,c]}function Te(t){const e=t.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0")/255,parseInt(e[2]??"0")/255,parseInt(e[3]??"0")/255,e[4]===void 0?1:parseFloat(e[4])]:null}function ze(t){const e=t.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0"),parseInt(e[2]??"0"),parseInt(e[3]??"0"),e[4]===void 0?1:parseFloat(e[4])]:null}function Me(t){const[e,i,o,c]=t,s=e/360,n=i/100,r=o/100;let p,d,f;if(i===0)p=d=f=r;else{const h=(x,a,u)=>(u<0&&(u+=1),u>1&&(u-=1),u<.16666666666666666?x+(a-x)*6*u:u<.5?a:u<.6666666666666666?x+(a-x)*(.6666666666666666-u)*6:x),S=r<.5?r*(1+n):r+n-r*n,B=2*r-S;p=h(B,S,s+1/3),d=h(B,S,s),f=h(B,S,s-1/3)}return[p,d,f,c]}const H=(t,e,i)=>Math.min(Math.max(t,e),i),G=[.5,.5,.5,1],Ce="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function Le(t){const e=_.useRef(void 0),i=_.useCallback(o=>{const c=t.map(s=>{if(s!=null){if(typeof s=="function"){const n=s,r=n(o);return typeof r=="function"?r:()=>{n(null)}}return s.current=o,()=>{s.current=null}}});return()=>{c.forEach(s=>s==null?void 0:s())}},t);return _.useMemo(()=>t.every(o=>o==null)?null:o=>{e.current&&(e.current(),e.current=void 0),o!=null&&(e.current=i(o))},t)}function ee(t){if(t.naturalWidth<1024&&t.naturalHeight<1024){if(t.naturalWidth<1||t.naturalHeight<1)return;const e=t.naturalWidth/t.naturalHeight;t.width=Math.round(e>1?1024*e:1024),t.height=Math.round(e>1?1024:1024/e)}}async function te(t){const e={},i=[],o=s=>{try{return s.startsWith("/")||new URL(s),!0}catch{return!1}},c=s=>{try{return s.startsWith("/")?!1:new URL(s,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(t).forEach(([s,n])=>{if(typeof n=="string"){const r=n||Ce;if(!o(r)){console.warn(`Uniform "${s}" has invalid URL "${r}". Skipping image loading.`);return}const p=new Promise((d,f)=>{const h=new Image;c(r)&&(h.crossOrigin="anonymous"),h.onload=()=>{ee(h),e[s]=h,d()},h.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${r}`),f()},h.src=r});i.push(p)}else if(n instanceof HTMLImageElement){const r=n.decode().then(()=>{ee(n),e[s]=n});i.push(r)}else e[s]=n}),await Promise.all(i),e}const se=_.forwardRef(function({fragmentShader:e,uniforms:i,webGlContextAttributes:o,speed:c=0,frame:s=0,width:n,height:r,minPixelRatio:p,maxPixelCount:d,mipmaps:f,style:h,...S},B){const[x,a]=_.useState(!1),u=_.useRef(null),m=_.useRef(null),w=_.useRef(o);_.useEffect(()=>((async()=>{const g=await te(i);u.current&&!m.current&&(m.current=new me(u.current,e,g,w.current,c,s,p,d,f),a(!0))})(),()=>{var g;(g=m.current)==null||g.dispose(),m.current=null}),[e]),_.useEffect(()=>{let b=!1;return(async()=>{var P;const A=await te(i);b||(P=m.current)==null||P.setUniforms(A)})(),()=>{b=!0}},[i,x]),_.useEffect(()=>{var b;(b=m.current)==null||b.setSpeed(c)},[c,x]),_.useEffect(()=>{var b;(b=m.current)==null||b.setMaxPixelCount(d)},[d,x]),_.useEffect(()=>{var b;(b=m.current)==null||b.setMinPixelRatio(p)},[p,x]),_.useEffect(()=>{var b;(b=m.current)==null||b.setFrame(s)},[s,x]);const E=Le([u,B]);return z.jsx("div",{ref:E,style:n!==void 0||r!==void 0?{width:typeof n=="string"&&isNaN(+n)===!1?+n:n,height:typeof r=="string"&&isNaN(+r)===!1?+r:r,...h}:h,...S})});se.displayName="ShaderMount";const ie="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",Pe=t=>typeof t=="object"&&typeof t.then=="function",oe=[];function De(t,e){if(t===e)return!0;if(!t||!e)return!1;const i=t.length;if(e.length!==i)return!1;for(let o=0;o<i;o++)if(t[o]!==e[o])return!1;return!0}function Oe(t,e=null){e===null&&(e=[t]);for(const o of oe)if(De(e,o.keys)){if(Object.prototype.hasOwnProperty.call(o,"error"))throw o.error;if(Object.prototype.hasOwnProperty.call(o,"response"))return o.response;throw o.promise}const i={keys:e,promise:(Pe(t)?t:t(...e)).then(o=>{i.response=o}).catch(o=>i.error=o)};throw oe.push(i),i.promise}const Fe=(t,e)=>Oe(t,e),y={params:{...be,scale:.6,speed:1,frame:0,colorBack:"#AAAAAC",colorTint:"#ffffff",distortion:.07,repetition:2,shiftRed:.3,shiftBlue:.3,contour:.4,softness:.1,angle:70,shape:"diamond"}},We=_.memo(function({colorBack:e=y.params.colorBack,colorTint:i=y.params.colorTint,speed:o=y.params.speed,frame:c=y.params.frame,image:s="",contour:n=y.params.contour,distortion:r=y.params.distortion,softness:p=y.params.softness,repetition:d=y.params.repetition,shiftRed:f=y.params.shiftRed,shiftBlue:h=y.params.shiftBlue,angle:S=y.params.angle,shape:B=y.params.shape,suspendWhenProcessingImage:x=!1,fit:a=y.params.fit,scale:u=y.params.scale,rotation:m=y.params.rotation,originX:w=y.params.originX,originY:E=y.params.originY,offsetX:b=y.params.offsetX,offsetY:g=y.params.offsetY,worldWidth:A=y.params.worldWidth,worldHeight:P=y.params.worldHeight,...O}){const M=typeof s=="string"?s:s.src,[j,F]=_.useState(ie);let W;x&&typeof window<"u"&&M?W=Fe(()=>Z(M).then(D=>URL.createObjectURL(D.pngBlob)),[M,"liquid-metal"]):W=j,_.useLayoutEffect(()=>{if(x)return;if(!M){F(ie);return}let D,T=!0;return Z(M).then(V=>{T&&(D=URL.createObjectURL(V.pngBlob),F(D))}),()=>{T=!1}},[M,x]);const k={u_colorBack:J(e),u_colorTint:J(i),u_image:W,u_contour:n,u_distortion:r,u_softness:p,u_repetition:d,u_shiftRed:f,u_shiftBlue:h,u_angle:S,u_isImage:!!s,u_shape:Ie[B],u_fit:we[a],u_scale:u,u_rotation:m,u_offsetX:b,u_offsetY:g,u_originX:w,u_originY:E,u_worldWidth:A,u_worldHeight:P};return z.jsx(se,{...O,speed:o,frame:c,fragmentShader:Ee,mipmaps:["u_image"],uniforms:k})});async function ke(){const t=`900 ${L.size}px "Fraunces Variable"`;await document.fonts.load(t,L.text),await document.fonts.ready;const e=document.createElement("canvas").getContext("2d");if(!e)throw new Error("no 2d context for the wordmark");e.font=t;const i=e.measureText(L.text),o=document.createElement("canvas");o.width=Math.ceil(i.actualBoundingBoxLeft+i.actualBoundingBoxRight)+L.pad*2,o.height=Math.ceil(i.actualBoundingBoxAscent+i.actualBoundingBoxDescent)+L.pad*2;const c=o.getContext("2d");if(!c)throw new Error("no 2d context for the wordmark");return c.font=t,c.fillStyle=ue[900],c.fillText(L.text,L.pad+i.actualBoundingBoxLeft,L.pad+i.actualBoundingBoxAscent),o.toDataURL("image/png")}const Ge=1e4;function Qe({active:t,onReady:e,onFail:i}){const o=_.useRef(null),[c,s]=_.useState(null),[n,r]=_.useState(null),[p,d]=_.useState(()=>{var a;return!!((a=window.matchMedia)!=null&&a.call(window,"(prefers-reduced-motion: reduce)").matches)}),[f,h]=_.useState(()=>document.hidden),S=_.useId().replace(/:/g,""),B=_.useRef(e),x=_.useRef(i);return _.useEffect(()=>{B.current=e,x.current=i}),_.useEffect(()=>{let a=!0;return ke().then(u=>{a&&s(u)}).catch(()=>x.current()),()=>{a=!1}},[]),_.useEffect(()=>{const a=o.current;if(!a)return;const u=()=>{const w=a.getBoundingClientRect();w.width<1||w.height<1||r(E=>E&&Math.abs(E.w-w.width)<1&&Math.abs(E.h-w.height)<1?E:{w:w.width,h:w.height})};u();const m=new ResizeObserver(u);return m.observe(a),()=>m.disconnect()},[]),_.useEffect(()=>{var m;const a=(m=window.matchMedia)==null?void 0:m.call(window,"(prefers-reduced-motion: reduce)");if(!a)return;const u=()=>d(a.matches);return a.addEventListener("change",u),()=>a.removeEventListener("change",u)},[]),_.useEffect(()=>{const a=()=>h(document.hidden);return document.addEventListener("visibilitychange",a),()=>document.removeEventListener("visibilitychange",a)},[]),_.useEffect(()=>{if(!c)return;const a=o.current;if(!a)return;let u=0,m=null;const w=()=>x.current(),E=performance.now(),b=()=>{m=a.querySelector("canvas"),m&&m.width>0?(m.addEventListener("webglcontextlost",w),u=requestAnimationFrame(()=>B.current())):performance.now()-E>Ge?x.current():u=requestAnimationFrame(b)};return u=requestAnimationFrame(b),()=>{var A;if(cancelAnimationFrame(u),!m)return;m.removeEventListener("webglcontextlost",w);const g=m.getContext("webgl2")??m.getContext("webgl");(A=g==null?void 0:g.getExtension("WEBGL_lose_context"))==null||A.loseContext()}},[c]),z.jsxs("div",{ref:o,className:"ink-live-fill",children:[z.jsx("svg",{width:"0",height:"0",className:"ink-defs","aria-hidden":"true",focusable:"false",children:z.jsxs("filter",{id:S,colorInterpolationFilters:"sRGB",children:[z.jsx("feColorMatrix",{type:"matrix",values:de}),z.jsxs("feComponentTransfer",{children:[z.jsx("feFuncR",{type:"table",tableValues:$(16)}),z.jsx("feFuncG",{type:"table",tableValues:$(8)}),z.jsx("feFuncB",{type:"table",tableValues:$(0)})]})]})}),c&&n&&z.jsx(We,{image:c,colorBack:le(q[100],0),colorTint:q[50],repetition:C.repetition,softness:C.softness,distortion:C.distortion,contour:C.contour,angle:C.angle,shiftRed:C.shiftRed,shiftBlue:C.shiftBlue,speed:fe(t,p,f),frame:C.frame,fit:"contain",scale:1,minPixelRatio:1,maxPixelCount:he(n.w,n.h),suspendWhenProcessingImage:!0,style:{width:"100%",height:"100%",filter:`url(#${S})`}})]})}export{Qe as default};
