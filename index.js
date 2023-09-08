//database
require("./config/database").connect();
require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { expressjwt: jwt } = require("express-jwt");

const { makeExecutableSchema } = require("graphql-tools");
const logger = require("morgan");
const bodyParser = require("body-parser");

const typeDefs = require("./graphql-backend-service/src/schema");
const resolvers = require("./graphql-backend-service/src/resolvers");
const determineStatusCodeBasedOnError = require("./graphql-backend-service/src/helpers/determineStatusCodeBasedOnError");
const generateToken = require("./graphql-backend-service/src/helpers/generateJWTToken.js");

const User = require("./mongodb-service/models/User");

const UserSchema = makeExecutableSchema({ typeDefs, resolvers });

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));

app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5000 })
);
app.use(bodyParser.json({ limit: "50mb" }));

/**
 * GraphQL server
 */

app.use(
  "/graphql",
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    requestProperty: "auth",
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
);

// =========== GraphQL setting  ========== //
// app.use("/graphql", async (req, res, done) => {
//   var userId = req.auth && req.auth.id ? req.auth.id : undefined;
//   const user = userId ? await User.findById(userId) : undefined;
//   req.context = {
//     user: user,
//   };
//   done();
// });
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: UserSchema,
    context: req.context,
    graphiql: process.env.NODE_ENV === "development",
    formatError: (error) => {
      // Customize error handling here
      const statusCode = determineStatusCodeBasedOnError(error);
      return {
        message: error.message,
        statusCode,
        locations: error.locations,
        path: error.path,
      };
    },
  }))
);

// =========== GraphQL setting END ========== //

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(app.get("port"), () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

console.log(`🚀  Server ready at: ${PORT}`);
