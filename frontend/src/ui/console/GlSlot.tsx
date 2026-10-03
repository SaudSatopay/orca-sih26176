import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { countContexts } from "../../effects/ledger";
import { consoleGlHere } from "./glGate";

class Fuse extends Component<{ children: ReactNode }, { blown: boolean }> {
  state = { blown: false };
  static getDerivedStateFromError() {
    return { blown: true };
  }
  render() {
    return this.state.blown ? null : this.props.children;
  }
}

/**
 * Mounts a WebGL decoration once the page has painted and gone quiet, if this
 * browser may run it (glGate.ts). The sheet under it is the design; if the
 * effect cannot load or throws, the slot is simply empty again. `children` is
 * a `React.lazy` element, so its chunk (and ogl) is fetched only here.
 */
export function GlSlot({ children, className }: { children: ReactNode; className?: string }) {
  const [may] = useState(consoleGlHere);
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!may) return;
    countContexts(); // counts only with ?fxdebug=1
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const timer = window.setTimeout(() => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setIdle(true), { timeout: 800 });
      else setIdle(true);
    }, 200);
    return () => {
      window.clearTimeout(timer);
      if (idleId != null) w.cancelIdleCallback?.(idleId);
    };
  }, [may]);
  if (!may || !idle) return null;
  return (
    <div aria-hidden className={className} data-gl-slot>
      <Fuse>
        <Suspense fallback={null}>{children}</Suspense>
      </Fuse>
    </div>
  );
}
