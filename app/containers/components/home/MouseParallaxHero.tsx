'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionValueEvent } from 'motion/react';
import { ContainerTextFlipDemo } from './textFlip';
import city from '@/public/firstScreen/city.webp';
import sea from '@/public/firstScreen/sea.jpg';
import zheDuo from '@/public/firstScreen/zheDuo.jpg';
import seaSide from '@/public/firstScreen/seaSide.jpg';
import singapore from '@/public/firstScreen/singapore.jpg';
import fuji from '@/public/firstScreen/fuji.jpg';

const scatteredImages = [
  { id: 1, top: '7%', left: '6%', width: '20vw', speed: 0.05, src: city },
  { id: 2, top: '10%', left: '70%', width: '17vw', speed: 0.08, src: sea },
  { id: 3, top: '67%', left: '20%', width: '15vw', speed: 0.06, src: zheDuo },
  { id: 4, top: '69%', left: '70%', width: '14vw', speed: 0.04, src: seaSide },
  { id: 5, top: '15%', left: '43%', width: '12vw', speed: 0.1, src: singapore },
  { id: 6, top: '63%', left: '45%', width: '14vw', speed: 0.07, src: fuji },
];

type ScatteredImage = (typeof scatteredImages)[number];

const getEntranceDirection = (top: string, left: string) => {
  const t = parseInt(top);
  const l = parseInt(left);

  const distTop = t;
  const distBottom = 100 - t;
  const distLeft = l;
  const distRight = 100 - l;

  const min = Math.min(distTop, distBottom, distLeft, distRight);

  if (min === distTop) return { y: '-100vh', x: 0 };
  if (min === distBottom) return { y: '100vh', x: 0 };
  if (min === distLeft) return { x: '-100vw', y: 0 };
  return { x: '100vw', y: 0 };
};

const imageVariants = {
  hidden: ({ img }: { img: ScatteredImage }) => ({
    ...getEntranceDirection(img.top, img.left),
    opacity: 0,
    transition: {
      duration: 1.0,
      ease: [0.25, 0.1, 0.25, 1.0],
    }
  }),
  visible: ({ index }: { index: number }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 1.4,
      ease: [0.25, 0.1, 0.25, 1.0], // Advanced ease-out
      delay: index * 0.1,
    },
  }),
} satisfies Parameters<typeof motion.div>[0]['variants'];

function ParallaxImage({
  img,
  index,
  smoothX,
  smoothY,
  isVisible,
}: {
  img: ScatteredImage;
  index: number;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
  isVisible: boolean;
}) {
  const router = useRouter();
  const x = useTransform(smoothX, (v) => v * img.speed);
  const y = useTransform(smoothY, (v) => v * img.speed);

  return (
    <motion.div
      custom={{ img, index }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={imageVariants}
      className="absolute z-10 pointer-events-auto bg-transparent"
      style={{
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.width,
      }}
    >
      <motion.div
        className={`relative w-full h-full rounded-lg opacity-80 group
          hover:opacity-100 transition-opacity duration-200`}
        style={{
          x,
          y,
        }}
      >
        <div className="relative w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-110">
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ boxShadow: '0 0 30px rgba(255,255,255,0.6)' }}
          />
          <Image
            src={img.src}
            alt={`Decoration ${img.id}`}
            className="object-cover rounded-lg shadow-2xl"
            fill
            sizes={img.width}
            draggable={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const MouseParallaxHero = ({ active = true }: { active?: boolean }) => {
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 26 });
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const isExitingRef = useRef(false);

  // Control the entrance state based on `active` prop
  // If not active, everything should be hidden regardless of scroll
  const shouldShow = active && isVisible;

  const titleX = useTransform(smoothX, (v) => v * 0.02);
  const titleY = useTransform(smoothY, (v) => v * 0.02);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isExitingRef.current) return;
    if (latest > 10 && isVisible) {
      setIsVisible(false);
    } else if (latest <= 10 && !isVisible) {
      setIsVisible(true);
    }
  });

  const handleExit = async () => {
    isExitingRef.current = true;
    setIsVisible(false);

    // Wait for exit animation (1.0s)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    window.scrollTo({ top: 800, behavior: "smooth" });

    // Reset lock after scroll is likely done
    setTimeout(() => {
      isExitingRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      <motion.div
        style={{ x: titleX, y: titleY }}
        animate={shouldShow ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="z-20 relative mix-blend-difference"
      >
        <ContainerTextFlipDemo onClick={handleExit} />
      </motion.div>

      {scatteredImages.map((img, index) => (
        <ParallaxImage
          key={img.id}
          img={img}
          index={index}
          smoothX={smoothX}
          smoothY={smoothY}
          isVisible={shouldShow}
        />
      ))}
    </div>
  );
};

export default MouseParallaxHero;
