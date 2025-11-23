

import { RetroContainer } from "@/components/RetroContainer";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import fs from 'fs';
import path from 'path';
import { Post } from "@/types";

async function getPosts(): Promise<Post[]> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function PortfolioPage() {
    const projects = await getPosts();

    return (
        <main className="min-h-screen p-4 flex flex-col items-center justify-center">
            <RetroContainer title="My Portfolio">
                <PortfolioGrid posts={projects} />
            </RetroContainer>
        </main>
    );
}
