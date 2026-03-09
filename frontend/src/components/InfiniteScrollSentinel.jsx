import { useEffect, useRef } from 'react';

const InfiniteScrollSentinel = ({ onLoadMore, hasMore, isLoading }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoading]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="h-20 w-full flex items-center justify-center mt-8">
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading more...</span>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollSentinel;
