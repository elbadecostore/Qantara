const CACHE = 'qantara-v1';
const ASSETS = [
  '/Qantara/',
  '/Qantara/index.html',
  '/Qantara/manifest.json',
  '/Qantara/icon-192.png',
  '/Qantara/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap'
];

/* تثبيت — تخزين الملفات الأساسية */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

/* تفعيل — حذف الكاش القديم */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* طلبات الشبكة — Network First للـ API، Cache First للباقي */
self.addEventListener('fetch', e => {
  const url = e.request.url;

  /* Firestore و Firebase — دائماً من الشبكة */
  if (url.includes('firestore.googleapis.com') ||
      url.includes('firebase') ||
      url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }

  /* tile.openstreetmap — Cache First */
  if (url.includes('tile.openstreetmap.org')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        }).catch(() => cached || new Response('', {status: 503}));
      })
    );
    return;
  }

  /* باقي الملفات — Cache First مع fallback للشبكة */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => new Response('التطبيق غير متاح حالياً بدون إنترنت', {
        status: 503,
        headers: {'Content-Type': 'text/plain; charset=utf-8'}
      }));
    })
  );
});
