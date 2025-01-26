import { gql } from "@apollo/client";

export const GET_ME = gql`
query Me {
  me {
    username
    email
    savedBooks {
      title
      authors
      description
      image
      link
    }
    bookCount
  }
}`