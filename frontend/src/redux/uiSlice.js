import { createSlice } from '@reduxjs/toolkit'

// Load UI state from localStorage helper
const loadUIState = () => {
  try {
    const saved = localStorage.getItem('ui_preferences')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const savedUI = loadUIState()

// Save to localStorage helper function
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('ui_preferences', JSON.stringify({
      theme: state.theme,
      compactMode: state.compactMode,
      recentlyViewed: state.recentlyViewed,
      watchlist: state.watchlist,
      movieRatings: state.movieRatings,
    }))
  } catch {
    // ignore storage errors
  }
}

const initialState = {
  theme: savedUI?.theme || 'dark',
  compactMode: savedUI?.compactMode || false,
  recentlyViewed: savedUI?.recentlyViewed || [],
  watchlist: savedUI?.watchlist || [],
  movieRatings: savedUI?.movieRatings || {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      saveToLocalStorage(state)
    },

    setTheme: (state, action) => {
      state.theme = action.payload
      saveToLocalStorage(state)
    },

    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode
      saveToLocalStorage(state)
    },

    addToRecentlyViewed: (state, action) => {
      // action.payload: { id, title, posterPath, type, rating }
      const existing = state.recentlyViewed.findIndex(
        item => item.id === action.payload.id && item.type === action.payload.type
      )
      if (existing !== -1) {
        state.recentlyViewed.splice(existing, 1)
      }
      state.recentlyViewed.unshift({
        ...action.payload,
        viewedAt: new Date().toISOString()
      })
      state.recentlyViewed = state.recentlyViewed.slice(0, 20)
      saveToLocalStorage(state)
    },

    clearRecentlyViewed: (state) => {
      state.recentlyViewed = []
      saveToLocalStorage(state)
    },

    addToWatchlist: (state, action) => {
      // action.payload: { id, title, posterPath, type, rating, overview }
      const exists = state.watchlist.some(
        item => item.id === action.payload.id && item.type === action.payload.type
      )
      if (!exists) {
        state.watchlist.unshift({
          ...action.payload,
          addedAt: new Date().toISOString()
        })
        saveToLocalStorage(state)
      }
    },

    removeFromWatchlist: (state, action) => {
      // action.payload: { id, type }
      state.watchlist = state.watchlist.filter(
        item => !(item.id === action.payload.id && item.type === action.payload.type)
      )
      saveToLocalStorage(state)
    },

    clearWatchlist: (state) => {
      state.watchlist = []
      saveToLocalStorage(state)
    },

    rateMovie: (state, action) => {
      // action.payload: { movieId, rating } — rating is 1-5 stars
      state.movieRatings[String(action.payload.movieId)] = action.payload.rating
      saveToLocalStorage(state)
    },

    removeRating: (state, action) => {
      delete state.movieRatings[String(action.payload)]
      saveToLocalStorage(state)
    },
  }
})

// Selectors
export const selectTheme = (state) => state.ui.theme
export const selectIsDark = (state) => state.ui.theme === 'dark'
export const selectCompactMode = (state) => state.ui.compactMode
export const selectRecentlyViewed = (state) => state.ui.recentlyViewed
export const selectWatchlist = (state) => state.ui.watchlist
export const selectMovieRatings = (state) => state.ui.movieRatings
export const selectIsInWatchlist = (id, type) => (state) =>
  state.ui.watchlist.some(item => item.id === Number(id) && item.type === type)
export const selectMovieRating = (movieId) => (state) =>
  state.ui.movieRatings[String(movieId)] || 0

export const {
  toggleTheme,
  setTheme,
  toggleCompactMode,
  addToRecentlyViewed,
  clearRecentlyViewed,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  rateMovie,
  removeRating
} = uiSlice.actions

export default uiSlice.reducer
