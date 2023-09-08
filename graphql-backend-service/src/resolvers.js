const User = require("../../mongodb-service/models/User");
const authController = require("./controller/authController");

const resolvers = {
  Query: {
    getUser: (id) => User,
    getUsers: () => [User],
  },
  Mutation: {
    signup: async (_, args) => {
      return authController.signup(args);
    },
    login: async (_, args) => {
      return authController.login(args);
    },
    refreshToken: async (_, args) => {
      return authController.refreshToken(args);
    },
  },
};

module.exports = resolvers;
