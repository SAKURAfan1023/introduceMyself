"use client";

import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import React, { useRef } from "react";

const text = `In the vast digital landscape, every interaction is a story waiting to unfold. Design is not merely about aesthetics; it is the silent language that bridges human intent with technological capability. As you scroll through this narrative, observe how each word lights up.`;

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

  const words = text.split(" ");

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        <div className="max-w-5xl px-8">
          <p className="flex flex-wrap text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
            {words.map((word, i) => {
              // 计算每个单词的“点亮”区间
              const start = i / words.length;
              const end = start + (1 / words.length);
              return (
                <Word key={i} progress={mappedProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word = ({ children, progress, range }: WordProps) => {
  const opacity = useTransform(progress, range, [0.1, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="mr-3 mt-3 transition-colors duration-200"
    >
      {children}
    </motion.span>
  );
};
