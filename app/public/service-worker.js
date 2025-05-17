/// <reference lib="webworker" />

const CACHE_NAME = "SCAMZAP-V0.0.1";
const CORE_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/fonts/RedHatDisplay-VariableFont_wght.ttf',
    '/fonts/RedHatMono-VariableFont_wght.ttf',
    '/icons/icon-16x16.avif',
    '/icons/icon-32x32.avif',
    '/icons/icon-48x48.avif',
    '/icons/icon-64x64.avif',
    '/icons/icon-72x72.avif',
    '/icons/icon-76x76.avif',
    '/icons/icon-96x96.avif',
    '/icons/icon-114x114.avif',
    '/icons/icon-120x120.avif',
    '/icons/icon-128x128.avif',
    '/icons/icon-144x144.avif',
    '/icons/icon-152x152.avif',
    '/icons/icon-180x180.avif',
    '/icons/icon-192x192.avif',
    '/icons/icon-196x196.avif',
    '/icons/icon-228x228.avif',
    '/icons/icon-256x256.avif',
    '/icons/icon-384x384.avif',
    '/icons/icon-512x512.avif'
];

async function cacheCoreAssets() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
}

async function dynamicCaching(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.warn("[SW] Fetch failed; serving from cache if possible:", error);
        return (await cache.match(request)) || (await cache.match('/offline'));
    }
}

self.addEventListener("install", (event) => {
    console.log("[SW] Installing...");
    event.waitUntil(cacheCoreAssets());
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[SW] Activating...");
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
            self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET') return;

    if (url.origin === self.location.origin) {
        event.respondWith(dynamicCaching(event.request));
    }
});
