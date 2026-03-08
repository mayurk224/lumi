import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFavorites,
  removeFavorite,
  selectFavorites,
  selectFavoritesLoading,
} from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import MovieGrid from "../components/MovieGrid";
import SortFilterBar from "../components/SortFilterBar";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";
import { FiHeart, FiFilm, FiCalendar, FiSearch } from "react-icons/fi";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
];

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const favorites = useSelector(selectFavorites);
  const isLoading = useSelector(selectFavoritesLoading);

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  const sortedFavorites = useMemo(() => {
    let items = [...favorites];

    if (searchFilter) {
      items = items.filter((f) =>
        f.title?.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "newest":
        items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
      case "oldest":
        items.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        break;
      case "az":
        items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "za":
        items.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        break;
    }

    return items;
  }, [favorites, sortBy, searchFilter]);

  const totalFavorites = favorites.length;
  const recentlyAdded = favorites.filter(
    (f) => new Date(f.addedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );

  return (
    <div className="min-h-screen bg-dark-100">
      <PageHeader
        icon={<FiHeart className="w-7 h-7" />}
        title="My Favorites"
        subtitle="Movies and shows you have saved"
        count={favorites.length}
        action={
          favorites.length > 0 ? (
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter favorites..."
                className="bg-dark-300/50 border border-white/10 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 pl-9 focus:outline-none focus:border-primary-500 w-48 sm:w-64 transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
            </div>
          ) : null
        }
      />

      {!isLoading && favorites.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatsCard
              icon={<FiHeart className="w-5 h-5" />}
              label="Total Saved"
              value={totalFavorites}
              color="primary"
            />
            <StatsCard
              icon={<FiCalendar className="w-5 h-5" />}
              label="Added This Week"
              value={recentlyAdded.length}
              color="green"
            />
            <StatsCard
              icon={<FiFilm className="w-5 h-5" />}
              label="Ready to Watch"
              value={totalFavorites}
              color="yellow"
            />
          </div>
        </div>
      )}

      {!isLoading && sortedFavorites.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <SortFilterBar
            sortOptions={SORT_OPTIONS}
            activeSort={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={sortedFavorites.length}
            label="favorites"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 pb-16">
        <MovieGrid
          movies={sortedFavorites}
          isLoading={isLoading}
          skeletonCount={12}
          type="movie"
          emptyComponent={
            searchFilter ? (
              <EmptyState
                icon={<FiSearch className="w-10 h-10" />}
                title={`No results for "${searchFilter}"`}
                subtitle="Try a different search term"
                actionLabel="Clear Filter"
                onAction={() => setSearchFilter("")}
              />
            ) : (
              <EmptyState
                icon={<FiHeart className="w-10 h-10" />}
                title="No favorites yet"
                subtitle="Start exploring movies and TV shows and save the ones you love"
                actionLabel="Browse Movies"
                onAction={() => navigate("/")}
              />
            )
          }
        />
      </div>
    </div>
  );
}
