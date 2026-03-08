import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFavorite,
  addFavorite,
  selectIsFavorited,
} from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { FiPlay, FiHeart, FiClock, FiTrash2 } from "react-icons/fi";

export default function HistoryCard({
  movieId,
  title,
  posterUrl,
  watchedAt,
  onRemove,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFavorited = useSelector(selectIsFavorited(String(movieId)));

  const formatWatchedAt = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    if (isFavorited) {
      dispatch(removeFavorite(String(movieId)));
      toast.success("Removed from favorites");
    } else {
      dispatch(addFavorite({ movieId: String(movieId), title, posterUrl }));
      toast.success("Added to favorites!");
    }
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movieId}`)}
      className="flex items-center gap-4 bg-dark-200 hover:bg-dark-200/80 border border-white/5 hover:border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex-shrink-0 w-14 sm:w-16 aspect-[2/3] rounded-lg overflow-hidden bg-dark-300/50">
        <img
          src={posterUrl || "/placeholder-poster.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-poster.svg";
          }}
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary-300 transition-colors">
          {title || "Unknown Title"}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <FiClock className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 text-xs">
            {formatWatchedAt(watchedAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movie/${movieId}`);
          }}
          className="p-2 text-gray-400 hover:text-white hover:bg-primary-500/20 rounded-lg transition-all"
          title="Watch"
        >
          <FiPlay className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`p-2 rounded-lg transition-all ${isFavorited ? "text-red-400 hover:bg-red-500/20" : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"}`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart
            className={`w-3.5 h-3.5 ${isFavorited ? "fill-red-400" : ""}`}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(movieId);
          }}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          title="Remove from history"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
