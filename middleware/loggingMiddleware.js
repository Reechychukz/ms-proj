const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");

const logger = require("../services/graphql-service/src/helpers/logger"); // Adjust the path as needed

const typeDefs = require("../services/mongodb-service/src/graphql/typeDefs");
const resolvers = require("../services/graphql-service/src/resolvers");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const loggingMiddleware = (req, res, next) => {
  try {
    // Check if req.body is defined and contains a query
    if (req.body && req.body.query) {
      logger.info("GraphQL request received", { query: req.body.query });
    } else {
      logger.warn("Invalid or empty GraphQL request body");
    }
  } catch (error) {
    logger.error("Error in GraphQL logging middleware", { error });
  }
  graphqlHTTP({
    schema: schema,
  })(req, res, next);
};

module.exports = loggingMiddleware;
