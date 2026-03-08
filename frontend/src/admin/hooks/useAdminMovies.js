import { useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const useAdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/admin/movies");
      setMovies(res.data.movies || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch movies";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMovie = useCallback(async (movieData) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/admin/movies", movieData);
      setMovies((prev) => [res.data, ...prev]);
      toast.success("Movie created successfully!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create movie";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateMovie = useCallback(async (id, movieData) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.put(`/api/admin/movies/${id}`, movieData);
      setMovies((prev) => prev.map((m) => (m._id === id ? res.data : m)));
      toast.success("Movie updated successfully!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update movie";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteMovie = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
      toast.success("Movie deleted successfully!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete movie";
      toast.error(msg);
      return { success: false };
    }
  }, []);

  return {
    movies,
    isLoading,
    isSubmitting,
    error,
    fetchMovies,
    createMovie,
    updateMovie,
    deleteMovie,
  };
};

export default useAdminMovies;
