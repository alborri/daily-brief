/* Daily Brief service worker: lets the installed app open without a connection.
   - The app page: network first (so updates arrive at once), saved copy when offline.
   - The news file: network first, saved copy when offline.
   - Icons, pictures and fonts: saved copy first. */
const VERSION = "__VERSION__";
const SHELL = "daily-brief-shell-" + VERSION;
const DATA = "daily-brief-data-v1";
const FONTS = "daily-brief-fonts-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("daily-brief-shell-") && k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function timeout(ms){ return new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms)); }
async function networkFirst(req, cacheName, key, ms){
  const cache = await caches.open(cacheName);
  try{
    const res = await Promise.race([fetch(req), timeout(ms)]);
    if(res && res.ok) cache.put(key, res.clone());
    return res;
  }catch(err){
    const hit = await cache.match(key);
    if(hit) return hit;
    throw err;
  }
}
async function cacheFirst(req, cacheName){
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if(hit) return hit;
  const res = await fetch(req);
  if(res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin === location.origin){
    if(url.pathname.endsWith("/data/news.json")){
      e.respondWith(networkFirst(req, DATA, new Request(url.origin + url.pathname), 8000));
      return;
    }
    if(req.mode === "navigate" || url.pathname.endsWith("/index.html")){
      e.respondWith(networkFirst(req, SHELL, "index.html", 4000).catch(() => caches.match("./")));
      return;
    }
    if(url.pathname.endsWith("/sw.js")) return;
    e.respondWith(cacheFirst(req, url.pathname.includes("/pics/") ? DATA : SHELL));
    return;
  }
  if(url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(cacheFirst(req, FONTS).catch(() => new Response("", { status: 504 })));
  }
});
