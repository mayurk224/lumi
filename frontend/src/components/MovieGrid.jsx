import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

export default function MovieGrid({
  movies,
  isLoading = false,
  skeletonCount = 12,
  type = "movie",
  emptyComponent,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8">
        {Array(skeletonCount)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  if (movies?.length === 0) {
    return emptyComponent || null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.movieId || movie.id}
          id={movie.movieId || movie.id}
          title={movie.title}
          posterPath={movie.posterUrl ? null : movie.poster_path}
          posterUrl={movie.posterUrl}
          rating={movie.vote_average || movie.rating}
          type={type}
          releaseDate={movie.release_date || movie.releaseDate}
          overview={movie.overview}
        />
      ))}
    </div>
  );
}
