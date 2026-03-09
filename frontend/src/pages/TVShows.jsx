import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getPopularTV, getTopRatedTV, getOnAirTV } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";
import InfiniteScrollSentinel from "../components/InfiniteScrollSentinel";
import GenreFilter from "../components/GenreFilter";
import { Tv } from "lucide-react";

const CATEGORY_MAP = {
  popular: { label: "Popular", fetchFn: getPopularTV },
  "top-rated": { label: "Top Rated", fetchFn: getTopRatedTV },
  "on-air": { label: "On Air Now", fetchFn: getOnAirTV },
};

const TVShows = () => {
  const { category = "popular" } = useParams();
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const currentCategory = CATEGORY_MAP[category] || CATEGORY_MAP.popular;

  const fetchShows = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (!append) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await currentCategory.fetchFn(pageNum);
        const data = response.data;

        if (pageNum === 1) {
          setShows(data.results || []);
        } else {
          setShows((prev) => [...prev, ...(data.results || [])]);
        }

        setHasMore(pageNum < data.total_pages);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch TV shows:", error);
        if (pageNum === 1) {
          setShows([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentCategory],
  );

  useEffect(() => {
    setShows([]);
    setPage(1);
    setHasMore(true);
    fetchShows(1, false);
  }, [category, fetchShows]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchShows(page + 1, true);
    }
  }, [page, hasMore, loadingMore, fetchShows]);

  const filteredShows = selectedGenre
    ? shows.filter((show) => show.genre_ids?.includes(selectedGenre))
    : shows;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-600 rounded-lg">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {currentCategory.label} TV Shows
            </h1>
            <p className="text-gray-400 text-sm">
              Discover amazing TV shows from around the world
            </p>
          </div>
        </div>

        {/* Genre Filter */}
        <GenreFilter
          type="tv"
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
        />

        {/* Results count */}
        {!loading && filteredShows.length > 0 && (
          <div className="mb-6 text-gray-400 text-sm">
            Showing {filteredShows.length}{" "}
            {filteredShows.length === 1 ? "show" : "shows"}
            {selectedGenre && " in selected genre"}
          </div>
        )}

        {/* Show Grid */}
        <MovieGrid movies={filteredShows} isLoading={loading} type="tv" />

        {/* Infinite Scroll Sentinel */}
        {!loading && hasMore && filteredShows.length > 0 && (
          <InfiniteScrollSentinel
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loadingMore}
          />
        )}

        {/* No results */}
        {!loading && filteredShows.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No shows found{selectedGenre && " for this genre"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShows;
