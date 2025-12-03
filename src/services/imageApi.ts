// 模拟图片数据
interface ImageData {
  id: string;
  url: string;
  alt: string;
}

// 模拟延迟
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 模拟获取图片列表 API
export const fetchImages = async (page: number, limit: number = 30): Promise<ImageData[]> => {
  // 模拟网络延迟
  await delay(500 + Math.random() * 500);

  // 生成模拟图片数据
    const images: ImageData[] = [];
    const startIndex = (page - 1) * limit;

    for (let i = 0; i < limit; i++) {
      const id = startIndex + i + 1;
      // 使用 picsum.photos 提供随机图片
      // 随机让一些图片加载失败用于测试
      const shouldFail = Math.random() > 0.95; // 5% 的失败概率

      images.push({
        id: `image-${id}`,
        url: shouldFail
          ? 'https://example.com/non-existent-image.jpg' // 无效 URL
          : `https://picsum.photos/300/300?random=${id}`,
        alt: `图片 ${id}`,
      });
    }

  return images;
};

// 获取总图片数（模拟）
export const getTotalImages = async (): Promise<number> => {
  await delay(200);
  return 1000; // 模拟总共有 1000 张图片
};