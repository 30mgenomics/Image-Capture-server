const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Image = require("../models/Image");
const { sendNotification } = require("../config/sseNotification");

require("dotenv").config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

exports.uploadImage = async (req, res) => {
  try {

    const { userId, patientId, patientName } = req.body; // Extract user ID and patient ID from request
    if (!req.file && !req.body.image) {
      return res.status(400).json({ error: "No image provided" });
    }


    // Convert Base64 to buffer if received as Base64
    let buffer;
    if (req.body.image) {
      buffer = Buffer.from(req.body.image.split(",")[1], "base64"); // Remove data URL scheme
    } else {
      return res.status(400).json({ error: "Invalid image data" });
    }

    // Upload buffer directly to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_uploads", // Cloudinary folder
          format: "jpeg", // Force format
          public_id: `image_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });


    // Save URL to database
    const newImage = new Image({
      userId,
      patientId,
      patientName,
      imageUrl: result.secure_url,
      uploadedAt: new Date(),
    });

    await newImage.save(); // Save to database

    // Trigger SSE notification
    sendNotification({
      title: "New Image Uploaded",
      userId,
      patientId,
      patientName,
      uploadedAt: new Date(),
    });

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};



// Fetch all uploaded images for the Admin
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }); // Sort by latest uploads
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the image in the database
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract public ID from Cloudinary URL to delete from Cloudinary
    const publicId = image.imageUrl.split("/").pop().split(".")[0]; // Extract ID from URL

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`user_uploads/${publicId}`);

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

