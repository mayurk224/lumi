// All TMDB API helper functions — import and call these from any component

import axios from "axios";

const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// Trending
export const getTrending = (timeWindow = "day") =>
  tmdb.get(`/trending/all/${timeWindow}`);

// Movies
export const getPopularMovies = (page = 1) =>
  tmdb.get("/movie/popular", { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdb.get("/movie/top_rated", { params: { page } });

export const getNowPlayingMovies = (page = 1) =>
  tmdb.get("/movie/now_playing", { params: { page } });

export const getUpcomingMovies = (page = 1) =>
  tmdb.get("/movie/upcoming", { params: { page } });

// TV Shows
export const getPopularTV = (page = 1) =>
  tmdb.get("/tv/popular", { params: { page } });

export const getTopRatedTV = (page = 1) =>
  tmdb.get("/tv/top_rated", { params: { page } });

export const getOnAirTV = (page = 1) =>
  tmdb.get("/tv/on_the_air", { params: { page } });

// Movie Details
export const getMovieDetails = (id) => tmdb.get(`/movie/${id}`);

export const getMovieCredits = (id) => tmdb.get(`/movie/${id}/credits`);

export const getMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`);

export const getSimilarMovies = (id) => tmdb.get(`/movie/${id}/similar`);

// TV Details
export const getTVDetails = (id) => tmdb.get(`/tv/${id}`);

export const getTVCredits = (id) => tmdb.get(`/tv/${id}/credits`);

export const getTVVideos = (id) => tmdb.get(`/tv/${id}/videos`);

export const getSimilarTV = (id) => tmdb.get(`/tv/${id}/similar`);

// People
export const getPersonDetails = (id) => tmdb.get(`/person/${id}`);

export const getPersonMovieCredits = (id) =>
  tmdb.get(`/person/${id}/movie_credits`);

// Search
export const searchMulti = (query, page = 1) =>
  tmdb.get("/search/multi", { params: { query, page } });

export const searchMovies = (query, page = 1) =>
  tmdb.get("/search/movie", { params: { query, page } });

export const searchTV = (query, page = 1) =>
  tmdb.get("/search/tv", { params: { query, page } });

export const searchPeople = (query, page = 1) =>
  tmdb.get("/search/person", { params: { query, page } });

// Genres
export const getMovieGenres = () => tmdb.get("/genre/movie/list");

export const getTVGenres = () => tmdb.get("/genre/tv/list");

// Image URL helpers — export these and use everywhere instead of hardcoding
export const getPosterUrl = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "/placeholder-poster.jpg";

export const getBackdropUrl = (path) =>
  path
    ? `https://image.tmdb.org/t/p/original${path}`
    : "/placeholder-backdrop.jpg";

export const getProfileUrl = (path) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : "/placeholder-person.jpg";

export default tmdb;
