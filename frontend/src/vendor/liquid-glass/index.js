/**
 * liquid-glass-js by Armagan Amcalar (dashersw/liquid-glass-js, MIT: see
 * LICENSE beside this file), vendored and reworked for ORCA. The refraction
 * model — a signed-distance field of the lens shape driving edge, rim and
 * corner displacement of a texture sample, plus a perpendicular ripple and a
 * small gaussian blur — is the library's; everything around it has been
 * rebuilt so a lens is a one-shot renderer over a caller-supplied texture.
 *
 * Changed for ORCA (first vendoring, commit 73f4b58, kept here):
 *   - no console output; failures go to the caller (throw / return null);
 *   - shader settings come from the constructor's options, not window globals;
 *   - dispose() frees the GL objects and loses the WebGL context;
 *   - no drop shadow, no z-index: the host styles the canvas.
 *
 * Changed for ORCA (this rework):
 *   - html2canvas is GONE and must not come back (it blocked the main thread
 *     for ~0.6 s). The lens refracts a texture the caller built itself
 *     (effects/glassBackdrop.ts paints the surfaces under the lens);
 *   - the Container/Button DOM classes are gone. `Lens` owns one detached
 *     canvas, never inserted into the page; the caller copies stills out of
 *     it (`copyStill()`) and the GL context is released with `dispose()`, so
 *     at rest the page holds zero live WebGL contexts;
 *   - the shader is rounded-rectangle only (the house radius is 2–3 px; the
 *     pill and circle paths were dead weight);
 *   - new uniform u_magnify: a true magnification term — the body of the
 *     lens samples the texture compressed toward its centre, so what is
 *     under the glass reads larger (a loupe), not just bent at the rim;
 *   - new uniforms u_center / u_textureSize map the lens into the caller's
 *     texture region (the old code assumed a snapshot of the whole page and
 *     tracked scroll; a still over a known region needs neither);
 *   - the white→grey "tint gradient" and the 400-sample "sampled gradient"
 *     are gone (they were the frosted-panel look, and the hot loop). In
 *     their place one flat tint uniform (u_tint, u_tintOpacity), set from a
 *     design token by the caller;
 *   - displacement intensities are in CSS pixels (the old values were in
 *     whole-page texture coordinates);
 *   - output is premultiplied alpha (vec4(rgb * mask, mask)) so the mask
 *     edge composites cleanly when the still is drawn onto the page;
 *   - the canvas renders at the caller's devicePixelRatio; all uniforms stay
 *     in CSS pixels.
 */

const VS = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_texcoord = a_texcoord;
}
`;

const FS = `
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
`;

/**
 * One lens over one texture region. The caller renders as many stills as it
 * needs by moving the view, copies each out, then disposes. Throws from the
 * constructor if WebGL or the shader is unavailable; texture upload failures
 * (a tainted canvas) throw from the constructor too.
 */
export class Lens {
  /**
   * @param {{
   *   texture: TexImageSource,
   *   textureSize: { width: number, height: number },
   *   dpr?: number,
   *   radius?: number,
   *   magnify?: number,
   *   tint?: { r: number, g: number, b: number },
   *   tintOpacity?: number,
   *   controls?: {
   *     blurRadius?: number, edgeIntensity?: number, edgeDistance?: number,
   *     rimIntensity?: number, rimDistance?: number, cornerBoost?: number,
   *     rippleEffect?: number,
   *   },
   * }} options
   */
  constructor(options) {
    this.dpr = options.dpr || 1;
    this.radius = options.radius ?? 3;
    this.magnify = options.magnify ?? 1.12;
    this.tint = options.tint ?? { r: 1, g: 1, b: 1 };
    this.tintOpacity = options.tintOpacity ?? 0;
    this.controls = options.controls || {};
    this.textureSize = options.textureSize;
    this.disposed = false;

    this.canvas = document.createElement("canvas");
    const gl =
      this.canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: false }) ||
      this.canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;

    const program = this.#createProgram(VS, FS);
    if (!program) throw new Error("shader failed to build");
    this.program = program;
    gl.useProgram(program);

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW);
    const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    /* Throws on a tainted source: the caller falls back to CSS. */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, options.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (name) => gl.getUniformLocation(program, name);
    this.u = {
      resolution: u("u_resolution"),
      textureSize: u("u_textureSize"),
      center: u("u_center"),
      radius: u("u_radius"),
      magnify: u("u_magnify"),
      blurRadius: u("u_blurRadius"),
      edgeIntensity: u("u_edgeIntensity"),
      edgeDistance: u("u_edgeDistance"),
      rimIntensity: u("u_rimIntensity"),
      rimDistance: u("u_rimDistance"),
      cornerBoost: u("u_cornerBoost"),
      rippleEffect: u("u_rippleEffect"),
      tint: u("u_tint"),
      tintOpacity: u("u_tintOpacity"),
    };

    const c = this.controls;
    gl.uniform2f(this.u.textureSize, this.textureSize.width, this.textureSize.height);
    gl.uniform1f(this.u.radius, this.radius);
    gl.uniform1f(this.u.magnify, this.magnify);
    gl.uniform1f(this.u.blurRadius, c.blurRadius ?? 0.8);
    gl.uniform1f(this.u.edgeIntensity, c.edgeIntensity ?? 5.0);
    gl.uniform1f(this.u.edgeDistance, c.edgeDistance ?? 0.16);
    gl.uniform1f(this.u.rimIntensity, c.rimIntensity ?? 9.0);
    gl.uniform1f(this.u.rimDistance, c.rimDistance ?? 0.55);
    gl.uniform1f(this.u.cornerBoost, c.cornerBoost ?? 2.0);
    gl.uniform1f(this.u.rippleEffect, c.rippleEffect ?? 0.0);
    gl.uniform3f(this.u.tint, this.tint.r, this.tint.g, this.tint.b);
    gl.uniform1f(this.u.tintOpacity, this.tintOpacity);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(u("u_image"), 0);
    gl.clearColor(0, 0, 0, 0);
  }

  /**
   * Point the lens at one spot: its CSS size and the centre of the area it
   * magnifies, in texture-region coordinates.
   */
  setView({ width, height, centerX, centerY }) {
    const gl = this.gl;
    this.viewWidth = width;
    this.viewHeight = height;
    this.canvas.width = Math.max(1, Math.round(width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(height * this.dpr));
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.u.resolution, width, height);
    gl.uniform2f(this.u.center, centerX, centerY);
  }

  /** Draw one frame. */
  render() {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /** The current frame as a plain 2D canvas (the GL canvas stays private). */
  copyStill() {
    const out = document.createElement("canvas");
    out.width = this.canvas.width;
    out.height = this.canvas.height;
    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");
    ctx.drawImage(this.canvas, 0, 0);
    return out;
  }

  /** Free the GL objects and lose the context: nothing lives after this. */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const gl = this.gl;
    gl.deleteTexture(this.texture);
    gl.deleteBuffer(this.positionBuffer);
    gl.deleteBuffer(this.texcoordBuffer);
    gl.deleteProgram(this.program);
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    this.gl = null;
    this.canvas = null;
  }

  #createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    return program;
  }
}
