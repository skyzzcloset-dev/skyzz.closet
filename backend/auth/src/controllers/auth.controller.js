// backend/src/controllers/auth.controller.js

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../db/redis");

function generateToken(id, email, role) {
  return jwt.sign({id, email, role}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

// ================== REGISTER ==================
async function registerUser(req, res) {
  try {
    const {fullName: {firstName, lastName} = {}, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({success: false, message: "All fields are required"});
    }

    const isUserExist = await userModel.findOne({email});
    if (isUserExist) {
      return res
        .status(400)
        .json({success: false, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    const user = await userModel.create({
      fullName: {firstName, lastName},
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.email, user.password, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {id: user._id, email: user.email, role: user.role},
    });
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ================== LOGIN ==================
async function loginUser(req, res) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({success: false, message: "Email and password are required"});
    }

    const user = await userModel.findOne({email}).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({success: false, message: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({success: false, message: "Invalid email or password"});
    }

    const token = generateToken(user._id, user.email, user.role);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.fullName.firstName,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ================== LOGOUT ==================

async function logoutUser(req, res) {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      // Store token in Redis blacklist for 24 hours
      await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
}

// ================== PROFILE ==================
async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    return res.status(200).json({success: true, user});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

async function updateProfile(req, res) {
  try {
    const {firstName, lastName, address} = req.body;
    const user = await userModel
      .findByIdAndUpdate(
        req.user.id,
        {
          "fullName.firstName": firstName,
          "fullName.lastName": lastName,
          address,
        },
        {new: true}
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    return res
      .status(200)
      .json({success: true, message: "Profile updated successfully", user});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

async function userCount(req, res) {
  try {
    const count = await userModel.countDocuments();
    if (!count) {
      return res.status(404).json({message: "No users found"});
    }
    res
      .status(200)
      .json({message: "User count fetched successfully", count: count});
  } catch (error) {
    return res
      .status(500)
      .json({message: "Server error", details: error.message});
  }
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  userCount,
};
