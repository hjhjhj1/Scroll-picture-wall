# Scroll-picture-wall
实现支持懒加载与错误重试的无限滚动图片墙
React 18 + TypeScript
自定义 Hook 实现滚动监听（禁止用 react-infinite-scroll-component）
图片懒加载用 IntersectionObserver
错误重试：最多 3 次，指数退避
样式仅 Tailwind CSS
每页 30 张缩略图，滚动到底部自动加载下一页
图片未进入视口前用灰色占位，进入后再加载真实 src
加载失败显示“重试”按钮，3 次失败后显示破裂图标
顶部悬浮计数：已加载 / 总量
回到顶部按钮：滚动 800 px 后出现，点击平滑滚动
