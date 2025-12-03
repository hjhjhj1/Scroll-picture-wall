import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  hasMore: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, hasMore }) => {
  if (!isLoading && !hasMore) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>已加载全部图片</p>
      </div>
    );
  }

  if (!isLoading) return null;

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-gray-600">加载中...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;