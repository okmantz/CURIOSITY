/* Offline support: cache the app shell, serve cache-first, refresh in the background. */
const VERSION = 'curiosity-v1.0.0';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css', 'assets/favicon.svg',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'js/util.js', 'js/content/meta.js', 'js/content/thought.js', 'js/content/reasoning.js', 'js/content/explore.js', 'js/content/practice.js',
  'js/store.js', 'js/social.js', 'js/lib.js', 'js/engine.js', 'js/progress.js',
  'js/templates1.js', 'js/templates2.js', 'js/templates3.js', 'js/card.js', 'js/feed.js', 'js/views.js', 'js/views2.js', 'js/app.js'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
