"use client";

import { useRef, useState } from "react";
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
  AnimatePresence,
} from "motion/react";
import { galleryData } from "./data";

interface ParallaxRowProps {
  images: string[];
  baseVelocity: number;
  isInView: boolean;
  isPaused: boolean;
  onImageHover: (src: string | null) => void;
}

function ParallaxRow({ images, baseVelocity, isInView, isPaused, onImageHover }: ParallaxRowProps) {
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
    // Also stop if paused (mouse enter)
    if (!isInView || isPaused) return;

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
            className="relative h-[200px] w-[300px] flex-shrink-0 overflow-hidden rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
            onMouseEnter={() => onImageHover(src)}
            onMouseLeave={() => onImageHover(null)}
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
  const [isPaused, setIsPaused] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Trigger when 10% of the component is visible
  const isInView = useInView(containerRef, {
    amount: 0.1,
    once: false
  });

  // Combine all images into one row
  const allImages = [
    ...galleryData.row1,
  ];

  return (
    <section
      ref={containerRef}
      className="w-full py-20 flex flex-col gap-8 overflow-hidden bg-transparent relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <ParallaxRow
        images={allImages}
        baseVelocity={1}
        isInView={isInView}
        isPaused={isPaused}
        onImageHover={setPreviewImage}
      />

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative max-w-[80vw] max-h-[80vh] p-2 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-xl max-h-[75vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
