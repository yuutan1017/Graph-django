import gql from "graphql-tag";


export const CREATE_USER = gql`
  mutation($username: String!, $password: String!) {
    createUser(input: { username: $username, password: $password, email: "" }) {
      user {
        id
        username
      }
    }
  }
`;

export const GET_TOKEN = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation {
    createProfile(input: {}) {
      profile {
        id
        userProfile {
          username
        }
      }
    }
  }
`;

export const GET_PROFILES = gql`
  query {
    allProfiles {
      edges {
        node {
          id
          userProfile {
            id
            username
          }
          followings {
            edges {
              node {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MYPROFILE = gql`
  query {
    profile {
      id
      userProfile {
        id
        username
        profilesFollowings {
          edges {
            node {
              userProfile {
                id
                username
              }
            }
          }
        }
      }
      followings {
        edges {
          node {
            id
            username
          }
        }
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation($id: ID!, $followings: [ID!]) {
    updateProfile(input: {id: $id, followings: $followings }) {
      profile {
        id
        userProfile {
          username
        }
        followings {
          edges {
            node {
              username
            }
          }
        }
      }
    }
  }
`;
