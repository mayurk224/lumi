import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { selectUser } from "../redux/authSlice";
import { selectFavorites, selectWatchHistory } from "../redux/movieSlice";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import MovieCard from "../components/MovieCard";
import {
  FiUser,
  FiHeart,
  FiClock,
  FiFilm,
  FiShield,
  FiCalendar,
} from "react-icons/fi";

export default function Profile() {
  const user = useSelector(selectUser);
  const favorites = useSelector(selectFavorites);
  const history = useSelector(selectWatchHistory);
  const navigate = useNavigate();

  let joinDate = "—";
  if (user?._id) {
    joinDate = new Date(
      parseInt(user._id.substring(0, 8), 16) * 1000,
    ).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const recentFavorites = favorites.slice(0, 6);
  const recentHistory = history.slice(0, 6);
  const watchedThisWeek = history.filter(
    (h) =>
      new Date(h.watchedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );

  return (
    <div className="min-h-screen bg-dark-100">
      <PageHeader
        icon={<FiUser className="w-7 h-7" />}
        title={user?.username || "My Profile"}
        subtitle={user?.email || ""}
        action={
          user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 rounded-xl text-sm font-medium transition-all"
            >
              <FiShield className="w-4 h-4" />
              Admin Panel
            </Link>
          )
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 pb-16">
        <div className="bg-dark-200 border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-5">
            Account Information
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["Username", user?.username],
                  ["Email", user?.email],
                  ["Role", user?.role === "admin" ? "👑 Admin" : "👤 User"],
                  ["Member Since", joinDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              icon={<FiHeart className="w-5 h-5" />}
              label="Favorites"
              value={favorites.length}
              color="primary"
            />
            <StatsCard
              icon={<FiClock className="w-5 h-5" />}
              label="Watched"
              value={history.length}
              color="blue"
            />
            <StatsCard
              icon={<FiFilm className="w-5 h-5" />}
              label="This Week"
              value={watchedThisWeek.length}
              color="green"
            />
            <StatsCard
              icon={<FiCalendar className="w-5 h-5" />}
              label="Member Since"
              value={
                user?._id
                  ? new Date(
                      parseInt(user._id.substring(0, 8), 16) * 1000,
                    ).getFullYear()
                  : "—"
              }
              color="yellow"
            />
          </div>
        </div>

        {recentFavorites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Recent Favorites</h2>
              <Link
                to="/favorites"
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {recentFavorites.map((fav) => (
                <MovieCard
                  key={fav.movieId}
                  id={fav.movieId}
                  title={fav.title}
                  posterUrl={fav.posterUrl}
                  type="movie"
                />
              ))}
            </div>
          </div>
        )}

        {recentHistory.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Recently Watched</h2>
              <Link
                to="/history"
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {recentHistory.map((item) => (
                <MovieCard
                  key={`${item.movieId}-${item.watchedAt}`}
                  id={item.movieId}
                  title={item.title}
                  posterUrl={item.posterUrl}
                  type="movie"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
