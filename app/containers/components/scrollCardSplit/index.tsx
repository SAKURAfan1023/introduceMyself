"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

export type ImageSource = string | StaticImageData;

export interface ScrollCardSplitProps {
  /** Image shown initially (Img 1) */
  frontImage?: ImageSource;
  /** Image that fades in (Img 2). Can be a single source (split) or an array of 3 sources (separate images). */
  middleImage?: ImageSource | [ImageSource, ImageSource, ImageSource];
  /** Image shown on the back after flip (Img 3) */
  backImage?: ImageSource;
}

const DEFAULT_IMAGES = {
  front: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop",
  middle: [
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop",
  ] as [string, string, string],
  back: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop",
};

/**
 * Helper to get the URL string from an ImageSource (string or StaticImageData)
 */
function getImgUrl(src: ImageSource): string {
  if (typeof src === "string") {
    return src;
  }
  return src.src;
}

export default function ScrollCardSplit({
  frontImage = DEFAULT_IMAGES.front,
  middleImage = DEFAULT_IMAGES.middle,
  backImage = DEFAULT_IMAGES.back,
}: ScrollCardSplitProps) {
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

  // Container Scale
  const containerScale = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.8, 0.9],
    [1.2, 1, 1, 1.2] // Visual "big block" effect, scaling up then down
  );

  // Cards Gap
  const cardsGap = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    ["0px", "30px", "30px", "0px"]
  );

  const containerWidth = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    ["64rem", "75rem", "75rem", "64rem"] // Visual "big block" effect, scaling up then down
  );

  // Cards Border Radius
  const cardsBorderRadius = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    ["0px", "20px", "20px", "0px"]
  );

  // Dynamic Shadow
  const containerShadow = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    [
      "0px 20px 40px rgba(0,0,0,0.4)", // Deep shadow when tilted
      "0px 10px 20px rgba(0,0,0,0.2)", // Tighter shadow when upright
    ]
  );

  // --- Title Animation ---
  // 0.15 - 0.2: Appear from bottom, scale up
  // 0.8 - 0.9: Fade out

  const titleY = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    ["100%", "30%"] // Move from behind/bottom to position
  );

  const titleScale = useTransform(
    scrollYProgress,
    [0.15, 0.2],
    [0.8, 0.8] // "Depth effect" - starts small/far, gets bigger
  );

  const titleOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

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
    <div
      ref={containerRef}
      className="relative h-[400vh] w-full bg-black -mt-[100vh] z-20"
    >
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
          }}
          className="mb-8 text-center z-10" // z-10 to be on top when fully visible?
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Results of the first month
          </h2>
          <p className="text-neutral-400 mt-2">TextIn</p>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          style={{
            y: "0vh",
            width: containerWidth,
            scale: containerScale,
            gap: cardsGap,
            boxShadow: containerShadow,
            transformOrigin: "bottom center", // Pivot from bottom
            transformStyle: "preserve-3d", // Ensure children 3D context is preserved
          }}
          className="flex flex-row items-center justify-center h-[500px] w-full bg-transparent"
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
              frontImage={frontImage}
              middleImage={middleImage}
              backImage={backImage}
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
  frontImage,
  middleImage,
  backImage,
}: {
  img2Opacity: MotionValue<number>;
  rotateY: MotionValue<number>;
  borderRadius: MotionValue<string>;
  frameOpacityStart: MotionValue<number>;
  frameOpacityEnd: MotionValue<number>;
  index: number;
  frontImage: ImageSource;
  middleImage: ImageSource | [ImageSource, ImageSource, ImageSource];
  backImage: ImageSource;
}) {
  // Logic for splitting one image across 3 cards
  // Total cards = 3.
  // background-size: 300% 100%
  // background-position-x:
  // i=0 -> 0%
  // i=1 -> 50%
  // i=2 -> 100%
  const bgPositionX = `${index * 50}%`;
  const bgSize = "300% 100%";

  // Determine middle image source
  let middleBgImage = "";
  let middleBgSize = "";
  let middleBgPos = "";

  if (Array.isArray(middleImage)) {
    // Array mode: Use specific image for this index
    middleBgImage = `url(${getImgUrl(middleImage[index])})`;
    middleBgSize = "cover";
    middleBgPos = "center";
  } else {
    // String mode: Use split logic
    middleBgImage = `url(${getImgUrl(middleImage)})`;
    middleBgSize = bgSize;
    middleBgPos = `${bgPositionX} center`;
  }

  const frontBgUrl = getImgUrl(frontImage);
  const backBgUrl = getImgUrl(backImage);

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
        className="absolute inset-0 w-full h-full backface-hidden rounded-none overflow-hidden bg-white"
        style={{ backfaceVisibility: "hidden", borderRadius }}
      >
        {/* Image 1 (Base) */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${frontBgUrl})`,
            backgroundPosition: `${bgPositionX} center`,
            backgroundSize: bgSize,
          }}
        />

        {/* Image 2 (Overlay) */}
        <motion.div
          style={{ opacity: img2Opacity }}
          className="absolute inset-0 bg-cover bg-no-repeat"
        >
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: middleBgImage,
              backgroundPosition: middleBgPos,
              backgroundSize: middleBgSize,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Back Face */}
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden rounded-none overflow-hidden bg-white"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius,
        }}
      >
        {/* Image 3 */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${backBgUrl})`,
            backgroundPosition: `${bgPositionX} center`,
            backgroundSize: bgSize,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
