"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "About", href: "/about" },
        { label: "Admin", href: "/admin" },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Animation Variants
    const menuVariants = {
        closed: {
            opacity: 0,
            scaleY: 0.8,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            scaleY: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        closed: {
            opacity: 0,
            x: -40,
            scale: 0.4,
        },
        open: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    return (
        <div
            ref={menuRef}
            className={cn(
                "fixed z-50 select-none transition-colors duration-300 flex",
                "md:top-0 md:left-0 md:w-full md:h-8 md:bg-white md:dark:bg-retro-dark-blue md:border-b-2 md:border-black md:dark:border-white md:flex-row md:items-center md:px-2 md:shadow-sm",
                "top-4 left-4 flex-col items-start"
            )}
        >
            {/* Mobile Menu Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "md:hidden p-2 flex items-center justify-center border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors",
                    "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
                    isOpen
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white text-black dark:bg-retro-dark-blue dark:text-white"
                )}
            >
                <Menu size={20} />
            </button>

            {/* Apple Logo / Brand - HIDDEN ON MOBILE */}
            <div className="hidden md:flex px-4 border-r-2 border-black dark:border-white h-full items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:text-white cursor-pointer transition-colors">
                <Link href="/">
                    <Apple size={16} fill="currentColor" />
                </Link>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center h-full">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-4 h-full flex items-center justify-center font-chicago text-sm tracking-wide border-r-2 border-black dark:border-white transition-colors",
                            "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
                            pathname === item.href
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-white text-black dark:bg-retro-dark-blue dark:text-white"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Mobile Dropdown Menu (Animated & Separated Blocks) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="md:hidden flex flex-col gap-2 mt-6 w-56 origin-top-left"
                    >
                        {navItems.map((item) => (
                            <motion.div
                                key={item.href}
                                variants={itemVariants}
                                className="w-full"
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "block px-4 py-3 font-chicago text-sm tracking-wide transition-colors border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                                        "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                        pathname === item.href
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "bg-white text-black dark:bg-retro-dark-blue dark:text-white"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
