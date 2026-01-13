import { useState } from "react";
import {
    DraggableCardBody,
    DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo({ onTitleClick }: { onTitleClick?: () => void }) {
    const items = [
        {
            title: "动漫",
            images: [
                "/anime/juren.png",
                "/anime/xiaMu.png",
                "/anime/spyFamily.png",
            ],
            className: "absolute top-10 left-[20%] rotate-[-5deg]",
        },
        {
            title: "音乐",
            images: [
                "/music/guitar.webp",
            ],
            className: "absolute top-40 left-[25%] rotate-[-7deg]",
        },
        {
            title: "后期",
            images: [
                "/editing/ps.webp",
                "/editing/pr.jpg",
                "/editing/shiping.png"
            ],
            className: "absolute top-5 left-[40%] rotate-[8deg]",
        },
        {
            title: "旅游",
            images: [
                "/travel/fuji.jpg",
                "/travel/zheDuo.jpg",
                "/travel/singapore.jpg",
            ],
            className: "absolute top-32 left-[55%] rotate-[10deg]",
        },
        {
            title: "游戏",
            images: [
                "/game/GameList.jpg",
            ],
            className: "absolute top-20 right-[35%] rotate-[2deg]",
        },
        {
            title: "美食",
            images: [
                "/food/1.webp",
                "/food/2.webp",
                "/food/3.webp",
            ],
            className: "absolute top-24 left-[45%] rotate-[-7deg]",
        },
    ];

    const [imageIndices, setImageIndices] = useState<number[]>(new Array(items.length).fill(0));

    const handleImageClick = (index: number) => {
        setImageIndices((prev) => {
            const newIndices = [...prev];
            const currentImageIndex = newIndices[index];
            if (currentImageIndex < items[index].images.length - 1) {
                newIndices[index] = currentImageIndex + 1;
            }
            return newIndices;
        });
    };

    return (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
            <p
                onClick={onTitleClick}
                className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-600 transition-colors"
            >
                I hope we could do some fun things together.
            </p>
            {items.map((item, index) => (
                <DraggableCardBody key={index} className={item.className}>
                    <img
                        src={item.images[imageIndices[index]]}
                        alt={item.title}
                        draggable={false}
                        className="pointer-events-auto relative z-10 h-80 w-80 object-cover cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(index);
                        }}
                    />
                    <h3
                        className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300  hover:text-neutral-900 transition-colors"
                    >
                        {item.title}
                    </h3>
                </DraggableCardBody>
            ))}
        </DraggableCardContainer>
    );
}
