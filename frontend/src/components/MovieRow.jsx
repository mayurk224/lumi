import React, { useRef } from "react";
import MovieCard from "./MovieCard";
import { SkeletonCard } from "./SkeletonCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MovieRow = ({ title, movies, isLoading, type = "movie", seeAllLink }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 600;
    if (direction === "left") {
      rowRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-4 sm:px-8 mb-4">
        <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllLink && (
            <a
              href={seeAllLink}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors mr-2"
            >
              See All
            </a>
          )}
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-dark-300/50 hover:bg-dark-300 text-white rounded-full transition-all"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-dark-300/50 hover:bg-dark-300 text-white rounded-full transition-all"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-8 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading ? (
          Array(10)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : movies && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title || movie.name}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              type={type}
              releaseDate={movie.release_date || movie.first_air_date}
              overview={movie.overview}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm px-2">No content available</p>
        )}
      </div>
    </section>
  );
};

export default MovieRow;
