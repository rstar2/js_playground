import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
    // You should use an absolute URL here
    uri: process.env.GRAPHQL_ENDPOINT_HTTP,
    connectToDevTools: true
});

export default apolloClient;

// https://vue-apollo.netlify.com/guide/apollo/queries.html#simple-query
// https://www.howtographql.com/vue-apollo/2-queries-loading-links/