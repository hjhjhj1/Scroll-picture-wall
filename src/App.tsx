import React, { useState, useEffect, useCallback } from 'react';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import ImageCard from './components/ImageCard';
import StatsCounter from './components/StatsCounter';
import BackToTop from './components/BackToTop';

const ITEMS_PER_PAGE = 30;
const TOTAL_IMAGES = 300; // 模拟总量

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 生成图片 URL
  const generateImageUrls = useCallback((page: number) => {
    const newUrls: string[] = [];
    const startIndex = page * ITEMS_PER_PAGE;

    for (let i = startIndex; i < startIndex + ITEMS_PER_PAGE && i < TOTAL_IMAGES; i++) {
      // 使用多个图片服务以提高可靠性
      const services = [
        `https://picsum.photos/400/400?random=${i}`,
        `https://source.unsplash.com/random/400x400?sig=${i}`,
        `https://unsplash.it/400/400?image=${i % 1084}`, // Unsplash.it 有 1084 张固定图片
      ];

      // 循环使用不同的图片服务
      newUrls.push(services[i % services.length]);
    }

    return newUrls;
  }, []);

  // 加载更多图片
  const loadMore = useCallback(async () => {
    if (isLoading || currentPage * ITEMS_PER_PAGE >= TOTAL_IMAGES) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUrls = generateImageUrls(currentPage);
      setImages(prev => [...prev, ...newUrls]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentPage, generateImageUrls]);

  // 无限滚动触发器
  const triggerLoad = useInfiniteScroll({
    threshold: 200,
    isLoading,
    hasMore: currentPage * ITEMS_PER_PAGE < TOTAL_IMAGES,
  });

  // 当触发器触发时加载更多
  useEffect(() => {
    if (triggerLoad) {
      loadMore();
    }
  }, [triggerLoad, loadMore]);

  // 初始加载第一页
  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <StatsCounter loadedCount={images.length} totalCount={TOTAL_IMAGES} />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((src, index) => (
            <ImageCard key={index} src={src} alt={`图片 ${index + 1}`} />
          ))}
        </div>

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* 没有更多数据 */}
        {!isLoading && images.length >= TOTAL_IMAGES && (
          <div className="text-center mt-8 text-gray-600">
            <p>已加载全部图片</p>
          </div>
        )}
      </main>

      <BackToTop />
    </div>
  );
};

export default App;