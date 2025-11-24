import { Post } from "@/types";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface PortfolioGridProps {
    posts: Post[];
}

export const PortfolioGrid = ({ posts }: PortfolioGridProps) => {
    const getMonthName = (monthStr: string) => {
        const date = new Date(2000, parseInt(monthStr) - 1, 1);
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-6">
            {posts.map((post) => {
                const [year, month] = post.date.split('-');
                const monthName = getMonthName(month);

                return (
                    <Link key={post.id} href={`/portfolio/${post.id}`} className="group">
                        <div
                            className="border-2 border-black dark:border-white p-2 hover:shadow-retro dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all cursor-pointer h-full flex flex-col relative overflow-hidden"
                            style={{
                                color: post.cardTextColor || 'var(--card-text, var(--main-color))'
                            }}
                        >
                            {/* Background Layers */}
                            <div
                                className="absolute inset-0 z-0"
                                style={{ backgroundColor: post.backgroundColor || 'var(--card-bg, #f9fafb)' }}
                            />
                            {post.backgroundImage && (
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
                                <div className="aspect-video border border-black dark:border-white bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors overflow-hidden relative">
                                    {post.thumbnail ? (
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover pixelated" />
                                    ) : (
                                        <ImageIcon size={48} className="text-gray-400 group-hover:text-black dark:text-gray-500 dark:group-hover:text-white" />
                                    )}
                                </div>
                                <h3 className="font-bold text-lg truncate mb-2">{post.title}</h3>

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
                                    {post.category && (
                                        <div className="border border-black dark:border-white px-2 py-0.5 text-xs bg-black text-white dark:bg-white dark:text-black uppercase">
                                            {post.category}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
