const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  username: { type: String, unique: true },
  password: { type: String },
  // Increment to revoke every refresh token issued before now (see logout).
  token_version: { type: Number, default: 0 },
});

// Export User model
module.exports = mongoose.model("User", UserSchema, "user");
