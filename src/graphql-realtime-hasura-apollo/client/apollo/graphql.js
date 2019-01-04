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

export const QUERY_USER_ID = id => gql`
  query {
    user(where: {id: {_eq: ${id}}}) {
      id
      created_at
    }
  }
`;

export const MUTATION_CREATE_USER = id => gql`
  mutation {
    insert_user(objects:
      [{id: ${id}}]
    ) {
      returning {
        id
        created_at
      }
    }
  }
`;
