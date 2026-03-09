// backend/routes/movie.routes.js - Public routes for movies (search, etc.)
const express = require("express");
const router = express.Router();
const { searchMovies } = require("../controllers/admin.controller");

// Public search endpoint - no auth required
// Anyone can search the movie catalog including admin-added movies
router.get("/search", searchMovies);

module.exports = router;
