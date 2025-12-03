import React, { useState, useCallback } from 'react';
import useImageLazyLoad from '../hooks/useImageLazyLoad';

interface ImageItemProps {
  src: string;
  alt?: string;
  className?: string;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, alt = '图片', className = '' }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [showManualRetry, setShowManualRetry] = useState(false);

  const { imgRef, isLoaded, hasError, reset, retryCount } = useImageLazyLoad(imageSrc, {
    maxRetries: 3,
  });

  // 手动重试加载图片
  const handleManualRetry = useCallback(() => {
    setShowManualRetry(false);
    // 添加时间戳避免缓存
    const timestamp = new Date().getTime();
    const url = new URL(src);
    url.searchParams.set('t', timestamp.toString());
    setImageSrc(url.toString());
    reset();
  }, [src, reset]);

  // 图片加载错误处理（用于手动触发重试）
  const handleImageError = useCallback(() => {
    // 如果已经达到最大重试次数，显示手动重试按钮
    if (hasError) {
      setShowManualRetry(true);
    }
  }, [hasError]);

  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
      {/* 灰色占位符 */}
      {!isLoaded && !hasError && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* 图片 */}
      <img
        ref={imgRef}
        data-src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 手动重试按钮 */}
      {showManualRetry && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={handleManualRetry}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
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
            <span>重试</span>
          </button>
        </div>
      )}

      {/* 加载失败图标（3次重试后） */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
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
      )}
    </div>
  );
};

export default ImageItem;