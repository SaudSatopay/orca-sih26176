import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CONTEXTS, effectsHere, type EffectName } from "./gate";
import { leases, releaseAfterLoss, type Lease } from "./contexts";
import { noteEffect } from "./ledger";
import { hasInteracted, onFirstInteraction } from "./interaction";

/** What every effect module's default export receives. */
export interface EffectProps {
  /** In view and on a visible tab. An effect draws nothing while this is false. */
  active: boolean;
  /** Call once the first frame is on screen; the slot then marks itself live. */
  onReady: () => void;
  /** Call if the effect cannot continue (context lost, shader failed): back to the poster. */
  onFail: () => void;
  /**
   * A higher-priority effect is waiting for a WebGL context (contexts.ts).
   * Only slots marked `yieldable` are ever asked. The effect finishes what
   * it is showing and calls `onYield`; the slot then unmounts it, gives the
   * context back and queues for a new one.
   */
  yieldRequested?: boolean;
  onYield?: () => void;
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

/** How long a slot may sit outside the near zone before its effect is unmounted. */
export const AWAY_MS = 1500;
/** The near zone: this far past the viewport an effect is mounted ahead of time. */
const NEAR_MARGIN = "400px 0px";
/**
 * A lease whose canvases were never seen (the effect left before its first
 * frame) is held this long after unmount: React Three Fiber drops its
 * context 500 ms after the canvas goes.
 */
const UNSEEN_RELEASE_MS = 700;

/**
 * Poster first. The poster is rendered at once and is the whole design; the
 * effect, if this browser may run it (gate.ts), is fetched after the page has
 * painted and gone quiet, mounted on top, and told when it is out of view.
 * If it throws or loses its context, the slot is the poster again.
 *
 * A WebGL effect is mounted only under a context lease (contexts.ts), and
 * with `releaseWhenAway` (the default for WebGL) it is unmounted once the
 * slot has been out of the near zone for AWAY_MS: the poster shows, the
 * context is lost, and the lease goes back once the loss is confirmed. It
 * mounts again when the slot comes near.
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
  releaseWhenAway,
  yieldable = false,
  armOn = "idle",
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
  /** Unmount (and free the context) while far out of view. Default: on for WebGL effects. */
  releaseWhenAway?: boolean;
  /** The effect can step aside when a higher-priority effect needs its context. */
  yieldable?: boolean;
  /**
   * When the slot starts its way to the effect: "idle" (after first paint,
   * once the page is quiet) or "interaction" (not before the visitor's first
   * pointer move, wheel, scroll, touch or key). Use "interaction" for an
   * effect whose start-up is heavy and that sits in the load window above
   * the fold, so the load is measured, and felt, with the poster alone.
   */
  armOn?: "idle" | "interaction";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const may = useMemo(() => effectsHere().includes(name), [name]);
  const leased = CONTEXTS[name] > 0;
  const releaseAway = releaseWhenAway ?? leased;
  const [armed, setArmed] = useState(() => armOn === "idle" || hasInteracted());
  const [idle, setIdle] = useState(false);
  /** In the near zone right now. */
  const [near, setNear] = useState(eager);
  /** Has ever been near: an effect never mounts before it first comes near. */
  const [cameNear, setCameNear] = useState(eager);
  const [away, setAway] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [held, setHeld] = useState(false);
  const [yielding, setYielding] = useState(false);
  const [stepAside, setStepAside] = useState(false);
  /** The canvases the running effect drew into, and which of them have lost their context. */
  const canvases = useRef(new Set<HTMLCanvasElement>());
  const lost = useRef(new WeakSet<HTMLCanvasElement>());

  // Armed on "interaction": nothing at all happens until the visitor first
  // moves, scrolls, touches or types. The page loads (and is measured) with
  // the poster alone; the effect's compile lands after the load window.
  useEffect(() => {
    if (!may || armed) return;
    return onFirstInteraction(() => setArmed(true));
  }, [may, armed]);

  // After first paint (and arming), once the page has gone quiet.
  useEffect(() => {
    if (!may || !armed) return;
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
  }, [may, armed]);

  useEffect(() => {
    if (!may || !ref.current) return;
    const el = ref.current;
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (eager) return;
        setNear(e.isIntersecting);
        if (e.isIntersecting) {
          setCameNear(true);
          setAway(false);
        }
      },
      { rootMargin: NEAR_MARGIN },
    );
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
  }, [may, eager]);

  // Out of the near zone for a while: let the effect go (the poster is the design).
  useEffect(() => {
    if (!may || !releaseAway || near) return;
    const timer = window.setTimeout(() => setAway(true), AWAY_MS);
    return () => window.clearTimeout(timer);
  }, [may, releaseAway, near]);

  const wanted = may && idle && cameNear && !away && !failed && !stepAside;

  // The lease: asked for when the effect is wanted, handed back once its
  // context is really gone. Effects without a context skip this.
  useEffect(() => {
    if (!leased || !wanted) return;
    const ctl = new AbortController();
    let lease: Lease | null = null;
    leases
      .acquire(name, {
        signal: ctl.signal,
        count: CONTEXTS[name],
        onYield: yieldable ? () => setYielding(true) : undefined,
      })
      .then(
        (l) => {
          // Granted in the same breath as the slot gave up: nothing was opened.
          if (ctl.signal.aborted) return l.release();
          lease = l;
          setHeld(true);
        },
        () => {},
      );
    const seen = canvases.current;
    const gone = lost.current;
    return () => {
      ctl.abort();
      setHeld(false);
      setLive(false);
      setYielding(false);
      setStepAside(false);
      if (!lease) return;
      const drawn = [...seen];
      seen.clear();
      if (drawn.length > 0) releaseAfterLoss(lease, drawn, gone);
      else window.setTimeout(lease.release, UNSEEN_RELEASE_MS);
    };
  }, [leased, wanted, name, yieldable]);

  const mount = wanted && (!leased || held);
  const isLive = mount && live;

  useEffect(() => {
    noteEffect(name, !may ? "poster" : failed ? "failed" : isLive ? "live" : mount ? "loading" : "waiting");
  }, [name, may, failed, isLive, mount]);

  const fail = useCallback(() => {
    setFailed(true);
    setLive(false);
  }, []);

  const ready = useCallback(() => {
    // Remember the canvases this effect drew into, so its lease is handed
    // back only once their contexts are lost.
    box.current?.querySelectorAll("canvas").forEach((c) => {
      if (canvases.current.has(c)) return;
      canvases.current.add(c);
      c.addEventListener("webglcontextlost", () => lost.current.add(c), { once: true });
    });
    setLive(true);
  }, []);

  const yieldNow = useCallback(() => setStepAside(true), []);

  return (
    <div ref={ref} className={className} style={style} data-effect={name} data-live={isLive ? 1 : 0}>
      {poster}
      {mount && (
        <Fuse onBlow={fail}>
          <Suspense fallback={null}>
            <div ref={box} className={effectClassName} aria-hidden>
              <Effect
                active={inView && tabVisible}
                onReady={ready}
                onFail={fail}
                yieldRequested={yielding}
                onYield={yieldNow}
              />
            </div>
          </Suspense>
        </Fuse>
      )}
    </div>
  );
}
