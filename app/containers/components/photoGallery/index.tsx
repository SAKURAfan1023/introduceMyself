"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView,
  wrap,
} from "motion/react";
import { galleryData } from "./data";

interface ParallaxRowProps {
  images: string[];
  baseVelocity: number;
  isInView: boolean;
}

function ParallaxRow({ images, baseVelocity, isInView }: ParallaxRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  /**
   * The magic happens here.
   * We dynamically change the move direction and speed based on scroll direction.
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    // Stop animation if not in view to save performance
    if (!isInView) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of repetitions needs to be enough to cover the screen width
   * plus the scroll distance before the wrap resets.
   * Since we wrap between -20% and -45%, we need enough width.
   * We'll render the images 8 times to be safe and ensure smooth infinite scrolling
   * regardless of screen width vs image count.
   */
  const repetitions = 8;
  const displayImages = Array.from({ length: repetitions }).flatMap(() => images);

  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap gap-4" style={{ x }}>
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            className="relative h-[200px] w-[300px] flex-shrink-0 overflow-hidden rounded-xl"
          >
            <img
              src={src}
              alt={`Gallery item ${idx}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function PhotoGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger when 30% of the component is visible
  const isInView = useInView(containerRef, {
    amount: 0.1,
    once: false
  });

  return (
    <section
      ref={containerRef}
      className="w-full py-20 flex flex-col gap-8 overflow-hidden bg-transparent"
    >
      <ParallaxRow
        images={galleryData.row1}
        baseVelocity={2}
        isInView={isInView}
      />
      <ParallaxRow
        images={galleryData.row2}
        baseVelocity={-2}
        isInView={isInView}
      />
      <ParallaxRow
        images={galleryData.row3}
        baseVelocity={2}
        isInView={isInView}
      />
    </section>
  );
}
