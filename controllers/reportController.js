const Report = require("../models/Report");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Upload report
exports.uploadReport = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const { userId, patientId, patientName } = req.body;

    if (!req.files || !req.files.report) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.report;

    // ✅ Convert file to Buffer
    const buffer = file.data;

    // ✅ Save to MongoDB directly
    const newReport = new Report({
      userId,
      patientId,
      patientName,
      reportData: buffer, // Directly save as Buffer
    });

    await newReport.save();

    res.status(200).json({ message: "Report uploaded successfully" });
  } catch (error) {
    console.error("Error uploading report:", error);
    res.status(500).json({ message: "Uploading error" });
  }
};

// exports.uploadReport = async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.files);
//     const { userId, patientId, patientName } = req.body;

//     if (!req.files || !req.files.report) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.files.report;

//     // ✅ Convert file to Buffer
//     const buffer = file.data;

//     // ✅ Save to MongoDB
//     const newReport = new Report({
//       userId,
//       patientId,
//       patientName,
//       reportData: buffer, // Directly save as Buffer
//     });

//     await newReport.save();

//     res.status(200).json({ message: "Report uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading report:", error);
//     res.status(500).json({ message: "uploading error" });
//   }
// };

// Get report by userID
exports.getUserReports = async (req, res) => {
  try {
    const { userId } = req.user; // Extract from token

    // ✅ Find all reports for the specific user
    const reports = await Report.find({ userId });

    if (!reports.length) {
      return res.status(404).json({ message: "No reports found" });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.uploadReport = async (req, res) => {
//   try {
//     const { userId, patientId, patientName } = req.body;

//     if (!req.files || !req.files.report) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.files.report;

//     // ✅ Upload to Cloudinary (Set resource_type for PDF)
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: "reports",
//       resource_type: "raw",
//       public_id: `report_${Date.now()}`,
//     });

//     // ✅ Save URL to MongoDB
//     const newReport = new Report({
//       userId,
//       patientId,
//       patientName,
//       reportUrl: result.secure_url,
//     });

//     await newReport.save();

//     res.status(200).json({
//       message: "Report uploaded successfully",
//       reportUrl: result.secure_url,
//     });
//   } catch (error) {
//     console.error("Error uploading report:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Upload report
// exports.uploadReport = async (req, res) => {
//   try {
//     const { userId, patientId, patientName } = req.body;
//     const reportUrl = `/uploads/${req.file.filename}`;

//     const newReport = new Report({ userId, patientId, patientName, reportUrl });
//     await newReport.save();

//     res.json({ message: "Report uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading report:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Get reports for specific user
// exports.getUserReports = async (req, res) => {
//   try {
//     const userId = req.user.userId; // Extract from decoded token
//     const reports = await Report.find({ userId });

//     res.json(reports);
//   } catch (error) {
//     console.error("Error fetching reports:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { view } = req.query;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": view
        ? "inline" // Open in browser
        : `attachment; filename="report_${Date.now()}.pdf"`, // Download as file
    });

    res.send(report.reportData);
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.downloadReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const report = await Report.findById(id);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     // ✅ Set headers for PDF download
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="report_${Date.now()}.pdf"`,
//     });

//     // ✅ Send Buffer directly as file
//     res.send(report.reportData);
//   } catch (error) {
//     console.error("Error downloading report:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }


