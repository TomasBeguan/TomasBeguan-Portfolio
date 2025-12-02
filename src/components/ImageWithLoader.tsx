"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    width?: number;
    height?: number;
    containerClassName?: string;
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
    ...props
}: ImageWithLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
        width && height ? width / height : undefined
    );

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Reset loading state when src changes
        setIsLoading(true);
    }, [src]);

    useEffect(() => {
        // Check if image is already loaded (e.g. from cache)
        if (imgRef.current && imgRef.current.complete) {
            setIsLoading(false);
        }
    }, []);

    return (
        <div
            className={cn(
                "relative overflow-hidden flex items-center justify-center transition-colors duration-300",
                isLoading ? "bg-gray-100" : "bg-transparent",
                containerClassName
            )}
            style={{
                aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                ...style
            }}
            onClick={onClick}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin w-8 h-8" />
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={(e) => {
                    setIsLoading(false);
                    // If we didn't have dimensions, we can set aspect ratio now to prevent future shifts if re-rendered? 
                    // Actually, if we don't have dimensions, we can't prevent initial shift.
                    // But we can at least ensure it fills the container if needed.
                }}
                {...props}
            />
        </div>
    );
}
