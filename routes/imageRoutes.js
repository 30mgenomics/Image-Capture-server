const express = require("express");
const router = express.Router();
const multer = require("multer");
const {getImages, uploadImage, deleteImage} = require("../controllers/imageController");

const upload = multer({storage: multer.memoryStorage()}); // Use Cloudinary instead

router.post("/upload-image", upload.single("image"), uploadImage);
router.get("/get-images", getImages); // Fetch images for Admin
router.delete("/delete/:id", deleteImage);

module.exports = router;
