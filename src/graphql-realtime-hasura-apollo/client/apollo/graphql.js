import gql from 'graphql-tag';

export const QUERY_HELLO = gql`
  query {
    hello
  }
`;

export const QUERY_USER = gql`
  query {
    user {
      online_ping
    }
  }
`;

