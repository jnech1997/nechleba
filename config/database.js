const mongoose = require("mongoose");

exports.connect = () => {
  mongoose.set("strictQuery", true);
  // Strip query operators ($gt, $ne, ...) from user-supplied filter objects.
  mongoose.set("sanitizeFilter", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.error("Database connection failed. Exiting now...", error.message);
      process.exit(1);
    });
};
