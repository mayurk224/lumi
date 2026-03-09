// Configured Axios instance for backend API calls (non-TMDB)

import axios from "axios";
import axiosInstance from "./axiosInstance";

/**
 * Search movies stored in MongoDB (admin-added movies).
 * These are NOT available via TMDB search.
 *
 * @param {string} query - Search term
 * @returns {Promise} axios response with { results, total, query }
 */
export const searchBackendMovies = async (query) => {
  if (!query || query.trim().length < 2) {
    return { data: { results: [], total: 0 } }
  }
  return axiosInstance.get('/api/movies/search', {
    params: { q: query.trim() },
  })
}

export default axiosInstance;
