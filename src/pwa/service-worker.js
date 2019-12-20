/* eslint-env browser */

// https://www.youtube.com/watch?v=KLQELCvb-B0&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7

const version = 3;
const staticCacheName = version => `static_v${version}`;

const dynamicCacheName = 'dynamic';

// if we need a offline page to be shown when we are offline and there's no cached resource
const offlineFallbackPage = '/offline.html';

// These are file paths, and they are added to the cache we created
const staticAssets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/register-service-worker.js',
    '/file.js',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    offlineFallbackPage
];


// Prior to the install event, your application does not have a service worker.
// The browser will detect the registration event from your code and install the service worker.
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
            // When the controlling service-worker is changed for a client/tab then 
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
            caches.keys()
                .then(keys => keys.filter(key => !(key === staticCacheName(version) || key === dynamicCacheName)))
                .then(keys => Promise.all[keys.map(key => caches.delete(key))])
                .then(() => console.log('SW removed all old caches'))
                .catch(err => console.error('SW failed to removed all old caches', err)),
        ]).then(() => console.log('SW is up and running!'))
    );
});

// This function will run when the service worker detects a fetch request. 
self.addEventListener('fetch', function(event) {
    // NOTE: skip any 'data' request - for instance if we get the data from Firebase Firestore
    // event.request.url is a String
    if (event.request.url.includes('firestore.googleapis.com')) {
        return;
    }
    
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
                                    // NOTE: we can use a strategy to dynamically cache only a limited number of resources, not all
                                    // thus when reach the limit we'll remove the oldest cached resource


                                    // NOTE: The response should be obligatory cloned because it's a stream
                                    // and otherwise we cannot consume it twice
                                    cache.put(event.request.url, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
            }).

            // return the pre-cached offline page
            catch(() =>  {
                // apply it only for HTML pages
                if (event.request.url.index('.html') > -1)
                    caches.match(offlineFallbackPage);

                // NOTE: these can be extended to return many type resources, for PNG, JPG and etc...
            })
    );
});


// Listen to events sent from the parent page
self.addEventListener('message', function(event){
    console.log('SW Received Message: ' + event.data);
});