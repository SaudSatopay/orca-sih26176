/// <reference types="vite/client" />
import { describe, expect, it, vi } from "vitest";
import source from "../public/sw.js?raw";

/**
 * public/sw.js, run against a fake worker scope: the page is network first
 * (online is always the deployed app), hashed assets are cached, and /api is
 * never touched.
 */
type Handler = (event: unknown) => void;

function boot(network: (req: Request) => Promise<Response>) {
  const handlers: Record<string, Handler> = {};
  const store = new Map<string, Map<string, Response>>();
  const keyOf = (r: Request | string) => (typeof r === "string" ? new URL(r, "https://orca.test").href : r.url);
  const caches = {
    open: async (name: string) => {
      if (!store.has(name)) store.set(name, new Map());
      const c = store.get(name)!;
      return {
        put: async (r: Request | string, res: Response) => void c.set(keyOf(r), res),
        match: async (r: Request | string) => c.get(keyOf(r))?.clone(),
      };
    },
    match: async (r: Request | string, o?: { cacheName?: string }) =>
      store.get(o?.cacheName ?? "")?.get(keyOf(r))?.clone(),
    keys: async () => [...store.keys()],
    delete: async (k: string) => store.delete(k),
  };
  const self = {
    location: { origin: "https://orca.test" },
    addEventListener: (type: string, fn: Handler) => (handlers[type] = fn),
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(async () => undefined) },
  };
  const fetchMock = vi.fn(network);
  new Function("self", "caches", "fetch", source)(self, caches, fetchMock);

  /** Dispatch a fetch; resolves to the worker's response, or null when it left it alone. */
  async function request(path: string, mode: RequestMode | "navigate" = "cors", method = "GET") {
    let answered = null as Promise<Response> | null;
    const req = { url: `https://orca.test${path}`, method, mode } as unknown as Request;
    handlers.fetch({ request: req, respondWith: (p: Promise<Response>) => (answered = p) });
    return answered ? await answered : null;
  }
  return { handlers, store, fetchMock, request, self };
}

const basic = (body: string) => {
  const res = new Response(body, { status: 200 });
  Object.defineProperty(res, "type", { value: "basic" });
  return res;
};

describe("the service worker", () => {
  it("never answers or caches /api, other origins or non-GET requests", async () => {
    const sw = boot(async () => basic("x"));
    expect(await sw.request("/api/fishing/outlook")).toBeNull();
    expect(await sw.request("/api/chat", "cors", "POST")).toBeNull();
    expect(sw.fetchMock).not.toHaveBeenCalled();
    expect([...sw.store.values()].every((c) => c.size === 0)).toBe(true);
  });

  it("serves the page from the network when online, and keeps a copy", async () => {
    let deploy = "v1";
    const sw = boot(async () => basic(`<html>${deploy}</html>`));
    expect(await (await sw.request("/?m=1", "navigate"))!.text()).toBe("<html>v1</html>");
    deploy = "v2"; // a new deploy: online, the new page is served, never the cached one
    expect(await (await sw.request("/?m=1", "navigate"))!.text()).toBe("<html>v2</html>");
  });

  it("falls back to the cached page with no signal", async () => {
    let online = true;
    const sw = boot(async () => {
      if (!online) throw new TypeError("Failed to fetch");
      return basic("<html>shell</html>");
    });
    await sw.request("/", "navigate");
    online = false;
    expect(await (await sw.request("/?m=1&offline=90", "navigate"))!.text()).toBe("<html>shell</html>");
  });

  it("caches hashed assets at runtime and serves them offline", async () => {
    let online = true;
    const sw = boot(async () => {
      if (!online) throw new TypeError("Failed to fetch");
      return basic("chunk");
    });
    await sw.request("/assets/MobileApp-abc123.js");
    online = false;
    expect(await (await sw.request("/assets/MobileApp-abc123.js"))!.text()).toBe("chunk");
  });

  it("leaves a static page such as the challenge page to the browser", async () => {
    const sw = boot(async () => basic("x"));
    expect(await sw.request("/challenge.html", "navigate")).toBeNull();
  });

  it("drops caches of other versions and takes over at once", async () => {
    const sw = boot(async () => basic("x"));
    expect(sw.self.skipWaiting).not.toHaveBeenCalled();
    sw.handlers.install({});
    expect(sw.self.skipWaiting).toHaveBeenCalled();
    sw.store.set("orca-shell-v0", new Map());
    let done: Promise<unknown> = Promise.resolve();
    sw.handlers.activate({ waitUntil: (p: Promise<unknown>) => (done = p) });
    await done;
    expect(sw.store.has("orca-shell-v0")).toBe(false);
    expect(sw.self.clients.claim).toHaveBeenCalled();
  });
});
