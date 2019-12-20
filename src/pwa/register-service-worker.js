/* eslint-env browser */

if ('serviceWorker' in navigator) {
    registerServiceWorker();

    supportAdd2HomeScreen();
} else {
    // Service Worker isn't supported on this browser
}

function registerServiceWorker() {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
        console.log(`Received from service worker message: ${event.data.message}`);
    });

    // Register a Service Worker
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
            console.log('SW registered: Scope is:', registration.scope);
        })
        .catch(() => {
            console.log('SW failed to register');
        });

    // when a new service-worker has been activated (e.g when we made a change) then reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Newer SW installed, activated and taken control of this client/tab, so reload it to have latest changes');
        window.location.reload();
    });
}

function supportAdd2HomeScreen() {
    // older versions of Chrome (67 and earlier) offered the install as PWA heuristically,
    // modern versions require we to explicitly show it after a UI event-handler
    // So this will work for all versions:

    // 1. listen to when the browser is about to prompt the user
    // and defer it, so that later we can prompt in a UI event
    let deferredInstallPromptEvent;
    window.addEventListener('beforeinstallprompt', event => {
        // prevent Chrome 67 or earlier to automatically show the prompt
        // on later versions this will do nothing
        event.preventDefault();

        // stash it for later
        deferredInstallPromptEvent = event;

        // can shown a specific dedicated button the when clicked will offer the show the deferred prompt
        // specialButton.style.display = 'block';
    });

    // could be a special UI element that is shown just for this, so that the user to explicitly
    // click on this button , but can be and UI event-handler
    document.addEventListener('click', event => {
        // trigger the deferred prompt
        // optionally can listen to the result here, on globally on the 'appinstalled' event
        // Note - it can be called only once on a 'deferredInstallPromptEvent'
        deferredInstallPromptEvent.prompt();
        deferredInstallPromptEvent.userChoice.then(result => {
            if (result.outcome === 'accepted') {
                console.log('User accepted to install the app as PWA on the home-screen');
            }
            deferredInstallPromptEvent = null;
        });
    }, {once: true});

    // 2. listen to if the app/site is installed as PWA on the home-screen
    window.addEventListener('appinstalled', event => {
        console.log('The app is installed as PWA on the home-screen');

        // can do some analytics here also
    });
}
