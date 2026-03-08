// routes/user.routes.js - User routes for favorites and watch history
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
} = require("../controllers/user.controller");

// Apply protect middleware to all routes in this router
router.use(protect);

router.post("/favorites", addToFavorites);
router.delete("/favorites/:movieId", removeFromFavorites);
router.get("/favorites", getFavorites);

router.post("/history", addToHistory);
router.get("/history", getHistory);
router.delete("/history", clearHistory);

module.exports = router;
