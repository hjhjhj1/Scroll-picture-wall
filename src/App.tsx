import React, { useState, useEffect, useCallback, useRef } from 'react';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import useRetry from './hooks/useRetry';
import ImageItem from './components/ImageItem';
import { fetchImages, getTotalImages } from './services/imageApi';

interface ImageData {
  id: string;
  url: string;
  alt: string;
}

const App: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToTopRef = useRef<HTMLButtonElement | null>(null);

  // 配置重试机制
  const { execute: loadImages, isLoading, error, reset } = useRetry(fetchImages, {
    maxRetries: 3,
    initialDelay: 1000,
  });

  const { execute: loadTotalImages } = useRetry(getTotalImages, {
    maxRetries: 3,
    initialDelay: 1000,
  });

  // 加载图片
  const loadMoreImages = useCallback(async () => {
    try {
      const newImages = await loadImages(page, 30);
      
      setImages((prev) => [...prev, ...newImages]);
      setPage((prev) => prev + 1);
      
      // 检查是否还有更多图片
      if (images.length + newImages.length >= totalImages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('加载图片失败:', err);
    }
  }, [loadImages, page, images.length, totalImages]);

  // 加载总图片数
  useEffect(() => {
    const loadTotal = async () => {
      try {
        const total = await loadTotalImages();
        setTotalImages(total);
      } catch (err) {
        console.error('获取总图片数失败:', err);
      }
    };

    loadTotal();
  }, [loadTotalImages]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // 无限滚动 Hook
  const loaderRef = useInfiniteScroll(loadMoreImages, hasMore, isLoading);

  // 重置错误
  const handleResetError = () => {
    reset();
    loadMoreImages();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部悬浮计数 */}
      <div className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">无限滚动图片墙</h1>
          <div className="text-sm text-gray-600">
            已加载: <span className="font-semibold text-blue-600">{images.length}</span> / 
            <span className="font-semibold text-gray-800">{totalImages || '-'}</span>
          </div>
        </div>
      </div>

      {/* 图片列表 */}
      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
              <p className="text-gray-600 mb-6">{error.message}</p>
              <button
                onClick={handleResetError}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                重新加载
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {images.map((image) => (
                  <ImageItem
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    className="aspect-square"
                  />
                ))}
              </div>

              {/* 加载指示器 */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* 加载更多触发器 */}
              {hasMore && !isLoading && (
                <div ref={loaderRef} className="h-20"></div>
              )}

              {/* 没有更多数据 */}
              {!hasMore && images.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>已加载全部图片</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 回到顶部按钮 */}
      {isScrolled && (
        <button
          ref={scrollToTopRef}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-40"
          aria-label="回到顶部"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;