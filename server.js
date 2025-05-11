const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
// const { setupSSE } = require("./config/sseNotification");

const connectDB = require("./config/db");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();


app.use(cors({
    origin: ["https://30mgenomics.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));


// app.options("*", cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: "100mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Setup SSE for real-time notifications
// setupSSE(app);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/image", require("./routes/imageRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Export the app for Vercel
module.exports = app;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
