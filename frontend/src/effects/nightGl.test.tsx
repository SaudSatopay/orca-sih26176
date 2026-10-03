import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hexToVec3, NIGHT_DPR_CAP, nightDpr, useNightScene, type Scene } from "./nightGl";
import { chart, ink, paper } from "../tokens";

/**
 * The night stage's manners, with a fake scene and a hand-cranked
 * requestAnimationFrame: nothing drawn while inactive, the loop cancelled
 * (not idling) out of view, the clock frozen while stopped, onReady after
 * the first real frame, onFail on a lost context, and the scene disposed
 * and its canvas removed on unmount.
 */

let queue: Map<number, FrameRequestCallback>;
let nextId: number;
let now: number;

function crank(frames = 1, ms = 1000 / 60) {
  for (let i = 0; i < frames; i++) {
    now += ms;
    const due = [...queue.entries()];
    queue.clear();
    for (const [, cb] of due) cb(now);
  }
}

beforeEach(() => {
  queue = new Map();
  nextId = 1;
  now = 1000;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    const id = nextId++;
    queue.set(id, cb);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => queue.delete(id));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

function fakeScene() {
  const canvas = document.createElement("canvas");
  const scene = {
    canvas,
    draws: [] as number[],
    disposed: 0,
    resized: 0,
    draw(t: number) {
      scene.draws.push(t);
    },
    resize() {
      scene.resized += 1;
    },
    dispose() {
      scene.disposed += 1;
    },
  };
  return scene;
}

function Harness({
  active,
  onReady,
  onFail,
  make,
}: {
  active: boolean;
  onReady: () => void;
  onFail: () => void;
  make: (host: HTMLElement, wake: () => void) => Scene | null;
}) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, { active, onReady, onFail }, make);
  return <div ref={host} />;
}

describe("the night stage", () => {
  it("converts token hex to shader colour", () => {
    expect(hexToVec3(ink[900])).toEqual([18 / 255, 33 / 255, 45 / 255]);
    expect(hexToVec3(paper[50])).toEqual([251 / 255, 247 / 255, 237 / 255]);
    expect(hexToVec3(chart[500]).every((c) => c >= 0 && c <= 1)).toBe(true);
  });

  it("caps the device pixel ratio at 1.5", () => {
    expect(NIGHT_DPR_CAP).toBe(1.5);
    vi.stubGlobal("devicePixelRatio", 3);
    expect(nightDpr()).toBe(1.5);
    vi.stubGlobal("devicePixelRatio", 1);
    expect(nightDpr()).toBe(1);
  });

  it("draws nothing and runs no loop while inactive", () => {
    const scene = fakeScene();
    const onReady = vi.fn();
    render(<Harness active={false} onReady={onReady} onFail={() => {}} make={() => scene} />);
    crank(10);
    expect(scene.draws).toEqual([]);
    expect(queue.size).toBe(0);
    expect(onReady).not.toHaveBeenCalled();
  });

  it("draws when active, calls onReady after the first frame, and stops dead when inactive", () => {
    const scene = fakeScene();
    const onReady = vi.fn();
    const { rerender } = render(<Harness active onReady={onReady} onFail={() => {}} make={() => scene} />);
    crank(1);
    expect(scene.draws).toHaveLength(1);
    crank(1);
    expect(onReady).toHaveBeenCalledTimes(1);
    crank(5);
    const drawn = scene.draws.length;
    expect(drawn).toBeGreaterThan(5);
    const clock = scene.draws[drawn - 1];

    rerender(<Harness active={false} onReady={onReady} onFail={() => {}} make={() => scene} />);
    expect(queue.size).toBe(0); // the loop is cancelled, not idling
    crank(30);
    expect(scene.draws).toHaveLength(drawn);

    // back in view: the clock resumes where it stopped, it does not jump
    rerender(<Harness active onReady={onReady} onFail={() => {}} make={() => scene} />);
    crank(2);
    expect(scene.draws[scene.draws.length - 1] - clock).toBeLessThan(0.1);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("never draws faster than 60 frames a second", () => {
    const scene = fakeScene();
    render(<Harness active onReady={() => {}} onFail={() => {}} make={() => scene} />);
    crank(120, 1000 / 120); // a 120 Hz display for one second
    expect(scene.draws.length).toBeLessThanOrEqual(61);
    expect(scene.draws.length).toBeGreaterThan(50);
  });

  it("falls back to the poster when the scene cannot be made", () => {
    const onFail = vi.fn();
    render(<Harness active onReady={() => {}} onFail={onFail} make={() => null} />);
    expect(onFail).toHaveBeenCalledTimes(1);
  });

  it("falls back to the poster on a lost context and stops drawing", () => {
    const scene = fakeScene();
    const onFail = vi.fn();
    render(<Harness active onReady={() => {}} onFail={onFail} make={() => scene} />);
    crank(2);
    act(() => {
      scene.canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    });
    expect(onFail).toHaveBeenCalledTimes(1);
    expect(queue.size).toBe(0);
  });

  it("disposes the scene and removes its canvas on unmount", () => {
    const scene = fakeScene();
    const { container, unmount } = render(
      <Harness
        active
        onReady={() => {}}
        onFail={() => {}}
        make={(host) => {
          host.appendChild(scene.canvas);
          return scene;
        }}
      />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
    unmount();
    expect(scene.disposed).toBe(1);
    expect(scene.canvas.isConnected).toBe(false);
    expect(queue.size).toBe(0);
  });

  it("lets a settled scene sleep until it is woken", () => {
    const scene = fakeScene();
    let still = false;
    let wake = () => {};
    render(
      <Harness
        active
        onReady={() => {}}
        onFail={() => {}}
        make={(_host, w) => {
          wake = w;
          return { ...scene, draw: scene.draw, moving: () => !still };
        }}
      />,
    );
    crank(3);
    still = true;
    crank(3);
    const n = scene.draws.length;
    crank(10);
    expect(scene.draws).toHaveLength(n);
    still = false;
    act(() => wake());
    crank(3);
    expect(scene.draws.length).toBeGreaterThan(n);
  });
});
