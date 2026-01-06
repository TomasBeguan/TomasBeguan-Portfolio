"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

interface PageData {
    front: string;
    back: string;
}

interface DiaryBookProps {
    cover: string;
    backCover: string;
    pages: PageData[];
    width?: number;
    height?: number;
    borderRadius?: string;
    glossy?: boolean;
    staticLeft?: string;
    staticRight?: string;
}

// Separate component for each page to satisfy react-pageflip requirements
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, index: number, borderRadius?: string }>(
    (props, ref) => {
        const isLeftPage = props.index % 2 !== 0;

        const pageStyle: React.CSSProperties = {
            borderTopRightRadius: isLeftPage ? '0' : props.borderRadius,
            borderBottomRightRadius: isLeftPage ? '0' : props.borderRadius,
            borderTopLeftRadius: isLeftPage ? props.borderRadius : '0',
            borderBottomLeftRadius: isLeftPage ? props.borderRadius : '0',
        };

        return (
            <div className="page" ref={ref}>
                <div
                    className="page-content w-full h-full relative overflow-hidden"
                    style={pageStyle}
                >
                    {props.children}
                </div>
            </div>
        );
    }
);
Page.displayName = 'Page';

import { Maximize2, Minimize2 } from 'lucide-react';

export const DiaryBook = ({
    cover,
    backCover,
    pages,
    width = 2000,
    height = 3230,
    borderRadius = "0px",
    glossy = true,
    staticLeft,
    staticRight
}: DiaryBookProps) => {
    const bookRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => setIsPortrait(e.matches);
        handleResize(mediaQuery);
        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const onFlip = (e: any) => {
        setCurrentPage(e.data);
    };

    // Flatten pages: [Cover, P1F, P1B, P2F, P2B, ..., BackCover]
    const flatPages = useMemo(() => {
        const result: string[] = [];
        if (cover) result.push(cover);
        pages.forEach(p => {
            if (p.front) result.push(p.front);
            if (p.back) result.push(p.back);
        });
        if (backCover) result.push(backCover);
        return result;
    }, [cover, backCover, pages]);

    if (!isMounted) return <div className="animate-pulse bg-stone-100 rounded-lg w-full max-w-md aspect-[14/10]" />;

    const w = Number(width);
    const h = Number(height);
    const spreadRatio = (w * 2) / h;
    const singleRatio = w / h;

    // On Mobile (Portrait), the limiting factor is usually WIDTH, not height.
    // So we want to fill the Width (e.g. 95% or 100%).
    // On Desktop (Landscape), limiting factor is usually HEIGHT.

    // Zoom Logic:
    // Mobile: 100% Width (Zoomed) vs 90% Width (Normal)
    // Desktop: 95vh Height (Zoomed) vs 82vh Height (Normal)

    // Base height for the book relative to viewport
    // Zoomed: almost full height, Normal: comfortable reading height
    // We adjust this based on orientation to avoid the book becoming tiny on mobile
    const baseHeight = isZoomed ? '95vh' : '82vh';

    // Static Background Logic
    // Only active if defined in CMS. If empty, we don't show any background layer (transparency shows main bg).
    const hasStaticBackgrounds = Boolean(staticLeft || staticRight);

    // Visibility Logic
    // Left Background: Hidden on Start (Cover & First Page/BackOfCover) -> Indices 0 and 1
    const showLeftBg = currentPage > 1;

    // Right Background: Hidden on End (Back Cover & Inside Back Cover)
    // Last Page Index is flatPages.length - 1. 
    // If we are at the end, we are viewing spread [Length-2, Length-1]. 
    // We want to hide the Right background (behind the Back Cover) when it's the only thing left.
    const showRightBg = currentPage < flatPages.length - 2;

    const containerStyle = {
        height: baseHeight,
        width: `calc(${baseHeight} * ${spreadRatio})`,
        maxWidth: '95vw', // Never exceed screen width
        aspectRatio: `${spreadRatio}`,
        transform: currentPage === 0
            ? 'translateX(-25%)'
            : currentPage === flatPages.length - 1
                ? 'translateX(25%)'
                : 'translateX(0)',
        zIndex: isZoomed ? 100 : 1
    };

    return (
        <div className={`book-wrapper w-full h-full flex flex-col items-center justify-center overflow-hidden relative ${isPortrait ? '' : 'p-4'}`}>
            {/* Zoom Toggle Button */}
            <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="fixed bottom-24 right-8 z-[110] bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
                {isZoomed ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>

            {flatPages.length > 0 && (
                <div
                    className="transition-all duration-500 ease-out will-change-transform relative shadow-book-real"
                    style={containerStyle}
                >
                    {/* Static Background Layer - Only if CMS fields present */}
                    {hasStaticBackgrounds && (
                        <div className="absolute inset-0 w-full h-full flex z-0 pointer-events-none">
                            {/* Desktop: Spread Background */}
                            <>
                                {/* Left Side Background */}
                                <div
                                    className={`w-1/2 h-full relative overflow-hidden transition-opacity duration-300 ${!showLeftBg ? 'opacity-0' : 'opacity-100'}`}
                                    style={{ willChange: 'opacity' }}
                                >
                                    {staticLeft && (
                                        <img
                                            src={staticLeft}
                                            alt="Left Background"
                                            className="w-full h-full object-cover"
                                            decoding="async"
                                        />
                                    )}
                                </div>
                                {/* Right Side Background */}
                                <div
                                    className={`w-1/2 h-full relative overflow-hidden transition-opacity duration-300 ${!showRightBg ? 'opacity-0' : 'opacity-100'}`}
                                    style={{ willChange: 'opacity' }}
                                >
                                    {staticRight && (
                                        <img
                                            src={staticRight}
                                            alt="Right Background"
                                            className="w-full h-full object-cover"
                                            decoding="async"
                                        />
                                    )}
                                </div>
                            </>
                        </div>
                    )}

                    <HTMLFlipBook
                        key={`desktop-${isZoomed ? 'zoomed' : 'normal'}`}
                        width={w}
                        height={h}
                        size="stretch"
                        minWidth={100}
                        maxWidth={4000}
                        minHeight={100}
                        maxHeight={4000}
                        maxShadowOpacity={glossy ? 0.4 : 0.2}
                        showCover={true}
                        mobileScrollSupport={true}
                        className="diary-flipbook"
                        style={{ background: 'transparent', width: '100%', height: '100%' }}
                        startPage={currentPage}
                        drawShadow={true}
                        flippingTime={500}
                        usePortrait={false}
                        startZIndex={0}
                        autoSize={false}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={false}
                        onFlip={onFlip}
                        disableFlipByClick={false}
                        ref={bookRef}
                    >
                        {flatPages.map((url, index) => (
                            <Page key={index} index={index} borderRadius={borderRadius}>
                                <img
                                    src={url}
                                    alt={`Page ${index}`}
                                    className="w-full h-full object-cover select-none pointer-events-none"
                                    decoding="async"
                                    loading={index < 2 || index > flatPages.length - 3 ? "eager" : "lazy"}
                                />
                            </Page>
                        ))}
                    </HTMLFlipBook>
                </div>
            )
            }

            <style jsx global>{`
                .book-wrapper {
                    overflow: visible !important;
                }
                .shadow-book-real {
                    filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));
                    will-change: width, height, transform; 
                }
                .page {
                    background-color: transparent;
                    backface-visibility: hidden;
                    will-change: transform;
                }
                /* Glossy vs Matte Styles */
                .stf__outer-shadow {
                    background: ${glossy
                    ? 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.2))'
                    : 'rgba(0,0,0,0.05)'} !important;
                    opacity: ${glossy ? 0.3 : 0.1} !important;
                }
                .stf__inner-shadow {
                    background: ${glossy
                    ? 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)'
                    : 'transparent'} !important;
                    opacity: ${glossy ? 0.2 : 0} !important;
                }
                .page-content {
                    box-shadow: ${glossy
                    ? 'inset 0 0 20px rgba(0,0,0,0.03)'
                    : 'none'};
                }
                .stf__parent {
                    overflow: visible !important;
                }
            `}</style>
        </div >
    );
};
