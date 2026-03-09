// Handles all authentication state — user info, token, loading, error

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Async thunk: Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", userData);
      // Cookie is set automatically by the server — no client action needed
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// Async thunk: Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        credentials,
      );
      // Cookie is set automatically by the server — client does nothing
      console.log('[Auth] Login successful:', response.data.user);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      const statusCode = error.response?.status;
      console.error(`[Auth] Login failed (${statusCode}):`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk: Get current user (for restoring session on refresh)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Session expired",
      );
    }
  },
);

// Async thunk: Logout - blacklist token on server
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call backend to blacklist the token and clear cookie
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      // Even if backend call fails, proceed with client-side logout
      console.warn('Server logout failed:', error.message);
    }
    // No localStorage to clear — cookie is managed by browser/server
  },
);

// Load initial state from localStorage (for non-auth UI preferences only)
// Authentication state is determined by calling /api/auth/me on app load
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,        // Token is now in HttpOnly cookie — not accessible to JS
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    localLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // No localStorage to clear
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // No token to store — it's in the HttpOnly cookie
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // No token handling
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        // Not an error to show — just not logged in
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        // Optional: could show loading but usually instant
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still log out on the client even if server call failed
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { localLogout, clearError, setCredentials } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;
