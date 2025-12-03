import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  initialDelay?: number;
}

const useRetry = (
  fn: (...args: any[]) => Promise<any>,
  options: UseRetryOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { maxRetries = 3, initialDelay = 1000 } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn(...args);
        setRetryCount(0);
        return result;
      } catch (err) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);

        if (newRetryCount >= maxRetries) {
          const error = err instanceof Error ? err : new Error('请求失败');
          setError(error);
          setIsLoading(false);
          throw error;
        }

        // 指数退避
        const delay = initialDelay * Math.pow(2, newRetryCount - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));

        return execute(...args);
      }
    },
    [fn, maxRetries, initialDelay, retryCount]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setIsLoading(false);
  }, []);

  return { execute, isLoading, error, retryCount, reset };
};

export default useRetry;