"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * A specialized component to apply a Bayer Dither effect to an image using SVG filters.
 * It uses a 4x4 Bayer matrix pattern for the threshold.
 */
export function BayerDitherImage({
    src,
    alt,
    className,
    contrast = 1.2,
    brightness = 1.1
}: {
    src: string;
    alt?: string;
    className?: string;
    contrast?: number;
    brightness?: number;
}) {
    // 4x4 Bayer Matrix Data URL (Greyscale 4x4 PNG)
    const bayerPattern = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkYGD4z8DAwMgABYwMoAogYMAAAAyVAREByAn7AAAAAElFTkSuQmCC";

    // Values converted to PNG:
    // 0, 128, 32, 160
    // 192, 64, 224, 96
    // 48, 176, 16, 144
    // 240, 112, 208, 80

    return (
        <div className={cn("relative overflow-hidden inline-block", className)}>
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <filter id="bayer-dither-filter" colorInterpolationFilters="sRGB">
                        {/* 1. Convert to grayscale and adjust brightness/contrast */}
                        <feColorMatrix
                            type="matrix"
                            values={`0.33 0.33 0.33 0 0 
                                    0.33 0.33 0.33 0 0 
                                    0.33 0.33 0.33 0 0 
                                    0 0 0 1 0`}
                        />
                        <feComponentTransfer>
                            <feFuncR type="linear" slope={contrast} intercept={brightness - 1} />
                            <feFuncG type="linear" slope={contrast} intercept={brightness - 1} />
                            <feFuncB type="linear" slope={contrast} intercept={brightness - 1} />
                        </feComponentTransfer>

                        {/* 2. Load and tile the Bayer pattern */}
                        <feImage href={bayerPattern} result="bayer" x="0" y="0" width="4" height="4" />
                        <feTile in="bayer" result="tiled-bayer" />

                        {/* 3. Combine image with Bayer pattern */}
                        {/* This math comparison creates the dither effect */}
                        <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="-0.5" in="SourceGraphic" in2="tiled-bayer" result="dithered" />

                        {/* 4. Threshold to 1-bit (Black and White) or limited colors */}
                        <feComponentTransfer in="dithered">
                            <feFuncR type="discrete" tableValues="0 1" />
                            <feFuncG type="discrete" tableValues="0 1" />
                            <feFuncB type="discrete" tableValues="0 1" />
                        </feComponentTransfer>
                    </filter>
                </defs>
            </svg>

            <img
                src={src}
                alt={alt}
                className="w-full h-full block pixelated"
                style={{ filter: "url(#bayer-dither-filter)" }}
            />
        </div>
    );
}
