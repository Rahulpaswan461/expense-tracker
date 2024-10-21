const { verifyToken } = require("../services/authJWT")

function checkForAuthenticatedUser(cookie) {
    return (req, res, next) => {
      // Allow access to specific paths without authentication
      if (req.path === "/" || req.path === "/api/user/register" || req.path === "/api/user/login") {
        return next();
      }
  
      // Get the token from cookies
      const token = req.cookies[cookie];
      if (!token) {
        return res.status(401).json({ error: "Authentication is required" });
      }
  
      try {
        // Verify the token and attach the payload to the request object
        const payload = verifyToken(token);
        req.user = payload;
  
        return next();
      } catch (error) {
        console.log("Error verifying token:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
  
  module.exports = {
    checkForAuthenticatedUser,
  };