import { useState, useCallback, useEffect } from 'react';

interface UseImageLoaderOptions {
  src: string;
  maxRetries?: number;
}

const useImageLoader = ({ src, maxRetries = 3 }: UseImageLoaderOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadImage = useCallback(async () => {
    // 如果 src 是空字符串，不进行加载
    if (!src.trim()) {
      setIsLoading(false);
      setError(null);
      return;
    }

    if (retryCount >= maxRetries) {
      setError(new Error('Max retries exceeded'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 指数退避：2^retryCount 秒
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      setIsLoading(false);
    } catch (err) {
      setRetryCount(prev => prev + 1);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [src, retryCount, maxRetries]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const retry = useCallback(() => {
    // 重置重试计数和错误状态
    setRetryCount(0);
    setError(null);
    // 直接调用 loadImage 函数
    loadImage();
  }, [loadImage]);

  return {
    isLoading,
    error,
    retry,
    retryCount,
    hasMaxRetries: retryCount >= maxRetries,
  };
};

export default useImageLoader;