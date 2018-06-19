const path = require('path');

const express = require('express');
const handlebars = require('express-handlebars');

const app = express();

const hbs = handlebars.create({
    // if Express 'view' setting is changed these values also has to be reflected
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    // helpers: require('./views/helpers')(),
    extname: '.hbs',
});

// the root folder for the template views
app.set('views', path.join(__dirname, 'views'));
// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
// use the Handlebars engine
app.set('view engine', 'hbs');

const appVersion = 'v1';

// configure routes
const apiRouter = express.Router();
app.use(`/${appVersion}/api`, apiRouter);
require('./routes/api')(apiRouter);

const viewRouter = express.Router();
app.use(`/${appVersion}/view`, viewRouter);
require('./routes/view')(viewRouter);

module.exports = app;
