import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { EffectProps } from "./EffectSlot";

type Loader = () => Promise<{ default: ComponentType<EffectProps> }>;

/** An effect's lazy component that can also be fetched before it first mounts. */
export type LazyEffect = LazyExoticComponent<ComponentType<EffectProps>> & {
  /** Fetch and evaluate the effect's chunk now (once); mounting it later costs no wait. */
  preload: () => Promise<unknown>;
};

/**
 * `lazy()` for an EffectSlot's effect, created at module scope by the caller:
 * `const Sea = lazyEffect(() => import("../effects/SeaGradient"))`. The slot
 * fetches the chunk ahead of the section (EffectSlot's preload queue), so a
 * section that scrolls into view never waits on the network.
 */
export function lazyEffect(load: Loader): LazyEffect {
  let pending: ReturnType<Loader> | null = null;
  const once = () => {
    pending ??= load().catch((err: unknown) => {
      // a failed fetch may be tried again by the next mount
      pending = null;
      throw err;
    });
    return pending;
  };
  return Object.assign(lazy(once), { preload: once });
}
