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

/* Push Notifications */

if (('serviceWorker' in navigator) && ('PushManager' in window)) {
    pushRegister();
} else {
    // Push Notifications aren't supported on this browser, disable or hide UI.
}

/**
 * @returns {Promise}
 */
function pushRegister() {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log(`Received from service worker message: ${event.data.message}`);
    });
    
    // Register a Service Worker
    return navigator.serviceWorker.getRegistration()
        .then((registration) => {
            // Use the PushManager to get the user’s subscription to the PUSH service
            return registration.pushManager.getSubscription()
                .then(async (subscription) => {
                    // If a subscription was found, return it
                    if (subscription) {
                        return subscription;
                    }

                    // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don’t plan to send notifications
                    // that don’t have a visible effect for the user)

                    // 1. We have to have created a private/public VAPID key
                    // for this the NPM 'web-push' library can be used
                    // in the CLI ```./node_modules/.bin/web-push generate-vapid-keys```
                    // the public key is for the browser,
                    // the private key used by the web-push library to send PUSH notifications from our server for instance

                    // 2. Get the server’s VAPID public key
                    // const response = await fetch('/push/vapidPublicKey');
                    // const vapidPublicKey = await response.text();
                    const vapidPublicKey = 'BJdBb9bMgH8KMHXgU2HTV1pmqRP1v0Di79A3OLdVPXzfxoUV0rMe2SNm2nM0bDchAldE2ciQxmflghpKP0xeWm4';


                    // Chrome doesn’t accept the base64-encoded (string) vapidPublicKey yet
                    // use urlBase64ToUint8Array() is defined in /tools.js
                    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                });
        })
        .then(async (subscription) => {
            // Send the subscription details to our server using if we want to sen PitUSH notifications from it
            // await fetch('/push/subscribe', {
            //     method: 'post',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         subscription: subscription
            //     }),
            // });

            return subscription;
        })
        .then((subscription) => {
            // Send the message to the service worker
            navigator.serviceWorker.controller.postMessage('Wait for a PUSH notification');
        })
        .catch(() => {
            // failed to subscribe for Push Notifications 
        });
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
