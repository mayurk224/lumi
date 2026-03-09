// controllers/admin.controller.js - Admin endpoints for manage movies and users
const Movie = require("../models/movie.model");
const User = require("../models/user.model");

// ─── MOVIE CRUD ───────────────────────────────────────────

const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      posterUrl,
      movieId,
      releaseDate,
      trailerUrl,
      genre,
      category,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const movie = new Movie({
      title,
      description,
      posterUrl,
      movieId,
      releaseDate,
      trailerUrl,
      genre,
      category,
      addedBy: req.user.id,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .populate("addedBy", "username email");
    res.status(200).json({ count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    Object.assign(movie, req.body);
    await movie.save();

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.deleteOne();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─── USER MANAGEMENT ─────────────────────────────────────

const searchMovies = async (req, res) => {
  try {
    const { q } = req.query

    // Return empty results for blank or too-short queries
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ results: [], total: 0 })
    }

    const query = q.trim()

    // Build a case-insensitive regex for flexible matching
    const searchRegex = new RegExp(query, 'i')

    // Search across title, description, and genre fields
    const movies = await Movie.find({
      $or: [
        { title:       { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { genre:       { $elemMatch: { $regex: searchRegex } } },
      ],
    })
    .select('title description posterUrl movieId releaseDate genre category trailerUrl')
    .limit(20)
    .lean()

    // Shape the results to match the format Search.jsx expects
    // Add a source field so the frontend knows this came from the backend
    const shaped = movies.map(movie => ({
      id:           movie.movieId || movie._id.toString(),
      _id:          movie._id,
      title:        movie.title,
      name:         movie.title,       // TV show compat field
      overview:     movie.description,
      poster_path:  null,              // no TMDB poster_path for backend movies
      posterUrl:    movie.posterUrl,   // full URL already stored
      release_date: movie.releaseDate,
      first_air_date: movie.releaseDate,
      vote_average: 0,                 // not stored by admin
      genre_ids:    [],
      media_type:   movie.category || 'movie',
      category:     movie.category || 'movie',
      source:       'backend',         // tag so frontend can distinguish
    }))

    return res.status(200).json({
      results: shaped,
      total:   shaped.length,
      query,
    })
  } catch (err) {
    console.error('[Search] MongoDB search error:', err.message)
    return res.status(500).json({
      message: 'Search failed',
      results: [],
    })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot ban an admin user" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  searchMovies,
  getAllUsers,
  banUser,
  deleteUser,
};
