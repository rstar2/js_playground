const GRAPHQL_API_URL = process.env.VUE_APP_GRAPHQL_API_URL;

import store from '@/store';
import http from './http';

const graphql = (data) => {
    // get the Authentication token from the JWT in the store
    const authToken = store.state.auth.JWT;
    
    return http(GRAPHQL_API_URL, data, authToken);
};

export default graphql;

