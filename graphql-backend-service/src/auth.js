const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key"; // Replace with your actual secret key

const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
};

module.exports = {
  generateToken,
};
