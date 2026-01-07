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
    const [isPortrait, setIsPortrait] = useState(false);
    const [forceShowLeft, setForceShowLeft] = useState(false);
    const [forceHideRight, setForceHideRight] = useState(false);

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
        setForceShowLeft(false);
        setForceHideRight(false);
    };

    const onStateChange = (e: any) => {
        if (e.data === 'flipping') {
            const flip = bookRef.current?.pageFlip();
            if (flip) {
                const dest = flip.getDestPageIndex();
                // If moving towards page 3 or further, show left bg early
                if (dest >= 3) setForceShowLeft(true);
                // If moving towards cover, ensure left bg is hidden
                if (dest <= 1) setForceShowLeft(false);

                // Symmetrical logic for the back cover: Hide right bg when reaching the last spread
                if (dest >= flatPages.length - 3) {
                    setForceHideRight(true);
                } else {
                    setForceHideRight(false);
                }
            }
        }
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

    const baseHeight = '82vh';
    const hasStaticBackgrounds = Boolean(staticLeft || staticRight);

    // Left Background Logic:
    // Visible if we are ALREADY on spread 2+ (index 3)
    // OR if we are on spread 1 (index 1) and currently flipping forward
    const showLeftBg = (currentPage >= 3) || (currentPage === 1 && forceShowLeft);

    // Right Background Logic:
    // Visible if we are NOT on the last spreads (last page and back cover)
    // AND we are not currently flipping to close the book
    const showRightBg = (currentPage < flatPages.length - 3) && !forceHideRight;

    const containerStyle: React.CSSProperties = {
        width: isPortrait
            ? '94vw'
            : `calc(${baseHeight} * ${spreadRatio})`,
        maxWidth: isPortrait ? 'none' : `calc(${baseHeight} * ${spreadRatio})`,
        aspectRatio: `${spreadRatio}`,
        height: 'auto',
        maxHeight: baseHeight,
        transform: currentPage === 0
            ? 'translateX(-25%)'
            : currentPage === flatPages.length - 1
                ? 'translateX(25%)'
                : 'translateX(0)',
        zIndex: 1
    };

    return (
        <div className={`book-wrapper w-full h-full flex flex-col items-center justify-center overflow-hidden relative ${isPortrait ? '' : 'p-4'}`}>
            {flatPages.length > 0 && (
                <div
                    className="transition-all duration-500 ease-out will-change-transform relative shadow-book-real"
                    style={containerStyle}
                >
                    {hasStaticBackgrounds && (
                        <div className="absolute inset-0 w-full h-full flex z-0 pointer-events-none">
                            <div
                                className={`w-1/2 h-full relative overflow-hidden transition-opacity duration-0 ${!showLeftBg ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                                style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
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
                            <div
                                className={`w-1/2 h-full relative overflow-hidden transition-opacity duration-0 ${!showRightBg ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                                style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
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
                        </div>
                    )}

                    <HTMLFlipBook
                        width={w}
                        height={h}
                        size="stretch"
                        minWidth={100}
                        maxWidth={4000}
                        minHeight={100}
                        maxHeight={4000}
                        maxShadowOpacity={glossy ? 0.4 : 0}
                        showCover={true}
                        mobileScrollSupport={true}
                        className="diary-flipbook"
                        style={{ background: 'transparent', width: '100%', height: '100%' }}
                        startPage={currentPage}
                        drawShadow={glossy}
                        flippingTime={500}
                        usePortrait={false}
                        startZIndex={0}
                        autoSize={false}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={false}
                        onFlip={onFlip}
                        onChangeState={onStateChange}
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
            )}

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
                .stf__outer-shadow {
                    display: ${glossy ? 'block' : 'none'} !important;
                }
                .stf__inner-shadow {
                    display: ${glossy ? 'block' : 'none'} !important;
                }
                .page-content {
                    background-color: transparent;
                    box-shadow: ${glossy
                    ? 'inset 0 0 20px rgba(0,0,0,0.03)'
                    : 'none'};
                }
                .stf__parent {
                    overflow: visible !important;
                }
            `}</style>
        </div>
    );
};
