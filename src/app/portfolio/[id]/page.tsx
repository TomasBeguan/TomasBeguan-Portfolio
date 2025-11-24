import { RetroContainer } from "@/components/RetroContainer";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Post } from "@/types";
import fs from 'fs';
import path from 'path';
import { notFound } from "next/navigation";

// This is a Server Component
async function getPost(id: string): Promise<Post | undefined> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContents);
    return posts.find((p) => p.id === id);
}

export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContents);

    return posts.map((post) => ({
        id: post.id,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <main className="h-[100dvh] w-full p-2 sm:p-4 flex flex-col items-center justify-start pt-[32px] overflow-hidden box-border fixed inset-0">
            <RetroContainer
                title={post.title}
                backgroundColor={post.backgroundColor}
                backgroundImage={post.backgroundImage}
                backgroundMode={post.backgroundMode}
                backgroundOpacity={post.backgroundOpacity}
                backgroundSize={post.backgroundSize}
                backgroundBlendMode={post.backgroundBlendMode}
                className="mt-[30px]"
            >
                <BlockRenderer blocks={post.blocks} textColor={post.textColor} />
            </RetroContainer>
        </main>
    );
}
