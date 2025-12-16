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

        // Inicializamos el target con la posición actual real
        targetScroll.current = container.scrollTop;

        // Función de animación (Loop)
        const updateScroll = () => {
            if (!container) return;

            // 1. Obtenemos posición actual
            const currentScroll = container.scrollTop;

            // 2. Calculamos la distancia al objetivo
            const diff = targetScroll.current - currentScroll;

            // 3. Si la distancia es pequeña, paramos (ahorramos batería)
            // (0.5px es un buen umbral de "llegada")
            if (Math.abs(diff) < 0.5) {
                isAnimating.current = false;
                // Sincronizamos final para evitar micro-saltos
                targetScroll.current = currentScroll;
                return;
            }

            // 4. LERP: Nos movemos un 10% de la distancia restante en cada frame
            // '0.1' es el factor de suavidad (menor = más lento/pesado, mayor = más rápido)
            const newScroll = currentScroll + (diff * 0.1);

            container.scrollTop = newScroll;

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

            // Si el mouse está DENTRO de la ventana, dejamos que el navegador (o Lenis prevent) 
            // se encargue nativamente. Solo actuamos si está FUERA.
            if (container.contains(e.target as Node)) {
                // Importante: Si el usuario usa el scroll nativo, actualizamos nuestro target
                // inmediatamente para que no haya saltos si luego saca el mouse.
                targetScroll.current = container.scrollTop;
                return;
            }

            // Calculamos límites para no scrollear al infinito
            const maxScroll = container.scrollHeight - container.clientHeight;

            // Actualizamos el OBJETIVO, no la posición directa
            targetScroll.current += e.deltaY;

            // Clampeamos (limitamos) el objetivo entre 0 y el máximo
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

            // Arrancamos el loop de física
            startAnimation();
        };

        // Listener extra: Si el usuario arrastra la barra de scroll manualmente,
        // necesitamos actualizar el targetScroll para que no "salte" hacia atrás.
        const handleNativeScroll = () => {
            // Solo actualizamos si NO estamos animando nosotros (es decir, fue el usuario)
            if (!isAnimating.current) {
                targetScroll.current = container.scrollTop;
            }
        };

        window.addEventListener('wheel', handleGlobalWheel, { passive: false });
        container.addEventListener('scroll', handleNativeScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleGlobalWheel);
            container.removeEventListener('scroll', handleNativeScroll);
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