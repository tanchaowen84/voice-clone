// Service Worker for caching iframe content
const CACHE_NAME = 'cnblocks-iframe-cache-v1'

// Add iframe URLs to this list to prioritize caching
const CDN_BASE_URL = 'https://cdn.voice-clone.org';
const URLS_TO_CACHE = [
    // CDN assets that should be cached
    `${CDN_BASE_URL}/favicon.ico`,
    `${CDN_BASE_URL}/favicon-16x16.png`,
    `${CDN_BASE_URL}/favicon-32x32.png`,
    `${CDN_BASE_URL}/logo.png`,
    `${CDN_BASE_URL}/logo-dark.png`,
    // VoiceClone specific images from CDN
    `${CDN_BASE_URL}/features1.png`,
    `${CDN_BASE_URL}/features2.png`,
    `${CDN_BASE_URL}/features3.png`,
    `${CDN_BASE_URL}/features4.png`,
    `${CDN_BASE_URL}/howitworks.png`,
    `${CDN_BASE_URL}/aicapabilities.png`,
    // Legacy images (can be removed if not used elsewhere)
    '/payments.png',
    '/payments-light.png',
    '/origin-cal.png',
    '/origin-cal-dark.png',
    '/exercice.png',
    '/exercice-dark.png',
    '/charts-light.png',
    '/charts.png',
    '/music-light.png',
    '/music.png',
    '/mail-back-light.png',
    '/mail-upper.png',
    '/mail-back.png',
    '/card.png',
    '/dark-card.webp',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache')
                return cache.addAll(URLS_TO_CACHE)
            })
            .then(() => self.skipWaiting()) // Activate SW immediately
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME]
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete)
                    })
                )
            })
            .then(() => self.clients.claim()) // Take control of clients immediately
    )
})

// Fetch event - serve from cache or fetch from network and cache
self.addEventListener('fetch', (event) => {
    // Check if this is an iframe request - typically they'll be HTML or have 'preview' in the URL
    const isIframeRequest = event.request.url.includes('/preview/') || event.request.url.includes('/examples/')

    if (isIframeRequest) {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((response) => {
                // Return cached response if found
                if (response) {
                    return response
                }

                // Clone the request (requests are one-time use)
                const fetchRequest = event.request.clone()

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response
                    }

                    // Clone the response (responses are one-time use)
                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache)
                    })

                    return response
                })
            })
        )
    } else {
        // For non-iframe requests, use a standard cache-first strategy
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response
                }
                return fetch(event.request)
            })
        )
    }
})

// Listen for messages from clients (to force cache update, etc)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }

    // Handle cache clearing
    if (event.data && event.data.type === 'CLEAR_IFRAME_CACHE') {
        const url = event.data.url

        if (url) {
            // Clear specific URL from cache
            caches.open(CACHE_NAME).then((cache) => {
                cache.delete(url).then(() => {
                    console.log(`Cleared cache for: ${url}`)
                })
            })
        } else {
            // Clear the entire cache
            caches.delete(CACHE_NAME).then(() => {
                console.log('Cleared entire iframe cache')
            })
        }
    }
})
