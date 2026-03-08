const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const adminRoutes = require("../routes/admin.routes");
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Need to configure properly for cookies
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Main entry point for auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Movie API is running" });
});

module.exports = app;
