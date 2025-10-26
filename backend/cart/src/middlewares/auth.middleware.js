// backend/src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

function createAuthMiddleware(roles = ["customer"]) {
  return async function authMiddleware(req, res, next) {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Insufficient permissions" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
}

module.exports = { createAuthMiddleware };
