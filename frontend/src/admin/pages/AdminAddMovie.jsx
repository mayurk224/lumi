import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminMovies from "../hooks/useAdminMovies";
import { FiArrowLeft, FiFilm, FiExternalLink, FiSave } from "react-icons/fi";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  posterUrl: "",
  movieId: "",
  releaseDate: "",
  trailerUrl: "",
  genre: "",
  category: "movie",
};

const AdminAddMovie = () => {
  const navigate = useNavigate();
  const { createMovie, isSubmitting } = useAdminMovies();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    const result = await createMovie({
      ...formData,
      genre: formData.genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      releaseDate: formData.releaseDate || undefined,
    });
    if (result.success) {
      navigate("/admin/movies");
    }
  };

  const inputClass =
    "w-full bg-dark-300/50 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all";

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/movies")}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Movie</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Fill in the details to add a movie to your database
          </p>
        </div>
      </div>

      <div className="bg-dark-200 border border-white/5 rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movie Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Inception"
              required
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Movie synopsis..."
              rows={3}
              disabled={isSubmitting}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poster Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://image.tmdb.org/..."
                disabled={isSubmitting}
                className={`${inputClass} flex-1`}
              />
              {formData.posterUrl && (
                <img
                  src={formData.posterUrl}
                  alt="preview"
                  className="w-12 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                TMDB Movie ID
              </label>
              <input
                type="text"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                placeholder="e.g. 27205"
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="movie" className="bg-dark-200">
                  Movie
                </option>
                <option value="tv" className="bg-dark-200">
                  TV Show
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${inputClass} color-scheme-dark`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres{" "}
                <span className="text-gray-500 font-normal">
                  (comma separated)
                </span>
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Action, Sci-Fi, Thriller"
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Trailer YouTube URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                disabled={isSubmitting}
                className={`${inputClass} flex-1`}
              />
              {formData.trailerUrl && (
                <a
                  href={formData.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-3 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-xl text-xs transition-all flex-shrink-0"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  Test
                </a>
              )}
            </div>
            <p className="text-gray-600 text-xs mt-1.5">
              Use embed format: https://www.youtube.com/embed/VIDEO_ID
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-primary-500/25"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding Movie...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Add Movie to Database
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddMovie;
