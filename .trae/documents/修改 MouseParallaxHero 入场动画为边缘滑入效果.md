# 修改 MouseParallaxHero 入场动画方案

## 目标

将散落图片的入场动画修改为从最近的屏幕边缘滑入，取消原有的缩放/淡入效果，采用 ease-out 缓动以增强高级感。

## 实现步骤

1. **重构组件结构**

   * 将 `ParallaxImage` 拆分为两层结构：

     * **外层容器 (`motion.div`)**: 负责定位 (`top`, `left`) 和 **入场动画** (从屏幕外滑入到原位)。

     * **内层容器 (`motion.div`)**: 负责 **鼠标视差效果** (`x`, `y` 响应鼠标移动) 和原有的 Hover 效果。

2. **实现智能入场方向计算**

   * 编写辅助逻辑，根据图片的 `top` / `left` 百分比计算其距离哪个屏幕边缘最近。

   * 规则：

     * 离上边近 -> 初始 `y: '-100vh'`

     * 离下边近 -> 初始 `y: '100vh'`

     * 离左边近 -> 初始 `x: '-100vw'`

     * 离右边近 -> 初始 `x: '100vw'`

3. **配置高级感 Motion 动画**

   * 更新 `imageVariants`：

     * `hidden`: 根据上述计算设置初始 `x` 或 `y`。

     * `visible`: 目标 `x: 0`, `y: 0`。

   * Transition 设置：

     * `ease`: 使用自定义贝塞尔曲线 `[0.25, 0.1, 0.25, 1.0]` 或类似的高级 ease-out 曲线。

     * `duration`: 约 1.2s - 1.5s，确保滑动过程优雅。

     * `stagger`: 保持原有的 stagger 逻辑或根据 index 增加 delay。

4. **代码修改**

   * 编辑 `app/containers/components/home/MouseParallaxHero.tsx`。

   * 移除旧的 `opacity` / `scale` 入场动画。

   * 应用新的结构和动画逻辑。

