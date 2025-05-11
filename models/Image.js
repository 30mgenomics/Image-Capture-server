const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  userId: String,
  patientId: String,
  patientName: String,
  imageUrl: String, // Store Cloudinary URL
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);