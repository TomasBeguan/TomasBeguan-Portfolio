

import { RetroWindow } from "@/components/RetroWindow";
import { GlobalCanvas } from "@/components/GlobalCanvas";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import fs from 'fs';
import path from 'path';
import { Post } from "@/types";

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts(): Promise<Post[]> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function PortfolioPage() {
    const posts = await getPosts();
    // Filter to only show active posts
    const activePosts = posts
        .filter(post => post.active !== false)
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroWindow className="w-full max-w-5xl md:flex-1 md:min-h-0 mb-3 flex flex-col md:mt-8">
                <PortfolioGrid posts={activePosts} />
            </RetroWindow>
            <GlobalCanvas />
        </main>
    );
}
