const mongoose = require("mongoose");


  const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true }, 
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  });

module.exports = mongoose.model("User", UserSchema);
// Compare this snippet from models/User.js:
