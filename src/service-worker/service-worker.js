/* eslint-env browser */

// https://www.youtube.com/watch?v=KLQELCvb-B0&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7

const version = 3;
const staticCacheName = version => `static_v${version}`;

const dynamicCacheName = 'dynamic';

// These are file paths, and they are added to the cache we created
const staticAssets = [
    '/',
    '/index.html',
    '/main.js',
    '/file.js',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
];

// Prior to the install event, your application does not have a service worker. The browser will detect the registration event from your code and install the service worker.
self.addEventListener('install', function (event) {
    event.waitUntil(
        Promise.all([
            // open a cache and specify which files to cache
            caches.open(staticCacheName(version))
                // cache.add() and cache.addAll() reach out ot the server to fetch the resources
                .then(cache => cache.addAll(staticAssets))
                .then(() => console.log('SW pre-cached all assets'))
                .catch(err => console.error('SW failed to pre-cached all assets', err)),

            // Immediately take control of the page, see the ‘Immediate Claim’ recipe
            // When the controlling service-worker is changed for a client/tag then 
            // it will auto reload - this is in main.js
            self.skipWaiting()
        ]).then(() => 'SW is installed')
    );
});

// The activate event is fired after the service worker is installed and ready to go
// This is a really good place to do clean up on old files and caches that you don't need anymore
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            // claim all current opened clients/tabs
            self.clients.claim(),

            // clear all old caches
            caches.keys(keys => keys.filter(key => key !== staticCacheName(version)))
                .then(keys => Promise.all[keys.map(key => caches.delete(key))])
                .then(() => console.log('SW removed all old caches'))
                .catch(err => console.error('SW failed to removed all old caches', err)),
        ]).then(() => console.log('SW is up and running!'))
    );
});

// This function will run when the service worker detects a fetch request. 
self.addEventListener('fetch', function(event) {
    // If a matching request is found, the function returns that request. 
    event.respondWith(
        // search only in last version cache - for static cache only
        // caches.match(event.request, {cacheName: staticCacheName(version)})
        //     .then(cachedResponse => cachedResponse || fetch(event.request))

        // add dynamic caching - for better offline experience
        // search in all chache and if not found add to the dynamic cache
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse ||
                        fetch(event.request).then(fetchResponse => {
                            // cache all subsequent resources if they are requested sometime
                            return caches.open(dynamicCacheName)
                                .then(cache => {
                                    // NOTE: The response should be obligatory cloned because it's a stream
                                    // and otherwise we cannot consume it twice
                                    cache.put(event.request.url, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
            })
            
    );
});


// Listen to events sent from the parent page
self.addEventListener('message', function(event){
    console.log('SW Received Message: ' + event.data);
});