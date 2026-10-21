import type { Metadata } from "next";
import { RetroWindow } from "@/components/RetroWindow";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getActivePosts } from "@/lib/data";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Portfolio",
    alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
    const activePosts = getActivePosts();

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroWindow className="w-full max-w-5xl md:flex-1 md:min-h-0 mb-3 flex flex-col md:mt-8">
                <PortfolioGrid posts={activePosts} />
            </RetroWindow>
        </main>
    );
}
