"use client";

import React, { useRef, useEffect } from 'react';

interface RetroWindowProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const RetroWindow = ({ title = "My Stuff", children, className = "" }: RetroWindowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

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
            }, 150); // Aumentado para asegurar que el contenido cargó
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
            if (window.innerWidth < 768) return; // No actuar en mobile vía wheel global

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

    return (
        <div className={`w-full max-w-4xl bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] relative transition-colors duration-300 ${className}`}>
            {/* Window Title Bar */}
            <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative z-30 h-12 transition-colors duration-300">
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-center gap-[3px] opacity-100 z-0">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-black dark:bg-white transition-colors duration-300"></div>
                        ))}
                    </div>
                    <div className="relative z-10 px-4 bg-white dark:bg-retro-dark-blue border-x-2 border-black dark:border-white transition-colors duration-300">
                        <h2 className="text-xl font-chicago tracking-normal text-retro-text">{title}</h2>
                    </div>
                </div>
            </div>

            {/* Window Content */}
            <div
                ref={scrollRef}
                className="md:flex-1 md:min-h-0 md:overflow-y-auto retro-scrollbar bg-white dark:bg-retro-dark-blue p-0 relative z-10 transition-colors duration-300"
                data-lenis-prevent
            >
                {children}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-[calc(50%-8px)] -translate-x-1/2 z-20 pointer-events-none animate-scroll-hint">
                <svg width="32" height="20" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                    <path d="M12 14L0 0H24L12 14Z" className="fill-white dark:fill-retro-dark-blue stroke-black dark:stroke-white" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};