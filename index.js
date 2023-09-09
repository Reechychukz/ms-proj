//database
require("./config/database").connect();
require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { expressjwt: jwt } = require("express-jwt");

const { makeExecutableSchema } = require("graphql-tools");
const logger = require("morgan");
const bodyParser = require("body-parser");

const typeDefs = require("./services/mongodb-service/src/graphql/typeDefs");
const resolvers = require("./services/graphql-service/src/resolvers");
const determineStatusCodeBasedOnError = require("./services/graphql-service/src/helpers/determineStatusCodeBasedOnError");
const generateToken = require("./services/graphql-service/src/helpers/generateJWTToken.js");

const User = require("./services/mongodb-service/src/models/User");

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

// Middleware for extracting and verifying JWT token
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, "your-secret-key");
      req.user = decodedToken; // Attach the decoded token to req.user
    } catch (error) {
      // Handle token verification error
    }
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: UserSchema,
    context: req.context,
    graphiql: process.env.NODE_ENV === "development",
    context: { req }, // Pass user from req to context
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
