import React from "react";

const SkeletonCard = () => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 animate-pulse">
      <div className="bg-dark-300/50 rounded-xl aspect-[2/3] w-full mb-3" />
      <div className="bg-dark-300/50 rounded h-3 w-3/4 mb-2" />
      <div className="bg-dark-300/50 rounded h-3 w-1/2" />
    </div>
  );
};

const SkeletonBanner = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-dark-200 animate-pulse">
      <div className="absolute bottom-16 left-8 sm:left-16 space-y-4 w-full max-w-lg">
        <div className="bg-dark-300/50 rounded h-5 w-24" />
        <div className="bg-dark-300/50 rounded-lg h-10 w-80" />
        <div className="bg-dark-300/50 rounded h-4 w-full" />
        <div className="bg-dark-300/50 rounded h-4 w-3/4" />
        <div className="flex gap-3 mt-4">
          <div className="bg-dark-300/50 rounded-xl h-11 w-32" />
          <div className="bg-dark-300/50 rounded-xl h-11 w-32" />
        </div>
      </div>
    </div>
  );
};

export { SkeletonCard, SkeletonBanner };
export default SkeletonCard;
