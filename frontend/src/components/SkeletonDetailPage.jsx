const SkeletonDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Backdrop */}
      <div className="relative mb-8">
        <div className="w-full h-64 md:h-96 bg-gray-800 rounded-lg animate-pulse" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 w-full md:w-64 lg:w-80">
          <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div className="space-y-4">
            <div className="h-10 bg-gray-800 rounded w-3/4 animate-pulse" />
            <div className="flex flex-wrap gap-4">
              <div className="h-6 bg-gray-800 rounded w-24 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded w-24 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-800 rounded w-40 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-800 rounded w-32 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-gray-800 rounded-full w-24 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Cast Section */}
          <div className="space-y-4 pt-6 border-t border-gray-700">
            <div className="h-8 bg-gray-800 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="mt-12 space-y-4">
        <div className="h-8 bg-gray-800 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetailPage;
