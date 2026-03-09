// Main app component — defines all routes

import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  selectToken,
  selectIsInitialized,
} from "./redux/authSlice";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import Toast from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import NetworkStatus from "./components/NetworkStatus";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import WatchHistory from "./pages/WatchHistory";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PersonDetail from "./pages/PersonDetail";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isInitialized = useSelector(selectIsInitialized);

  // Restore user session on app load
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  // Show loading spinner until session check is done
  if (token && !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toast />
      <NetworkStatus />
      <Router>
        <ScrollToTop />
        <Layout>
          <PageTransition>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:category" element={<Movies />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/tv-shows/:category" element={<TVShows />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<TVDetail />} />
              <Route path="/person/:id" element={<PersonDetail />} />
              <Route path="/search" element={<Search />} />

              {/* Protected user routes */}
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <WatchHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Admin only route */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </PageTransition>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
