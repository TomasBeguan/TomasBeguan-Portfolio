"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RetroButton } from "./RetroButton";
import { ImageWithLoader } from "./ImageWithLoader";

interface RetroCarouselProps {
    items: string[];
    itemAlts?: string[];
    noBorder?: boolean;
    pixelate?: boolean;
    delay?: number; // Delay in seconds
    allowModal?: boolean;
    showAltText?: boolean;
    onImageClick?: (url: string, alt: string) => void;
}

export function RetroCarousel({
    items,
    itemAlts = [],
    noBorder = false,
    pixelate = false,
    delay = 3,
    allowModal = true,
    showAltText = false,
    onImageClick,
}: RetroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play: extremely simple and robust
    useEffect(() => {
        if (items.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, (Number(delay) || 3) * 1000);

        return () => clearInterval(interval);
    }, [items.length, delay]);

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="w-full relative group">
            <div
                className={cn(
                    "w-full bg-white relative overflow-hidden transition-all duration-300",
                    !noBorder && "border-2 border-black shadow-retro-sm",
                    noBorder && "bg-transparent"
                )}
            >
                {/* Main Image Container */}
                <div className="w-full aspect-[4/3] relative">
                    {items.map((src, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
                                allowModal && onImageClick && "cursor-zoom-in"
                            )}
                            onClick={() => {
                                if (allowModal && onImageClick) {
                                    onImageClick(src, itemAlts[idx] || `Carousel item ${idx + 1}`);
                                }
                            }}
                        >
                            <ImageWithLoader
                                src={src}
                                alt={itemAlts[idx] || `Carousel item ${idx + 1}`}
                                containerClassName="w-full h-full"
                                unoptimized={src.toLowerCase().endsWith('.gif')}
                                className={cn(
                                    "w-full h-full object-contain",
                                    pixelate && "pixelated"
                                )}
                                sizes="100vw"
                                quality={100}
                                priority={idx === 0}
                            />
                            {showAltText && itemAlts[idx] && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-white border-2 border-black shadow-retro-sm max-w-[80%]">
                                    <p className="text-xs font-bold text-black text-center truncate pointer-events-none">
                                        {itemAlts[idx]}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <RetroButton
                        onClick={prevSlide}
                        className="pointer-events-auto bg-white/80 hover:bg-white border-2 border-black p-1 shadow-retro-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <ChevronLeft size={24} className="text-black" />
                    </RetroButton>
                    <RetroButton
                        onClick={nextSlide}
                        className="pointer-events-auto bg-white/80 hover:bg-white border-2 border-black p-1 shadow-retro-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <ChevronRight size={24} className="text-black" />
                    </RetroButton>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
                    {items.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-3 h-3 border border-black transition-colors duration-500",
                                idx === currentIndex ? "bg-black" : "bg-white"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
