"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Lightweight flipbook (replaces the abandoned react-pageflip library).
 * - Desktop: two-page spreads with a CSS 3D page turn.
 * - Mobile: one page at a time, native swipe (scroll-snap).
 * - Only the pages around the current spread are loaded, resized by next/image.
 */

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

const FLIP_MS = 700;
const PRELOAD_SHEETS = 2; // sheets kept loaded on each side of the current spread

function PageImage({ src, alt, priority, sizes }: { src: string; alt: string; priority?: boolean; sizes: string }) {
    if (!src) return <div className="absolute inset-0 bg-white" />;
    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            draggable={false}
            unoptimized={src.startsWith("data:") || src.toLowerCase().endsWith(".gif")}
            className="object-cover select-none pointer-events-none"
        />
    );
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    return isMobile;
}

export const DiaryBook = ({
    cover,
    backCover,
    pages,
    width = 2000,
    height = 3230,
    borderRadius = "0px",
    glossy = true,
    staticLeft,
    staticRight,
}: DiaryBookProps) => {
    const isMobile = useIsMobile();

    // [Cover, P1F, P1B, ..., BackCover]
    const flatPages = useMemo(() => {
        const result: string[] = [];
        if (cover) result.push(cover);
        pages.forEach((p) => {
            if (p.front) result.push(p.front);
            if (p.back) result.push(p.back);
        });
        if (backCover) result.push(backCover);
        return result;
    }, [cover, backCover, pages]);

    const pageRatio = Number(width) / Number(height) || 2000 / 3230;

    if (flatPages.length === 0 || isMobile === null) {
        return <div className="animate-pulse bg-stone-100 w-full max-w-md" style={{ aspectRatio: `${pageRatio}` }} />;
    }

    return isMobile ? (
        <MobileBook flatPages={flatPages} pageRatio={pageRatio} borderRadius={borderRadius} />
    ) : (
        <DesktopBook
            flatPages={flatPages}
            pageRatio={pageRatio}
            borderRadius={borderRadius}
            glossy={glossy}
            staticLeft={staticLeft}
            staticRight={staticRight}
        />
    );
};

/* ------------------------------------------------------------------ */
/* Desktop: spreads with 3D page turn                                  */
/* ------------------------------------------------------------------ */

interface DesktopBookProps {
    flatPages: string[];
    pageRatio: number;
    borderRadius: string;
    glossy: boolean;
    staticLeft?: string;
    staticRight?: string;
}

