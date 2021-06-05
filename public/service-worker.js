const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/dist/app.bundle.js',
    '/dist/db.bundle.js',
    '/dist/manifest.json',
    '/dist/assets/icons/icon_96x96.png',
    '/dist/assets/icons/icon_128x128.png',
    '/dist/assets/icons/icon_192x192.png',
    '/dist/assets/icons/icon_256x256.png',
    '/dist/assets/icons/icon_384x384.png',
    '/dist/assets/icons/icon_512x512.png',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
  ];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime-budget';

self.addEventListener('install', (event) => {
  caches
  event.waitUntil(
     caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  // non GET requests are not cached and requests to other origins are not cached
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    event.respondWith(fetch(event.request));
    return;
  } 

// handle runtime GET requests for data from /api routes
if (event.request.url.includes("/api/transactions")) {
  // make network request and fallback to cache if network request fails (offline)
  event.respondWith(
    caches.open(RUNTIME).then(cache => {
      return fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => caches.match(event.request));
    })
  );
  return;
}

// use cache first for all other requests for performance
event.respondWith(
  caches.match(event.request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    }

    // request is not in cache. make network request and cache the response
    return caches.open(RUNTIME).then(cache => {
      return fetch(event.request).then(response => {
        return cache.put(event.request, response.clone()).then(() => {
          return response;
        });
      });
    });
  })
);
});



