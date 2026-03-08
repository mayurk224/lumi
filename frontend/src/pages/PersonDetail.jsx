import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPersonDetails,
  getPersonMovieCredits,
  getProfileUrl,
} from "../api/tmdb";
import MovieRow from "../components/MovieRow";
import { FiArrowLeft, FiCalendar, FiMapPin, FiUser } from "react-icons/fi";

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchPerson() {
      try {
        const [personRes, creditsRes] = await Promise.all([
          getPersonDetails(id),
          getPersonMovieCredits(id),
        ]);
        setPerson(personRes.data);
        const sorted = creditsRes.data.cast
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 20);
        setMovies(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="bg-dark-200 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium border border-white/10 w-fit"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col sm:flex-row gap-8 items-start mt-6">
            <div className="flex-shrink-0 w-40 sm:w-52 mx-auto sm:mx-0">
              <img
                src={getProfileUrl(person.profile_path)}
                alt={person.name}
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
                onError={(e) => {
                  e.target.src = "/placeholder-person.svg";
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary-500/20 text-primary-300 text-xs font-medium px-3 py-1 rounded-full border border-primary-500/30">
                  {person.known_for_department}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {person.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                {person.birthday && (
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-primary-400" />
                    <span>Born {person.birthday}</span>
                    {!person.deathday && (
                      <span className="text-gray-600">
                        (Age{" "}
                        {new Date().getFullYear() -
                          new Date(person.birthday).getFullYear()}
                        )
                      </span>
                    )}
                  </div>
                )}
                {person.deathday && (
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-red-400" />
                    <span>Died {person.deathday}</span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-1.5">
                    <FiMapPin className="w-4 h-4 text-primary-400" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {person.biography ? (
                <div>
                  <h2 className="text-white font-bold mb-2">Biography</h2>
                  <p className="text-gray-300 leading-relaxed text-sm line-clamp-6">
                    {person.biography}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No biography available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 pb-16">
        <h2 className="text-white text-2xl font-bold px-4 sm:px-8 mb-6">
          Known For
        </h2>
        <MovieRow title="" movies={movies} isLoading={false} type="movie" />
      </div>
    </div>
  );
}
