import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBackdropUrl, getPosterUrl } from "../api/tmdb";
import {
  FiPlay,
  FiInfo,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { SkeletonBanner } from "./SkeletonCard";

const HeroBanner = ({ movies, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const featuredMovies = movies?.slice(0, 5) || [];
  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const goTo = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    goTo((currentIndex - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    goTo((currentIndex + 1) % featuredMovies.length);
  };

  const handlePlay = () => {
    if (currentMovie) {
      navigate(
        `/${currentMovie.media_type === "tv" ? "tv" : "movie"}/${currentMovie.id}`,
      );
    }
  };

  const handleInfo = () => {
    if (currentMovie) {
      navigate(
        `/${currentMovie.media_type === "tv" ? "tv" : "movie"}/${currentMovie.id}`,
      );
    }
  };

  if (isLoading) return <SkeletonBanner />;
  if (!currentMovie) return null;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-dark-200">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={getBackdropUrl(currentMovie.backdrop_path)}
          alt={currentMovie.title || currentMovie.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-backdrop.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-100 via-dark-100/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-dark-100/20" />
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all hidden sm:flex"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all hidden sm:flex"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      <div
        className={`absolute bottom-16 left-8 sm:left-16 z-10 max-w-lg transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {currentMovie.media_type === "tv" ? "TV Show" : "Movie"}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <FiStar className="w-4 h-4 fill-yellow-400" />
            <span className="text-white text-sm font-medium">
              {currentMovie.vote_average?.toFixed(1)}
            </span>
          </div>
          {currentMovie.release_date && (
            <span className="text-gray-400 text-sm">
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
          {currentMovie.title || currentMovie.name}
        </h1>

        <p className="text-gray-300 text-sm sm:text-base line-clamp-2 mb-6 leading-relaxed">
          {currentMovie.overview || "No description available."}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FiPlay className="w-4 h-4 fill-white" />
            Watch Now
          </button>
          <button
            onClick={handleInfo}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
          >
            <FiInfo className="w-4 h-4" />
            More Info
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 rounded-full
              ${
                index === currentIndex
                  ? "w-6 h-2 bg-primary-500"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
