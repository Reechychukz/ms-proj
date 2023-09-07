const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  //Connecting to DB...
  console.log("Connecting to DB...");

  /**
   * Connect to MongoDB.
   */
  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection.on("error", function (err) {
    console.log(
      "MongoDB Connection Error. Please make sure that MongoDB is running.",
      err
    );
    process.exit(1);
  });
  mongoose.set("debug", true);
};
