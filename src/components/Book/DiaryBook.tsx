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

    // Calculate dynamic aspect ratio class if it's a standard one or use style
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
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden perspective-[3500px]">
            {/* Book Container */}
            <div
                className="relative w-full max-w-[1000px] preserve-3d transition-all duration-[1.2s] cubic-bezier(0.645, 0.045, 0.355, 1)"
                style={{
                    ...getAspectRatioStyle(),
                    transform: currentIndex === 0
                        ? 'translateX(-25%)'
                        : currentIndex === bookLeaves.length
                            ? 'translateX(25%)'
                            : 'translateX(0)'
                }}
            >

                {/* Book Base (Static Back) */}
                <div className={`absolute inset-0 flex transition-all duration-700 ${currentIndex === 0 || currentIndex === bookLeaves.length ? '' : 'shadow-3xl'}`}>
                    <div
                        className={`flex-1 bg-[#fdfaf3] transition-all duration-700 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'} ${currentIndex === bookLeaves.length ? 'border border-black/10 shadow-2xl' : ''}`}
                        style={{ borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius }}
                    />
                    <div
                        className={`flex-1 bg-[#fdfaf3] transition-all duration-700 ${currentIndex === bookLeaves.length ? 'opacity-0' : 'opacity-100'} ${currentIndex === 0 ? 'border border-black/10 shadow-2xl' : ''}`}
                        style={{ borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius }}
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
                            className={`absolute top-0 right-0 w-1/2 h-full preserve-3d origin-left transition-all cursor-pointer select-none`}
                            style={{
                                zIndex: zIndex,
                                transform: isFlipped
                                    ? 'rotateY(-180deg) scale(1)'
                                    : 'rotateY(0deg) scale(1)',
                                transitionDuration: '1.2s',
                                transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                                visibility: (index >= currentIndex - 2 && index <= currentIndex + 1) ? 'visible' : 'hidden'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isFlipped) flipPrev(); else flipNext();
                            }}
                        >
                            {/* Front Side */}
                            <div
                                className={`absolute inset-0 border-l border-black/5 backface-hidden overflow-hidden flex flex-col items-center justify-between bg-[#fdfaf3] ${isFirstLeaf ? 'shadow-2xl' : ''}`}
                                style={{ borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius }}
                            >
                                <div className="flex-1 w-full h-full flex items-center justify-center relative">
                                    {leaf.front ? (
                                        <img
                                            src={leaf.front}
                                            alt={`Leaf ${index} front`}
                                            className="w-full h-full object-cover pointer-events-none filter drop-shadow-sm"
                                        />
                                    ) : null}

                                    {/* Page Number (Right side = Even numbers 2, 4...) */}
                                    {!isFirstLeaf && !isLastLeaf && (
                                        <div className="absolute bottom-2 right-2 font-chicago text-[10px] text-black/40 bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded-sm z-10 border border-black/5">
                                            {index * 2}
                                        </div>
                                    )}
                                </div>
                                {/* Visual indicator for cover */}
                                {isFirstLeaf && !isFlipped && (
                                    <div className="absolute top-4 right-4 font-chicago text-[10px] uppercase text-black/30 bg-white/20 backdrop-blur-md px-2 py-1 rounded-sm border border-black/5 z-10">
                                        Front Cover
                                    </div>
                                )}
                            </div>

                            {/* Back Side */}
                            <div
                                className={`absolute inset-0 border-r border-black/5 backface-hidden overflow-hidden flex flex-col items-center justify-between bg-[#fdfaf3] ${isLastLeaf ? 'shadow-2xl' : ''}`}
                                style={{
                                    transform: 'rotateY(180deg)',
                                    borderTopLeftRadius: borderRadius,
                                    borderBottomLeftRadius: borderRadius
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

                                    {/* Page Number (Left side = Odd numbers 1, 3, 5...) */}
                                    {!isLastLeaf && (
                                        <div className="absolute bottom-2 left-2 font-chicago text-[10px] text-black/40 bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded-sm z-10 border border-black/5">
                                            {index * 2 + 1}
                                        </div>
                                    )}
                                </div>

                                {/* Visual indicator for back cover */}
                                {isLastLeaf && isFlipped && (
                                    <div className="absolute top-4 left-4 font-chicago text-[10px] uppercase text-black/30 bg-white/20 backdrop-blur-md px-2 py-1 rounded-sm border border-black/5 z-10">
                                        Back Cover
                                    </div>
                                )}
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
