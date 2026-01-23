"use client";

import { Post } from "@/types";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ImageWithLoader } from "./ImageWithLoader";
import { Thumbnail3DViewer } from "./Thumbnail3DViewer";
import { useLanguage } from "@/context/LanguageContext";

import { useRef } from "react";


interface PortfolioGridProps {
    posts: Post[];
}

export const PortfolioGrid = ({ posts }: PortfolioGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    const getMonthName = (monthStr: string) => {
        const date = new Date(2000, parseInt(monthStr) - 1, 1);
        const locale = language === 'es' ? 'es-ES' : 'en-US';
        return date.toLocaleString(locale, { month: 'long' });
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-6">
                {posts.map((post) => {
                    const [year, month] = post.date.split('-');
                    const monthName = getMonthName(month);
                    const title = (language === 'en' && post.title_en) ? post.title_en : post.title;
                    const category = (language === 'en' && post.category_en) ? post.category_en : post.category;

                    return (
                        <Link key={post.id} href={`/portfolio/${post.slug || post.id}`} className="group">
                            <div
                                className="border-2 border-black dark:border-white p-2 hover:shadow-retro dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all cursor-pointer h-full flex flex-col relative overflow-hidden"
                                style={{
                                    color: post.cardTextColor || 'var(--card-text, var(--main-color))'
                                }}
                            >
                                {/* Background Layers */}
                                <div
                                    className="absolute inset-0 z-0"
                                    style={{ backgroundColor: post.usePostBackgroundForCard ? (post.backgroundColor || 'var(--card-bg, #f9fafb)') : (post.cardBackgroundColor || 'var(--card-bg, #f9fafb)') }}
                                />
                                {post.usePostBackgroundForCard && post.backgroundImage && (
                                    <div
                                        className="absolute inset-0 z-0 pointer-events-none"
                                        style={{
                                            backgroundImage: `url(${post.backgroundImage})`,
                                            opacity: (post.backgroundOpacity || 100) / 100,
                                            backgroundPosition: 'center',
                                            mixBlendMode: post.backgroundBlendMode as any || 'normal',
                                            backgroundSize: post.backgroundSize || (post.backgroundMode === 'cover' ? 'cover' : post.backgroundMode === 'contain' ? 'contain' : post.backgroundMode === 'stretch' ? '100% 100%' : 'auto'),
                                            backgroundRepeat: post.backgroundMode === 'repeat' ? 'repeat' : 'no-repeat'
                                        }}
                                    />
                                )}

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full">
                                    <div
                                        className="aspect-square flex items-center justify-center mb-2 transition-colors overflow-hidden relative"
                                        style={{ backgroundColor: post.thumbnailModel ? (post.thumbnail3dBackgroundColor || 'transparent') : 'transparent' }}
                                    >
                                        {post.thumbnailModel ? (
                                            <Thumbnail3DViewer
                                                url={post.thumbnailModel}
                                                className={`relative w-full h-full overflow-hidden `}
                                            // 👇 Esto fuerza a iOS a promocionar la capa a GPU y reduce el jitter
                                            //style={{ transform: 'translateZ(0)' }}
                                            />
                                        ) : post.thumbnail ? (
                                            <ImageWithLoader
                                                src={post.thumbnail}
                                                alt={title}
                                                unoptimized={post.thumbnail.toLowerCase().endsWith('.gif')}
                                                className="w-full h-full object-cover"
                                                containerClassName="w-full h-full"
                                            />
                                        ) : (
                                            <ImageIcon size={48} className="text-gray-400 group-hover:text-black dark:text-gray-500 dark:group-hover:text-white" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg truncate mb-2">{title}</h3>

                                    <div className="flex gap-2 mt-auto items-center justify-between">
                                        {/* Grouped Date Block */}
                                        <div className="flex border border-black dark:border-white bg-white dark:bg-retro-dark-blue text-black dark:text-white">
                                            <div className="px-2 py-0.5 text-xs border-r border-black dark:border-white">
                                                {year}
                                            </div>
                                            <div className="px-2 py-0.5 text-xs uppercase">
                                                {monthName}
                                            </div>
                                        </div>

                                        {/* Category Tag */}
                                        {category && (
                                            <div className="border border-black dark:border-white px-2 py-0.5 text-xs bg-black text-white dark:bg-white dark:text-black uppercase">
                                                {category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
