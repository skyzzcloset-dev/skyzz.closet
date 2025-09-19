const express = require("express");
const {
  getProfile,
  updateProfile,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

const {authMiddleware} = require("../middleware/auth.middleware");
const validators = require("../middleware/validate.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protect profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/updateprofile", authMiddleware, updateProfile);

module.exports = router;
