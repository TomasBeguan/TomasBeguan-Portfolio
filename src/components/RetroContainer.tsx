"use client";

import React, { useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { RetroButton } from "./RetroButton";
import { useLanguage } from "@/context/LanguageContext";
import { useRetroScroll } from "@/hooks/useRetroScroll";

interface RetroContainerProps {
    title: string;
    title_en?: string;
    children: React.ReactNode;
    className?: string;
    onBack?: () => void;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundMode?: 'cover' | 'contain' | 'repeat' | 'no-repeat' | 'stretch';
    backgroundOpacity?: number;
    backgroundSize?: string;
    backgroundBlendMode?: string;
    hideBack?: boolean;
}

export function RetroContainer({
    title,
    title_en,
    children,
    className,
    onBack,
    backgroundColor,
    backgroundImage,
    backgroundMode,
    backgroundOpacity = 100,
    backgroundSize,
    backgroundBlendMode,
    hideBack = false
}: RetroContainerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { language, t } = useLanguage();

    const displayTitle = (language === 'en' && title_en) ? title_en : title;

    useRetroScroll(scrollRef);

    // Track navigation history within the session
    useEffect(() => {
        const currentPath = window.location.pathname;
        const storedPath = sessionStorage.getItem('current_path');

        if (storedPath && storedPath !== currentPath) {
            sessionStorage.setItem('previous_path', storedPath);
        }
        sessionStorage.setItem('current_path', currentPath);
    }, [pathname]);

    const handleClose = () => {
        if (onBack) {
            onBack();
        } else {
            // Check if we have a previous path stored in this session
            const hasPreviousPath = typeof window !== 'undefined' &&
                sessionStorage.getItem('previous_path');

            if (hasPreviousPath) {
                router.back();
            } else {
                router.push('/');
            }
        }
    };

    return (
        <>
            <div
                className={cn(
                    "flex flex-col bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] w-full max-w-5xl mx-auto my-0 md:flex-1 md:min-h-0 transition-colors duration-300",
                    className
                )}
            >
                {/* Title Bar */}
                <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative z-20 h-12 shrink-0 select-none transition-colors duration-300">
                    {/* Back Button (Fixed on Mobile, Absolute on Desktop) */}
                    {!hideBack && (
                        <div className="absolute md:absolute left-2 md:left-2 z-10 md:z-10 h-8 md:top-1/2 md:-translate-y-1/2 max-md:fixed max-md:top-10 max-md:left-4 max-md:z-[45]">
                            <RetroButton
                                onClick={handleClose}
                                className="px-2 sm:px-3 py-0 text-sm h-full border-2 border-black dark:border-white shadow-retro-sm md:shadow-none active:translate-x-0 active:translate-y-0 hover:translate-x-0 hover:translate-y-0 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-chicago flex items-center gap-2 bg-white dark:bg-retro-dark-blue dark:text-white transition-colors duration-300"
                            >
                                <ArrowLeft size={14} strokeWidth={3} />
                                <span className="hidden sm:inline">{t('back')}</span>
                            </RetroButton>
                        </div>
                    )}

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
                            <h2 className="text-xl font-chicago tracking-normal pt-1 text-retro-text ">{displayTitle}</h2>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:flex-1 p-2 sm:p-2 bg-white dark:bg-retro-dark-blue md:min-h-0 transition-colors duration-300">
                    <div className="md:h-full w-full border border-black dark:border-white relative md:overflow-hidden bg-white dark:bg-retro-dark-blue transition-colors duration-300">
                        {/* Layer 1: Background Color */}
                        <div
                            className="absolute inset-0 z-0 "
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
                        <div
                            ref={scrollRef}
                            className="relative z-10 md:h-full w-full md:overflow-y-auto retro-scrollbar p-4 md:p-8"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
