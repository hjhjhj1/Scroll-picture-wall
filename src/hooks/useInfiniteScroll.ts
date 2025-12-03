import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean,
  options: UseInfiniteScrollOptions = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { threshold = 0.1, rootMargin = '100px' } = options;

  useEffect(() => {
    if (isLoading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observerRef.current.observe(currentLoaderRef);
    }

    return () => {
      if (observerRef.current && currentLoaderRef) {
        observerRef.current.unobserve(currentLoaderRef);
      }
    };
  }, [callback, hasMore, isLoading, threshold, rootMargin]);

  return loaderRef;
};

export default useInfiniteScroll;