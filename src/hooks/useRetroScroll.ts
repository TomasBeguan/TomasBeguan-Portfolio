"use client";

import { RefObject, useEffect, useRef } from "react";

/**
 * Shared scroll behaviour for RetroWindow and RetroContainer (it used to be duplicated in both):
 * - On desktop, wheel events outside the window smoothly scroll the window's content (lerp).
 * - Remembers the scroll position per page in sessionStorage and restores it on return.
 */
export function useRetroScroll(scrollRef: RefObject<HTMLDivElement | null>) {
    const targetScroll = useRef(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollKey = `scroll-${window.location.pathname}`;
        const isMobile = () => window.innerWidth < 768;
        const getScrollPos = () => (isMobile() ? window.scrollY : container.scrollTop);

        // Write to sessionStorage at most once per frame instead of on every scroll event
        let saveQueued = false;
        const savePosition = () => {
            if (saveQueued) return;
            saveQueued = true;
            requestAnimationFrame(() => {
                saveQueued = false;
                try {
                    sessionStorage.setItem(scrollKey, getScrollPos().toString());
                } catch { /* storage unavailable */ }
            });
        };

        // Restore position on mount
        let restoreTimer: ReturnType<typeof setTimeout> | undefined;
        let savedScroll: string | null = null;
        try { savedScroll = sessionStorage.getItem(scrollKey); } catch { /* storage unavailable */ }
        if (savedScroll) {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }
            const pos = parseInt(savedScroll, 10);
            restoreTimer = setTimeout(() => {
                if (isMobile()) {
                    window.scrollTo(0, pos);
                } else {
                    container.scrollTop = pos;
                    targetScroll.current = pos;
                }
            }, 150); // Give content (especially 3D) time to lay out
        }

        let frame = 0;
        const updateScroll = () => {
            const currentScroll = container.scrollTop;
            const diff = targetScroll.current - currentScroll;

            if (Math.abs(diff) < 0.5) {
                isAnimating.current = false;
                targetScroll.current = currentScroll;
                savePosition();
                return;
            }

            container.scrollTop = currentScroll + diff * 0.1;
            frame = requestAnimationFrame(updateScroll);
        };

        const handleGlobalWheel = (e: WheelEvent) => {
            if (isMobile()) return;

            if (container.contains(e.target as Node)) {
                targetScroll.current = container.scrollTop;
                return;
            }

            const maxScroll = container.scrollHeight - container.clientHeight;
            targetScroll.current = Math.max(0, Math.min(targetScroll.current + e.deltaY, maxScroll));
            if (!isAnimating.current) {
                isAnimating.current = true;
                frame = requestAnimationFrame(updateScroll);
            }
        };

        const handleScroll = () => {
            if (!isAnimating.current) {
                targetScroll.current = getScrollPos();
            }
            savePosition();
        };

        // passive: true — we never call preventDefault, so the browser can scroll without waiting on JS
        window.addEventListener("wheel", handleGlobalWheel, { passive: true });
        container.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            clearTimeout(restoreTimer);
            cancelAnimationFrame(frame);
            isAnimating.current = false;
            window.removeEventListener("wheel", handleGlobalWheel);
            container.removeEventListener("scroll", handleScroll);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollRef]);
}
