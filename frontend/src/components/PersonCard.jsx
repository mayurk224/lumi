import { useNavigate } from "react-router-dom";
import { getProfileUrl } from "../api/tmdb";
import { FiUser } from "react-icons/fi";

const PersonCard = ({ id, name, profilePath, knownFor, knownForMovies }) => {
  const navigate = useNavigate();
  const profileUrl = getProfileUrl(profilePath);

  const knownForTitles =
    knownForMovies
      ?.slice(0, 3)
      .map((m) => m.title || m.name)
      .filter(Boolean)
      .join(", ") || "";

  return (
    <div
      className="flex items-center gap-4 bg-dark-200 hover:bg-dark-300/50 border border-white/5 hover:border-primary-500/30 rounded-xl p-4 cursor-pointer transition-all duration-200 group"
      onClick={() => navigate(`/person/${id}`)}
    >
      <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden bg-dark-300/50 ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all">
        <img
          src={profileUrl}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
          loading="lazy"
        />
        <div className="w-full h-full bg-dark-300 items-center justify-center hidden">
          <FiUser className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-base group-hover:text-primary-300 transition-colors truncate">
          {name}
        </h3>
        <p className="text-primary-400 text-sm font-medium mt-0.5">
          {knownFor}
        </p>
        {knownForTitles && (
          <p className="text-gray-500 text-xs mt-1 truncate">
            Known for: {knownForTitles}
          </p>
        )}
      </div>

      <div className="text-gray-600 group-hover:text-primary-400 transition-colors text-lg">
        →
      </div>
    </div>
  );
};

export default PersonCard;
