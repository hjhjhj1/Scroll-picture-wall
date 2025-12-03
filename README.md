# 无限滚动图片墙

一个基于 React 18 + TypeScript 的无限滚动图片墙应用，支持图片懒加载、错误重试等功能。

## 功能特性

- ✨ **无限滚动**：滚动到底部自动加载下一页（每页 30 张）
- 📸 **图片懒加载**：使用 IntersectionObserver 实现，图片进入视口前显示灰色占位
- 🔄 **错误重试**：最多 3 次重试，指数退避策略
- 📊 **顶部计数**：实时显示已加载图片数 / 总图片数
- 📱 **响应式设计**：适配不同屏幕尺寸
- 🎨 **现代化 UI**：使用 Tailwind CSS 构建
- 🔝 **回到顶部**：滚动 800px 后显示，点击平滑滚动到顶部

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **IntersectionObserver API** - 滚动监听和懒加载

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
scroll-picture-wall/
├─ src/
│  ├─ components/
│  │  └─ ImageItem.tsx          # 图片组件（含懒加载和错误重试）
│  ├─ hooks/
│  │  ├─ useInfiniteScroll.ts   # 自定义 Hook：无限滚动监听
│  │  ├─ useImageLazyLoad.ts    # 自定义 Hook：图片懒加载
│  │  └─ useRetry.ts            # 自定义 Hook：错误重试
│  ├─ services/
│  │  └─ imageApi.ts            # 模拟图片 API
│  ├─ App.tsx                   # 主应用组件
│  ├─ main.tsx                  # 应用入口
│  └─ index.css                 # 全局样式
├─ index.html                   # HTML 模板
├─ package.json                 # 项目配置
├─ tsconfig.json                # TypeScript 配置
├─ vite.config.ts               # Vite 配置
└─ tailwind.config.js           # Tailwind CSS 配置
```

## 核心功能说明

### 无限滚动

使用自定义 Hook `useInfiniteScroll` 实现，通过 IntersectionObserver 监听加载触发器元素，当进入视口时自动加载下一页。

### 图片懒加载

使用自定义 Hook `useImageLazyLoad` 实现，图片进入视口前只加载占位符，进入后才加载真实图片。

### 错误重试机制

使用自定义 Hook `useRetry` 实现：
- 最多重试 3 次
- 指数退避策略（1s, 2s, 4s）
- 每次重试添加时间戳避免缓存

### 状态管理

- `images`：已加载的图片列表
- `page`：当前页码
- `hasMore`：是否还有更多数据
- `totalImages`：总图片数
- `isLoading`：是否正在加载
- `error`：错误信息

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

需要支持 IntersectionObserver API 的现代浏览器。

## License

MIT