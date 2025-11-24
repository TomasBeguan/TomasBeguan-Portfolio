"use client";

import { ArrowLeft, X, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { RetroButton } from "./RetroButton";

interface RetroContainerProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    onBack?: () => void;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundMode?: 'cover' | 'contain' | 'repeat' | 'no-repeat' | 'stretch';
    backgroundOpacity?: number;
    backgroundSize?: string;
    backgroundBlendMode?: string;
}

export function RetroContainer({
    title,
    children,
    className,
    onBack,
    backgroundColor,
    backgroundImage,
    backgroundMode,
    backgroundOpacity = 100,
    backgroundSize,
    backgroundBlendMode
}: RetroContainerProps) {
    const router = useRouter();

    const handleClose = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const getImageStyle = () => {
        if (!backgroundImage) return {};

        const style: React.CSSProperties = {
            backgroundImage: `url(${backgroundImage})`,
            opacity: backgroundOpacity / 100,
            backgroundPosition: 'center',
            backgroundBlendMode: backgroundBlendMode || 'normal',
        };

        // Size priority: manual size > mode
        if (backgroundSize) {
            style.backgroundSize = backgroundSize;
        } else if (backgroundMode === 'cover') {
            style.backgroundSize = 'cover';
        } else if (backgroundMode === 'contain') {
            style.backgroundSize = 'contain';
        }

        // Repeat logic
        if (backgroundMode === 'repeat') {
            style.backgroundRepeat = 'repeat';
        } else {
            style.backgroundRepeat = 'no-repeat';
        }

        return style;
    };

    return (
        <>
            <div
                className={cn(
                    "flex flex-col bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] w-full max-w-5xl mx-auto my-0 flex-1 min-h-0 transition-colors duration-300",
                    className
                )}
            >
                {/* Title Bar */}
                <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative h-12 shrink-0 select-none transition-colors duration-300">
                    {/* Back Button (Absolute Left) */}
                    <div className="absolute left-2 z-10 h-8 top-1/2 -translate-y-1/2">
                        <RetroButton
                            onClick={handleClose}
                            className="px-2 sm:px-3 py-0 text-sm h-full border border-black dark:border-white shadow-none active:translate-x-0 active:translate-y-0 hover:translate-x-0 hover:translate-y-0 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-chicago flex items-center gap-2 bg-white dark:bg-retro-dark-blue dark:text-white transition-colors duration-300"
                        >
                            <ArrowLeft size={14} strokeWidth={3} />
                            <span className="hidden sm:inline">Back</span>
                        </RetroButton>
                    </div>

                    {/* Title with striped background */}
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        {/* Stripes */}
                        <div className="absolute inset-0 flex flex-col justify-center gap-[3px] opacity-100 z-0">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-full h-[1px] bg-black dark:bg-white transition-colors duration-300"></div>
                            ))}
                        </div>

                        {/* Title Text with white background to cover stripes */}
                        <div className="relative z-10 px-4 bg-white dark:bg-retro-dark-blue border-x-2 border-black dark:border-white transition-colors duration-300">
                            <h2 className="text-xl font-chicago tracking-normal pt-1 text-retro-text">{title}</h2>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-2 sm:p-4 bg-white dark:bg-retro-dark-blue min-h-0 transition-colors duration-300">
                    <div className="h-full w-full border border-black dark:border-white relative overflow-hidden bg-white dark:bg-retro-dark-blue transition-colors duration-300">
                        {/* Layer 1: Background Color */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{ backgroundColor: backgroundColor || '#ffffff' }}
                        />

                        {/* Layer 2: Background Image */}
                        {backgroundImage && (
                            <div
                                className="absolute inset-0 z-1 pointer-events-none"
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    opacity: backgroundOpacity / 100,
                                    backgroundPosition: 'center',
                                    mixBlendMode: backgroundBlendMode as any || 'normal',
                                    backgroundSize: backgroundSize || (backgroundMode === 'cover' ? 'cover' : backgroundMode === 'contain' ? 'contain' : backgroundMode === 'stretch' ? '100% 100%' : 'auto'),
                                    backgroundRepeat: backgroundMode === 'repeat' ? 'repeat' : 'no-repeat'
                                }}
                            />
                        )}

                        {/* Layer 3: Content */}
                        <div className="relative z-10 h-full w-full overflow-y-auto retro-scrollbar p-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
