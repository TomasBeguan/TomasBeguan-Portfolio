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
    aspectRatio?: string;
    borderRadius?: string;
    glossy?: boolean;
}

// Separate component for each page to satisfy react-pageflip requirements
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, index: number, borderRadius?: string }>(
    (props, ref) => {
        const isLeftPage = props.index % 2 !== 0; // In standard book, odd index (0-indexed) is Left

        const pageStyle: React.CSSProperties = {
            borderTopRightRadius: isLeftPage ? '0' : props.borderRadius,
            borderBottomRightRadius: isLeftPage ? '0' : props.borderRadius,
            borderTopLeftRadius: isLeftPage ? props.borderRadius : '0',
            borderBottomLeftRadius: isLeftPage ? props.borderRadius : '0',
        };

        return (
            <div className="page" ref={ref}>
                <div
                    className="page-content w-full h-full bg-[#fdfaf3] relative border border-black/10 overflow-hidden"
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
    aspectRatio = "14/10",
    borderRadius = "4px",
    glossy = true
}: DiaryBookProps) => {
    const bookRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 450, height: 630 });
    const [isMounted, setIsMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setIsMounted(true);
        const updateSize = async () => {
            const container = document.querySelector('.book-wrapper');
            if (container) {
                const rect = container.getBoundingClientRect();
                const availableHeight = rect.height;
                const availableWidth = rect.width;

                // Parse Aspect Ratio
                let singlePageRatio = 0.714; // Default 10/14
                if (aspectRatio === 'cover' && cover) {
                    await new Promise((resolve) => {
                        const img = new Image();
                        img.src = cover;
                        img.onload = () => {
                            singlePageRatio = img.naturalWidth / img.naturalHeight;
                            resolve(null);
                        };
                        img.onerror = () => resolve(null);
                    });
                } else if (aspectRatio.includes('/')) {
                    const [w, h] = aspectRatio.split('/');
                    // aspectRatio is for TWO pages spread. One page is (W/2) / H
                    singlePageRatio = (parseFloat(w) / 2) / parseFloat(h);
                } else if (!isNaN(parseFloat(aspectRatio))) {
                    singlePageRatio = parseFloat(aspectRatio) / 2;
                }

                // Size calculation
                let h = availableHeight * 0.9;
                let w = h * singlePageRatio;

                if (w * 2 > availableWidth * 0.95) {
                    w = (availableWidth * 0.95) / 2;
                    h = w / singlePageRatio;
                }

                setDimensions({ width: Math.floor(w), height: Math.floor(h) });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [aspectRatio, cover]);

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

    if (!isMounted) return <div className="animate-pulse bg-stone-100 rounded-lg w-[450px] h-[630px]" />;

    return (
        <div className="book-wrapper w-full h-full flex flex-col items-center justify-center overflow-visible">
            {flatPages.length > 0 && (
                <div
                    className="transition-transform duration-[800ms] ease-in-out will-change-transform"
                    style={{
                        transform: currentPage === 0
                            ? `translateX(${-dimensions.width / 2}px)`
                            : currentPage === flatPages.length - 1
                                ? `translateX(${dimensions.width / 2}px)`
                                : 'translateX(0)'
                    }}
                >
                    <HTMLFlipBook
                        width={dimensions.width}
                        height={dimensions.height}
                        size="fixed"
                        minWidth={100}
                        maxWidth={2000}
                        minHeight={100}
                        maxHeight={2000}
                        maxShadowOpacity={glossy ? 0.4 : 0.2}
                        showCover={true}
                        mobileScrollSupport={true}
                        className="diary-flipbook shadow-book-real"
                        style={{ background: 'transparent' }}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={1000}
                        usePortrait={false}
                        startZIndex={0}
                        autoSize={true}
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
                }
                .page {
                    background-color: #fdfaf3;
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
        </div>
    );
};
