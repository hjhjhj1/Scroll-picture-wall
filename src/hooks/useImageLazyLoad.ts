import { useEffect, useRef, useState } from 'react';

export const useImageLazyLoad = (src: string, retryCount: number = 0, onRetry: (count: number) => void) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 指数退避计算
  const getBackoffTime = (attempt: number): number => {
    return Math.min(1000 * Math.pow(2, attempt), 8000); // 最大8秒
  };

  // 加载图片
  const loadImage = () => {
    if (!src) return;

    setIsError(false);
    setIsLoaded(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
      setCurrentSrc(src);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);

      // 自动重试
      if (retryCount < 3) {
        const backoffTime = getBackoffTime(retryCount);
        retryTimerRef.current = setTimeout(() => {
          onRetry(retryCount + 1);
        }, backoffTime);
      }
    };
  };

  // 手动重试
  const handleRetry = () => {
    if (retryCount < 3) {
      onRetry(retryCount + 1);
    }
  };

  // 监听容器进入视口
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !currentSrc && !isError) {
          loadImage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.unobserve(containerRef.current);
    };
  }, [currentSrc, src, isError]);

  // 重试次数变化时重新加载
  useEffect(() => {
    if (retryCount > 0) {
      loadImage();
    }
  }, [retryCount]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    currentSrc,
    isLoaded,
    isError,
    handleRetry
  };
};