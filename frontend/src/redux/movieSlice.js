// Handles movie-related global state — favorites and watch history

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ─── Favorites Thunks ────────────────────────────────────

export const fetchFavorites = createAsyncThunk(
  "movies/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/users/favorites");
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch favorites",
      );
    }
  },
);

export const addFavorite = createAsyncThunk(
  "movies/addFavorite",
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/favorites",
        movieData,
      );
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add favorite",
      );
    }
  },
);

export const removeFavorite = createAsyncThunk(
  "movies/removeFavorite",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/users/favorites/${movieId}`,
      );
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove favorite",
      );
    }
  },
);

// ─── Watch History Thunks ────────────────────────────────

export const fetchHistory = createAsyncThunk(
  "movies/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/users/history");
      return response.data.watchHistory;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history",
      );
    }
  },
);

export const addToHistory = createAsyncThunk(
  "movies/addToHistory",
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/history",
        movieData,
      );
      return response.data.watchHistory;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update history",
      );
    }
  },
);

export const clearHistory = createAsyncThunk(
  "movies/clearHistory",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/api/users/history");
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear history",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    favorites: [],
    watchHistory: [],
    favoritesLoading: false,
    historyLoading: false,
    favoritesError: null,
    historyError: null,
  },
  reducers: {
    clearMovieErrors: (state) => {
      state.favoritesError = null;
      state.historyError = null;
    },
  },
  extraReducers: (builder) => {
    // Favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });

    // History
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.watchHistory = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.watchHistory = action.payload;
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.watchHistory = [];
      });
  },
});

export const { clearMovieErrors } = movieSlice.actions;

// Selectors
export const selectFavorites = (state) => state.movies.favorites;
export const selectWatchHistory = (state) => state.movies.watchHistory;
export const selectFavoritesLoading = (state) => state.movies.favoritesLoading;
export const selectHistoryLoading = (state) => state.movies.historyLoading;
export const selectIsFavorited = (movieId) => (state) =>
  state.movies.favorites.some((fav) => String(fav.movieId) === String(movieId));

export default movieSlice.reducer;
