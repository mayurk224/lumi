// Redux store — combines all slices

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieReducer from "./movieSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/fetchCurrentUser/fulfilled"],
      },
    }),
});

export default store;
