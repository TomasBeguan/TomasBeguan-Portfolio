"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
                {children}
            </ThemeProvider>
        </LanguageProvider>
    );
}
