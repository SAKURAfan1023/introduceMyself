'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react';
import ChineseMap from './components/ChineseMap';
import SichuanMap from './components/SichuanMap';

// Expose the designated YScrollProgress variable
export const SICHUAN_FOCUS_PROGRESS = 1;

interface MapSvgProps {
    onLeshanClick?: () => void;
}

export default function MapSvg({ onLeshanClick }: MapSvgProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const handleSichuanClick = () => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const containerTop = rect.top + scrollTop;
        const containerHeight = containerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate the scroll position corresponding to the target progress
        // The total scrollable distance for the animation is (containerHeight - windowHeight)
        const scrollDistance = containerHeight - windowHeight;
        const targetScrollY = containerTop + (scrollDistance * SICHUAN_FOCUS_PROGRESS);

        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    };

    // Animation: Zoom in and move to focus on Sichuan (bottom-left)
    // Scale: 1 -> 6 (Large zoom to focus on province)
    const scale = useTransform(scrollYProgress, [0, 1], [1, 6]);

    // Position: Move focus from Center to Bottom-Left (Sichuan area)
    // Adjust these values to fine-tune the final focus position
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "0"]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    // Opacity: Cross-fade between China map and Sichuan map
    const opacityChina = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
    const displayChina = useTransform(scrollYProgress, (val) => (val >= 0.6 ? 'none' : 'block'));

    const opacitySichuan = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 0, 1]);
    const displaySichuan = useTransform(scrollYProgress, (val) => (val <= 0.4 ? 'none' : 'block'));

    return (
        <div ref={containerRef} className="w-full h-[400vh] relative bg-neutral-100">
            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ scale, x, y }}
                    className="relative w-[90vmin] h-[90vmin] flex items-center justify-center origin-center"
                >
                    {/* China Map Base */}
                    <motion.div
                        style={{ opacity: opacityChina, display: displayChina }}
                        className="w-full h-full absolute top-0 left-0"
                    >
                        <ChineseMap onSichuanClick={handleSichuanClick} className="w-full h-full select-none" />
                    </motion.div>

                    {/* Sichuan Map - Relative Position */}
                    {/* Positioned relative to the China map container */}
                    <motion.div
                        style={{ opacity: opacitySichuan, display: displaySichuan }}
                        className="absolute bottom-[25.8%] left-[36.4%] w-[22.5%] h-[22.5%] z-10"
                    >
                        <SichuanMap onLeshanClick={onLeshanClick} className="w-full h-full select-none" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
