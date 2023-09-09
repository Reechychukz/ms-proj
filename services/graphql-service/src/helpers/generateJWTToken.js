const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, secretKey, { expiresIn: "1h" });
};

module.exports = {
  generateToken,
};
