const express = require("express");
require("../config/redis");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const adminRoutes = require("../routes/admin.routes");
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get('/api/health', async (req, res) => {
  try {
    const { isRedisReady, getRedisClient } = require('../config/redis');
    const { getBlacklistCount } = require('../utils/tokenBlacklist');

    let redisPing = null;
    if (isRedisReady()) {
      try {
        redisPing = await getRedisClient().ping();
      } catch {
        redisPing = 'error';
      }
    }

    res.json({
      status: 'ok',
      mongodb: 'connected',
      redis: isRedisReady() ? 'connected' : 'disconnected',
      redisPing,
      blacklistedTokens: await getBlacklistCount(),
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()) + 's',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Main entry point for auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Movie API is running" });
});

module.exports = app;
