import React from 'react';
import useLazyLoad from '../hooks/useLazyLoad';
import useImageLoader from '../hooks/useImageLoader';

interface ImageCardProps {
  src: string;
  alt: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => {
  const { ref, isVisible } = useLazyLoad({ rootMargin: '50px' });
  const { isLoading, error, retry, hasMaxRetries } = useImageLoader({
    src: src,
    maxRetries: 3
  });

  return (
    <div ref={ref} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md">
      {isVisible ? (
        <>          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 p-4">
              {hasMaxRetries ? (
                <>
                  <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <p className="text-gray-600 text-sm">加载失败</p>
                </>
              ) : (
                <button
                  onClick={retry}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  重试
                </button>
              )}
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gray-200"></div>
      )}
    </div>
  );
};

export default ImageCard;