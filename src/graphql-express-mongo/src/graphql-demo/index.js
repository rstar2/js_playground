const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');

const { queryType } = require('./query.js');

const schema = new GraphQLSchema({ query: queryType });

module.exports = graphqlHTTP({
    schema: schema,
    graphiql: true,
})