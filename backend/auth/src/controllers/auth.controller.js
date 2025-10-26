// src/controllers/auth.controller.js
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../db/redis");
const { default: mongoose } = require("mongoose");

// Generate JWT token
function generateToken(id, email, role) {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Cookie options helper
function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    domain: isProd ? ".skyzzcloset.shop" : "localhost",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}


// ================== REGISTER ==================
async function registerUser(req, res) {
  try {
    const { fullName = {}, email, password } = req.body;
    const { firstName, lastName } = fullName;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10);
    const user = await userModel.create({ fullName: { firstName, lastName }, email, password: hashedPassword });
    const token = generateToken(user._id, user.email, user.role);

    res.cookie("token", token, cookieOptions());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, role: user.role, username: user.fullName.firstName },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

// ================== LOGIN ==================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user._id, user.email, user.role);
    res.cookie("token", token, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { id: user._id, email: user.email, role: user.role, username: user.fullName.firstName },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

// ================== LOGOUT ==================
async function logoutUser(req, res) {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (token) await redis.set(`blacklist:${token}`, "true", "EX", 7 * 24 * 60 * 60);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      domain: process.env.NODE_ENV === "production" ? ".skyzzcloset.shop" : undefined,
      maxAge: 0,
    });

    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

// ================== PROFILE / USERS ==================
async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

async function getAllUsers(req, res) {
  const { firstName, lastName, email, role } = req.query;
  const skip = parseInt(req.query.skip) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  try {
    const filter = {};
    if (firstName) filter["fullName.firstName"] = firstName;
    if (lastName) filter["fullName.lastName"] = lastName;
    if (email) filter.email = email;
    if (role) filter.role = role;

    const users = await userModel.find(filter).skip(skip).limit(limit).select("-password");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user id" });

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName = {}, address } = req.body;
    if (fullName.firstName) user.fullName.firstName = fullName.firstName;
    if (fullName.lastName) user.fullName.lastName = fullName.lastName;
    if (address) user.address = address;

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
}

async function userCount(req, res) {
  try {
    const count = await userModel.countDocuments();
    if (count === 0) return res.status(404).json({ message: "No users found" });
    return res.status(200).json({ message: "User count fetched successfully", count });
  } catch (error) {
    return res.status(500).json({ message: "Server error", details: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  userCount,
  getAllUsers,
};
