"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const initialPage = useRef(0);
    const [isPortrait, setIsPortrait] = useState(false);
    const [forceShowLeft, setForceShowLeft] = useState(false);
    const [forceHideRight, setForceHideRight] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => setIsPortrait(e.matches);
        handleResize(mediaQuery);
        mediaQuery.addEventListener('change', handleResize);

        // Small delay to ensure the book is initialized before any potential interaction
        const timer = setTimeout(() => {
            if (bookRef.current) {
                // This can help "kickstart" the library's internal centering logic
                bookRef.current.pageFlip().update();
            }
        }, 300);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const onFlip = (e: any) => {
        setCurrentPage(e.data);
        // Clear force states after flip completes
        setForceShowLeft(false);
        setForceHideRight(false);
    };

    const handlePrev = (e?: React.TouchEvent | React.MouseEvent) => {
        if (e) {
            if ('preventDefault' in e) e.preventDefault();
        }
        if (!bookRef.current) return;
        const flip = bookRef.current.pageFlip();
        const dest = flip.getCurrentPageIndex() - 2;
        if (dest <= 1) setForceShowLeft(false);
        flip.flipPrev();
    };

    const handleNext = (e?: React.TouchEvent | React.MouseEvent) => {
        if (e) {
            if ('preventDefault' in e) e.preventDefault();
        }
        if (!bookRef.current) return;
        const flip = bookRef.current.pageFlip();
        const dest = flip.getCurrentPageIndex() + 2;
        if (dest >= 3) setForceShowLeft(true);
        if (dest >= flatPages.length - 3) setForceHideRight(true);
        flip.flipNext();
    };

    const onStateChange = (e: any) => {
        // We handle background visibility logic primarily in onFlip now
        // to avoid calling non-existent API methods like getDestPageIndex.
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

    const bookPages = useMemo(() => {
        return flatPages.map((url, index) => (
            <Page key={index} index={index} borderRadius={borderRadius}>
                <img
                    src={url}
                    alt={`Page ${index}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    decoding="async"
                    loading={index < 2 || index > flatPages.length - 3 ? "eager" : "lazy"}
                />
            </Page>
        ));
    }, [flatPages, borderRadius]);

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
        zIndex: 1,
        transition: 'transform 0.5s ease-out, width 0.5s ease-out, height 0.5s ease-out'
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
                        style={{
                            background: 'transparent',
                            width: '100%',
                            height: '100%'
                        }}
                        startPage={initialPage.current}
                        drawShadow={glossy}
                        flippingTime={600}
                        usePortrait={false}
                        startZIndex={0}
                        autoSize={false}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={15}
                        showPageCorners={false}
                        onFlip={onFlip}
                        onChangeState={onStateChange}
                        disableFlipByClick={false}
                        ref={bookRef}
                    >
                        {bookPages}
                    </HTMLFlipBook>

                    {/* Native drag should work now without hit areas blocking the surface */}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6 z-20">
                <button
                    onClick={handlePrev}
                    className="group flex items-center justify-center w-12 h-12 border-2 border-black dark:border-white bg-white dark:bg-retro-dark-blue hover:shadow-retro dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    aria-label="Previous Page"
                >
                    <ChevronLeft className="text-black dark:text-white" size={24} />
                </button>
                <button
                    onClick={handleNext}
                    className="group flex items-center justify-center w-12 h-12 border-2 border-black dark:border-white bg-white dark:bg-retro-dark-blue hover:shadow-retro dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    aria-label="Next Page"
                >
                    <ChevronRight className="text-black dark:text-white" size={24} />
                </button>
            </div>


            <style jsx global>{`
                .book-wrapper {
                    overflow: visible !important;
                    touch-action: pan-y; /* Allow vertical scroll but let book handle horizontal touch */
                    -webkit-overflow-scrolling: touch;
                }
                .diary-flipbook {
                    /* Ensure the flipbook itself doesn't block vertical scrolling on the page */
                    touch-action: pan-y;
                }
                .shadow-book-real {
                    filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));
                    will-change: width, height, transform;
                }
                .page {
                    background-color: transparent;
                    backface-visibility: hidden;
                    will-change: transform;
                    user-select: none;
                    -webkit-user-drag: none;
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
                    user-select: none;
                }
                .stf__parent {
                    overflow: visible !important;
                    touch-action: pan-y;
                }
            `}</style>
        </div>
    );
};
