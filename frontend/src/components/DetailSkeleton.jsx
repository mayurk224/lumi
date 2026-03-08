export default function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-dark-100 animate-pulse">
      <div className="relative h-[55vh] min-h-[400px] bg-dark-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-shrink-0 w-48 sm:w-64">
            <div className="bg-dark-300/50 rounded-2xl aspect-[2/3] w-full" />
          </div>
          <div className="flex-1 pt-4 sm:pt-32 space-y-4">
            <div className="bg-dark-300/50 rounded h-4 w-24" />
            <div className="bg-dark-300/50 rounded-lg h-10 w-3/4" />
            <div className="flex gap-2">
              <div className="bg-dark-300/50 rounded-full h-8 w-20" />
              <div className="bg-dark-300/50 rounded-full h-8 w-20" />
              <div className="bg-dark-300/50 rounded-full h-8 w-20" />
            </div>
            <div className="space-y-2">
              <div className="bg-dark-300/50 rounded h-4 w-full" />
              <div className="bg-dark-300/50 rounded h-4 w-full" />
              <div className="bg-dark-300/50 rounded h-4 w-3/4" />
            </div>
            <div className="flex gap-3">
              <div className="bg-dark-300/50 rounded-xl h-12 w-36" />
              <div className="bg-dark-300/50 rounded-xl h-12 w-36" />
              <div className="bg-dark-300/50 rounded-xl h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
