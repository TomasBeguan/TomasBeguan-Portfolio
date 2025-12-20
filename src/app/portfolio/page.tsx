

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
        <main className="h-[100dvh] w-full p-2 sm:p-4 flex flex-col items-center justify-start pt-[32px] overflow-hidden box-border fixed inset-0">
            <RetroWindow className="w-full max-w-5xl md:flex-1 md:min-h-0 mb-8 sm:mb-12 flex flex-col mt-8">
                <PortfolioGrid posts={activePosts} />
            </RetroWindow>
            <GlobalCanvas />
        </main>
    );
}
