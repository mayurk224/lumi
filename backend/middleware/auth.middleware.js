const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");
const { COOKIE_NAME } = require("../config/cookieConfig");

const protect = async (req, res, next) => {
  try {
    // Extract token from HttpOnly cookie set by the server
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        message: 'No token, authorization denied',
        code: 'NO_TOKEN',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has been blacklisted (user logged out)
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res
        .status(401)
        .json({ message: 'Token has been invalidated. Please log in again.' });
    }

    const currentUser = await User.findById(decoded.id).select(
      "role isBanned",
    );

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    if (currentUser.isBanned) {
      return res
        .status(403)
        .json({ message: "Your account has been banned" });
    }

    req.user = decoded;
    req.user.role = currentUser.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
