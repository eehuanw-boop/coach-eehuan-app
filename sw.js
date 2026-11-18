/* BurnUp Coaching — Service Worker
   - 网页本身：优先用网络拿最新版，没网络时用手机里存的版本（所以更新会自动生效）
   - 字体、Firebase 程序库：存在手机里，下次直接用
   - 登入和云端资料（googleapis.com）不经过这里，由 Firebase 自己处理离线 */
const VERSION = "burnup-v1";
const SHELL = [
  "./coaching.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isPage = req => req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
const cacheable = url =>
  url.origin === self.location.origin ||
  url.hostname === "fonts.googleapis.com" ||
  url.hostname === "fonts.gstatic.com" ||
  (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/"));

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(!cacheable(url)) return;   // 登入、云端资料等：不拦截

  if(isPage(req) && url.origin === self.location.origin){
    // 网页：网络优先，失败时用存档（忽略 ?source=pwa 这类参数）
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(url.pathname.endsWith("/") ? req : new Request(url.origin + url.pathname), copy));
        return res;
      }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match("./coaching.html")))
    );
    return;
  }

  // 其他（图标、字体、Firebase 程序库）：先用存档，同时在背景更新
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if(res && (res.ok || res.type === "opaque")){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
