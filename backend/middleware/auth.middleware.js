const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback if token is in header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
