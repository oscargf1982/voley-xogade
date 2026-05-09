const CACHE = 'voley-xogade-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  // Firebase y Google Fonts siempre desde la red
  if (
    e.request.url.includes('firebase') ||
    e.request.url.includes('googleapis') ||
    e.request.url.includes('gstatic')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Lo demás: caché primero, red como fallback
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
