"use client";

import { cn } from "@/lib/utils";

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const RetroButton = ({ children, className, onClick, ...props }: RetroButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all bg-white dark:bg-retro-dark-blue text-black dark:text-white font-chicago px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
