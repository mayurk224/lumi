import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchHistory,
  clearHistory,
  selectWatchHistory,
  selectHistoryLoading,
} from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import HistoryCard from "../components/HistoryCard";
import MovieGrid from "../components/MovieGrid";
import SortFilterBar from "../components/SortFilterBar";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { FiClock, FiTrash2, FiSearch, FiCalendar, FiEye } from "react-icons/fi";

const SORT_OPTIONS = [
  { value: "newest", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
];

export default function WatchHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const watchHistory = useSelector(selectWatchHistory);
  const isLoading = useSelector(selectHistoryLoading);

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");
  const [searchFilter, setSearchFilter] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [localHiddenItems, setLocalHiddenItems] = useState(new Set()); // For optimistic UI removal

  useEffect(() => {
    if (user) {
      dispatch(fetchHistory());
    }
  }, [dispatch, user]);

  const sortedHistory = useMemo(() => {
    let items = watchHistory.filter(
      (h) => !localHiddenItems.has(String(h.movieId)),
    );

    if (searchFilter) {
      items = items.filter((h) =>
        h.title?.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "newest":
        items.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
        break;
      case "oldest":
        items.sort((a, b) => new Date(a.watchedAt) - new Date(b.watchedAt));
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
  }, [watchHistory, sortBy, searchFilter, localHiddenItems]);

  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await dispatch(clearHistory()).unwrap();
      toast.success("Watch history cleared");
      setShowConfirmClear(false);
    } catch (error) {
      toast.error("Failed to clear history");
    } finally {
      setIsClearingHistory(false);
    }
  };

  const handleRemoveSingleItem = (movieId) => {
    setLocalHiddenItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(String(movieId));
      return newSet;
    });
    toast.success("Removed from history");
  };

  const visibleHistoryCount = watchHistory.length - localHiddenItems.size;
  const watchedToday = watchHistory.filter(
    (h) =>
      !localHiddenItems.has(String(h.movieId)) &&
      new Date(h.watchedAt).toDateString() === new Date().toDateString(),
  );
  const watchedThisWeek = watchHistory.filter(
    (h) =>
      !localHiddenItems.has(String(h.movieId)) &&
      new Date(h.watchedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );

  return (
    <div className="min-h-screen bg-dark-100">
      <ConfirmDialog
        isOpen={showConfirmClear}
        onConfirm={handleClearHistory}
        onCancel={() => setShowConfirmClear(false)}
        title="Clear Watch History"
        message="This will permanently delete your entire watch history. This action cannot be undone."
        confirmLabel="Clear All History"
        isLoading={isClearingHistory}
      />

      <PageHeader
        icon={<FiClock className="w-7 h-7" />}
        title="Watch History"
        subtitle="Everything you have browsed and watched"
        count={visibleHistoryCount}
        action={
          <div className="flex items-center gap-3">
            {visibleHistoryCount > 0 && (
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter history..."
                  className="bg-dark-300/50 border border-white/10 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 pl-9 focus:outline-none focus:border-primary-500 w-52 transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
              </div>
            )}
            {visibleHistoryCount > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl transition-all"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        }
      />

      {!isLoading && visibleHistoryCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatsCard
              icon={<FiEye className="w-5 h-5" />}
              label="Total Watched"
              value={visibleHistoryCount}
              color="primary"
            />
            <StatsCard
              icon={<FiCalendar className="w-5 h-5" />}
              label="Watched Today"
              value={watchedToday.length}
              color="green"
            />
            <StatsCard
              icon={<FiClock className="w-5 h-5" />}
              label="This Week"
              value={watchedThisWeek.length}
              color="yellow"
            />
          </div>
        </div>
      )}

      {!isLoading && sortedHistory.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <SortFilterBar
            sortOptions={SORT_OPTIONS}
            activeSort={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={sortedHistory.length}
            label="entries"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 pb-16">
        {isLoading ? (
          <div className="px-4 sm:px-8 space-y-3">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-dark-200 rounded-xl animate-pulse"
                />
              ))}
          </div>
        ) : sortedHistory.length === 0 && searchFilter ? (
          <EmptyState
            icon={<FiSearch className="w-10 h-10" />}
            title={`No results for "${searchFilter}"`}
            subtitle="Try a different search term"
            actionLabel="Clear Filter"
            onAction={() => setSearchFilter("")}
          />
        ) : sortedHistory.length === 0 ? (
          <EmptyState
            icon={<FiClock className="w-10 h-10" />}
            title="No watch history yet"
            subtitle="Movies and shows you browse and watch trailers for will appear here"
            actionLabel="Explore Movies"
            onAction={() => navigate("/")}
          />
        ) : viewMode === "list" ? (
          <div className="px-4 sm:px-8 space-y-2">
            {sortedHistory.map((item) => (
              <HistoryCard
                key={`${item.movieId}-${item.watchedAt}`}
                movieId={item.movieId}
                title={item.title}
                posterUrl={item.posterUrl}
                watchedAt={item.watchedAt}
                onRemove={handleRemoveSingleItem}
              />
            ))}
          </div>
        ) : (
          <MovieGrid movies={sortedHistory} isLoading={false} type="movie" />
        )}
      </div>
    </div>
  );
}
