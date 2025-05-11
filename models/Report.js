const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  reportData: { type: Buffer, required: true }, // Store file as Buffer
  uploadedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;


// const mongoose = require("mongoose");

// const ReportSchema = new mongoose.Schema({
//   userId: { type: String, required: true }, // Associate report with user
//   patientId: String,
//   patientName: String,
//   reportUrl: String, // Cloudinary URL
// });

// module.exports = mongoose.model("Report", ReportSchema);
