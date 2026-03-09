import React, { useState, useEffect, useMemo } from "react";
import useAdminMovies from "../hooks/useAdminMovies";
import MovieFormModal from "../components/MovieFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilm,
  FiRefreshCw,
} from "react-icons/fi";

const AdminMovies = () => {
  const {
    movies,
    isLoading,
    isSubmitting,
    fetchMovies,
    createMovie,
    updateMovie,
    deleteMovie,
  } = useAdminMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletingMovieId, setDeletingMovieId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    if (!searchQuery) return movies;
    return movies.filter(
      (m) =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre?.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [movies, searchQuery]);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  const handleSubmit = async (formData) => {
    let result;
    if (editingMovie) {
      result = await updateMovie(editingMovie._id, formData);
    } else {
      result = await createMovie(formData);
    }
    if (result.success) handleCloseForm();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMovieId) return;
    setIsDeleting(true);
    const result = await deleteMovie(deletingMovieId);
    if (result.success) setDeletingMovieId(null);
    setIsDeleting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <MovieFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingMovie}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        isOpen={!!deletingMovieId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingMovieId(null)}
        title="Delete Movie"
        message="Are you sure you want to permanently delete this movie? This cannot be undone."
        confirmLabel="Delete Movie"
        isLoading={isDeleting}
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {movies.length} movie{movies.length !== 1 ? "s" : ""} in your
            database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMovies}
            className="p-2.5 bg-dark-300/50 hover:bg-dark-300 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
            title="Refresh"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-primary-500/25"
          >
            <FiPlus className="w-4 h-4" />
            Add Movie
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, genre, or category..."
          className="w-full bg-dark-200 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-primary-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-16 bg-dark-300/30 animate-pulse mb-px"
              />
            ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          icon={<FiFilm className="w-10 h-10" />}
          title="No movies yet"
          subtitle="Add your first movie to get started"
          actionLabel="Add Movie"
          onAction={handleOpenAdd}
        />
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No movies match "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-primary-400 hover:text-primary-300 text-sm transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Movie</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Genre</div>
            <div className="col-span-2">Added</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-12 bg-dark-300/50 rounded-lg overflow-hidden flex-shrink-0">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFilm className="w-3 h-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {movie.title}
                    </p>
                    {movie.movieId && (
                      <p className="text-gray-600 text-xs">
                        ID: {movie.movieId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${movie.category === "tv" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}
                  >
                    {movie.category === "tv" ? "TV Show" : "Movie"}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-400 text-xs truncate">
                    {movie.genre?.slice(0, 2).join(", ") || "—"}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 text-xs">
                    {formatDate(movie.createdAt)}
                  </p>
                </div>

                <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleOpenEdit(movie)}
                    className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingMovieId(movie._id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/5 bg-dark-300/10">
            <p className="text-gray-600 text-xs">
              Showing {filteredMovies.length} of {movies.length} movies
            </p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
