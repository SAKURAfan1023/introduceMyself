"use client";

import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import EmeiMountain from "./img/EmeiMountain.jpg";
import LeshanGiantBuddha from "./img/LeshanBuddha.webp";
import monkey from "./img/monkey.png";
import snow from "./img/snow.png";

export const cardsData = [
    {
        title: "乐山大佛",
        description: "全名嘉州凌云寺大弥勒石像，世界上最高的石佛像",
        image: LeshanGiantBuddha
    },
    {
        title: "峨眉山",
        description: "四大佛教名山，金顶海拔3077米",
        image: EmeiMountain
    },
    {
        title: "幽谷灵猴",
        description: "峨眉山灵猴，以顽皮著称",
        image: monkey
    },
    {
        title: "峨眉山雪景",
        description: "奇峰、林海、云雾与冰雪相交织的奇景",
        image: snow
    },
];

export function ThreeDCardDemo({ scale = 1, onClick, index = 0 }: { scale?: number; onClick?: () => void; index?: number }) {
    const card = cardsData[index % cardsData.length];

    return (
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-neutral-600 dark:text-white"
                            >
                                {card.title}
                            </CardItem>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                            >
                                {card.description}
                            </CardItem>
                            <CardItem translateZ="100" className="w-full mt-4">
                                <Image
                                    src={card.image}
                                    height={1000}
                                    width={1000}
                                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    alt="thumbnail"
                                />
                            </CardItem>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-between items-center mt-20">
                        <CardItem
                            translateZ={20}
                            as="button"
                            onClick={onClick}
                            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white cursor-pointer"
                        >
                            Click to see →
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
        </div>
    );
}