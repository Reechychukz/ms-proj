const Joi = require("joi");

// Validation schema for user signup
const validateSignup = () => {
  return Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
};

// Validation schema for user login
const validateLogin = () => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
};

module.exports = { validateSignup, validateLogin };
