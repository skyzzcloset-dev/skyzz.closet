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

const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const validators = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/register", validators.registerUserValidations, registerUser);
router.post("/login", validators.loginUserValidations, loginUser);
router.post("/logout", logoutUser);

// Protect profile routes
router.get("/profile/:id", createAuthMiddleware(["admin"]), getProfile);
router.get("/getAllUsers", createAuthMiddleware(["admin"]), getAllUsers);
router.patch("/updateprofile/:id", createAuthMiddleware(["admin"]), updateProfile);
router.get("/userCount", createAuthMiddleware(["admin"]), userCount);

module.exports = router;
