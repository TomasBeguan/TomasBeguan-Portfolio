"use client";

import { useState } from "react";
import { Block } from "@/types";
import { RetroButton } from "./RetroButton";
import { cn } from "@/lib/utils";
import { ImageModal } from "./ImageModal";
import { ImageWithLoader } from "./ImageWithLoader";
import { Model3DViewer } from "./Model3DViewer";
import { useLanguage } from "@/context/LanguageContext";
import { RetroVideoPlayer } from "./RetroVideoPlayer";
import { RetroCarousel } from "./RetroCarousel";


interface BlockRendererProps {
    blocks: Block[];
    textColor?: string;
}

export function BlockRenderer({ blocks, textColor = '#333333' }: BlockRendererProps) {
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt?: string; transparent?: boolean } | null>(null);
    const { language } = useLanguage();

    // Helper to get localized content
    const getText = (text: string, textEn?: string) => {
        return (language === 'en' && textEn) ? textEn : text;
    };

    const parseRichText = (text: string, linkColor?: string): React.ReactNode[] => {
        let nodes: (string | React.ReactNode)[] = [text];

        const process = (
            currentNodes: (string | React.ReactNode)[],
            regex: RegExp,
            transform: (match: RegExpExecArray, index: number) => React.ReactNode
        ) => {
            const newNodes: (string | React.ReactNode)[] = [];
            currentNodes.forEach(node => {
                if (typeof node !== 'string') {
                    newNodes.push(node);
                    return;
                }

                let lastIndex = 0;
                let match;
                regex.lastIndex = 0;

                while ((match = regex.exec(node)) !== null) {
                    if (match.index > lastIndex) {
                        newNodes.push(node.substring(lastIndex, match.index));
                    }
                    newNodes.push(transform(match, newNodes.length));
                    lastIndex = regex.lastIndex;
                }
                if (lastIndex < node.length) {
                    newNodes.push(node.substring(lastIndex));
                }
            });
            return newNodes;
        };

        // 1. Links: [text](url)
        nodes = process(nodes, /\[([^\]]+)\]\(([^)]+)\)/g, (match, i) => (
            <a
                key={`link-${i}`}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:opacity-80"
                style={{ color: linkColor || '#7c3aed' }}
            >
                {parseRichText(match[1], linkColor)}
            </a>
        ));

        // 2. Color: [text]{color} (e.g. [my text]{#ff0000} or [my text]{red})
        nodes = process(nodes, /\[([^\]]+)\]\{([^}]+)\}/g, (match, i) => (
            <span key={`color-${i}`} style={{ color: match[2] }}>
                {parseRichText(match[1], linkColor)}
            </span>
        ));

        // 3. Bold: **text**
        nodes = process(nodes, /\*\*([^*]+)\*\*/g, (match, i) => (
            <strong key={`bold-${i}`}>
                {parseRichText(match[1], linkColor)}
            </strong>
        ));

        // 4. Italic: *text*
        nodes = process(nodes, /\*([^*]+)\*/g, (match, i) => (
            <em key={`italic-${i}`}>
                {parseRichText(match[1], linkColor)}
            </em>
        ));

        return nodes;
    };

    return (
        <>
            <div className="flex flex-col gap-6" style={{ color: textColor }}>
                {blocks.map((block) => {
                    const content = getText(block.content, block.content_en);

                    switch (block.type) {
                        case 'header':
                            return (
                                <h1
                                    key={block.id}
                                    className="text-2xl md:text-2xl p-4 border font-chicago text-center uppercase whitespace-pre-wrap "
                                    style={{ borderColor: textColor }}
                                >
                                    {parseRichText(content, block.linkColor)}
                                </h1>
                            );
                        case 'subtitle':
                            return (
                                <h2 key={block.id} className="text-2xl md:text-2xl font-bold font-space-grotesk text-left leading-none whitespace-pre-wrap">
                                    {parseRichText(content, block.linkColor)}
                                </h2>
                            );
                        case 'text':
                            return (
                                <p key={block.id} className="text-xl whitespace-pre-wrap font-space-grotesk leading-none">
                                    {parseRichText(content, block.linkColor)}
                                </p>
                            );
                        case 'image':
                            // Auto-detect if user accidentally used an Image block for a 3D model
                            if (block.content.toLowerCase().endsWith('.glb') || block.content.toLowerCase().endsWith('.gltf')) {
                                return (
                                    <Model3DViewer
                                        key={block.id}
                                        url={block.content}
                                        altText={getText(block.altText || '', block.altText_en)}
                                        className="border-2 border-black shadow-retro-sm"
                                    />
                                );
                            }

                            const altText = getText(block.altText || "Project Image", block.altText_en);

                            return (
                                <div
                                    key={block.id}
                                    className={cn(
                                        "w-full p-1 bg-white",
                                        !block.noBorder && "border-2 border-black shadow-retro-sm",
                                        block.allowModal !== false && "cursor-zoom-in",
                                        block.noBorder && "bg-transparent p-0"
                                    )}
                                    onClick={() => block.allowModal !== false && setSelectedImage({ url: block.content, alt: altText, transparent: block.noBorder })}
                                >
                                    <ImageWithLoader
                                        src={block.content}
                                        alt={altText}
                                        width={block.width}
                                        height={block.height}
                                        sizes="100vw"
                                        className={cn("w-full h-auto", block.pixelate && "pixelated")}
                                    />
                                </div>
                            );
                        case 'video':
                            return (
                                <div key={block.id} className="w-full">
                                    <RetroVideoPlayer
                                        url={block.content}
                                        title={getText(block.altText || '', block.altText_en)}
                                    />
                                </div>
                            );
                        case 'grid':
                            const items = block.items || [];
                            const itemAlts = (language === 'en' && block.itemAlts_en) ? block.itemAlts_en : block.itemAlts || [];
                            const cols = items.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
                            return (
                                <div key={block.id} className={cn("grid gap-4", cols)}>
                                    {items.map((src, idx) => {
                                        const alt = itemAlts[idx] || `Grid item ${idx}`;
                                        return (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "p-1 bg-white",
                                                    !block.noBorder && "border-2 border-black hover:shadow-retro-sm transition-shadow",
                                                    block.allowModal !== false && "cursor-zoom-in",
                                                    block.noBorder && "bg-transparent p-0"
                                                )}
                                                onClick={() => block.allowModal !== false && setSelectedImage({ url: src, alt: alt, transparent: block.noBorder })}
                                            >
                                                <ImageWithLoader
                                                    src={src}
                                                    alt={alt}
                                                    containerClassName="w-full"
                                                    className={cn("w-full h-full object-contain", block.pixelate && "pixelated")}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        case 'link':
                            const buttons = block.buttons && block.buttons.length > 0 ? block.buttons : [{
                                text: block.linkText || block.content || 'Button',
                                text_en: block.linkText_en,
                                url: block.linkUrl || '#',
                                bgColor: block.bgColor,
                                textColor: block.textColor,
                                borderColor: block.borderColor,
                                iconUrl: block.iconUrl
                            }];

                            return (
                                <div key={block.id} className="flex flex-col sm:flex-row justify-center gap-4 my-4 w-full">
                                    {buttons.map((btn, idx) => (
                                        <a
                                            key={idx}
                                            href={btn.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "flex-1 px-6 py-3 text-lg border-2 border-black bg-white shadow-retro hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-black active:text-white font-bold flex items-center justify-center gap-2 font-space-grotesk tracking-wider text-center",
                                            )}
                                            style={{
                                                backgroundColor: btn.bgColor,
                                                color: btn.textColor,
                                                borderColor: btn.borderColor
                                            }}
                                        >
                                            {btn.iconUrl && (
                                                <img src={btn.iconUrl} alt="icon" className="w-5 h-5 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{getText(btn.text, btn.text_en)}</span>
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
                                    altText={getText(block.altText || '', block.altText_en)}
                                    className="border-2 border-black shadow-retro-sm"
                                />
                            );
                        case 'carousel':
                            return (
                                <div key={block.id} className="w-full">
                                    <RetroCarousel
                                        items={block.items || []}
                                        itemAlts={(language === 'en' && block.itemAlts_en) ? block.itemAlts_en : block.itemAlts || []}
                                        noBorder={block.noBorder}
                                        pixelate={block.pixelate}
                                        delay={block.delay}
                                        allowModal={block.allowModal !== false}
                                        showAltText={block.showAltText}
                                        onImageClick={(url, alt) => setSelectedImage({ url, alt, transparent: block.noBorder })}
                                    />
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
                transparent={selectedImage?.transparent}
                onClose={() => setSelectedImage(null)}
            />
        </>
    );
}
