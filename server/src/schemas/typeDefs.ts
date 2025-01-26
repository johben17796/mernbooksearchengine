const typeDefs = `
  
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: ID!
    user: User
  }


  type Query {
    users: [User]
    user(username: String!): User
    me: User
   
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(id: ID!, title: String!): User
    removeBook(bookId: ID!): User
  }
`
export default typeDefs;


