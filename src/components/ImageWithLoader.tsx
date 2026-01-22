"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    width?: number;
    height?: number;
    containerClassName?: string;
    priority?: boolean;
    quality?: number;
}

export function ImageWithLoader({
    src,
    alt,
    width,
    height,
    className,
    containerClassName,
    onClick,
    style,
    priority = false,
    quality,
    ...props
}: ImageWithLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
        width && height ? width / height : undefined
    );

    useEffect(() => {
        // Reset loading state when src changes
        setIsLoading(true);
    }, [src]);

    // If src is an external URL (not starting with /), we might need to handle it differently 
    // but Next.js Images usually require prefixing or configuration. 
    // Assuming everything in posts.json follows current patterns.

    return (
        <div
            className={cn(
                "relative overflow-hidden flex items-center justify-center transition-colors duration-500",
                isLoading ? "bg-gray-50/50" : "bg-transparent",
                containerClassName
            )}
            style={{
                aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                ...style
            }}
            onClick={onClick}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 z-10">
                    <Loader2 className="animate-spin w-8 h-8" />
                </div>
            )}
            <Image
                src={src as string}
                alt={alt || ""}
                fill={!width && !height}
                width={width}
                height={height}
                priority={priority}
                quality={quality}
                sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={cn(
                    "transition-none",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={() => setIsLoading(false)}
                // We use any because ImgHTMLAttributes includes things next/image doesn't like
                {...(props as any)}
            />
        </div>
    );
}
