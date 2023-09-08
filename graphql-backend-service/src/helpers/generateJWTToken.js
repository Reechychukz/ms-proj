const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key"; // Replace with your actual secret key

const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, secretKey, { expiresIn: "1h" });
};

module.exports = {
  generateToken,
};
