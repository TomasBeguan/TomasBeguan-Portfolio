

import { RetroContainer } from "@/components/RetroContainer";
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
    const activePosts = posts.filter(post => post.active !== false);

    return (
        <main className="h-[100dvh] w-full p-2 sm:p-4 flex flex-col items-center justify-start pt-[32px] overflow-hidden box-border fixed inset-0">
            <RetroContainer title="My Portfolio" className="mt-[30px] flex-1 min-h-0">
                <PortfolioGrid posts={activePosts} />
            </RetroContainer>
        </main>
    );
}
