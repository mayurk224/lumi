import MovieCard from "./MovieCard";
import PersonCard from "./PersonCard";
import SkeletonCard from "./SkeletonCard";

const SearchResultsGrid = ({ results, isLoading, type }) => {
  const skeletonCount = 12;

  const getMediaType = (item) => {
    if (type !== "all") return type;
    return item.media_type || "movie";
  };

  return (
    <div>
      {isLoading && results.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 sm:px-8">
          {Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : (
        <>
          {(() => {
            const people = results.filter((r) => getMediaType(r) === "person");
            const media = results.filter((r) => getMediaType(r) !== "person");

            return (
              <>
                {people.length > 0 && (
                  <div className="px-4 sm:px-8 mb-8">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
                      People
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {people.map((person) => (
                        <PersonCard
                          key={person.id}
                          id={person.id}
                          name={person.name}
                          profilePath={person.profile_path}
                          knownFor={person.known_for_department}
                          knownForMovies={person.known_for}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {media.length > 0 && (
                  <div className="px-4 sm:px-8">
                    {people.length > 0 && (
                      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
                        Titles
                      </h3>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {media.map((item) => {
                        const mediaType = getMediaType(item);
                        return (
                          <MovieCard
                            key={`${item.id}-${mediaType}`}
                            id={item.id}
                            title={item.title || item.name}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            type={mediaType}
                            releaseDate={
                              item.release_date || item.first_air_date
                            }
                            overview={item.overview}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
};

export default SearchResultsGrid;
