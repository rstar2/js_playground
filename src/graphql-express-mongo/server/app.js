require('dotenv-safe').load();

const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./middlewares/auth');

const port = process.env.PORT || 5000;
const app = express();

const graphqlHTTP_demo = require('./graphql-demo');
const graphqlHTTP = require('./graphql');

// initialize the MongoDB driver ( Mongoose )
require('./db');

app.use(bodyParser.json());

// allow CORS - currently from EVERYWHERE
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // HTTP 'OPTIONS' requests are not needed to hit our API
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// just a normal HTTP demo endpoint
app.get('/hello', (req, res) => {
    res.send('hello');
});

// Setup the GraphQL server middleware (ddemo)
app.use('/graphql-demo', graphqlHTTP_demo);

// More complex GraphQL server middleware (with real MongoDB database and more actions)
app.use('/graphql', auth, graphqlHTTP);


app.listen(port).on('listening', () => {
    console.log(`Server Running at localhost:${port}`);
});
