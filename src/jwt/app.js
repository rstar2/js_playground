require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/protected'));

const port = process.env.PORT || 3000;
app.listen(port || 3000, function () {
    console.log('Express server listening on port ' + port);
});