import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import InfiniteScrollSentinel from '../components/InfiniteScrollSentinel';
import GenreFilter from '../components/GenreFilter';
import SectionHeader from '../components/SectionHeader';
import { Film } from 'lucide-react';

const CATEGORY_MAP = {
  popular: { label: 'Popular', fetchFn: getPopularMovies },
  'top-rated': { label: 'Top Rated', fetchFn: getTopRatedMovies },
  'now-playing': { label: 'Now Playing', fetchFn: getNowPlayingMovies },
  upcoming: { label: 'Upcoming', fetchFn: getUpcomingMovies },
};

const Movies = () => {
  const { category = 'popular' } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const currentCategory = CATEGORY_MAP[category] || CATEGORY_MAP.popular;

  const fetchMovies = useCallback(
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
          setMovies(data.results || []);
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }

        setHasMore(pageNum < data.total_pages);
        setPage(pageNum);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        if (pageNum === 1) {
          setMovies([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentCategory]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, false);
  }, [category, fetchMovies]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchMovies(page + 1, true);
    }
  }, [page, hasMore, loadingMore, fetchMovies]);

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genre_ids?.includes(selectedGenre))
    : movies;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-600 rounded-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {currentCategory.label} Movies
            </h1>
            <p className="text-gray-400 text-sm">
              Discover amazing movies from around the world
            </p>
          </div>
        </div>

        {/* Genre Filter */}
        <GenreFilter
          type="movie"
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
        />

        {/* Results count */}
        {!loading && filteredMovies.length > 0 && (
          <div className="mb-6 text-gray-400 text-sm">
            Showing {filteredMovies.length}{' '}
            {filteredMovies.length === 1 ? 'movie' : 'movies'}
            {selectedGenre && ' in selected genre'}
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid movies={filteredMovies} isLoading={loading} />

        {/* Infinite Scroll Sentinel */}
        {!loading && hasMore && filteredMovies.length > 0 && (
          <InfiniteScrollSentinel
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loadingMore}
          />
        )}

        {/* No results */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No movies found{selectedGenre && ' for this genre'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
