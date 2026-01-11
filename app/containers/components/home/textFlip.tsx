"use client";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ContainerTextFlipDemo() {
    const words = ["better", "modern", "beautiful", "awesome"];
    return (
        <motion.h1
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            className={cn(
                "relative mb-6 max-w-1xl text-left text-4xl leading-normal font-bold tracking-tight text-white md:text-6xl z-10",
            )}
            transition={{ duration: 1 }}
            layout
        >
            <div className="inline-block text-sky-200">
                Introduce Myself <ContainerTextFlip words={words} />
                {/* <Blips /> */}
            </div>
        </motion.h1>
    );
}
