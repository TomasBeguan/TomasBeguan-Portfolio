"use client";

import { useState } from "react";
import { Block } from "@/types";
import { RetroButton } from "./RetroButton";
import { cn } from "@/lib/utils";
import { ImageModal } from "./ImageModal";
import { ImageWithLoader } from "./ImageWithLoader";
import { Model3DViewer } from "./Model3DViewer";


interface BlockRendererProps {
    blocks: Block[];
    textColor?: string;
}

export function BlockRenderer({ blocks, textColor }: BlockRendererProps) {
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
            <div className="flex flex-col gap-6" style={{ color: textColor }}>
                {blocks.map((block) => {
                    switch (block.type) {
                        case 'header':
                            return (
                                <h1 key={block.id} className="text-3xl md:text-4xl font-bold border-b-2 border-black pb-2 font-space-grotesk tracking-tight" style={{ borderColor: textColor }}>
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
                            // Auto-detect if user accidentally used an Image block for a 3D model
                            if (block.content.toLowerCase().endsWith('.glb') || block.content.toLowerCase().endsWith('.gltf')) {
                                return (
                                    <Model3DViewer
                                        key={block.id}
                                        url={block.content}
                                        altText={block.altText}
                                        className="border-2 border-black shadow-retro-sm"
                                    />
                                );
                            }

                            return (
                                <div
                                    key={block.id}
                                    className={cn(
                                        "w-full p-1 bg-white",
                                        !block.noBorder && "border-2 border-black shadow-retro-sm cursor-zoom-in",
                                        block.noBorder && "bg-transparent p-0"
                                    )}
                                    onClick={() => !block.noBorder && setSelectedImage({ url: block.content, alt: block.altText })}
                                >
                                    <ImageWithLoader
                                        src={block.content}
                                        alt={block.altText || "Project Image"}
                                        width={block.width}
                                        height={block.height}
                                        className="w-full h-auto pixelated"
                                    />
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
                                        <div
                                            key={idx}
                                            className={cn(
                                                "p-1 bg-white h-full",
                                                !block.noBorder && "border-2 border-black hover:shadow-retro-sm transition-shadow cursor-zoom-in",
                                                block.noBorder && "bg-transparent p-0"
                                            )}
                                            onClick={() => !block.noBorder && setSelectedImage({ url: src, alt: block.itemAlts?.[idx] })}
                                        >
                                            <ImageWithLoader
                                                src={src}
                                                alt={block.itemAlts?.[idx] || `Grid item ${idx}`}
                                                className="w-full h-full object-cover pixelated"
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        case 'link':
                            const buttons = block.buttons && block.buttons.length > 0 ? block.buttons : [{
                                text: block.linkText || block.content || 'Button',
                                url: block.linkUrl || '#',
                                bgColor: block.bgColor,
                                textColor: block.textColor,
                                borderColor: block.borderColor,
                                iconUrl: block.iconUrl
                            }];

                            return (
                                <div key={block.id} className="flex flex-wrap justify-center gap-4 my-4">
                                    {buttons.map((btn, idx) => (
                                        <a
                                            key={idx}
                                            href={btn.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "px-4 py-1 border-2 border-black bg-white shadow-retro hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-black active:text-white font-bold flex items-center gap-2",
                                            )}
                                            style={{
                                                backgroundColor: btn.bgColor,
                                                color: btn.textColor,
                                                borderColor: btn.borderColor
                                            }}
                                        >
                                            {btn.iconUrl && (
                                                <img src={btn.iconUrl} alt="icon" className="w-4 h-4" />
                                            )}
                                            {btn.text}
                                        </a>
                                    ))}
                                </div>
                            );
                        case 'model3d':
                            return (
                                <Model3DViewer
                                    key={block.id}
                                    url={block.content}
                                    textureUrl={block.textureUrl}
                                    altText={block.altText}
                                    className="border-2 border-black shadow-retro-sm"
                                />
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
