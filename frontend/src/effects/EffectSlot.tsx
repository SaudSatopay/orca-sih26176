import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { effectsHere, type EffectName } from "./gate";
import { noteEffect } from "./ledger";

/** What every effect module's default export receives. */
export interface EffectProps {
  /** In view and on a visible tab. An effect draws nothing while this is false. */
  active: boolean;
  /** Call once the first frame is on screen; the slot then marks itself live. */
  onReady: () => void;
  /** Call if the effect cannot continue (context lost, shader failed): back to the poster. */
  onFail: () => void;
}

class Fuse extends Component<{ onBlow: () => void; children: ReactNode }, { blown: boolean }> {
  state = { blown: false };
  static getDerivedStateFromError() {
    return { blown: true };
  }
  componentDidCatch() {
    this.props.onBlow();
  }
  render() {
    return this.state.blown ? null : this.props.children;
  }
}

/**
 * Poster first. The poster is rendered at once and is the whole design; the
 * effect, if this browser may run it (gate.ts), is fetched after the page has
 * painted and gone quiet, mounted on top, and told when it is out of view.
 * If it throws or loses its context, the slot is the poster again.
 *
 * `data-effect` and `data-live` are on the slot so a stylesheet can step the
 * poster back once the effect is really drawing (`[data-live="1"] .poster`).
 */
export function EffectSlot({
  name,
  Effect,
  poster,
  className = "",
  style,
  effectClassName = "absolute inset-0",
  eager = false,
}: {
  name: EffectName;
  /**
   * The effect, as a `React.lazy` component created at module scope by the
   * caller: `const Sea = lazy(() => import("../effects/SeaGradient"))`. Its
   * chunk is requested the first time the slot mounts it, never before.
   */
  Effect: ComponentType<EffectProps>;
  poster: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Class on the element that holds the running effect. */
  effectClassName?: string;
  /** Mount as soon as the page is idle, even if the slot is below the fold. */
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const may = useMemo(() => effectsHere().includes(name), [name]);
  const [idle, setIdle] = useState(false);
  const [near, setNear] = useState(eager);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);

  // After first paint, once the page has gone quiet.
  useEffect(() => {
    if (!may) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const timer = window.setTimeout(() => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      else setIdle(true);
    }, 600);
    return () => {
      window.clearTimeout(timer);
      if (idleId != null) w.cancelIdleCallback?.(idleId);
    };
  }, [may]);

  useEffect(() => {
    if (!may || !ref.current) return;
    const el = ref.current;
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "400px 0px",
    });
    const viewIo = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    nearIo.observe(el);
    viewIo.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      nearIo.disconnect();
      viewIo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [may]);

  const mount = may && idle && near && !failed;
  const isLive = mount && live;

  useEffect(() => {
    noteEffect(name, !may ? "poster" : failed ? "failed" : isLive ? "live" : mount ? "loading" : "waiting");
  }, [name, may, failed, isLive, mount]);

  const fail = () => {
    setFailed(true);
    setLive(false);
  };

  return (
    <div ref={ref} className={className} style={style} data-effect={name} data-live={isLive ? 1 : 0}>
      {poster}
      {mount && (
        <Fuse onBlow={fail}>
          <Suspense fallback={null}>
            <div className={effectClassName} aria-hidden>
              <Effect active={inView && tabVisible} onReady={() => setLive(true)} onFail={fail} />
            </div>
          </Suspense>
        </Fuse>
      )}
    </div>
  );
}