function DesktopBook({ flatPages, pageRatio, borderRadius, glossy, staticLeft, staticRight }: DesktopBookProps) {
    // A "sheet" is a physical leaf: front = right-hand page, back = left-hand page once turned.
    const sheets = useMemo(() => {
        const list: { front: string; back: string }[] = [];
        for (let i = 0; i < flatPages.length; i += 2) {
            list.push({ front: flatPages[i], back: flatPages[i + 1] ?? "" });
        }
        return list;
    }, [flatPages]);

    const total = sheets.length;
    const [flipped, setFlipped] = useState(0); // number of sheets turned to the left
    const [animating, setAnimating] = useState<Record<number, "fwd" | "back">>({});
    const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    const markAnimating = (index: number, dir: "fwd" | "back") => {
        setAnimating((a) => ({ ...a, [index]: dir }));
        clearTimeout(timers.current[index]);
        timers.current[index] = setTimeout(() => {
            setAnimating((a) => {
                const copy = { ...a };
                delete copy[index];
                return copy;
            });
        }, FLIP_MS + 50);
    };

    useEffect(() => {
        const t = timers.current;
        return () => Object.values(t).forEach(clearTimeout);
    }, []);

    const flippedRef = useRef(0);

    const next = useCallback(() => {
        const f = flippedRef.current;
        if (f >= total) return;
        flippedRef.current = f + 1;
        markAnimating(f, "fwd");
        setFlipped(f + 1);
    }, [total]);

    const prev = useCallback(() => {
        const f = flippedRef.current;
        if (f <= 0) return;
        flippedRef.current = f - 1;
        markAnimating(f - 1, "back");
        setFlipped(f - 1);
    }, []);

    // Keyboard arrows
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev]);

    // Click on a half / drag to turn
    const pointer = useRef<{ x: number; y: number } | null>(null);
    const bookRef = useRef<HTMLDivElement>(null);
    const onPointerDown = (e: React.PointerEvent) => {
        pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: React.PointerEvent) => {
        const start = pointer.current;
        pointer.current = null;
        if (!start || !bookRef.current) return;
        const dx = e.clientX - start.x;
        if (Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
            return;
        }
        const rect = bookRef.current.getBoundingClientRect();
        if (e.clientX - rect.left > rect.width / 2) next();
        else prev();
    };

    const isClosedFront = flipped === 0;
    const isClosedBack = flipped === total;
    const shift = isClosedFront ? "-25%" : isClosedBack ? "25%" : "0%";
    const spreadRatio = pageRatio * 2;

    // Static backgrounds = the page stacks seen under the turning sheets
    const showLeftBg = flipped >= 2 || (flipped === 1 && animating[1] === "back");
    const showRightBg = flipped <= total - 2 || (flipped === total - 1 && animating[total - 2] === "fwd");

    const pageSizes = "(max-width: 1400px) 45vw, 700px";
    const faceRadius = (side: "left" | "right"): React.CSSProperties =>
        side === "right"
            ? { borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius }
            : { borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center select-none">
            <div
                className="relative"
                style={{
                    width: `min(92vw, calc(74vh * ${spreadRatio}))`,
                    aspectRatio: `${spreadRatio}`,
                    transform: `translateX(${shift})`,
                    transition: `transform ${FLIP_MS}ms ease-in-out`,
                }}
            >
                <div
                    ref={bookRef}
                    className="absolute inset-0 cursor-pointer"
                    style={{ perspective: "2500px", filter: "drop-shadow(0 25px 40px rgba(0,0,0,0.3))", touchAction: "pan-y" }}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    role="region"
                    aria-label="Diario"
                >
                    {/* Static page stacks */}
                    {staticLeft && (
                        <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden" style={{ ...faceRadius("left"), visibility: showLeftBg ? "visible" : "hidden" }}>
                            <PageImage src={staticLeft} alt="" sizes={pageSizes} />
                        </div>
                    )}
                    {staticRight && (
                        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden" style={{ ...faceRadius("right"), visibility: showRightBg ? "visible" : "hidden" }}>
                            <PageImage src={staticRight} alt="" sizes={pageSizes} />
                        </div>
                    )}

                    {sheets.map((sheet, i) => {
                        const isFlipped = i < flipped;
                        const anim = animating[i];
                        const near = i >= flipped - PRELOAD_SHEETS - 1 && i <= flipped + PRELOAD_SHEETS;
                        // Hide sheets buried deep in either stack (they're covered anyway)
                        if (!near && !anim) return null;

                        const zIndex = anim
                            ? 1000 + (anim === "fwd" ? i : total - i)
                            : isFlipped
                                ? i + 1
                                : total - i + 1;

                        return (
                            <div
                                key={i}
                                className="absolute top-0 right-0 w-1/2 h-full"
                                style={{
                                    transformOrigin: "left center",
                                    transformStyle: "preserve-3d",
                                    transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
                                    transition: `transform ${FLIP_MS}ms cubic-bezier(0.45, 0.05, 0.35, 1)`,
                                    zIndex,
                                }}
                            >
                                {/* Front (right-hand page) */}
                                <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", ...faceRadius("right") }}>
                                    <PageImage src={sheet.front} alt={`Página ${i * 2 + 1}`} sizes={pageSizes} priority={i === 0} />
                                    {glossy && <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/15 via-transparent to-transparent" style={{ width: "12%" }} />}
                                </div>
                                {/* Back (left-hand page once turned) */}
                                <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", ...faceRadius("left") }}>
                                    <PageImage src={sheet.back} alt={`Página ${i * 2 + 2}`} sizes={pageSizes} />
                                    {glossy && <div className="absolute inset-y-0 right-0 pointer-events-none bg-gradient-to-l from-black/15 to-transparent" style={{ width: "12%" }} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <BookNav
                onPrev={prev}
                onNext={next}
                canPrev={flipped > 0}
                canNext={flipped < total}
                label={isClosedFront || isClosedBack ? "" : `${flipped * 2 - 1}–${flipped * 2} / ${flatPages.length - 2}`}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Mobile: one page per screen, native swipe                           */
/* ------------------------------------------------------------------ */

function MobileBook({ flatPages, pageRatio, borderRadius }: { flatPages: string[]; pageRatio: number; borderRadius: string }) {
    const scroller = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    const onScroll = () => {
        const el = scroller.current;
        if (!el) return;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        if (i !== index) setIndex(i);
    };

    const goTo = (i: number) => {
        const el = scroller.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(flatPages.length - 1, i));
        el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div
                className="relative"
                style={{ width: `min(88vw, calc(68vh * ${pageRatio}))`, aspectRatio: `${pageRatio}`, filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.25))" }}
            >
                <div
                    ref={scroller}
                    onScroll={onScroll}
                    className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", borderRadius }}
                >
                    {flatPages.map((src, i) => (
                        <div key={i} className="relative shrink-0 w-full h-full snap-center">
                            {Math.abs(i - index) <= 2 && (
                                <PageImage src={src} alt={`Página ${i + 1}`} sizes="88vw" priority={i === 0} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <BookNav
                onPrev={() => goTo(index - 1)}
                onNext={() => goTo(index + 1)}
                canPrev={index > 0}
                canNext={index < flatPages.length - 1}
                label={`${index + 1} / ${flatPages.length}`}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */

function BookNav({ onPrev, onNext, canPrev, canNext, label }: { onPrev: () => void; onNext: () => void; canPrev: boolean; canNext: boolean; label: string }) {
    const btn =
        "flex items-center justify-center w-12 h-12 border-2 border-black bg-white hover:shadow-retro transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:hover:shadow-none";
    return (
        <div className="flex items-center gap-4 mt-6 z-20">
            <button onClick={onPrev} disabled={!canPrev} className={btn} aria-label="Página anterior">
                <ChevronLeft size={24} />
            </button>
            <span className="font-chicago text-[10px] w-20 text-center opacity-60 tabular-nums">{label}</span>
            <button onClick={onNext} disabled={!canNext} className={btn} aria-label="Página siguiente">
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
