"use client";

import { cn } from "@/lib/utils";

interface RetroButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const RetroButton = ({ children, onClick, className = "", style }: RetroButtonProps) => {
    return (
        <button
            onClick={onClick}
            style={style}
            className={`
        px-8 py-2
        bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white
        font-silkscreen text-lg text-black dark:text-white
        shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] 
        hover:shadow-retro-sm dark:hover:shadow-[2px_2px_0px_0px_#ffffff] 
        hover:translate-x-[2px] hover:translate-y-[2px]
        hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
        transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
        ${className}
      `}
        >
            {children}
        </button>
    );
};
