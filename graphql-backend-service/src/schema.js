// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "User" type defines the queryable fields for every user in our data source.
    type User {
        id: ID!
        email: String!
        username: String
        firstName: String
        lastName: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In the
    # case, the "getUsers" query returns an array of zero or more users (defined above).
    type Query {
        getUsers: [User]
        getUser(id: ID!): User
    }

    type Mutation {
        signup(email: String!, username: String!, firstName: String, lastName: String, password: String!): User
        login(email: String!, password: String!): String
    }

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type SignupMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        user: User
    }
`;
module.exports = typeDefs;
