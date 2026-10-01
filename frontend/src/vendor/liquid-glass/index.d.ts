/** Types for the vendored liquid-glass-js (see the header of index.js for what ORCA changed). */

export type GlassShape = "rounded" | "circle" | "pill";

/** Shader settings; anything left out keeps the library's default. */
export interface GlassControls {
  blurRadius?: number;
  edgeIntensity?: number;
  rimIntensity?: number;
  baseIntensity?: number;
  edgeDistance?: number;
  rimDistance?: number;
  baseDistance?: number;
  cornerBoost?: number;
  rippleEffect?: number;
}

export interface ContainerOptions {
  borderRadius?: number;
  type?: GlassShape;
  tintOpacity?: number;
  /** Bend the middle of the lens as well as its edge. */
  warp?: boolean;
  controls?: GlassControls;
  /** The first frame has been drawn. */
  onReady?: () => void;
  /** No WebGL, the snapshot failed, or the shader did not build. */
  onFail?: (error: unknown) => void;
}

export class Container {
  static instances: Container[];
  /** The one html2canvas picture of `document.body` that every lens refracts. */
  static pageSnapshot: HTMLCanvasElement | null;
  static isCapturing: boolean;
  /** Extra html2canvas options for the next snapshot (for example a height limit). */
  static snapshotOptions: () => Record<string, unknown>;
  /** Elements the snapshot leaves out. */
  static ignore: Set<Element>;
  /** How long the last snapshot took, in milliseconds. */
  static snapshotMs: number | null;

  constructor(options?: ContainerOptions);
  /** The wrapper `div.glass-container`; the caller puts it in the page. */
  element: HTMLDivElement;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | null;
  webglInitialized: boolean;
  disposed: boolean;
  /** Draws one frame; set once the shader is ready. */
  render: (() => void) | null | undefined;
  updateSizeFromDOM(): void;
  addChild<T extends Container>(child: T): T;
  removeChild(child: Container): void;
  dispose(): void;
}

export interface ButtonOptions {
  text?: string;
  size?: number | string;
  type?: GlassShape;
  warp?: boolean;
  tintOpacity?: number;
  onClick?: (text: string) => void;
}

/** Not used by ORCA: a div with its own text, not a real button. */
export class Button extends Container {
  constructor(options?: ButtonOptions);
}
