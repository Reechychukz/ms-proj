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
const generateToken = require("./graphql-backend-service/src/auth.js");

const User = require("./mongodb-service/models/User");

const GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

/**
 * Create Express server.
 */
const app = express();

// /**
//  * Connect to MongoDB.
//  */
// mongoose.connect(process.env.MONGODB, {
//   useMongoClient: true,
// });
// mongoose.connection.on("error", function () {
//   console.log(
//     "MongoDB Connection Error. Please make sure that MongoDB is running."
//   );
//   process.exit(1);
// });
// mongoose.set("debug", true);

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
app.use("/graphql", async (req, res, done) => {
  var userId = req.auth && req.auth.id ? req.auth.id : undefined;
  const user = userId ? await User.findById(userId) : undefined;
  req.context = {
    user: user,
  };
  done();
});
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: GraphQLSchema,
    context: req.context,
    graphiql: process.env.NODE_ENV === "development",
  }))
);
// =========== GraphQL setting END ========== //

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(app.get("port"), () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

console.log(`🚀  Server ready at: ${PORT}`);
