import { useEffect, useRef, useState, useCallback } from 'react';

interface UseImageLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  maxRetries?: number;
}

const useImageLazyLoad = (
  src: string,
  options: UseImageLazyLoadOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { rootMargin = '50px', threshold = 0.1, maxRetries = 3 } = options;

  const loadImage = useCallback((img: HTMLImageElement, imgSrc: string, currentRetryCount: number = 0) => {
    const image = new Image();
    image.src = imgSrc;

    image.onload = () => {
      img.src = imgSrc;
      setIsLoaded(true);
      setRetryCount(0);
      if (observerRef.current) {
        observerRef.current.unobserve(img);
      }
    };

    image.onerror = () => {
      const newRetryCount = currentRetryCount + 1;
      setRetryCount(newRetryCount);

      if (newRetryCount >= maxRetries) {
        setHasError(true);
        if (observerRef.current) {
          observerRef.current.unobserve(img);
        }
      } else {
        // 指数退避重试
        const delay = 1000 * Math.pow(2, newRetryCount - 1);
        setTimeout(() => {
          loadImage(img, imgSrc, newRetryCount);
        }, delay);
      }
    };
  }, [maxRetries]);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const imgSrc = img.dataset.src;

            if (imgSrc && !isLoaded && !hasError) {
              loadImage(img, imgSrc);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current && imgElement) {
        observerRef.current.unobserve(imgElement);
      }
    };
  }, [rootMargin, threshold, isLoaded, hasError, loadImage]);

  const reset = useCallback(() => {
    setIsLoaded(false);
    setHasError(false);
    setRetryCount(0);
    // 重新观察图片
    const imgElement = imgRef.current;
    if (imgElement && observerRef.current) {
      observerRef.current.observe(imgElement);
    }
  }, []);

  return { imgRef, isLoaded, hasError, reset, retryCount };
};

export default useImageLazyLoad;