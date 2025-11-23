"use client";

import { useState } from "react";
import { Block } from "@/types";
import { RetroButton } from "./RetroButton";
import { cn } from "@/lib/utils";
import { ImageModal } from "./ImageModal";


interface BlockRendererProps {
    blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt?: string } | null>(null);

    const parseRichText = (text: string, linkColor?: string) => {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:opacity-80"
                    style={{ color: linkColor || '#7c3aed' }}
                >
                    {match[1]}
                </a>
            );
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts.length > 0 ? parts : text;
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {blocks.map((block) => {
                    switch (block.type) {
                        case 'header':
                            return (
                                <h1 key={block.id} className="text-3xl md:text-4xl font-bold border-b-2 border-black pb-2 font-space-grotesk tracking-tight">
                                    {parseRichText(block.content, block.linkColor)}
                                </h1>
                            );
                        case 'subtitle':
                            return (
                                <h2 key={block.id} className="text-xl md:text-2xl font-bold mt-4 font-space-grotesk text-center">
                                    {parseRichText(block.content, block.linkColor)}
                                </h2>
                            );
                        case 'text':
                            return (
                                <p key={block.id} className="text-lg leading-tight whitespace-pre-wrap font-inter">
                                    {parseRichText(block.content, block.linkColor)}
                                </p>
                            );
                        case 'image':
                            return (
                                <div key={block.id} className="w-full border-2 border-black p-1 bg-white shadow-retro-sm cursor-zoom-in" onClick={() => setSelectedImage({ url: block.content, alt: block.altText })}>
                                    <img src={block.content} alt={block.altText || "Project Image"} className="w-full h-auto pixelated" />
                                </div>
                            );
                        case 'video':
                            // Extract YouTube ID
                            const getYoutubeId = (url: string) => {
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                return (match && match[2].length === 11) ? match[2] : null;
                            };
                            const videoId = getYoutubeId(block.content);
                            return videoId ? (
                                <div key={block.id} className="w-full aspect-video border-2 border-black p-1 bg-white shadow-retro-sm">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : null;
                        case 'grid':
                            const items = block.items || [];
                            const cols = items.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
                            return (
                                <div key={block.id} className={cn("grid gap-4", cols)}>
                                    {items.map((src, idx) => (
                                        <div key={idx} className="border-2 border-black p-1 bg-white hover:shadow-retro-sm transition-shadow cursor-zoom-in" onClick={() => setSelectedImage({ url: src, alt: block.itemAlts?.[idx] })}>
                                            <img src={src} alt={block.itemAlts?.[idx] || `Grid item ${idx}`} className="w-full h-auto pixelated" />
                                        </div>
                                    ))}
                                </div>
                            );
                        case 'link':
                            return (
                                <div key={block.id} className="flex justify-center my-4">
                                    <a
                                        href={block.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "px-4 py-1 border-2 border-black bg-white shadow-retro hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-black active:text-white font-bold flex items-center gap-2",
                                        )}
                                        style={{
                                            backgroundColor: block.bgColor,
                                            color: block.textColor,
                                            borderColor: block.borderColor
                                        }}
                                    >
                                        {block.iconUrl && (
                                            <img src={block.iconUrl} alt="icon" className="w-4 h-4" />
                                        )}
                                        {block.linkText || block.content}
                                    </a>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div >

            <ImageModal
                isOpen={!!selectedImage}
                imageUrl={selectedImage?.url || ""}
                altText={selectedImage?.alt}
                onClose={() => setSelectedImage(null)}
            />
        </>
    );
}
