const CACHE = "pantry-board-v2";
const FILES = [
  "./",
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "js/main.js",
  "js/planner.js",
  "js/schema.js",
  "js/seed-meals.js",
  "js/storage.js",
  "js/ui.js",
];

const precache = () => caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting());

const deleteOldCaches = () =>
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim());

self.addEventListener("install", event => event.waitUntil(precache()));
self.addEventListener("activate", event => event.waitUntil(deleteOldCaches()));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
