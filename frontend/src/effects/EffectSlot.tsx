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
import { hasInteracted, onFirstInteraction, sinceFirstInteraction } from "./interaction";
import type { LazyEffect } from "./lazyEffect";
import { distanceFromReader, fetchAhead, fetchSoon, followHeading } from "./reader";

/** What every effect module's default export receives. */
export interface EffectProps {
  /**
   * Draw now. True in view on a visible tab, and also before the effect's
   * first frame wherever it is: an effect mounted a screen ahead draws that
   * frame off screen, then rests until its section is in view. An effect
   * draws nothing while this is false.
   */
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

/** How long a slot may sit outside the warm zone before its effect is unmounted. */
export const AWAY_MS = 1500;
/**
 * The warm zone: a whole screen above and below the viewport. Once the
 * visitor has moved, scrolled or touched, an effect here takes its context,
 * loads and draws its first frame off screen, so its section scrolls in
 * already drawn and simply starts moving, instead of trading its poster for
 * the live effect while the reader watches.
 */
export const WARM_MARGIN = "100% 0px";
/**
 * Slots out of view start this long after the first interaction, so the
 * effects that interaction armed on screen (the hero's ink and splash) take
 * their contexts first and nothing ahead is opened only to be closed again.
 */
export const LOOK_AHEAD_AFTER_MS = 1000;
/** An effect armed on "pointer" is let go this long after the pointer leaves its slot. */
export const POINTER_LINGER_MS = 4000;
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
 * Ahead of the reader. Until the visitor first moves, scrolls or touches,
 * a WebGL effect starts only once its slot is in view, so the page loads,
 * and is measured, with posters alone. After that, a slot within a screen of
 * the viewport (the warm zone) starts at once: it takes a context, mounts,
 * draws its first frame off screen and goes live there, then rests until it
 * is in view. The reader meets every section already drawn.
 *
 * A WebGL effect is mounted only under a context lease (contexts.ts): the
 * slots nearest the reader are served first, and one far behind the reader
 * gives its context back to one coming up. With `releaseWhenAway` (the
 * default for WebGL) it is also unmounted once the slot has been out of the
 * warm zone for AWAY_MS: the poster shows, the context is lost, and the
 * lease goes back once the loss is confirmed.
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
  fixed = false,
}: {
  name: EffectName;
  /**
   * The effect, as a lazy component created at module scope by the caller
   * with lazyEffect.ts: `const Sea = lazyEffect(() => import("../effects/SeaGradient"))`.
   * Its chunk is fetched ahead in idle time after the first interaction, or
   * the first time the slot mounts it, never during the load.
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
   * once the page is quiet), "interaction" (not before the visitor's first
   * pointer move, wheel, scroll, touch or key), or "pointer" (only while a
   * mouse is over the slot, and POINTER_LINGER_MS after it leaves). Use
   * "interaction" for an effect whose start-up is heavy and that sits in the
   * load window above the fold, so the load is measured, and felt, with the
   * poster alone. Use "pointer" for an effect that, left alone, draws exactly
   * its poster (water over a still sheet): it holds no context until touched.
   */
  armOn?: "idle" | "interaction" | "pointer";
  /**
   * The slot is fixed to the viewport (the splash), so always on screen. It
   * belongs to the top of the page: the farther the reader has scrolled, the
   * farther away it counts in the context queue.
   */
  fixed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const may = useMemo(() => effectsHere().includes(name), [name]);
  const leased = CONTEXTS[name] > 0;
  const releaseAway = releaseWhenAway ?? leased;
  const [interacted, setInteracted] = useState(hasInteracted);
  const armed = armOn === "idle" || (armOn === "interaction" && interacted);
  const [idle, setIdle] = useState(false);
  /** For "pointer": a mouse is over the slot, or left it a moment ago. */
  const [touched, setTouched] = useState(false);
  /** Within a screen of the viewport right now. */
  const [warm, setWarm] = useState(eager);
  const warmNow = useRef(eager);
  /** Has ever been warm: an effect never mounts before its section first comes within a screen. */
  const [cameNear, setCameNear] = useState(eager);
  const [away, setAway] = useState(false);
  const [inView, setInView] = useState(false);
  /**
   * May hold a context: in view, or warm once the visitor has interacted,
   * until it has been let go (away).
   */
  const [engaged, setEngaged] = useState(eager || !leased);
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [held, setHeld] = useState(false);
  const [yielding, setYielding] = useState(false);
  const [stepAside, setStepAside] = useState(false);
  /** The canvases the running effect drew into, and which of them have lost their context. */
  const canvases = useRef(new Set<HTMLCanvasElement>());
  const lost = useRef(new WeakSet<HTMLCanvasElement>());

  /** How far this slot is from the reader, for the context and fetch queues. */
  const distance = useCallback(() => {
    const el = ref.current;
    if (!el) return Number.POSITIVE_INFINITY;
    // A fixed sheet ranks behind every section on screen or coming up once
    // the reader has left the first screen, but never beyond the horizon.
    return fixed ? Math.min(window.scrollY, window.innerHeight) : distanceFromReader(el);
  }, [fixed]);

  // Start a screen ahead of the reader: only after the first interaction,
  // and not in the moment just after it.
  const ahead = useRef(0);
  const engageAhead = useCallback(() => {
    const since = sinceFirstInteraction();
    if (since < 0) return;
    window.clearTimeout(ahead.current);
    ahead.current = window.setTimeout(
      () => {
        if (warmNow.current) setEngaged(true);
      },
      Math.max(0, LOOK_AHEAD_AFTER_MS - since),
    );
  }, []);
  useEffect(() => () => window.clearTimeout(ahead.current), []);

  // The visitor's first move, scroll, touch or key arms "interaction" slots
  // and lets every slot start a screen ahead of the reader.
  useEffect(() => {
    if (!may || interacted) return;
    return onFirstInteraction(() => {
      setInteracted(true);
      if (warmNow.current) engageAhead();
    });
  }, [may, interacted, engageAhead]);

  // "pointer": wanted while a mouse is over the slot, let go a while after it
  // leaves. A fixed slot is always under the pointer and takes no pointer
  // events itself: it is wanted while the mouse moves anywhere, and let go a
  // while after it rests.
  useEffect(() => {
    if (!may || armOn !== "pointer" || !ref.current) return;
    const el = ref.current;
    let linger = 0;
    const rest = () => {
      window.clearTimeout(linger);
      linger = window.setTimeout(() => setTouched(false), POINTER_LINGER_MS);
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      window.clearTimeout(linger);
      setTouched(true);
      if (fixed) rest();
    };
    const target: EventTarget = fixed ? window : el;
    target.addEventListener("pointermove", over as EventListener, { passive: true });
    if (!fixed) {
      el.addEventListener("pointerenter", over);
      el.addEventListener("pointerleave", rest);
    }
    return () => {
      target.removeEventListener("pointermove", over as EventListener);
      el.removeEventListener("pointerenter", over);
      el.removeEventListener("pointerleave", rest);
      window.clearTimeout(linger);
    };
  }, [may, armOn, fixed]);

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
    followHeading();
    const el = ref.current;
    const warmIo = new IntersectionObserver(
      ([e]) => {
        if (eager) return;
        warmNow.current = e.isIntersecting;
        setWarm(e.isIntersecting);
        if (e.isIntersecting) {
          setCameNear(true);
          setAway(false);
          engageAhead();
        }
        leases.reconsider();
      },
      { rootMargin: WARM_MARGIN },
    );
    const viewIo = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) setEngaged(true);
      leases.reconsider();
    });
    warmIo.observe(el);
    viewIo.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      warmIo.disconnect();
      viewIo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [may, eager, engageAhead]);

  // Out of the warm zone for a while: let the effect go (the poster is the design).
  useEffect(() => {
    if (!may || !releaseAway || warm) return;
    const timer = window.setTimeout(() => {
      setAway(true);
      if (leased && !eager) setEngaged(false);
    }, AWAY_MS);
    return () => window.clearTimeout(timer);
  }, [may, releaseAway, warm, leased, eager]);

  // The effect's code is fetched ahead of time, nearest the reader first.
  useEffect(() => {
    const preload = (Effect as Partial<LazyEffect>).preload;
    if (!may || !preload) return;
    const withdraw = fetchSoon({ preload, distance });
    const off = onFirstInteraction(fetchAhead);
    return () => {
      withdraw();
      off();
    };
  }, [may, Effect, distance]);

  // A pointer-armed slot needs no quiet page: the reader is already touching it.
  const due = armOn === "pointer" ? touched : idle;
  const wanted = may && due && cameNear && engaged && !away && !failed && !stepAside;

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
        distance,
        onYield: yieldable ? () => setYielding(true) : undefined,
        // Off screen, and farther from the reader than a slot coming up:
        // nobody is looking, so let go now (the splash still lets its ink fade).
        onStepAside: () => (yieldable ? setYielding(true) : setStepAside(true)),
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
  }, [leased, wanted, name, yieldable, distance]);

  // Waiting for a context: look at the queue again as the reader scrolls, so
  // a slot left behind makes room for this one before it is on screen.
  useEffect(() => {
    if (!leased || !wanted || held) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        leases.reconsider();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [leased, wanted, held]);

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
                active={(inView || !isLive) && tabVisible}
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
