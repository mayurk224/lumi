import React, { useEffect, useState } from "react";
import { getMovieGenres, getTVGenres } from "../api/tmdb";

const GenreFilter = ({ type, selectedGenre, onGenreSelect }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res =
          type === "tv" ? await getTVGenres() : await getMovieGenres();
        setGenres(res.data.genres);
      } catch (err) {
        // do nothing
      }
    }
    fetchGenres();
  }, [type]);

  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-8 pb-2 mb-6"
      style={{ scrollbarWidth: "none" }}
    >
      <button
        onClick={() => onGenreSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${
            selectedGenre === null
              ? "bg-primary-500 text-white"
              : "bg-dark-300/50 text-gray-300 hover:bg-dark-300 hover:text-white border border-white/10"
          }`}
      >
        All
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreSelect(genre.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
              selectedGenre === genre.id
                ? "bg-primary-500 text-white"
                : "bg-dark-300/50 text-gray-300 hover:bg-dark-300 hover:text-white border border-white/10"
            }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
