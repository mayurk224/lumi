const express = require("express");
const authRoutes = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

authRoutes.post("/sign-up", registerUser);
authRoutes.post("/sign-in", loginUser);
authRoutes.get("/me", protect, getMe);

module.exports = authRoutes;
