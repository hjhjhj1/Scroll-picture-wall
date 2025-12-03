import React, { useState } from 'react';
import { useImageLazyLoad } from '../hooks/useImageLazyLoad';

interface ImageItemProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, alt, width = 300, height = 200 }) => {
  const [retryCount, setRetryCount] = useState(0);

  const { containerRef, currentSrc, isLoaded, isError, handleRetry } = useImageLazyLoad(
    src,
    retryCount,
    setRetryCount
  );

  // 图片加载失败且重试次数超过3次
  const isPermanentlyFailed = isError && retryCount >= 3;

  return (
    <div className="relative group">
      {/* 占位容器 */}
      <div
        ref={containerRef}
        className={`w-full h-full bg-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ width, height }}
      />

      {/* 图片 */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-all duration-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ width, height }}
        />
      )}

      {/* 加载失败状态 */}
      {isError && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300">
          {!isPermanentlyFailed ? (
            <>
              <div className="text-gray-500 text-sm">加载失败</div>
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200"
              >
                重试
              </button>
            </>
          ) : (
            <div className="text-gray-400 text-4xl">
              📷
            </div>
          )}
        </div>
      )}

      {/* 加载中状态 */}
      {!isLoaded && !isError && currentSrc && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageItem;