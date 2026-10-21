import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Ultra, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { RetroMenuBar } from "@/components/RetroMenuBar";
import { Providers } from "@/components/Providers";
import { FloatingLanguageSelector } from "@/components/FloatingLanguageSelector";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";

// Only the fonts actually used by the site are loaded (Inter and Silkscreen were unused).
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const ultra = Ultra({ weight: "400", subsets: ["latin"], variable: "--font-ultra", display: "swap" });
const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre", display: "swap" });
// Chicago is now self-hosted through next/font: preloaded, hashed and cached long-term.
const chicago = localFont({
    src: "../../public/uploads/fonts/Chicago.ttf",
    variable: "--font-chicago",
    display: "swap",
    fallback: ["Geneva", "Verdana", "sans-serif"],
});

const description = "Portfolio de Tomás Beguan, artista 3D: animación, modelado y desarrollo de videojuegos. / 3D artist portfolio: animation, modeling and game development.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Tomás Beguan | 3D Artist",
        template: "%s | Tomás Beguan",
    },
    description,
    authors: [{ name: "Tomás Beguan", url: SITE_URL }],
    creator: "Tomás Beguan",
    keywords: ["Tomás Beguan", "3D artist", "artista 3D", "animación 3D", "3D animation", "Blender", "portfolio"],
    openGraph: {
        type: "website",
        siteName: "Tomás Beguan",
        title: "Tomás Beguan | 3D Artist",
        description,
        url: "/",
        images: [{ url: "/uploads/1765924930973-Profile01.webp" }],
        locale: "es_AR",
        alternateLocale: ["en_US"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Tomás Beguan | 3D Artist",
        description,
        images: ["/uploads/1765924930973-Profile01.webp"],
    },
};

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${ultra.variable} ${libreBaskerville.variable} ${chicago.variable} font-sans antialiased bg-gray-100 pt-8 dark:bg-gray-900 transition-colors duration-300`} suppressHydrationWarning>
                <Providers>
                    <RetroMenuBar />
                    {children}
                    <FloatingLanguageSelector />
                    <Analytics />
                </Providers>
            </body>
        </html>
    );
}
