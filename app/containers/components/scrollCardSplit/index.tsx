"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export default function ScrollCardSplit() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Offset "start end" -> "end end" means:
  // 0: When the top of the container enters the bottom of the viewport
  // 1: When the bottom of the container aligns with the bottom of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Animation Stages ---

  // 1. Float Up (0 - 0.1)
  // 2. Scale Up (0.1 - 0.2)
  // 3. Gap Increase (0.2 - 0.3)
  // 4. Flip (0.5 - 0.7)
  // 5. Gap Close (0.7 - 0.8)
  // 6. Scale Down (0.8 - 0.9)
  // 7. Move Up (0.9 - 1)

  // Container Y Position
  const containerY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    ["100vh", "0vh", "0vh", "-100vh"]
  );

  // Container Scale
  const containerScale = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.8, 0.9],
    [0.8, 1, 1, 0.8] // Visual "big block" effect, scaling up then down
  );

  // Cards Gap
  const cardsGap = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    ["0px", "30px", "30px", "0px"]
  );

  // Cards Border Radius
  const cardsBorderRadius = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    ["0px", "20px", "20px", "0px"]
  );

  // Cards X Rotation (Flip Up) with Depth
  const containerRotateX = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    ["45deg", "0deg"]
  );

  const containerZ = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    ["-100px", "0px"]
  );

  // Dynamic Shadow
  const containerShadow = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    [
      "0px 20px 40px rgba(0,0,0,0.4)", // Deep shadow when tilted
      "0px 10px 20px rgba(0,0,0,0.2)"  // Tighter shadow when upright
    ]
  );

  // --- Title Animation ---
  // 0.15 - 0.2: Appear from bottom, scale up
  // 0.8 - 0.9: Fade out

  const titleY = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    ["300%", "-20%"] // Move from behind/bottom to position
  );

  const titleScale = useTransform(
    scrollYProgress,
    [0.15, 0.2],
    [0.8, 1] // "Depth effect" - starts small/far, gets bigger
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.11, 0.8, 0.9],
    [0, 1, 1, 0]
  );

  // --- Card Content Animations ---

  // Background Image Change 1 -> 2 (0.3 - 0.4)
  const img2Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);

  // Flip (0.5 - 0.7)
  const rotateY = useTransform(scrollYProgress, [0.5, 0.7], [0, 180]);

  // Card Frame Opacity:
  // Start Frame: Visible until 0.5 (Flip Start)
  const frameOpacityStart = useTransform(scrollYProgress, [0.48, 0.5], [1, 0]);

  // End Frame: Visible after 0.7 (Flip End)
  const frameOpacityEnd = useTransform(scrollYProgress, [0.7, 0.72], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-black -mt-[100vh] z-20">
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ perspective: "600px" }} // Explicit inline perspective on parent
      >
        <GridPattern
          width={20}
          height={20}
          x={-1}
          y={-1}
          strokeWidth={2}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
            "stroke-white/40"
          )}
        />

        {/* Title Container */}
        {/* Placed above cards visually, but animated to come from 'underneath' */}
        <motion.div
          style={{
            y: titleY,
            scale: titleScale,
            opacity: titleOpacity,
            zIndex: 0, // Behind cards initially? No, user said "from underlying", so maybe start lower z-index or just visual placement.
            // If it appears *above* the rectangles in the final layout, but animates from "bottom", standard flex works.
            // If it needs to be strictly "behind" in z-space, we need absolute positioning.
            // "placed above three equal area rectangular containers" -> DOM order or visual order.
            // "0.15-0.2: Title container appears from the bottom of the three parallel containers and scales slightly larger"
            // This suggests it might be behind them? Or just moving up from below them.
            // I'll keep it simple: relative positioning, negative margin or transform.
          }}
          className="mb-8 text-center z-10" // z-10 to be on top when fully visible?
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Scroll Animation
          </h2>
          <p className="text-neutral-400 mt-2">Framer Motion Magic</p>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          style={{
            y: containerY,
            scale: containerScale,
            gap: cardsGap,
            rotateX: containerRotateX,
            z: containerZ,
            boxShadow: containerShadow,
            transformOrigin: "bottom center", // Pivot from bottom
            transformStyle: "preserve-3d", // Ensure children 3D context is preserved
          }}
          className="flex flex-row items-center justify-center h-[400px] w-full max-w-5xl bg-transparent"
        >
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              img2Opacity={img2Opacity}
              rotateY={rotateY}
              borderRadius={cardsBorderRadius}
              frameOpacityStart={frameOpacityStart}
              frameOpacityEnd={frameOpacityEnd}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Card({
  img2Opacity,
  rotateY,
  borderRadius,
  frameOpacityStart,
  frameOpacityEnd,
  index,
}: {
  img2Opacity: MotionValue<number>;
  rotateY: MotionValue<number>;
  borderRadius: MotionValue<string>;
  frameOpacityStart: MotionValue<number>;
  frameOpacityEnd: MotionValue<number>;
  index: number;
}) {
  return (
    <motion.div
      style={{
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-1/3 h-full rounded-none"
    >
      {/* --- Index 0 Frames --- */}
      {index === 0 && (
        <>
          {/* Start: Top Left */}
          <motion.div
            style={{
              opacity: frameOpacityStart,
              borderTopLeftRadius: borderRadius,
              borderTop: "8px solid black",
              borderLeft: "8px solid black",
              zIndex: 30,
            }}
            className="absolute -top-5 -left-5 w-1/4 h-1/4 pointer-events-none"
          />
          {/* End: Top Right (after flip) */}
          <motion.div
            style={{
              opacity: frameOpacityEnd,
              borderTopRightRadius: borderRadius,
              borderTop: "8px solid black",
              borderRight: "8px solid black",
              zIndex: 30,
            }}
            className="absolute -top-5 -right-5 w-1/4 h-1/4 pointer-events-none"
          />
        </>
      )}

      {/* --- Index 2 Frames --- */}
      {index === 2 && (
        <>
          {/* Start: Bottom Right */}
          <motion.div
            style={{
              opacity: frameOpacityStart,
              borderBottomRightRadius: borderRadius,
              borderBottom: "8px solid black",
              borderRight: "8px solid black",
              zIndex: 30,
            }}
            className="absolute -bottom-5 -right-5 w-1/4 h-1/4 pointer-events-none"
          />
          {/* End: Bottom Left (after flip) */}
          <motion.div
            style={{
              opacity: frameOpacityEnd,
              borderBottomLeftRadius: borderRadius,
              borderBottom: "8px solid black",
              borderLeft: "8px solid black",
              zIndex: 30,
            }}
            className="absolute -bottom-5 -left-5 w-1/4 h-1/4 pointer-events-none"
          />
        </>
      )}

      {/* Front Face */}
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden rounded-none overflow-hidden"
        style={{ backfaceVisibility: "hidden", borderRadius }}
      >
        {/* Image 1 (Base) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center rounded-none">
          <span className="text-2xl font-bold text-white/50">Img 1</span>
        </div>

        {/* Image 2 (Overlay) */}
        <motion.div
          style={{ opacity: img2Opacity }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center rounded-none"
        >
          <span className="text-2xl font-bold text-white/50">Img 2</span>
        </motion.div>
      </motion.div>

      {/* Back Face */}
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden rounded-none overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center rounded-none"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius,
        }}
      >
        <span className="text-2xl font-bold text-white/50">Img 3</span>
      </motion.div>
    </motion.div>
  );
}
