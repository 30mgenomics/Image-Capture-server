const express = require("express");
const { loginUser, logoutUser, addUser, authenticateToken, getUserId } = require("../controllers/authController");


const router = express.Router();

router.post("/login", loginUser);
router.post("/addUser", authenticateToken, addUser); // Only admin can add users
router.get("/user/me", authenticateToken, getUserId);
router.post("/logout", authenticateToken, logoutUser);

module.exports = router;
