import { RetroWindow } from "@/components/RetroWindow";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import postsData from "@/data/posts.json";
import { Post } from "@/types";

// Cast the imported JSON to the Post type to avoid type errors if strict
const posts: Post[] = postsData as Post[];

export default function Home() {
    return (
        <main className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center p-4 pt-12 sm:pt-24">
            {/* Title Section */}
            <div className="mb-4 sm:mb-8 text-center z-10 shrink-0">
                <h1 className="text-4xl sm:text-6xl md:text-8xl mb-2 font-ultra tracking-tight text-black">
                    Tomás Beguan
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-libre italic">
                    Just a designer.
                </p>
            </div>

            {/* Mac OS Window with Portfolio Feed */}
            <RetroWindow className="z-10 w-full max-w-5xl flex-1 min-h-0 mb-8 sm:mb-12 flex flex-col">
                <PortfolioGrid posts={posts} />
            </RetroWindow>

            {/* Cursor Graphic (Decorative) */}
            <div className="absolute bottom-8 right-12 pointer-events-none animate-pulse">
                <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 2L2 28L8.5 26.5L11.5 38L16.5 36.5L13.5 25.5L20 24L9.5 2Z" fill="white" stroke="black" strokeWidth="2" />
                </svg>
            </div>
        </main>
    );
}
