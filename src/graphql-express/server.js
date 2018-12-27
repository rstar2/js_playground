const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

const graphqlHTTP = require('./graphql');

// just a normal HTTP demo endpoint
app.get('/hello', (req, res) => {
    res.send('hello');
});

// Setup the GraphQL server middleware
app.use('/graphql', graphqlHTTP);


app.listen(port).on('listening', () => {
    console.log(`Server Running at localhost:${port}`);
});
