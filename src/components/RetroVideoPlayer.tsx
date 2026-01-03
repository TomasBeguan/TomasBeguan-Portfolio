"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Rewind, FastForward, X, Minus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface RetroVideoPlayerProps {
    url: string;
    title?: string;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

export const RetroVideoPlayer = ({ url, title = "Movie Player" }: RetroVideoPlayerProps) => {
    const { language } = useLanguage();
    const reactId = React.useId().replace(/:/g, '');
    const playerRef = useRef<any>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    // Use a unique ID for each instance to avoid clashes, stabilized for SSR
    const uniqueId = useRef(`player-${reactId}`);

    // Extract YouTube ID - Improved version
    const getYoutubeId = (url: string) => {
        if (!url) return null;
        // If it's already an ID
        if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(url);

    useEffect(() => {
        if (!videoId || typeof window === 'undefined') return;

        let timeoutId: NodeJS.Timeout;
        let isDestroyed = false;

        const initPlayer = () => {
            if (isDestroyed || !window.YT || !window.YT.Player) return false;

            try {
                const el = document.getElementById(uniqueId.current);
                if (!el) return false;

                playerRef.current = new window.YT.Player(uniqueId.current, {
                    events: {
                        onReady: () => {
                            if (!isDestroyed) setIsPlayerReady(true);
                        },
                        onStateChange: (event: any) => {
                            if (!isDestroyed) setIsPaused(event.data !== 1);
                        },
                        onError: () => {
                            if (!isDestroyed) setIsPlayerReady(true);
                        }
                    }
                });
                return true;
            } catch (e) {
                return false;
            }
        };

        // API Script loading
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Attempt initialization
        const check = setInterval(() => {
            if (window.YT && window.YT.Player) {
                if (initPlayer()) clearInterval(check);
            }
        }, 500);

        timeoutId = setTimeout(() => {
            clearInterval(check);
            if (!isDestroyed) setIsPlayerReady(true);
        }, 4000);

        return () => {
            isDestroyed = true;
            clearInterval(check);
            clearTimeout(timeoutId);
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                try { playerRef.current.destroy(); } catch (e) { }
            }
        };
    }, [videoId]);

    if (!videoId) return null;

    const handlePlay = () => playerRef.current?.playVideo?.();
    const handlePause = () => playerRef.current?.pauseVideo?.();
    const handleStop = () => {
        playerRef.current?.stopVideo?.();
        playerRef.current?.seekTo?.(0);
    };
    const handleSeek = (seconds: number) => {
        if (playerRef.current?.getCurrentTime) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo?.(currentTime + seconds, true);
        }
    };

    // Construct robust embed URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=1&rel=0&origin=${origin}&widget_referrer=${origin}`;


    return (
        <div className="w-full bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro transition-colors duration-300 text-black dark:text-white">
            {/* Mac OS Title Bar */}
            <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-between relative z-30 h-8 transition-colors duration-300">
                {/* Left: Title */}
                <div className="flex-1 truncate">
                    <h2 className="text-[14px] font-chicago tracking-normal text-retro-text truncate">
                        {title || (language === 'es' ? 'Sin título' : 'Untitled')}
                    </h2>
                </div>

                {/* Right: Window Controls */}
                <div className="flex items-center gap-1.5 ml-4">
                    <div className="w-3.5 h-3.5 border border-black dark:border-white bg-white dark:bg-retro-dark-blue flex items-center justify-center">
                        <Minus size={10} strokeWidth={3} className="text-black dark:text-white" />
                    </div>
                    <div className="w-3.5 h-3.5 border border-black dark:border-white bg-white dark:bg-retro-dark-blue flex items-center justify-center">
                        <div className="w-1.5 h-1.5 border border-black dark:border-white"></div>
                    </div>
                    <div className="w-3.5 h-3.5 border border-black dark:border-white bg-white dark:bg-retro-dark-blue flex items-center justify-center">
                        <X size={10} strokeWidth={3} className="text-black dark:text-white" />
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className="relative w-full aspect-video bg-black border-b-2 border-black dark:border-white flex items-center justify-center overflow-hidden group">
                <iframe
                    id={uniqueId.current}
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full relative z-10"
                ></iframe>
            </div>

            {/* Mac OS Style Controls Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white dark:bg-retro-dark-blue transition-colors duration-300">
                <div className="flex items-center gap-1">
                    <MacButton onClick={handlePlay} active={!isPaused} icon={<Play size={12} fill="currentColor" />} />
                    <MacButton onClick={handlePause} active={isPaused} icon={<Pause size={12} fill="currentColor" />} />
                    <MacButton onClick={handleStop} icon={<Square size={12} fill="currentColor" />} />

                    <div className="w-[2px] h-6 bg-black dark:bg-white mx-1 opacity-20"></div>

                    <MacButton onClick={() => handleSeek(-10)} icon={<Rewind size={12} fill="currentColor" />} />
                    <MacButton onClick={() => handleSeek(10)} icon={<FastForward size={12} fill="currentColor" />} />
                </div>

                <div className="text-[12px] font-chicago opacity-50 hidden sm:block text-black dark:text-white">
                    QuickTime Player
                </div>
            </div>
        </div>
    );
};

const MacButton = ({ icon, onClick, active }: { icon: React.ReactNode, onClick?: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white transition-all transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
            active ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white dark:bg-retro-dark-blue text-black dark:text-white shadow-retro-sm"
        )}
    >
        {icon}
    </button>
);
