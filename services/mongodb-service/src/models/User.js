const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  password: {
    required: false,
    type: String,
  },
  lastname: {
    type: String,
  },
  firstname: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
