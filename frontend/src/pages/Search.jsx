import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMulti, searchMovies, searchTV, searchPeople } from "../api/tmdb";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import SearchBar from "../components/SearchBar";
import SearchResultsGrid from "../components/SearchResultsGrid";
import TabBar from "../components/TabBar";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { FiSearch, FiFilm, FiTv, FiUsers, FiGrid } from "react-icons/fi";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialTab = searchParams.get("tab") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ all: 0, movie: 0, tv: 0, person: 0 });

  const debouncedQuery = useDebounce(query, 500);

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "movie", label: "Movies", count: counts.movie },
    { id: "tv", label: "TV Shows", count: counts.tv },
    { id: "person", label: "People", count: counts.person },
  ];

  const getSearchFunction = (tab) => {
    if (tab === "movie") return searchMovies;
    if (tab === "tv") return searchTV;
    if (tab === "person") return searchPeople;
    return searchMulti;
  };

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setTotalResults(0);
      setCounts({ all: 0, movie: 0, tv: 0, person: 0 });
      return;
    }

    async function performSearch() {
      setIsLoading(true);
      setError(null);
      setPage(1);
      setResults([]);

      try {
        const searchFn = getSearchFunction(activeTab);
        const res = await searchFn(debouncedQuery, 1);
        setResults(res.data.results || []);
        setTotalPages(res.data.total_pages || 1);
        setTotalResults(res.data.total_results || 0);

        if (activeTab === "all") {
          try {
            const [moviesRes, tvRes, peopleRes] = await Promise.all([
              searchMovies(debouncedQuery, 1),
              searchTV(debouncedQuery, 1),
              searchPeople(debouncedQuery, 1),
            ]);
            setCounts({
              all: res.data.total_results || 0,
              movie: moviesRes.data.total_results || 0,
              tv: tvRes.data.total_results || 0,
              person: peopleRes.data.total_results || 0,
            });
          } catch (e) {
            // ignore count fetch errors silently
          }
        } else {
          setCounts((prev) => ({
            ...prev,
            [activeTab]: res.data.total_results || 0,
          }));
        }
      } catch (err) {
        setError("Search failed. Please check your connection and try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, activeTab]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const searchFn = getSearchFunction(activeTab);
      const res = await searchFn(debouncedQuery, nextPage);
      setResults((prev) => [...prev, ...(res.data.results || [])]);
      setPage(nextPage);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error("Failed to load more results:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, page, totalPages, activeTab, debouncedQuery]);

  const hasMore = page < totalPages;
  const sentinelRef = useInfiniteScroll(
    loadMore,
    hasMore,
    isLoadingMore || isLoading,
  );

  useEffect(() => {
    const params = {};
    if (debouncedQuery) params.q = debouncedQuery;
    if (activeTab !== "all") params.tab = activeTab;
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, activeTab, setSearchParams]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (activeTab !== "all" && newQuery !== query) {
      setActiveTab("all");
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setResults([]);
    setPage(1);
  };

  const showEmptyState =
    !isLoading && debouncedQuery.length >= 2 && results.length === 0 && !error;
  const showInitialState = debouncedQuery.trim().length < 2;

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="bg-dark-200/50 border-b border-white/5 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Search
            </h1>
            <p className="text-gray-400">Find movies, TV shows, and people</p>
          </div>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            initialValue={initialQuery}
          />

          {debouncedQuery.length >= 2 && (
            <div className="mt-6">
              <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        {!isLoading && results.length > 0 && debouncedQuery && (
          <div className="px-4 sm:px-8 mb-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-semibold">{results.length}</span>{" "}
              of{" "}
              <span className="text-white font-semibold">
                {totalResults.toLocaleString()}
              </span>{" "}
              results for{" "}
              <span className="text-primary-300 font-semibold">
                "{debouncedQuery}"
              </span>
            </p>
            {activeTab !== "all" && (
              <button
                onClick={() => handleTabChange("all")}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All &rarr;
              </button>
            )}
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}

        {showInitialState && !error && (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-24 h-24 bg-dark-200 rounded-full flex items-center justify-center mb-6">
              <FiSearch className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">
              What are you looking for?
            </h2>
            <p className="text-gray-500 text-center max-w-sm mb-10">
              Search for your favorite movies, TV shows, or discover new ones
            </p>

            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[
                "Avengers",
                "Breaking Bad",
                "Christopher Nolan",
                "Stranger Things",
                "The Dark Knight",
                "Game of Thrones",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="px-4 py-2 bg-dark-200 hover:bg-dark-300/70 border border-white/10 hover:border-primary-500/50 text-gray-300 hover:text-white rounded-full text-sm transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {showEmptyState && !error && (
          <EmptyState
            icon={<FiSearch className="w-10 h-10" />}
            title={`No results for "${debouncedQuery}"`}
            subtitle="Try different keywords, check for spelling mistakes, or browse by category"
            actionLabel="Clear Search"
            onAction={() => handleSearch("")}
          />
        )}

        {!showInitialState && !error && (results.length > 0 || isLoading) && (
          <SearchResultsGrid
            results={results}
            isLoading={isLoading}
            type={activeTab}
          />
        )}

        {!isLoading && !showInitialState && (
          <div ref={sentinelRef} className="h-4" />
        )}

        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading more results...</span>
            </div>
          </div>
        )}

        {!hasMore && results.length > 0 && !isLoading && !isLoadingMore && (
          <p className="text-center text-gray-600 text-sm py-8">
            All {totalResults.toLocaleString()} results loaded
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
