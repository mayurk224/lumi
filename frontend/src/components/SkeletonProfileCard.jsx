const SkeletonProfileCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-700" />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-8 bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <div className="h-10 bg-gray-700 rounded w-full" />
        <div className="h-10 bg-gray-700 rounded w-full" />
      </div>
    </div>
  );
};

export default SkeletonProfileCard;
