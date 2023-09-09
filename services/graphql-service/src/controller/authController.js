const bcrypt = require("bcryptjs");
const { User } = require("../../../mongodb-service/src/models/User");
const validate = require("../helpers/validate");
const generateJWTToken = require("../helpers/generateJWTToken");
const jwt = require("jsonwebtoken");
const logger = require("../helpers/logger");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY;

const authController = {
  /**
   * controller method for user signup
   * @param {*} params - user details on signup
   * @returns {Object} response - process status information
   */
  signup: async ({ firstName, lastName, username, email, password }) => {
    try {
      const validationSchema = validate.validateSignup();
      const { error } = validationSchema.validate({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      if (error) {
        const error = new Error("Validation Error");
        error.statusCode = 403;
        throw error;
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("Duplicate Email");
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const response = {
        code: 200,
        success: true,
        message: "Signup successful",
        user: newUser,
      };
      logger.info("Signup successful", { data: newUser });
      return response;
    } catch (error) {
      const err = new Error(error);
      logger.error("An error occurred in signup resolver", { error });
      throw err;
    }
  },

  /**
   * controller method for user login
   * @param {*} param0 - user email and password
   * @returns {Object} response - process status information
   */
  login: async ({ email, password }) => {
    try {
      const validationSchema = validate.validateLogin();
      const { error } = validationSchema.validate({ email, password });
      if (error) {
        const error = new Error("Validation Error");
        error.statusCode = 403; // Set the status code
        throw error;
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordValid) {
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error;
      }
      const token = generateJWTToken.generateToken(
        existingUser._id.toHexString()
      );

      const response = {
        code: 200,
        success: true,
        message: "Login successful",
        user: existingUser,
        token,
      };
      logger.info("Login successful", { data: existingUser });
      return response;
    } catch (error) {
      const err = new Error(error);
      logger.error("An error occurred in login resolver", { error });
      throw err;
    }
  },

  /**
   * controller method to refress jwt token
   * @param {*} token -  jwt
   * @returns {Object} response - process status information
   */
  refreshToken: async ({ token }) => {
    try {
      const decodedToken = jwt.verify(token, secretKey);

      if (!decodedToken || !decodedToken.userId) {
        const error = new Error("Invalid Refresh Token");
        error.statusCode = 422;
        throw error;
      }

      const accessToken = generateJWTToken.generateToken(decodedToken.userId);

      const response = {
        code: 200,
        success: true,
        message: "Token Refreshed Successfully",
        accessToken,
      };

      logger.info("Token Refreshed Successfully");
      return response;
    } catch (error) {
      const err = new Error(error);
      logger.error("An error occurred in refresh token resolver", { error });
      throw err;
    }
  },

  /**
   * controller method to get a user by id
   * @param {*} userId - user id
   * @returns {Object} response - process status information and user object
   */
  getUserById: async ({ id }) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        const error = new Error("Not Found");
        error.statusCode = 404;
        throw error;
      }
      const response = {
        code: 200,
        success: true,
        message: "User Retrieved Successfully",
        user: user,
      };

      return response;
    } catch (error) {
      const err = new Error(error);
      logger.error("An error occurred in get user by id resolver", { error });
      throw err;
    }
  },

  /**
   *
   * @returns {Object} - list of users
   */
  getAllUsers: async () => {
    try {
      const users = await User.find();
      if (!users) {
        const error = new Error("Not Found");
        error.statusCode = 404;
        throw error;
      }

      const response = {
        code: 200,
        success: true,
        message: "Users Retrieved Successfully",
        user: users,
      };

      logger.info("Users Retrieved Successfully");
      return response;
    } catch (error) {
      const err = new Error(error);
      logger.error("An error occurred in get all users resolver", { error });
      throw err;
    }
  },
};
module.exports = authController;
