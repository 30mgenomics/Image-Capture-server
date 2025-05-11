const Auth = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if the user is the predefined admin
    if (userId === process.env.ADMIN_USER_ID && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: "admin", userId: userId, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({ token, userName: "Admin", isAdmin: true });
    }

    // Check in database for regular users
    const user = await Auth.findOne({ userId });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, userId: user.userId, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId:userId , userName: user.userName, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Optionally add the token to a blacklist (if needed)
    // Example: store in Redis or database
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserId = async (req, res) => {
  try {
    console.log("Request User:", req.user); // Debugging
    const user = await Auth.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// exports.getUserId = async (req, res) => {
//   try {
//     console.log("Request User:", req.user); // Debugging
//     const user = await User.findById(req.user.id).select("-password"); // Exclude password
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// }

exports.addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);  // Debugging
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { userName, userId, password } = req.body;

    if (!userName || !userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Auth({ userName, userId, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User added successfully" });

  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export middleware for use in protected routes
exports.authenticateToken = authenticateToken;
