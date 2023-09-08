const bcrypt = require("bcryptjs");
const { User } = require("../../../mongodb-service/models/User");
const validate = require("../helpers/validate");
const generateJWTToken = require("../helpers/generateJWTToken");

const authController = {
  signup: async ({ firstName, lastName, username, email, password }) => {
    try {
      // Validate input data
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
        error.statusCode = 403; // Set the status code
        throw error;
      }
      if (!error) console.log("no error");

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("Duplicate Email");
        error.statusCode = 409; // Set the status code
        throw error;
      }

      // Hash the password and create a new user record
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      console.log(newUser);
      const response = {
        code: 200,
        success: true,
        message: "Signup successful",
        user: newUser,
      };
      return response;
    } catch (error) {
      const err = new Error(error);
      throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      // Validating input data
      const validationSchema = validate.validateLogin();
      const { error } = validationSchema.validate({ email, password });
      if (error) {
        const error = new Error("Validation Error");
        error.statusCode = 403; // Set the status code
        throw error;
      }
      console.log("here");

      // Checking if the user with the provided email exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error;
      }

      // Comparing the provided password with the stored hashed password
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

      // Login successful
      const response = {
        code: 200,
        success: true,
        message: "Login successful",
        user: existingUser,
        token,
      };
      return response;
    } catch (error) {
      const err = new Error(error);
      throw err;
    }
  },

  refreshToken: async ({ refreshToken }) => {
    try {
      // Verify and decode the refresh token
      const decodedToken = jwt.verify(refreshToken, secretKey);

      // Check if the decoded token is valid
      if (!decodedToken || !decodedToken.userId) {
        const error = new Error("Invalid Refresh Token");
        error.statusCode = 422;
        throw error;
      }

      // Generate a new access token
      const accessToken = generateJWTToken(decodedToken.userId);

      const response = {
        code: 200,
        success: true,
        message: "Token Refreshed Successfully",
        accessToken,
      };
      return response;
    } catch (error) {
      const err = new Error(error);
      throw err;
    }
  },
};
module.exports = authController;
