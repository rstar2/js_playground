const graphqlHTTP = require('express-graphql');

module.exports = graphqlHTTP({
    schema: require('./schema'),
    // root schema-resolvers
    rootValue: require('./resolvers'),
    graphiql: true,
});