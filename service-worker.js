const CACHE_NAME = 'IMG-AI-cache-V2.2.1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/AI.png',
];
self.addEventListener('load', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});