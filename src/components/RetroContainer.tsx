"use client";

import React, { useRef, useEffect } from "react";
import { ArrowLeft, X, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { RetroButton } from "./RetroButton";
import { useLanguage } from "@/context/LanguageContext";

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
    backgroundBlendMode
}: RetroContainerProps) {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { language, t } = useLanguage();

    const displayTitle = (language === 'en' && title_en) ? title_en : title;

    // Almacenamos el objetivo (a dónde queremos llegar)
    const targetScroll = useRef(0);
    // Almacenamos si estamos en medio de una animación
    const isAnimating = useRef(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollKey = `scroll-${window.location.pathname}`;

        // Función para obtener scroll actual (dependiendo de si es mobile o no)
        const getScrollPos = () => {
            const isMobile = window.innerWidth < 768;
            return isMobile ? window.scrollY : container.scrollTop;
        };

        // Restaurar posición al montar
        const savedScroll = sessionStorage.getItem(scrollKey);
        if (savedScroll) {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }
            const pos = parseInt(savedScroll);
            setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                    window.scrollTo(0, pos);
                } else {
                    container.scrollTop = pos;
                    targetScroll.current = pos;
                }
            }, 150); // Aumentado para asegurar que el contenido (especialmente 3D) cargó
        }

        // Función de animación (Loop)
        const updateScroll = () => {
            if (!container) return;

            // 1. Obtenemos posición actual
            const currentScroll = container.scrollTop;

            // 2. Calculamos la distancia al objetivo
            const diff = targetScroll.current - currentScroll;

            // 3. Si la distancia es pequeña, paramos (ahorramos batería)
            if (Math.abs(diff) < 0.5) {
                isAnimating.current = false;
                targetScroll.current = currentScroll;
                // Guardamos posición final
                sessionStorage.setItem(scrollKey, currentScroll.toString());
                return;
            }

            // 4. LERP
            const newScroll = currentScroll + (diff * 0.1);
            container.scrollTop = newScroll;

            // Guardamos posición intermedia
            sessionStorage.setItem(scrollKey, newScroll.toString());

            // 5. Pedimos el siguiente frame
            requestAnimationFrame(updateScroll);
        };

        const startAnimation = () => {
            if (!isAnimating.current) {
                isAnimating.current = true;
                requestAnimationFrame(updateScroll);
            }
        };

        const handleGlobalWheel = (e: WheelEvent) => {
            if (!container) return;
            if (window.innerWidth < 768) return;

            if (container.contains(e.target as Node)) {
                targetScroll.current = container.scrollTop;
                return;
            }

            const maxScroll = container.scrollHeight - container.clientHeight;
            targetScroll.current += e.deltaY;
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));
            startAnimation();
        };

        const handleScroll = () => {
            const isMobile = window.innerWidth < 768;
            const pos = getScrollPos();

            if (!isAnimating.current) {
                targetScroll.current = pos;
            }
            sessionStorage.setItem(scrollKey, pos.toString());
        };

        window.addEventListener('wheel', handleGlobalWheel, { passive: false });
        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleGlobalWheel);
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
                    "flex flex-col bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] w-full max-w-5xl mx-auto my-0 md:flex-1 md:min-h-0 transition-colors duration-300",
                    className
                )}
            >
                {/* Title Bar */}
                <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative z-20 h-12 shrink-0 select-none transition-colors duration-300">
                    {/* Back Button (Fixed on Mobile, Absolute on Desktop) */}
                    <div className="absolute md:absolute left-2 md:left-2 z-10 md:z-10 h-8 md:top-1/2 md:-translate-y-1/2 max-md:fixed max-md:top-10 max-md:left-4 max-md:z-[45]">
                        <RetroButton
                            onClick={handleClose}
                            className="px-2 sm:px-3 py-0 text-sm h-full border-2 border-black dark:border-white shadow-retro-sm md:shadow-none active:translate-x-0 active:translate-y-0 hover:translate-x-0 hover:translate-y-0 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-chicago flex items-center gap-2 bg-white dark:bg-retro-dark-blue dark:text-white transition-colors duration-300"
                        >
                            <ArrowLeft size={14} strokeWidth={3} />
                            <span className="hidden sm:inline">{t('back')}</span>
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
