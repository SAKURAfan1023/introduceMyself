# 修改 app/page.tsx 计划

## 1. 目标

更改首页逻辑，移除背景色渐变，实现 `MouseParallaxHero` 组件的“幕帘上拉”视觉效果。

## 2. 具体步骤

### A. 移除背景色渐变

* 删除 `backgroundColor` 的 `useTransform` 定义。

* 移除最外层 `motion.div` 上的 `style={{ backgroundColor }}` 属性，或将其改为普通 `main` 或 `div` 标签。

* 仅幕布添加黑色，其余组件保持白色

### B. 实现幕帘上拉效果

1. **定位调整**: 将 `MouseParallaxHero` 的容器设置为绝对定位 (`absolute`)，使其初始状态下覆盖在页面最顶层。

   * 样式类: `absolute top-0 left-0 w-full h-screen z-50`。

   * 这将确保它像幕布一样遮住下方的 `ScrollTextBright` 等组件。

2. **动画绑定**:

   * 使用 `useScroll` 监听全局滚动 (`scrollY`)。

   * 使用 `useTransform` 创建 `heroY` 变量。

   * **逻辑**: 当页面向下滚动时，将 `heroY` 从 `0vh` 变换到 `-100vh`（即向上移出视口）。

   * **参数微调**: 设置一个滚动阈值（例如滚动前 500px 或 800px），在此范围内完成上拉动作，产生视差或加速移出的效果。

### C. 代码结构调整

```tsx
// 伪代码预览
export default function Home() {
  const { scrollY } = useScroll(); // 监听视口滚动
  const heroY = useTransform(scrollY, [0, 800], ["0vh", "-100vh"]); // 滚动 800px 时，Hero 完全上移

  return (
    <main className="relative w-full min-h-screen bg-black"> {/* 设置默认背景色 */}
      
      {/* 幕帘层: MouseParallaxHero */}
      <motion.div 
        style={{ y: heroY }} 
        className="absolute top-0 left-0 w-full h-screen z-50 overflow-hidden"
      >
        <MouseParallaxHero />
      </motion.div>

      {/* 内容层: 会被幕帘盖住，滚动后显现 */}
      <div className="relative z-10 pt-[20vh]"> {/* 可能需要一点 padding 或者直接顶格，视设计而定 */}
        <ScrollTextBright />
      </div>
      
      {/* 其他组件... */}
    </main>
  );
}
```

## 3. 验证

* 确认背景色不再变化。

* 确认进入页面时首先看到的是 `MouseParallaxHero`。

* 确认向下滚动时，`MouseParallaxHero` 像幕帘一样向上拉起，露出下面的 `ScrollTextBright`。

