import React from 'react';

interface StatsCounterProps {
  loadedCount: number;
  totalCount: number;
}

const StatsCounter: React.FC<StatsCounterProps> = ({ loadedCount, totalCount }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{loadedCount}</span>
          <span>/</span>
          <span className="font-semibold">{totalCount}</span>
          <span>张图片</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;