const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String},
    token: { type: String }
});

// Export User model
module.exports = mongoose.model('User', UserSchema, 'user');