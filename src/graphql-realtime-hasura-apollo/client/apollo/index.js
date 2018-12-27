import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
    // You should use an absolute URL here
    uri: 'http://192.168.99.100:8080',
    connectToDevTools: true
});

export default apolloClient;

// https://vue-apollo.netlify.com/guide/apollo/queries.html#simple-query
// https://www.howtographql.com/vue-apollo/2-queries-loading-links/