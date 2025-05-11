const mongoose = require("mongoose");


  const AuthSchema = new mongoose.Schema({
    userName: { type: String, required: true }, 
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  });

module.exports = mongoose.model("Auth", AuthSchema);
// Compare this snippet from models/User.js:
