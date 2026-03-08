const express = require("express");
const authRoutes = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

authRoutes.post("/sign-up", registerUser);
authRoutes.post("/sign-in", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.get("/me", protect, getMe);

module.exports = authRoutes;
