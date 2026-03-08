import { useNavigate } from "react-router-dom";
import { getProfileUrl } from "../api/tmdb";
import { FiUser } from "react-icons/fi";

export default function CastCard({ id, name, character, profilePath }) {
  const navigate = useNavigate();
  const profileUrl = getProfileUrl(profilePath);

  return (
    <div
      className="flex-shrink-0 w-28 cursor-pointer group"
      onClick={() => navigate(`/person/${id}`)}
    >
      <div className="relative w-28 h-28 rounded-full overflow-hidden bg-dark-300/50 mb-3 ring-2 ring-transparent group-hover:ring-primary-500 transition-all duration-200">
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
        <div className="w-full h-full bg-dark-300/50 items-center justify-center hidden">
          <FiUser className="w-8 h-8 text-gray-500" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-0.5">
          {name}
        </p>
        <p className="text-gray-400 text-xs line-clamp-2 leading-tight">
          {character}
        </p>
      </div>
    </div>
  );
}
