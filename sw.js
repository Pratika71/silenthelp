// ─── SilentHelp Service Worker ───────────────────────────
// This makes the app work completely offline
// It caches all files on first visit

const CACHE_NAME = 'silenthelp-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Install: cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache first (offline first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version OR fetch from network
      return response || fetch(event.request);
    })
  );
});
