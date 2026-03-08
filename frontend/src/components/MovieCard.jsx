import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosterUrl } from "../api/tmdb";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorited,
} from "../redux/movieSlice";
import { selectUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { FiHeart, FiStar } from "react-icons/fi";

const MovieCard = ({
  id,
  title,
  posterPath,
  posterUrl: propPosterUrl,
  rating,
  type = "movie",
  releaseDate,
  overview,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFavorited = useSelector(selectIsFavorited(String(id)));
  const posterUrl = propPosterUrl || getPosterUrl(posterPath);
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const displayRating = rating ? rating.toFixed(1) : "N/A";

  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
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
          title: title || "Unknown",
          posterUrl: posterUrl,
        }),
      );
      toast.success("Added to favorites");
    }
  };

  return (
    <div
      className="flex-shrink-0 w-36 sm:w-44 cursor-pointer group relative"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-dark-300/50 mb-3">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-poster.svg";
          }}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 left-2">
          <span className="bg-primary-500/90 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {type === "tv" ? "TV" : "Movie"}
          </span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
          <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">
            {displayRating}
          </span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-2 right-2 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100
            ${
              isFavorited
                ? "bg-red-500 text-white"
                : "bg-black/60 text-white hover:bg-red-500"
            }`}
        >
          <FiHeart
            className={`w-3.5 h-3.5 ${isFavorited ? "fill-white" : ""}`}
          />
        </button>
      </div>

      <div>
        <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight mb-1">
          {title || "Unknown Title"}
        </h3>
        <p className="text-gray-400 text-xs">{year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
