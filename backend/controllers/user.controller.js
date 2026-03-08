// controllers/user.controller.js - User endpoints for favorites and watch history
const User = require("../models/user.model");

// ─── FAVORITES ───────────────────────────────────────────

const addToFavorites = async (req, res) => {
  try {
    const { movieId, title, posterUrl } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    const user = await User.findById(req.user.id);

    const alreadyExists = user.favorites.find((fav) => fav.movieId === movieId);
    if (alreadyExists) {
      return res.status(400).json({ message: "Movie already in favorites" });
    }

    user.favorites.push({ movieId, title, posterUrl, addedAt: new Date() });
    await user.save();

    res
      .status(200)
      .json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter((fav) => fav.movieId !== movieId);
    await user.save();

    res
      .status(200)
      .json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("favorites");
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─── WATCH HISTORY ───────────────────────────────────────

const addToHistory = async (req, res) => {
  try {
    const { movieId, title, posterUrl } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    const user = await User.findById(req.user.id);

    // Remove existing entry to avoid duplicates
    user.watchHistory = user.watchHistory.filter(
      (item) => item.movieId !== movieId,
    );

    // Unshift to front
    user.watchHistory.unshift({
      movieId,
      title,
      posterUrl,
      watchedAt: new Date(),
    });

    // Trim to max 50 items
    user.watchHistory = user.watchHistory.slice(0, 50);

    await user.save();

    res
      .status(200)
      .json({
        message: "Added to watch history",
        watchHistory: user.watchHistory,
      });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("watchHistory");
    res.status(200).json({ watchHistory: user.watchHistory });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.watchHistory = [];
    await user.save();

    res.status(200).json({ message: "Watch history cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
};
