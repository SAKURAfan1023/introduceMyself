"use client";

import { useScroll, useTransform, motion, MotionValue, useMotionValueEvent } from "motion/react";
import React, { useRef, useState } from "react";

const items = [
  "生日：2003年10月23日，今年22岁",
  "就读于东北大学通信工程专业，本科生",
  "来自四川省乐山市",
  "是26届前端校招生，目前是提前实习阶段",
  "在王学彤老师的带领下学习业务、前端知识",
  "在TextIn官网项目中负责部分前端页面动效",
];

// 占位图片数组，实际项目中请替换为真实图片路径
const images = [
  "https://picsum.photos/400/250?random=1",
  "https://picsum.photos/400/250?random=2",
  "https://picsum.photos/400/250?random=3",
  "https://picsum.photos/400/250?random=4",
  "https://picsum.photos/400/250?random=5",
  "https://picsum.photos/400/250?random=6",
];

export default function ScrollTextBright() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 监听容器的滚动进度
  // 当容器顶部到达视口顶部时开始 (0)
  // 当容器底部到达视口底部时结束 (1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const mappedProgress = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0, 1]);

  // 计算所有字符的总数，用于分配进度
  const totalChars = items.reduce((acc, item) => acc + item.length, 0);

  // 预先计算每个列表项的起始字符索引，避免在渲染中进行副作用操作
  const itemStartIndices = items.reduce((acc, item) => {
    const lastEnd = acc.length > 0 ? acc[acc.length - 1] : 0;
    return [...acc, lastEnd + item.length];
  }, [0]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        <div className="max-w-5xl px-8">
          <ul className="flex flex-col gap-8 text-4xl font-bold leading-tight text-black md:text-5xl lg:text-5xl list-disc pl-10">
            {items.map((item, index) => {
              const itemStartCharIndex = itemStartIndices[index];
              // 计算当前item在整体进度中的起始和结束位置
              const itemStartProgress = itemStartCharIndex / totalChars;
              const itemEndProgress = (itemStartCharIndex + item.length) / totalChars;

              return (
                <li key={index} className="relative">
                  <PopupImage
                    src={images[index]}
                    progress={mappedProgress}
                    range={[itemStartProgress, itemEndProgress]}
                    position={index < 3 ? "bottom" : "top"}
                  />
                  {item.split("").map((char, charIndex) => {
                    // 计算每个字符的“点亮”区间
                    const globalCharIndex = itemStartCharIndex + charIndex;
                    const start = globalCharIndex / totalChars;
                    const end = start + (1 / totalChars);

                    return (
                      <Char key={charIndex} progress={mappedProgress} range={[start, end]}>
                        {char}
                      </Char>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface PopupImageProps {
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  position: "top" | "bottom";
}

const PopupImage = ({ src, progress, range, position }: PopupImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [start, end] = range;

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest > start && latest < end) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  });

  const positionClass = position === "bottom"
    ? "top-full mt-4 left-0 origin-top"
    : "bottom-full mb-4 left-0 origin-bottom";

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: isOpen ? 200 : 0 }}
      transition={{ duration: 0.5 }}
      className={`absolute z-10 w-80 overflow-hidden rounded-lg shadow-lg ${positionClass}`}
    >
      <img src={src} alt="popup" className="h-full w-full object-cover" />
    </motion.div>
  );
};

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Char = ({ children, progress, range }: CharProps) => {
  const opacity = useTransform(progress, range, [0.1, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block transition-colors duration-200"
    >
      {children}
    </motion.span>
  );
};
