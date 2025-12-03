import React, { useState, useEffect, useCallback } from 'react';
import ImageItem from './ImageItem';
import LoadingIndicator from './LoadingIndicator';
import BackToTopButton from './BackToTopButton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

// 模拟图片数据
const generateImageData = (page: number, pageSize: number) => {
  const images = [];
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  for (let i = startIndex; i < endIndex; i++) {
    let src = `https://picsum.photos/seed/${i + 1}/800/600.jpg?random=${Date.now()}`;

    // 模拟第四张图片加载失败
    if (i + 1 === 4) {
      src = `https://example.com/non-existent-image-${Date.now()}.jpg`;
    }

    images.push({
      id: i + 1,
      src,
      alt: `图片 ${i + 1}`
    });
  }

  return images;
};

const ImageWall: React.FC = () => {
  const [images, setImages] = useState<{ id: number; src: string; alt: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(100); // 模拟总共有100张图片

  const pageSize = 30; // 每页30张图片

  // 加载更多图片
  const loadMoreImages = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newImages = generateImageData(currentPage, pageSize);
      setImages(prev => [...prev, ...newImages]);
      setCurrentPage(prev => prev + 1);

      // 检查是否还有更多图片
      if (images.length + newImages.length >= totalImages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage, images.length, totalImages]);

  // 初始化加载第一页图片
  useEffect(() => {
    loadMoreImages();
  }, []);

  // 使用自定义无限滚动 Hook
  const observerRef = useInfiniteScroll(loadMoreImages, isLoading, hasMore);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部悬浮计数 */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">无限滚动图片墙</h1>
          <div className="text-gray-600">
            已加载 <span className="font-semibold text-blue-600">{images.length}</span> / <span className="font-semibold">{totalImages}</span> 张图片
          </div>
        </div>
      </div>

      {/* 图片网格 */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <ImageItem
              key={image.id}
              src={image.src}
              alt={image.alt}
              width={300}
              height={200}
            />
          ))}
        </div>

        {/* 加载指示器 */}
        <LoadingIndicator isLoading={isLoading} hasMore={hasMore} />

        {/* 观察器目标元素 */}
        <div ref={observerRef} className="h-1"></div>
      </div>

      {/* 回到顶部按钮 */}
      <BackToTopButton />
    </div>
  );
};

export default ImageWall;