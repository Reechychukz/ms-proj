# ms-proj

> Nodejs-Javacript | Express | GraphQL | MongoDB API Task.

> View live version at https://ms-proj.onrender.com/graphql

## Features

> This project uses Node.js v14 and MongoDB.

- GraphQL rootValue using [RawModel.js](https://github.com/xpepermint/rawmodeljs).
- Authentication endpoints (SIgnup and Login).
- Query users or specific user by id.

## Pre-requisites

- Node.js v14+(recommended).
- Install and start MongoDB server.

## Build Setup

```
# install dependencies
npm install

# start the server (GraphiQL is started at http://localhost:4000/graphql)
npm start

# use nodemon in development to automatically reload the server on changes
npm install -g nodemon
npm run dev

# run GraphQL query from command-line
npm run exec '{getUsers {id name}}'

# run tests
npm test
```

## Run

`npm start`

## Query Examples

> Mutations

```js
mutation Signup {
    signup(
        email: johndoe@email.com
        username: john
        password: ******
        firstName: John
        lastName: Doe
    ) {
        id
        code
        success
        message
    }
}
```

```js
mutation Login {
    login(email: "johndoe@email.com", password: "12345678910") {
        code
        success
        message
        token
        user {
            id
            email
            username
            firstName
            lastName
        }
    }
}
```

```js
mutation RefreshToken {
    refreshToken(
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZjNjRlMzJmNjcxZGI4ODNhMGY1M2IiLCJpYXQiOjE2OTQyOTIzMDUsImV4cCI6MTY5NDI5NTkwNX0.hZgwm5rSzVtkk5pgBI35WnUbtPfUjMzvgZyPBvUpLcU"
    ) {
        code
        success
        message
        accessToken
    }
}
```

> Queries

```js
query GetUserById {
    getUserById(id: 12345678910) {
        code
        success
        message
        user {
            id
            email
            username
            firstName
            lastName
        }
    }
}
```

```js
query GetAllUsers {
    getAllUsers {
        code
        success
        message
        user {
            id
            email
            username
            firstName
            lastName
        }
    }
}

```

## Architecture

```
ms-proj
├── config
│   └── database.js
├── middleware
│   └── loggingMiddleware.js
├── services
│   ├── graphql-service
│   │   └── src
│   │       ├── controller
│   │       │   └── authController.js
│   │       ├── helpers
│   │       │   ├── determineStatusCodeBasedOnError.js
│   │       │   ├── generateJWTToken.js
│   │       │   ├── logger.js
│   │       │   └── validate.js
│   │       └── resolvers.js
│   └── mongodb-service
│       └── src
│           ├── graphql
│           │   └── typeDef.js
│           ├── models
│           │   └── User.js
│           └── updateTypeDefs.js
├── index.js
├── package-lock.json
└── package.json

```

The HTTP server is based on [express-graphql](https://github.com/graphql/express-graphql) which is a bridge to communicate with a GraphQL application via [Express](http://expressjs.com/) HTTP server. The `express-graphql` middleware includes a [GraphiQL](https://github.com/graphql/graphiql) user interface which is a generic interface for running GraphQL queries and mutations (for use in development).
