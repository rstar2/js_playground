const path = require('path');
const express = require('express');
const webpush = require('web-push');

const app = express();

app.use(require('body-parser').json());
app.use(require('express-static')(path.resolve(__dirname + '/public')));

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.listen(3000);