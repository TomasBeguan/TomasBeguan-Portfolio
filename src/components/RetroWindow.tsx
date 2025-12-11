"use client";

import React, { useRef } from 'react';


interface RetroWindowProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const RetroWindow = ({ title = "My Stuff", children, className = "" }: RetroWindowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`w-full max-w-4xl bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] relative transition-colors duration-300 ${className}`}>
            {/* Window Title Bar */}
            <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative z-30 h-12 transition-colors duration-300">
                {/* Close Box */}


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
                        <h2 className="text-xl font-chicago tracking-normal text-retro-text">{title}</h2>
                    </div>
                </div>
            </div>



            {/* Window Content */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto retro-scrollbar bg-white dark:bg-retro-dark-blue p-0 relative z-10 transition-colors duration-300">
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
