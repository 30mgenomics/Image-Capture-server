const express = require("express");
const { uploadReport, getUserReports, deleteReport, downloadReport } = require("../controllers/reportController");
const { authenticateToken } = require("../controllers/authController");
const fileUpload = require("express-fileupload");


const router = express.Router();

// // ✅ Use express-fileupload directly
router.use(fileUpload({useTempFiles: false, limits: {fileSize: 100 * 1024 * 1024 } })); // Limit size to 100MB
// ✅ Upload route
router.post("/upload", authenticateToken, uploadReport);
// router.post("/upload", authenticateToken, upload.single("report"), uploadReport);
router.get("/user-reports", authenticateToken, getUserReports);
router.delete("/delete/:id", authenticateToken, deleteReport);
router.get("/download/:id", downloadReport);

module.exports = router;
