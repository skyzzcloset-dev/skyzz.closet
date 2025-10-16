const jwt = require("jsonwebtoken")
function createAuthMiddleware(roles = ["customer"]) {
  return async function authMiddleware(req, res, next) {
    try {
      const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

      console.log("Headers:", req.headers);
      console.log("Authorization header:", req.header("Authorization"));

      if (!token) {
        return res
          .status(401)
          .json({success: false, message: "Unauthorized: No token provided"});
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Role check
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res
        .status(401)
        .json({success: false, message: "Unauthorized: Invalid token"});
    }
  };
}

module.exports = {createAuthMiddleware}