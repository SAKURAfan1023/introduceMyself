'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import LoadingMask from "@/app/containers/components/loadingMask";
import MouseParallaxHero from "@/app/containers/components/home/MouseParallaxHero";
import ScrollCardSplit from "@/app/containers/components/scrollCardSplit";
import PhotoGallery from "@/app/containers/components/photoGallery";
import { DraggableCardDemo } from "@/app/containers/components/dragShow";
import ScrollTextBright from "@/app/containers/components/scrollTextBright";

export default function Home() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  // 监听全局滚动
  const { scrollY } = useScroll();

  // 幕帘上拉效果：
  // 滚动 0 -> 800px 期间，Hero 组件从 0vh 移动到 -100vh（向上移出视口）
  const heroY = useTransform(scrollY, [0, 800], ["0vh", "-100vh"]);

  return (
    <main className="relative w-full min-h-screen">
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
          "fixed inset-0 z-0" // Ensure it stays fixed as background
        )}
      />
      <LoadingMask onAnimationComplete={() => setIsHeroVisible(true)} />
      {/* 
        Hero Section (幕帘层) 
        设置 fixed 或 absolute top-0，并使用 z-50 覆盖在其他内容之上。
        通过 motion.div 绑定 y 值实现上拉效果。
      */}
      <motion.div
        style={{ y: heroY }}
        className="fixed top-0 left-0 w-full h-screen z-50 overflow-hidden bg-black"
      >
        <MouseParallaxHero active={isHeroVisible} />
      </motion.div>

      {/* 
        内容区域 
        由于 Hero 是 fixed/absolute 的，不占文档流空间。
        这里的内容默认会顶在最上面，被 Hero 盖住。
        ScrollTextBright 本身有较大的高度（300vh），可以撑开页面产生滚动条。
        随着用户向下滚动，Hero 上拉，露出这里的内容。
      */}
      <div className="relative z-10">
        <ScrollTextBright />
      </div>

      {/* Scroll Card Split Animation Section */}
      <div className="relative z-10">
        <ScrollCardSplit />
      </div>

      {/* Draggable Card Demo Section */}
      <div className="relative z-10">
        <DraggableCardDemo />
      </div>

      {/* Infinite Scroll Photo Gallery */}
      <div className="relative z-10">
        <PhotoGallery />
      </div>
    </main>
  );
}
