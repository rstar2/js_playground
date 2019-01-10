const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./middlewares/auth');

require('dotenv-safe').load();

const port = process.env.PORT || 5000;
const app = express();

const graphqlHTTP_demo = require('./graphql-demo');
const graphqlHTTP = require('./graphql');

// initialize the MongoDB driver ( Mongoose )
require('./db');

app.use(bodyParser.json());

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
