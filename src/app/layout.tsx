import type { Metadata } from "next";
import { Space_Grotesk, Inter, Ultra, Libre_Baskerville, Silkscreen } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ultra = Ultra({ weight: "400", subsets: ["latin"], variable: "--font-ultra" });
const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre" });
const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--font-silkscreen" });

// Attempt to load local Chicago font, fallback to sans-serif if missing
// const chicago = localFont({
//   src: [
//     {
//       path: './fonts/Chicago.ttf',
//       weight: '400',
//       style: 'normal',
//     }
//   ],
//   variable: '--font-chicago',
//   display: 'swap',
// });

export const metadata: Metadata = {
    title: "Tomas Beguan | Portfolio",
    description: "3D Designer & Artist",
};

import { RetroMenuBar } from "@/components/RetroMenuBar";
import { Providers } from "@/components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${inter.variable} ${ultra.variable} ${libreBaskerville.variable} ${silkscreen.variable} font-sans antialiased bg-gray-100 pt-8 dark:bg-gray-900 transition-colors duration-300`}>
                <Providers>
                    <RetroMenuBar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
