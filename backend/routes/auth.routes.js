const express = require("express");
const authRoutes = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", protect, logoutUser);
authRoutes.get("/me", protect, getMe);

module.exports = authRoutes;
