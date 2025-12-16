"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-black hover:text-white p-1 rounded-sm transition-colors"
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
};

export const RetroMenuBar = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "About", href: "/about" },
        //{ label: "Admin", href: "/admin" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-8 bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white flex items-center px-2 z-50 select-none shadow-sm transition-colors duration-300">
            {/* Apple Logo / Brand */}
            <div className="px-4 border-r-2 border-black dark:border-white h-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:text-white cursor-pointer transition-colors">
                <Link href="/">
                    <Apple size={16} fill="currentColor" />
                </Link>
            </div>

            {/* Nav Items */}
            <div className="flex items-center h-full">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              px-4 h-full flex items-center justify-center
              font-chicago text-sm tracking-wide
              border-r-2 border-black dark:border-white
              hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors
              ${pathname === item.href ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-retro-dark-blue dark:text-white"}
            `}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Theme Toggle - Disabled per user request */}
            {/* <div className="ml-auto px-4 h-full flex items-center border-l-2 border-black dark:border-white text-black dark:text-white">
                <ThemeToggle />
            </div> */}
        </div>
    );
};
