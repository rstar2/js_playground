const express = require('express');
const webpush = require('web-push');

const pushRouter = express.Router();

// configure the web-push API
const publicKey = process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
const subject = process.env.WEB_PUSH_VAPID_SUBJECT;
webpush.setVapidDetails(subject, publicKey, privateKey);

// a dummy in Memory DB
// TODO: in real life this should be a real DB
const subscriptions = {};

function sendNotification(subscription, payload, options) {
    return webpush.sendNotification(subscription, payload, options)
        .then(function () {
            console.log('Push Notification sent to ' + subscription.endpoint);
        }).catch(function (error) {
            console.log('Push ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
            delete subscriptions[subscription.endpoint];
            throw error;
        });
}

// make the application server push/send som notifications
const pushInterval = 10; // seconds
let pushCounter = 0;
// setInterval(function () {
//     const payload = JSON.stringify({ title: 'Global PUSH', text: `Notification: ${++pushCounter}` });
//     const options = {
//         // TTL is a value in seconds that describes how long a push message is retained by the push service (by default, four weeks).
//         TTL: 200
//     };
//     Object.values(subscriptions).forEach(subscription => sendNotification(subscription, payload, options));
// }, pushInterval * 1000);


pushRouter.get('/vapidPublicKey', function (req, res) {
    res.send(publicKey);
});

pushRouter.post('/subscribe', (req, res) => {
    const subscription = req.body.subscription;
    if (!subscriptions[subscription.endpoint]) {
        console.log('Push Subscription registered ' + subscription.endpoint);
        subscriptions[subscription.endpoint] = subscription;
    }
    res.status(201).end();
});

pushRouter.post('/unsubscribe', (req, res) => {
    const subscription = req.body.subscription;
    if (subscriptions[subscription.endpoint]) {
        console.log('Push Subscription unregistered ' + subscription.endpoint);
        delete subscriptions[subscription.endpoint];
    }
    res.status(201).end();
});

pushRouter.post('/send', function (req, res) {
    // TODO: get from DB
    const subscriptionEndpoint = req.body.endpoint;
    const payloadText = req.body.payload;
    self.registration.pushManager.getSubscription()
    const subscription = subscriptions[subscriptionEndpoint];
    if (subscription) {
        const payload = JSON.stringify({ title: 'Single PUSH', text: payloadText });
        const options = {
            TTL: 200
        };
        sendNotification(subscription, payload, options)
            .then(function () {
                res.sendStatus(201).end();
            })
            .catch(function (error) {
                res.sendStatus(500).end();
            });
    }
});

module.exports = pushRouter;