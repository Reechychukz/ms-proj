require("./config/database").connect();
require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const loggingMiddleware = require("./middleware/loggingMiddleware");

const { makeExecutableSchema } = require("graphql-tools");
const bodyParser = require("body-parser");

const typeDefs = require("./services/mongodb-service/src/graphql/typeDefs");
const resolvers = require("./services/graphql-service/src/resolvers");
const determineStatusCodeBasedOnError = require("./services/graphql-service/src/helpers/determineStatusCodeBasedOnError");

const UserSchema = makeExecutableSchema({ typeDefs, resolvers });

// Create Express server.
const app = express();

// Express configuration.
app.set("port", process.env.PORT || 3000);

app.use("/graphql", loggingMiddleware);

app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5000 })
);
app.use(bodyParser.json({ limit: "50mb" }));

//graphql http requests
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: UserSchema,
    context: req.context,
    graphiql: process.env.NODE_ENV === "development",
    context: { req }, // Pass user from req to context
    formatError: (error) => {
      const statusCode = determineStatusCodeBasedOnError(error);
      return {
        message: error.message,
        statusCode,
      };
    },
  }))
);

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(app.get("port"), () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

console.log(`🚀  Server ready at: ${PORT}`);
