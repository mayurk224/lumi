import React, { useEffect, useState } from 'react';
import { Film, X, ExternalLink, Save } from 'lucide-react';

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

const MovieFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        posterUrl: initialData.posterUrl || "",
        movieId: initialData.movieId || "",
        releaseDate: initialData.releaseDate
          ? new Date(initialData.releaseDate).toISOString().split("T")[0]
          : "",
        trailerUrl: initialData.trailerUrl || "",
        genre: Array.isArray(initialData.genre)
          ? initialData.genre.join(", ")
          : initialData.genre || "",
        category: initialData.category || "movie",
      });
    } else if (isOpen && !initialData) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    onSubmit({
      ...formData,
      genre: formData.genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      releaseDate: formData.releaseDate || undefined,
    });
  };

  const isEditMode = !!initialData;

  if (!isOpen) return null;

  const inputClass = "w-full bg-transparent text-white placeholder-white/30 px-4 py-3 border border-white/20 rounded-sm focus:outline-none focus:border-[#BBFB00] transition-colors disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">

      {/* Modal Container */}
      <div className="bg-black border border-white/20 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 bg-black z-10">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-[#BBFB00]" />
            <h2 className="text-white font-bold tracking-wide text-lg">
              {isEditMode ? "Edit Movie" : "Add New Movie"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Title */}
          <div>
            <label className={labelClass}>
              Movie Title <span className="text-[#BBFB00]">*</span>
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

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
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

          {/* Poster URL & Preview */}
          <div>
            <label className={labelClass}>Poster Image URL</label>
            <div className="flex gap-3">
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                disabled={isSubmitting}
                className={`${inputClass} flex-1`}
              />
              {formData.posterUrl && (
                <img
                  src={formData.posterUrl}
                  alt="preview"
                  className="w-12 h-[52px] object-cover rounded-sm border border-white/20 shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* ID & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>TMDB Movie ID</label>
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
              <label className={labelClass}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${inputClass} cursor-pointer appearance-none`}
              >
                <option value="movie" className="bg-black text-white">Movie</option>
                <option value="tv" className="bg-black text-white">TV Show</option>
              </select>
            </div>
          </div>

          {/* Release Date & Genres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className={labelClass}>
                Genres <span className="text-white/40 font-normal">(comma separated)</span>
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

          {/* Trailer URL */}
          <div>
            <label className={labelClass}>Trailer YouTube URL</label>
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
                  className="flex items-center gap-2 px-4 py-3 border border-white/20 text-white hover:bg-white hover:text-black rounded-sm text-sm font-medium transition-colors shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  Test
                </a>
              )}
            </div>
            <p className="text-white/40 text-xs mt-2">
              Use embed format: https://www.youtube.com/embed/VIDEO_ID
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-white/10 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 text-sm font-medium text-white border border-white/20 hover:bg-white/5 rounded-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold bg-[#BBFB00] text-black hover:bg-white disabled:bg-[#BBFB00]/50 disabled:cursor-not-allowed rounded-sm transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? "Save Changes" : "Create Movie"}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MovieFormModal;
