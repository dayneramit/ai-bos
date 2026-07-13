/**
 * AI-BOS Document Studio — Service Worker
 * Hand-written (no build-step dependency) so it works with a plain
 * `next build` and any static host. Strategy:
 *   - App shell (start URLs + icons + manifest): cache-first
 *   - Everything else (pages, Next static chunks): network-first,
 *     falling back to cache, falling back to the offline page.
 * All document data itself lives in localStorage, so quotations,
 * receipts, and warranty certificates already created remain fully
 * usable offline regardless of network state.
 */

const CACHE_VERSION = "ai-bos-doc-studio-v1";
const APP_SHELL = [
  "/",
  "/quotation",
  "/receipt",
  "/warranty",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const offline = await caches.match("/offline.html");
          if (offline) return offline;
        }
        return Response.error();
      })
  );
});
