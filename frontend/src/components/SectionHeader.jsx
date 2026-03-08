import React from "react";
import { Link } from "react-router-dom";

const SectionHeader = ({
  title,
  subtitle,
  seeAllLink,
  seeAllText = "See All",
}) => {
  return (
    <div className="flex items-end justify-between px-4 sm:px-8 mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {seeAllLink && (
        <Link
          to={seeAllLink}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center gap-1"
        >
          {seeAllText}
          <span>→</span>
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
