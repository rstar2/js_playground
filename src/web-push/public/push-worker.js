/* eslint-env browser */

// Immediately take control of the page, see the ‘Immediate Claim’ recipe
// for a detailed explanation of the implementation of the following two event listeners
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

// Register event listener for the ‘notificationclick’ event
self.addEventListener('notificationclick', function (event) {
    console.log('Push notification clicked');

    // const clickedNotification = event.notification;
    // clickedNotification.close();

    event.waitUntil(
        // Retrieve a list of the clients of this service worker
        self.clients.matchAll().then(function (clientList) {
            // If there is at least one client, focus it
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            // Otherwise, open a new page
            return self.clients.openWindow('/');
        })
    );
});

self.addEventListener('notificationclose', function (event) {
    const dismissedNotification = event.notification;

    // const promiseChain = notificationCloseAnalytics();
    // event.waitUntil(promiseChain);
});

// Register event listener for the ‘push’ event
self.addEventListener('push', function (event) {
    console.log('Push notification received');

    event.waitUntil(
        // Retrieve a list of the clients of this service worker
        self.clients.matchAll().then(function (clientList) {
            // Check if there’s at least one focused client
            const focused = clientList.some((client) => {
                return client.focused /*|| client.visibilityState === 'visible'*/;
            });

            let notificationMessage;
            if (focused) {
                notificationMessage = 'You\'re still here, thanks!';
            } else if (clientList.length > 0) {
                notificationMessage = 'You haven\'t closed the page, click here to focus it!';
            } else {
                notificationMessage = 'You have closed the page, click here to re-open it!';
            }

            // this is if the payload is send as plain text
            //const payload = event.data ? event.data.text() : 'no payload';

            // this is if the payload is send as JSON
            const payload = event.data ? event.data.json() : {};

            // send a message to all client/page that a push notifications is received
            clientList.forEach((client) => {
                client.postMessage({
                    message: 'Received a push message.',
                    time: new Date().toString()
                });
            });

            // Show a notification
            return self.registration.showNotification(payload.title || 'Push Demo', {
                body: notificationMessage + '\n' + payload.text,

                // The tag field allows replacing an old notification with a new one
                // (a notification with the same tag of another one will replace it)
                //tag: 'TAG',

                //icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png',
            });
        })
    );
});

// Listen to 'pushsubscriptionchange' event which is fired when subscription expires.
// Subscribe again and register the new subscription in the server.
self.addEventListener('pushsubscriptionchange', function (event) {
    console.log('Push Subscription expired');
    event.waitUntil(
        self.registration.pushManager.subscribe({ userVisibleOnly: true })
            .then(function (subscription) {
                console.log('Push Subscribed after expiration', subscription.endpoint);
                return fetch('register', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint
                    })
                });
            })
    );
});

// Listen to events sent from the parent page
self.addEventListener('message', function(event){
    console.log('SW Received Message: ' + event.data);
});