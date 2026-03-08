import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import useAdminMovies from "../hooks/useAdminMovies";
import useAdminUsers from "../hooks/useAdminUsers";
import StatsCard from "../../components/StatsCard";
import {
  FiFilm,
  FiUsers,
  FiPlusCircle,
  FiActivity,
  FiUserX,
  FiShield,
} from "react-icons/fi";

const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const { movies, isLoading: moviesLoading, fetchMovies } = useAdminMovies();
  const { users, isLoading: usersLoading, fetchUsers } = useAdminUsers();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchUsers();
  }, [fetchMovies, fetchUsers]);

  const totalMovies = movies.length;
  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.isBanned).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const recentMovies = movies.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Here's what's happening on your platform
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<FiFilm className="w-5 h-5" />}
          label="Total Movies"
          value={moviesLoading ? "..." : totalMovies}
          color="primary"
        />
        <StatsCard
          icon={<FiUsers className="w-5 h-5" />}
          label="Total Users"
          value={usersLoading ? "..." : totalUsers}
          color="blue"
        />
        <StatsCard
          icon={<FiUserX className="w-5 h-5" />}
          label="Banned Users"
          value={usersLoading ? "..." : bannedUsers}
          color="red"
        />
        <StatsCard
          icon={<FiShield className="w-5 h-5" />}
          label="Admins"
          value={usersLoading ? "..." : adminUsers}
          color="yellow"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Add Movie",
              icon: FiPlusCircle,
              to: "/admin/add",
              color: "bg-primary-500 hover:bg-primary-600",
            },
            {
              label: "All Movies",
              icon: FiFilm,
              to: "/admin/movies",
              color: "bg-dark-300/70 hover:bg-dark-300 border border-white/10",
            },
            {
              label: "Manage Users",
              icon: FiUsers,
              to: "/admin/users",
              color: "bg-dark-300/70 hover:bg-dark-300 border border-white/10",
            },
            {
              label: "View Site",
              icon: FiActivity,
              to: "/",
              color: "bg-dark-300/70 hover:bg-dark-300 border border-white/10",
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105 text-sm font-medium`}
            >
              <action.icon className="w-5 h-5" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-200 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Movies</h2>
            <button
              onClick={() => navigate("/admin/movies")}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              View All →
            </button>
          </div>
          {moviesLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-dark-300/50 rounded-xl animate-pulse mb-2"
                />
              ))
          ) : recentMovies.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No movies added yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentMovies.map((movie) => (
                <div
                  key={movie._id}
                  className="flex items-center gap-3 p-3 bg-dark-300/20 rounded-xl hover:bg-dark-300/40 transition-all cursor-pointer"
                  onClick={() => navigate("/admin/movies")}
                >
                  <div className="w-8 h-11 bg-dark-300/50 rounded-lg overflow-hidden flex-shrink-0">
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {movie.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {movie.category} · {movie.genre?.[0] || "No genre"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark-200 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Users</h2>
            <button
              onClick={() => navigate("/admin/users")}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              View All →
            </button>
          </div>
          {usersLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-dark-300/50 rounded-xl animate-pulse mb-2"
                />
              ))
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No users yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 bg-dark-300/20 rounded-xl"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user.username}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {user.role === "admin" && (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                    {user.isBanned && (
                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                        Banned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
