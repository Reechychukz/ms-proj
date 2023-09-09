# ms-proj

> Nodejs-Javacript | Express | GraphQL | MongoDB API Task.

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

## Architecture

```

|- ./config       - config files
|- ./index.js     - application main file
|- ./.env         - env sample
|- ./services     - major services

```

Graph application describes your data model and provides a communication layer. HTTP application exposes GraphQL application over HTTP thus users can use the GraphQL application as your API endpoint.

The HTTP server is based on [express-graphql](https://github.com/graphql/express-graphql) which is a bridge to communicate with a GraphQL application via [Express](http://expressjs.com/) HTTP server. The `express-graphql` middleware includes a [GraphiQL](https://github.com/graphql/graphiql) user interface which is a generic interface for running GraphQL queries and mutations (for use in development).
