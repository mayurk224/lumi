import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getSimilarTV,
  getPosterUrl,
  getBackdropUrl,
} from "../api/tmdb";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorited,
  addToHistory,
  fetchFavorites,
} from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import { addToRecentlyViewed } from "../redux/uiSlice";
import toast from "react-hot-toast";
import TrailerModal from "../components/TrailerModal";
import CastCard from "../components/CastCard";
import MovieRow from "../components/MovieRow";
import SkeletonDetailPage from "../components/SkeletonDetailPage";
import RatingCircle from "../components/RatingCircle";
import StarRating from "../components/StarRating";
import WatchlistButton from "../components/WatchlistButton";
import ShareButton from "../components/ShareButton";
import {
  FiPlay,
  FiHeart,
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiStar,
  FiGlobe,
  FiTv,
} from "react-icons/fi";

export default function TVDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFavorited = useSelector((state) =>
    selectIsFavorited(state, String(id)),
  );

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsRes, creditsRes, videosRes, similarRes] =
          await Promise.all([
            getTVDetails(id),
            getTVCredits(id),
            getTVVideos(id),
            getSimilarTV(id),
          ]);
        setMovie(detailsRes.data);
        setCredits(creditsRes.data);
        setSimilarMovies(similarRes.data.results);
        setSimilarLoading(false);

        const videos = videosRes.data.results;
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube");
        setTrailerKey(trailer ? trailer.key : null);

        if (user) {
          dispatch(
            addToHistory({
              movieId: String(detailsRes.data.id),
              title: detailsRes.data.name,
              posterUrl: getPosterUrl(detailsRes.data.poster_path),
            }),
          );
          // Add to recently viewed
          dispatch(
            addToRecentlyViewed({
              id: detailsRes.data.id,
              title: detailsRes.data.name,
              posterPath: detailsRes.data.poster_path,
              type: 'tv',
              rating: detailsRes.data.vote_average,
            }),
          );
        }
      } catch (err) {
        setError("Failed to load TV details. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, user, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  const handleFavoriteToggle = () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }
    if (isFavorited) {
      dispatch(removeFavorite(String(id)));
      toast.success("Removed from favorites");
    } else {
      dispatch(
        addFavorite({
          movieId: String(id),
          title: movie.name,
          posterUrl: getPosterUrl(movie.poster_path),
        }),
      );
      toast.success("Added to favorites!");
    }
  };

  const handleWatchTrailer = () => {
    setIsTrailerOpen(true);
    if (user && movie) {
      dispatch(
        addToHistory({
          movieId: String(movie.id),
          title: movie.name,
          posterUrl: getPosterUrl(movie.poster_path),
        }),
      );
    }
  };

  if (isLoading) return <SkeletonDetailPage />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-100 text-white p-4">
        <p className="text-xl mb-4 text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : "N/A";
  const seasons = movie.number_of_seasons;
  const episodes = movie.number_of_episodes;
  const genres = movie.genres || [];
  const cast = credits?.cast?.slice(0, 15) || [];
  const creator = movie.created_by?.[0]?.name;
  const language = movie.original_language?.toUpperCase();

  return (
    <div className="min-h-screen bg-dark-100">
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={trailerKey}
        title={movie.name}
      />

      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-backdrop.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-100/80 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium border border-white/10"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-48 relative z-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-shrink-0 w-48 sm:w-64 mx-auto sm:mx-0">
            <img
              src={posterUrl}
              alt={movie.name}
              className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              onError={(e) => {
                e.target.src = "/placeholder-poster.svg";
              }}
            />
          </div>

          <div className="flex-1 pt-0 sm:pt-32">
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-primary-500/20 text-primary-300 text-xs font-medium px-3 py-1 rounded-full border border-primary-500/30"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {movie.name}
            </h1>

            {movie.tagline && (
              <p className="text-primary-300 italic text-lg mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <RatingCircle rating={movie.vote_average} size={52} />
                <div>
                  <p className="text-white font-semibold">
                    {movie.vote_average?.toFixed(1)}/10
                  </p>
                  <p className="text-gray-500 text-xs">
                    {movie.vote_count?.toLocaleString()} votes
                  </p>
                </div>
              </div>

              <span className="text-gray-600">|</span>

              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-primary-400" />
                <span>{movie.first_air_date || "N/A"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <FiTv className="w-4 h-4 text-primary-400" />
                <span>
                  {seasons} Season{seasons !== 1 ? "s" : ""} · {episodes}{" "}
                  Episodes
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <FiGlobe className="w-4 h-4 text-primary-400" />
                <span>{language}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={handleWatchTrailer}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-primary-500/25"
              >
                <FiPlay className="w-4 h-4 fill-white" />
                {trailerKey ? "Watch Trailer" : "No Trailer Available"}
              </button>

              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 border ${
                  isFavorited
                    ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <FiHeart
                  className={`w-4 h-4 ${isFavorited ? "fill-red-400" : ""}`}
                />
                {isFavorited ? "In Favorites" : "Add to Favorites"}
              </button>

              <WatchlistButton
                id={movie.id}
                title={movie.name}
                posterPath={movie.poster_path}
                type="tv"
                rating={movie.vote_average}
                overview={movie.overview}
                showLabel={true}
                size="md"
              />
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-3 mb-8">
              <ShareButton
                title={movie.name}
                text={`Check out ${movie.name} on MovieVault!`}
                url={window.location.href}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-white font-bold text-lg mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {movie.overview || "No overview available for this title."}
              </p>
            </div>

            {/* User Rating */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-base mb-3">Your Rating</h3>
              <StarRating
                movieId={String(movie.id)}
                size="lg"
                showCount={true}
                tmdbRating={movie.vote_average}
              />
            </div>

            {creator && (
              <div className="mb-6">
                <span className="text-gray-400 text-sm">Created by </span>
                <span className="text-white font-semibold">{creator}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-dark-200/50 rounded-xl p-4 border border-white/5">
              {[
                ["Status", movie.status],
                ["Seasons", movie.number_of_seasons],
                ["Episodes", movie.number_of_episodes],
                ["Network", movie.networks?.[0]?.name || "N/A"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs mb-1">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="text-white text-2xl font-bold mb-6">Cast</h2>
            <div
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {cast.map((member) => (
                <CastCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  character={member.character}
                  profilePath={member.profile_path}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-14">
          <h2 className="text-white text-2xl font-bold mb-6">More Like This</h2>
          <MovieRow
            title=""
            movies={similarMovies}
            isLoading={similarLoading}
            type="tv"
          />
        </div>
      </div>
    </div>
  );
}
