# 创建 ScrollTextBright 组件计划

## 1. 组件结构设计
- **路径**: `app/containers/components/scrollTextBright/index.tsx`
- **功能**: 展示一段英文文本，随着页面向下滚动，文本从头到尾依次“点亮”（改变颜色或透明度），模拟阅读进度。

## 2. 技术实现方案
- **布局**:
  - 外层容器：设置较大的高度（例如 `200vh` 或更高），以产生滚动条。
  - 内容容器：使用 `sticky top-0` 定位，确保文本在滚动过程中停留在视口中央。
- **动画逻辑**:
  - 使用 `framer-motion` 的 `useScroll` 获取垂直滚动进度 `scrollYProgress`。
  - 将长文本拆分为单词数组。
  - 创建一个子组件 `Word`（或直接在主组件映射），为每个单词绑定动画。
  - **核心算法**:
    - 假设共有 `N` 个单词。
    - 第 `i` 个单词的“点亮”范围基于 `scrollYProgress`。
    - 使用 `useTransform` 将 `scrollYProgress` 的一段区间（例如 `[i/N, (i+1)/N]`）映射到 `opacity` (0.2 -> 1) 或 `color` (灰色 -> 黑色)。

## 3. 代码概览
```tsx
// 伪代码示例
const words = text.split(" ");
return (
  <div style={{ height: "200vh" }} ref={containerRef}>
    <div className="sticky top-0 ...">
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i/N, (i+1)/N]}>
          {word}
        </Word>
      ))}
    </div>
  </div>
)
```

## 4. 建议与优化
- **平滑过渡**: 给每个单词的颜色变化设置一个缓冲区间，避免突兀的跳变。
- **可配置性**: 可以将文本内容作为 props 传入，或者默认提供一段关于设计或开发的英文文案。
- **视觉增强**: 变亮的单词可以使用更粗的字重 (`font-bold`) 或者稍微不同的颜色（如高亮色），增强视觉引导。
