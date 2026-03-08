import { useEffect, useRef, useCallback } from "react";

function useInfiniteScroll(callback, hasMore, isLoading) {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const observe = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          callback();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [callback, hasMore, isLoading]);

  useEffect(() => {
    observe();
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [observe]);

  return sentinelRef;
}

export default useInfiniteScroll;
