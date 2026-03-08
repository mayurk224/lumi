// models/movie.model.js - Movie Mongoose schema and model
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "Description not available",
    },
    posterUrl: {
      type: String,
      default: "",
    },
    movieId: {
      type: String,
      trim: true,
    },
    releaseDate: {
      type: Date,
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    genre: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Movie", movieSchema);
