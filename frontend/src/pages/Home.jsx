import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getNowPlayingMovies,
} from "../api/tmdb";
import { fetchFavorites } from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import GenreFilter from "../components/GenreFilter";
import { FiTrendingUp, FiFilm, FiTv, FiAward, FiClock } from "react-icons/fi";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [popularMovies, setPopularMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [popularTV, setPopularTV] = useState([]);
  const [tvLoading, setTvLoading] = useState(true);

  const [topRated, setTopRated] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);

  const [nowPlaying, setNowPlaying] = useState([]);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(true);

  const [selectedMovieGenre, setSelectedMovieGenre] = useState(null);
  const [selectedTVGenre, setSelectedTVGenre] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [trendingRes, moviesRes, tvRes, topRatedRes, nowPlayingRes] =
          await Promise.all([
            getTrending("day"),
            getPopularMovies(),
            getPopularTV(),
            getTopRatedMovies(),
            getNowPlayingMovies(),
          ]);
        setTrending(trendingRes.data.results);
        setPopularMovies(moviesRes.data.results);
        setPopularTV(tvRes.data.results);
        setTopRated(topRatedRes.data.results);
        setNowPlaying(nowPlayingRes.data.results);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setTrendingLoading(false);
        setMoviesLoading(false);
        setTvLoading(false);
        setTopRatedLoading(false);
        setNowPlayingLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  const filteredMovies = selectedMovieGenre
    ? popularMovies.filter((m) => m.genre_ids?.includes(selectedMovieGenre))
    : popularMovies;

  const filteredTV = selectedTVGenre
    ? popularTV.filter((m) => m.genre_ids?.includes(selectedTVGenre))
    : popularTV;

  return (
    <div className="min-h-screen bg-dark-100">
      <HeroBanner movies={trending} isLoading={trendingLoading} />

      <div className="mt-8">
        <div className="flex items-center gap-3 px-4 sm:px-8 mb-4">
          <FiTrendingUp className="w-6 h-6 text-primary-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Trending Today
          </h2>
        </div>
        <MovieRow
          title=""
          movies={trending}
          isLoading={trendingLoading}
          type="movie"
        />
      </div>

      <section className="mt-10">
        <div className="flex items-center gap-3 px-4 sm:px-8 mb-4">
          <FiFilm className="w-6 h-6 text-primary-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Popular Movies
          </h2>
        </div>
        <GenreFilter
          type="movie"
          selectedGenre={selectedMovieGenre}
          onGenreSelect={setSelectedMovieGenre}
        />
        <MovieRow
          title=""
          movies={filteredMovies}
          isLoading={moviesLoading}
          type="movie"
        />
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-3 px-4 sm:px-8 mb-4">
          <FiClock className="w-6 h-6 text-primary-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Now Playing
          </h2>
        </div>
        <MovieRow
          title=""
          movies={nowPlaying}
          isLoading={nowPlayingLoading}
          type="movie"
        />
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-3 px-4 sm:px-8 mb-4">
          <FiAward className="w-6 h-6 text-yellow-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Top Rated
          </h2>
        </div>
        <MovieRow
          title=""
          movies={topRated}
          isLoading={topRatedLoading}
          type="movie"
        />
      </section>

      <section className="mt-10 pb-12">
        <div className="flex items-center gap-3 px-4 sm:px-8 mb-4">
          <FiTv className="w-6 h-6 text-primary-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Popular TV Shows
          </h2>
        </div>
        <GenreFilter
          type="tv"
          selectedGenre={selectedTVGenre}
          onGenreSelect={setSelectedTVGenre}
        />
        <MovieRow
          title=""
          movies={filteredTV}
          isLoading={tvLoading}
          type="tv"
        />
      </section>
    </div>
  );
};

export default Home;
