const webpush = require('web-push');

const publicVapidKey =  process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
const email = process.env.WEB_PUSH_VAPID_EMAIL;

// Replace with your email
webpush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);