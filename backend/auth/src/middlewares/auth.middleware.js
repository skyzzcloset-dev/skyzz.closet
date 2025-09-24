const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({success: false, message: "Unauthorized: No token provided"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({success: false, message: "Unauthorized: User not found"});
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({success: false, message: "Unauthorized: Invalid token"});
  }
}

function adminPage(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({error: "Access denied, admin only"});
  }
  next();
}

module.exports = {authMiddleware, adminPage};
