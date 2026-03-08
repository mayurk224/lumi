// routes/admin.routes.js - Admin routes for managing movies and users
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getAllUsers,
  banUser,
  deleteUser,
} = require("../controllers/admin.controller");

// Apply both middlewares to all routes in this router
router.use(protect, adminOnly);

// Movie routes
router.post("/movies", createMovie);
router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.put("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);

// User management routes
router.get("/users", getAllUsers);
router.put("/users/:id/ban", banUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
