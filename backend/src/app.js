const express = require("express");
const cors = require("cors");
const authRoutes = require("../routes/auth.routes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main entry point for auth routes
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Movie API is running" });
});

module.exports = app;
