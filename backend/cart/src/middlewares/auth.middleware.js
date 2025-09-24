const jwt = require("jsonwebtoken");

function createAuthMiddleware(role = ["customer"]) {
  return async function authmiddleware(req, res, next) {
    const {token} =
      req.cookies.token || req.headers("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({message: "Unauthorized: No token provided"});
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!role.includes(decoded.role)) {
        return res.status(403).json({message: "Insufficient Perms"});
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({message: "Invalid Token"});
    }
  };
}

module.exports = {createAuthMiddleware};
