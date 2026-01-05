"use client";

import React, { useState, useMemo, useEffect } from 'react';

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
}

export const DiaryBook = ({
    cover,
    backCover,
    pages,
    aspectRatio = "14/10",
    borderRadius = "2px"
}: DiaryBookProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [computedRatio, setComputedRatio] = useState<string>('14/10');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (aspectRatio === 'cover' && cover) {
            const img = new Image();
            img.src = cover;
            img.onload = () => {
                // A book is two pages wide. So ratio = (width * 2) / height
                const r = (img.naturalWidth * 2) / img.naturalHeight;
                setComputedRatio(r.toString());
            };
        } else {
            setComputedRatio(aspectRatio);
        }
    }, [cover, aspectRatio]);

    // Combine cover, inner pages, and back cover into a unified page list
    // Each entry represents a PHYSICAL leaf with a front and back.
    // Mapping: CMS Front = Left Page (Odd), CMS Back = Right Page (Even)
    const bookLeaves = useMemo(() => {
        const leaves: PageData[] = [];

        // 1. Cover Leaf: Front is Cover, Back is the first Page's Front (Page 1 - Left)
        leaves.push({
            front: cover,
            back: pages.length > 0 ? pages[0].front : ''
        });

        // 2. Middle Leaves: Front is previous Page's Back (Right), Back is current Page's Front (Left)
        for (let i = 1; i < pages.length; i++) {
            leaves.push({
                front: pages[i - 1].back,
                back: pages[i].front
            });
        }

        // 3. Final Leaf: Front is the last Page's Back (Right), Back is the Back Cover
        leaves.push({
            front: pages.length > 0 ? pages[pages.length - 1].back : '',
            back: backCover
        });

        return leaves;
    }, [cover, backCover, pages]);

    const flipNext = () => {
        if (currentIndex < bookLeaves.length) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const flipPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handlePageClick = (isFlipped: boolean) => {
        if (!isZoomed) {
            if (isFlipped) flipPrev(); else flipNext();
        }
    };

    const handlePageDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isZoomed) {
            setIsZoomed(false);
            setPanOffset({ x: 0, y: 0 });
        } else {
            const rect = e.currentTarget.closest('.book-container')?.getBoundingClientRect();
            if (rect) {
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomOrigin({ x, y });
                setIsZoomed(true);
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isZoomed) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isZoomed && isDragging) {
            setPanOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Calculate corrected border radius for circular corners if percentage is used
    const correctedRadius = useMemo(() => {
        if (!borderRadius || !borderRadius.includes('%') || borderRadius.includes('/') || borderRadius.includes(' ')) return borderRadius;

        const percent = parseFloat(borderRadius);
        if (isNaN(percent)) return borderRadius;

        const ratioValue = (() => {
            if (computedRatio.includes('/')) {
                const [w, h] = computedRatio.split('/');
                return parseFloat(w) / parseFloat(h);
            }
            return parseFloat(computedRatio) || 1.4;
        })();

        // For a single page (w-1/2), the aspect ratio is ratioValue / 2
        const pageAspectRatio = ratioValue / 2;
        // Vertical radius = Horizontal radius * (Width / Height)
        const verticalPercent = percent * pageAspectRatio;
        // Use space for individual corner properties, not slash
        return `${borderRadius} ${verticalPercent}%`;
    }, [borderRadius, computedRatio]);

    const getAspectRatioStyle = () => {
        if (computedRatio.includes('/')) {
            const [w, h] = computedRatio.split('/');
            return { aspectRatio: `${w} / ${h}` };
        }
        // If it's a decimal ratio
        if (!isNaN(parseFloat(computedRatio))) {
            return { aspectRatio: computedRatio };
        }
        return { aspectRatio: '14/10' };
    };

    return (
        <div
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden perspective-[3500px]"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Book Container */}
            <div
                className={`book-container relative w-full max-w-[1000px] preserve-3d transition-all duration-[1.2s] cubic-bezier(0.645, 0.045, 0.355, 1) ${isZoomed ? 'z-50' : 'z-10'} ${isDragging ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : ''}`}
                onMouseDown={handleMouseDown}
                style={{
                    ...getAspectRatioStyle(),
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: `
                        ${currentIndex === 0 ? 'translateX(-25%)' : currentIndex === bookLeaves.length ? 'translateX(25%)' : 'translateX(0)'}
                        ${isZoomed ? `scale(2.5) translate(${panOffset.x / 2.5}px, ${panOffset.y / 2.5}px)` : 'scale(1)'}
                    `,
                    transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)'
                }}
            >

                {/* Book Base (Static Back) */}
                <div className={`absolute inset-0 flex transition-all duration-700 ${currentIndex === 0 || currentIndex === bookLeaves.length ? '' : 'shadow-3xl'}`}>
                    <div
                        className={`flex-1 bg-[#fdfaf3] transition-all duration-700 border border-black/30 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                        style={{ borderTopLeftRadius: correctedRadius, borderBottomLeftRadius: correctedRadius, transform: 'translateZ(0)' }}
                    />
                    <div
                        className={`flex-1 bg-[#fdfaf3] transition-all duration-700 border border-black/30 ${currentIndex === bookLeaves.length ? 'opacity-0' : 'opacity-100'}`}
                        style={{ borderTopRightRadius: correctedRadius, borderBottomRightRadius: correctedRadius, transform: 'translateZ(0)' }}
                    />
                </div>

                {/* Decorative Spine Shadow (Much subtler) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[40px] bg-gradient-to-r from-transparent via-black/5 to-transparent z-40 -translate-x-1/2 pointer-events-none" />

                {/* Pages */}
                {bookLeaves.map((leaf, index) => {
                    const isFlipped = index < currentIndex;
                    const zIndex = isFlipped ? index + 1 : bookLeaves.length - index;

                    // Is this leaf a cover leaf?
                    const isFirstLeaf = index === 0;
                    const isLastLeaf = index === bookLeaves.length - 1;

                    return (
                        <div
                            key={index}
                            className={`absolute top-0 right-0 w-1/2 h-full preserve-3d origin-left transition-all select-none`}
                            style={{
                                zIndex: zIndex,
                                transform: isFlipped
                                    ? 'rotateY(-180deg) scale(1)'
                                    : 'rotateY(0deg) scale(1)',
                                transitionDuration: '1.2s',
                                transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                                visibility: (index >= currentIndex - 2 && index <= currentIndex + 1) ? 'visible' : 'hidden',
                                cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePageClick(isFlipped);
                            }}
                            onDoubleClick={handlePageDoubleClick}
                        >
                            {/* Front Side */}
                            <div
                                className={`absolute inset-0 border border-black/30 backface-hidden overflow-hidden flex flex-col items-center justify-between bg-[#fdfaf3] ${isFirstLeaf ? 'shadow-2xl' : ''}`}
                                style={{ borderTopRightRadius: correctedRadius, borderBottomRightRadius: correctedRadius, transform: 'translateZ(0)' }}
                            >
                                <div className="flex-1 w-full h-full flex items-center justify-center relative">
                                    {leaf.front ? (
                                        <img
                                            src={leaf.front}
                                            alt={`Leaf ${index} front`}
                                            className="w-full h-full object-cover pointer-events-none filter drop-shadow-sm"
                                        />
                                    ) : null}

                                </div>
                            </div>

                            {/* Back Side */}
                            <div
                                className={`absolute inset-0 border border-black/30 backface-hidden overflow-hidden flex flex-col items-center justify-between bg-[#fdfaf3] ${isLastLeaf ? 'shadow-2xl' : ''}`}
                                style={{
                                    transform: 'rotateY(180deg) translateZ(0)',
                                    borderTopLeftRadius: correctedRadius,
                                    borderBottomLeftRadius: correctedRadius
                                }}
                            >
                                <div className="flex-1 w-full h-full flex items-center justify-center relative">
                                    {leaf.back ? (
                                        <img
                                            src={leaf.back}
                                            alt={`Leaf ${index} back`}
                                            className="w-full h-full object-cover pointer-events-none filter drop-shadow-sm"
                                        />
                                    ) : null}

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
        </div>
    );
};
