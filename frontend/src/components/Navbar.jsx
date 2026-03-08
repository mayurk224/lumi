import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout, selectUser, selectIsAdmin } from "../redux/authSlice";
import {
  FiSearch,
  FiHeart,
  FiClock,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-200/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              MovieVault
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, TV shows, people..."
                className="w-full bg-dark-300/50 text-white placeholder-gray-400 rounded-full px-4 py-2 pl-10 text-sm border border-white/10 focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 text-xs font-medium hover:text-primary-300"
                >
                  Go
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-primary-400 bg-primary-500/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`
                  }
                >
                  <FiHeart className="w-4 h-4" /> Favorites
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-primary-400 bg-primary-500/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`
                  }
                >
                  <FiClock className="w-4 h-4" /> History
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-yellow-400 bg-yellow-500/10" : "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"}`
                    }
                  >
                    <FiShield className="w-4 h-4" /> Admin
                  </NavLink>
                )}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="ml-1 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark-200 pb-4">
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full bg-dark-300/50 text-white placeholder-gray-400 rounded-full px-4 py-2.5 pl-10 text-sm border border-white/10 focus:outline-none focus:border-primary-500 transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-2 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>

          <div className="px-4 space-y-1 mt-2">
            {user ? (
              <>
                <Link
                  to="/favorites"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2"
                >
                  <FiHeart className="w-4 h-4" /> Favorites
                </Link>
                <Link
                  to="/history"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2"
                >
                  <FiClock className="w-4 h-4" /> History
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 py-3 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg px-2"
                  >
                    <FiShield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 py-3 px-2 border-t border-white/10 mt-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm flex-1">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border border-red-500/20"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-2.5 flex items-center justify-center border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-2.5 flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
