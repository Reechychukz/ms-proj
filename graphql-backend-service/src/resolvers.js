//const User = require("./models/User"); // You'll create this model later
const User = require("../../mongodb-service/models/User");

const resolvers = {
  Query: {
    getUser: (id) => User,
    getUsers: () => [User],
  },
  Mutation: {
    signup: async (_, args) => {
      // Implement user signup logic and save data to MongoDB
    },
    login: async (_, { email, password }) => {
      // Implement user login logic, generate JWT, and return it
    },
  },
};

module.exports = resolvers;
