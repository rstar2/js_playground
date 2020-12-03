import gql from 'graphql-tag';

export const QUERY_USER_ID = gql`
  query user($userId: uuid!) {
    user(where: {id: {_eq: $userId}}) {
      id
      created_at
    }
  }
`;

export const MUTATION_CREATE_USER = gql`
  mutation createUser($name: String!) {
    insert_user(objects:[{ name: $name }]) {
      returning {
        id
        created_at
      }
    }
  }
`;

export const MUTATION_MARK_USER_ONLINE = gql`
  mutation userOnline($uuid: uuid) {
    update_user(
      where: {id: {_eq: $uuid}},
      _set : { online_ping: true }
    ) {
      affected_rows
      returning {
        last_seen_at
      }
    }
  }
`;

export const MUTATION_VOTE = gql`
  mutation vote($optionId: uuid!, $userId: uuid!) {
    insert_vote(objects:[{ option_id: $optionId, created_by_user_id: $userId }]) {
      returning {
        id
      }
    }
  }
`;

// --------------
export const SUBSCRIPTION_ONLINE_USERS = gql`
  subscription getOnlineUsersCount {
    online_users {
      count
    }
  }
`;

export const SUBSCRIPTION_RESULT = gql`
  subscription getResult($pollId: uuid!) {
    poll_results (
      order_by: {option_id:desc},
      where: { poll_id: {_eq: $pollId} }
    ) {
      option_id
      option { id text }
      votes
    }
  }
`;

