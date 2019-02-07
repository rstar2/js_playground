// Simple usage (with no subscriptions, e.g only HTTP connection to the API)
// import ApolloClient from 'apollo-boost';
// const apolloClient = new ApolloClient({
//     // You should use an absolute URL here
//     uri: process.env.GRAPHQL_ENDPOINT_HTTP,
//     connectToDevTools: true
// });

// this is more robust setting allowing subscriptions over WebSocket
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: process.env.GRAPHQL_ENDPOINT_HTTP,
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
    uri: process.env.GRAPHQL_ENDPOINT_WS,
    options: {
        reconnect: true,
    },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' &&
            operation === 'subscription';
    },
    wsLink,
    httpLink
);

// Create the apollo client
const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export default apolloClient;

// https://www.howtographql.com/vue-apollo/2-queries-loading-links/