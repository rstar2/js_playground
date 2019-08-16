/* eslint-env browser */

if ('serviceWorker' in navigator) {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log(`Received from service worker message: ${event.data.message}`);
    });
    
    // Register a Service Worker
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration =>{})
        .catch(() => {});

    // when a new service-worker has been activated (e.g when we made a change) then reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });   
} else {
    // Service Worker isn't supported on this browser, disable or hide UI.
}