const express = require("express");

const {
  getProfile,
  updateProfile,
  registerUser,
  loginUser,
  logoutUser,
  userCount,
  getAllUsers,
} = require("../controllers/auth.controller");

const {authMiddleware} = require("../middlewares/auth.middleware");
const validators = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/register", validators.registerUserValidations, registerUser);
router.post("/login", validators.loginUserValidations, loginUser);
router.post("/logout", logoutUser);

// Protect profile routes
router.get("/profile/:id", authMiddleware, getProfile);
router.get("/getAllUsers", authMiddleware, getAllUsers);
router.patch("/updateprofile/:id", authMiddleware, updateProfile);
router.get("/userCount", authMiddleware, userCount);

module.exports = router;
