/* eslint-env browser */

const version = 1;
const cacheName = version => `appName_v${version}`;

// TODO: The versions work OK but after Refreshing - check how to fix it

// Prior to the install event, your application does not have a service worker. The browser will detect the registration event from your code and install the service worker.
self.addEventListener('install', function (event) {
    // Immediately take control of the page, see the ‘Immediate Claim’ recipe
    // for a detailed explanation of the implementation of the following two event listeners
    event.waitUntil(self.skipWaiting());

    // handle which files are cached onto the user's machine.

    // open a cache and specify which files to cache
    // could use a version so when adding/removing resources from the app
    // to update the service-worker also to take care of this
    caches.open(cacheName(version)).then((cache) => {
        // array of strings - These are file paths, and they are added to the cache we created
        cache.addAll([
            '/',
            'index.html',
            'client_1.js',
            'client_2.js',
            'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        ]).catch(err => console.error('Failed to add files to cache', err));
    }).catch(err => console.error('Failed to open cache', err));
});

// The activate event is fired after the service worker is installed and ready to go
// This is a really good place to do clean up on old files and caches that you don't need anymore
self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());

    // clear old caches - dont' care about async result and etc
    for(let i = 0; i < version; i++) {
        caches.delete(cacheName(i));
    }

    console.log('SW is up and running!');
});

// This function will run when the service worker detects a fetch request. 
self.addEventListener('fetch', function(event) {
    // If a matching request is found, the function returns that request. 
    event.respondWith(
        // search only in last version cache
        caches.match(event.request, {cacheName: cacheName(version)})
            .then(function(cachedFiles) {
                if (cachedFiles) {
                    return cachedFiles;
                } 
                return fetch(event.request);
            })
    );
});


// Listen to events sent from the parent page
self.addEventListener('message', function(event){
    console.log('SW Received Message: ' + event.data);
});