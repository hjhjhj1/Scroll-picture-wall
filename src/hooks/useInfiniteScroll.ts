import { useEffect, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  isLoading?: boolean;
  hasMore?: boolean;
}

const useInfiniteScroll = ({ 
  threshold = 100, 
  isLoading = false, 
  hasMore = true 
}: UseInfiniteScrollOptions = {}) => {
  const [triggerLoad, setTriggerLoad] = useState(false);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setTriggerLoad(prev => !prev);
    }
  }, [threshold, isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // 初始加载时检查是否已经在底部
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return triggerLoad;
};

export default useInfiniteScroll;