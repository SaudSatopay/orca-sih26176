/** Types for the vendored liquid-glass-js (see the header of index.js for what ORCA changed). */

/** Shader settings; anything left out keeps the module's default. All in CSS px. */
export interface GlassControls {
  /** Blur of the refracted sample, px. Keep at 1 or under: anti-aliasing, not frost. */
  blurRadius?: number;
  /** Outward displacement at the lens edge, px. */
  edgeIntensity?: number;
  /** 1/px decay of the edge term. */
  edgeDistance?: number;
  /** Outward displacement at the rim, px — the visible bend. */
  rimIntensity?: number;
  /** 1/px decay of the rim term. */
  rimDistance?: number;
  /** Extra displacement in the corners, px. */
  cornerBoost?: number;
  /** Perpendicular ripple at the rim, px. */
  rippleEffect?: number;
}

export interface LensOptions {
  /** The backdrop the lens refracts — built by the caller, never a page snapshot. */
  texture: TexImageSource;
  /** Logical (CSS px) size of the texture region. */
  textureSize: { width: number; height: number };
  /** Device pixel ratio for the rendered still. */
  dpr?: number;
  /** Corner radius, CSS px (house radius is 2–3). */
  radius?: number;
  /** Body magnification; 1.08–1.18 reads as a loupe. */
  magnify?: number;
  /** Flat tint colour, 0..1 channels (from a design token). */
  tint?: { r: number; g: number; b: number };
  tintOpacity?: number;
  controls?: GlassControls;
}

export interface LensView {
  width: number;
  height: number;
  /** Centre of the magnified spot, in texture-region CSS px. */
  centerX: number;
  centerY: number;
}

/**
 * One lens over one texture region: set a view, render, copy the still out,
 * repeat for the next view, then dispose. The constructor throws when WebGL
 * is unavailable, the shader does not build, or the texture upload fails
 * (e.g. a tainted canvas) — the caller falls back to CSS.
 */
export class Lens {
  constructor(options: LensOptions);
  canvas: HTMLCanvasElement | null;
  gl: WebGLRenderingContext | null;
  disposed: boolean;
  setView(view: LensView): void;
  render(): void;
  /** The current frame as a plain 2D canvas at the lens's dpr. */
  copyStill(): HTMLCanvasElement;
  /** Frees GL objects and loses the context. */
  dispose(): void;
}
