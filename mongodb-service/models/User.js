const mongoose = require("mongoose");
const { Schema } = mongoose;
// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
// });

const user = new Schema({
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
    required: true,
    type: String,
  },
  firstname: {
    required: true,
    type: String,
  },
});

const userSchema = mongoose.model("users", user);
//export default mongoose.model("users", userSchema);
//export default mongoose.model("users", user);
