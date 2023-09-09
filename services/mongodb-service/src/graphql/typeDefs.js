const typeDefs = `#graphql
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "User" type defines the queryable fields for every user in our data source.
    type User {
        id: ID
        email: String!
        username: String
        firstName: String
        lastName: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In the
    # case, the "getUsers" query returns an array of zero or more users (defined above).
    type Query {
        getAllUsers: GetAllUsersQueryResponse
        getUserById(id: ID!): GetUserByIdQueryResponse
    }

    type Mutation {
        signup(email: String!, username: String!, firstName: String, lastName: String, password: String!): SignupMutationResponse
        login(email: String!, password: String!): LoginMutationResponse
        refreshToken(token: String!): RefreshTokenMutationResponse
    }

    interface MutationResponse {
        code: Int!
        success: Boolean!
        message: String!
    }

    interface QueryResponse {
        code: Int
        success: Boolean!
        message: String!
    }

    type SignupMutationResponse implements MutationResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User!
    }

    type LoginMutationResponse implements MutationResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User!
        token: String
    }

    type RefreshTokenMutationResponse {
        code: Int!
        success: Boolean!
        message: String!
        accessToken: String
    }

    type GetUserByIdQueryResponse implements QueryResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User
    }

    type GetAllUsersQueryResponse implements QueryResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: [User]
    }
`;
module.exports = typeDefs;
