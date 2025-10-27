
const CACHE_NAME = "acc-pwa-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith((async () => {
    const cached = await caches.match(req, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      return resp;
    } catch (err) {
      if (req.mode === "navigate") return caches.match("./index.html");
      return caches.match("./");
    }
  })());
});
