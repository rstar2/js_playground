/* eslint-env browser */

if ('serviceWorker' in navigator) {
    register();
} else {
    // Service Worker isn't supported on this browser, disable or hide UI.
}

/**
 * @returns {Promise}
 */
function register() {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log(`Received from service worker message: ${event.data.message}`);
    });
    
    // Register a Service Worker
    return navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then((registration) => {
           
        })
        .catch(() => {
        });
}