const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose.set("strictQuery", true);
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
    })
    .then(async () => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      process.exit(1);
    });
  mongoose.Promise = global.Promise;
};
