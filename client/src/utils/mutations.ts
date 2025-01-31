import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const SAVE_BOOK = gql`
mutation saveBook($input: BookInput!) {
  saveBook(input: $input) {
    _id
    username
    savedBooks {
      bookId
      title
      description
      link
      image
      authors
    }
  }
}
`



export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    username
    savedBooks {
      bookId
      title
      authors
    }
  }
}
`