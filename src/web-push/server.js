const path = require('path');
const express = require('express');

process.chdir(__dirname);
require('dotenv').config()

const app = express();

app.use(require('body-parser').json());
app.use(express.static(path.resolve('public')));

app.use('/push', require('./push-route'));

app.listen(3000);