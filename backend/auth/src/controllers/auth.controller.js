// backend/src/controllers/auth.controller.js

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../db/redis");
const {default: mongoose} = require("mongoose");

// Generate JWT token
function generateToken(id, email, role) {
  return jwt.sign({id, email, role}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

// ================== REGISTER ==================
async function registerUser(req, res) {
  try {
    const {fullName = {}, email, password} = req.body;
    const {firstName, lastName} = fullName;

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

    const token = generateToken(user._id, user.email, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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
    if (!user)
      return res
        .status(400)
        .json({success: false, message: "Invalid email or password"});

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({success: false, message: "Invalid email or password"});

    const token = generateToken(user._id, user.email, user.role);
 
    console.log(token);
    
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
      await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    });

    return res
      .status(200)
      .json({success: true, message: "User logged out successfully"});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ================== PROFILE ==================
async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({success: false, message: "User not found"});
    return res.status(200).json({success: true, user});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ================== UPDATE PROFILE ==================
async function updateProfile(req, res) {
  try {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: "Invalid user id"});

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({message: "User not found"});

    const {fullName = {}, address} = req.body;
    const {firstName, lastName} = fullName;

    if (firstName) user.fullName.firstName = firstName;
    if (lastName) user.fullName.lastName = lastName;
    if (address) user.address = address;

    await user.save();

    return res
      .status(200)
      .json({success: true, message: "Profile updated successfully", user});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ================== USER COUNT ==================
async function userCount(req, res) {
  try {
    const count = await userModel.countDocuments();
    if (!count) return res.status(404).json({message: "No users found"});
    return res
      .status(200)
      .json({message: "User count fetched successfully", count});
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
