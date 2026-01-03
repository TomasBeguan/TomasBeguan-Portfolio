import { RetroWindow } from "@/components/RetroWindow";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { GlobalCanvas } from "@/components/GlobalCanvas";

import { Post } from "@/types";
import fs from 'fs';
import path from 'path';


// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts(): Promise<Post[]> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function Home() {
    const posts = await getPosts();
    // Filter to only show active posts (posts without 'active' field are considered active by default)
    const activePosts = posts.filter(post => post.active !== false);

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

            <GlobalCanvas />
        </main>
    );
}
