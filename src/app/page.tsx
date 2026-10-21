import { RetroWindow } from "@/components/RetroWindow";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getActivePosts } from "@/lib/data";

// Content lives in src/data/posts.json, so the page is fully static and rebuilt on each deploy.
export const dynamic = "force-static";

export default function Home() {
    const activePosts = getActivePosts();

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 pt-6 sm:pt-16">
            {/* Title Section */}
            <div className="mb-4 text-center z-10 shrink-0">
                <h1 className="text-4xl sm:text-6xl md:text-8xl mb-2 font-ultra tracking-tight text-black">
                    Tomás Beguan
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-libre italic">
                    3D Artist.
                </p>
            </div>

            {/* Mac OS Window with Portfolio Feed */}
            <RetroWindow className="w-full max-w-5xl md:flex-1 md:min-h-0 mb-3 flex flex-col">
                <PortfolioGrid posts={activePosts} />
            </RetroWindow>
        </main>
    );
}
