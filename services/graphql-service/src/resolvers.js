const User = require("../../mongodb-service/src/models/User");
const authController = require("./controller/authController");

const resolvers = {
  Query: {
    getUserById: async (_, args) => {
      return authController.getUserById(args);
    },
    getAllUsers: async () => {
      return authController.getAllUsers();
    },
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
