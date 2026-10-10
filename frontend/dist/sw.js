/*
 * ORCA's service worker: lets the app shell open with no signal, so the phone
 * can show ORCA's last plan (kept in localStorage, re-judged by offline.ts).
 *
 *   - navigations to the app: network first; offline, the cached index.html
 *   - same-origin GET /assets/*: cache first (the names are content hashes,
 *     so a deploy brings new names and never an old file under a new one)
 *   - /api/* and everything else: never touched, never cached
 *
 * Online, the page is always the deployed one: index.html comes from the
 * network whenever the network answers, and the cached copy is only the
 * fallback when it does not.
 */
const VERSION = "orca-shell-v1";
const SHELL = "/index.html";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** A path the SPA answers (no file extension), or index.html itself. */
function isAppPath(pathname) {
  return pathname === "/" || pathname === SHELL || !/\.[a-z0-9]+$/i.test(pathname);
}

async function navigate(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(VERSION);
      await cache.put(SHELL, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(SHELL, { cacheName: VERSION });
    if (cached) return cached;
    throw error;
  }
}

async function asset(request) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") await cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    if (isAppPath(url.pathname)) event.respondWith(navigate(request));
    return;
  }
  if (url.pathname.startsWith("/assets/")) event.respondWith(asset(request));
});
