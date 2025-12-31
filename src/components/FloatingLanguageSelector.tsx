"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function FloatingLanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block select-none">
            <div className="flex bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] p-1 gap-1">
                <button
                    onClick={() => setLanguage('es')}
                    className={cn(
                        "px-3 py-1 font-chicago text-[10px] transition-all",
                        language === 'es'
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white"
                    )}
                >
                    ES
                </button>
                <div className="w-[1px] bg-black dark:bg-white self-stretch" />
                <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                        "px-3 py-1 font-chicago text-[10px] transition-all",
                        language === 'en'
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white"
                    )}
                >
                    EN
                </button>
            </div>
        </div>
    );
}
