import type { Metadata } from "next";
import { Space_Grotesk, Inter, Ultra, Libre_Baskerville, Silkscreen } from "next/font/google";
// import localFont from 'next/font/local'; // (Lo tienes comentado)
import "./globals.css";

// 1. Importar Lenis
import { ReactLenis } from 'lenis/react';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ultra = Ultra({ weight: "400", subsets: ["latin"], variable: "--font-ultra" });
const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre" });
const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--font-silkscreen" });

export const metadata: Metadata = {
    title: "Tomas Beguan | Portfolio",
    description: "3D Designer & Artist",
};

import { RetroMenuBar } from "@/components/RetroMenuBar";
import { Providers } from "@/components/Providers";
import { FloatingLanguageSelector } from "@/components/FloatingLanguageSelector";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${inter.variable} ${ultra.variable} ${libreBaskerville.variable} ${silkscreen.variable} font-sans antialiased bg-gray-100 pt-8 dark:bg-gray-900 transition-colors duration-300`} suppressHydrationWarning>

                {/* 2. Envolver todo el contenido dentro del body con ReactLenis */}
                {/* 'root' indica que Lenis controla el scroll de la ventana (html/window) */}

                <Providers>
                    <RetroMenuBar />
                    {children}
                    <FloatingLanguageSelector />
                </Providers>


            </body>
        </html>
    );
}