import { useEffect, useRef } from "react";

/**
 * The sea under the hero chart — the same idea as the map's FlowLayer (motes
 * advected along the wind, drawn in chart ink with fading trails) without
 * Leaflet underneath it.
 *
 * Doctrine, as for FlowLayer: pure decoration. It carries no information the
 * SVG chart above it does not already state, so it loads late, pauses when
 * off-screen or on a hidden tab, and is never mounted under reduced motion.
 */

export type SeaField =
  | { kind: "breeze"; u: number; v: number }
  | { kind: "vortex"; cx: number; cy: number; reach: number };

interface Mote {
  x: number;
  y: number;
  age: number;
  life: number;
}

const DPR_CAP = 1.5;
const FRAME_MS = 1000 / 40;

function velocity(f: SeaField, x: number, y: number, t: number): [number, number] {
  // A slow meander so no two streaks run perfectly parallel.
  const wob = Math.sin(x * 0.021 + t * 0.0004) * Math.cos(y * 0.027 - t * 0.0003);
  if (f.kind === "breeze") {
    return [f.u + wob * 0.22 * Math.abs(f.v || f.u), f.v + wob * 0.22 * Math.abs(f.u || f.v)];
  }
  const dx = x - f.cx;
  const dy = y - f.cy;
  const r = Math.hypot(dx, dy) || 1;
  // Strongest at the eyewall, easing off with distance; a slight inflow.
  const s = 2.1 * Math.min(1, r / 34) * Math.min(1, (f.reach * 1.9) / r);
  return [(dy / r) * s - (dx / r) * s * 0.22, (-dx / r) * s - (dy / r) * s * 0.22];
}

export default function HeroSea({
  field,
  land,
  width,
  height,
}: {
  field: SeaField;
  /** SVG path of the land, in the chart's viewBox units — motes stay off it. */
  land: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef(field);
  const landRef = useRef(land);
  fieldRef.current = field;
  landRef.current = land;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--chart-teal").trim() ||
      "currentColor";

    let scale = 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let landPath = new Path2D(landRef.current);
    let landSrc = landRef.current;
    const motes: Mote[] = [];

    const spawn = (m: Mote) => {
      m.x = Math.random() * width;
      m.y = Math.random() * height;
      m.age = 0;
      m.life = 60 + Math.random() * 90;
    };
    for (let i = 0; i < 240; i++) {
      const m = { x: 0, y: 0, age: 0, life: 0 };
      spawn(m);
      m.age = Math.random() * m.life;
      motes.push(m);
    }

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      if (!box.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round((box.width * dpr * height) / width);
      scale = canvas.width / width;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      if (landSrc !== landRef.current) {
        landSrc = landRef.current;
        landPath = new Path2D(landSrc);
      }
      const f = fieldRef.current;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "source-over";
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      ctx.lineWidth = 1.05;
      for (const m of motes) {
        const [u, v] = velocity(f, m.x, m.y, now);
        const nx = m.x + u;
        const ny = m.y + v;
        m.age += 1;
        const out = nx < -4 || nx > width + 4 || ny < -4 || ny > height + 4;
        if (out || m.age > m.life || ctx.isPointInPath(landPath, nx * scale, ny * scale)) {
          spawn(m);
          continue;
        }
        // Fade in and out over a mote's life so nothing pops.
        const k = Math.min(1, m.age / 12, (m.life - m.age) / 18);
        ctx.globalAlpha = 0.42 * Math.max(0, k);
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        m.x = nx;
        m.y = ny;
      }
      ctx.globalAlpha = 1;
      if (canvas.dataset.live !== "1") canvas.dataset.live = "1";
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", run);
    run();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, [width, height]);

  return <canvas ref={ref} aria-hidden className="hero-sea absolute inset-0 h-full w-full" />;
}
