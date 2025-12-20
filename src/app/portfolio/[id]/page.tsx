import { RetroContainer } from "@/components/RetroContainer";
// Force rebuild
import { BlockRenderer } from "@/components/BlockRenderer";
import { Post } from "@/types";
import fs from 'fs';
import path from 'path';
import { notFound } from "next/navigation";

// This is a Server Component
async function getPost(slugOrId: string): Promise<Post | undefined> {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContents);
    return posts.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const posts: Post[] = JSON.parse(fileContents);

    return posts.map((post) => ({
        id: post.slug || post.id, // The param is named 'id' in the folder structure
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // 'id' here will contain the slug from the URL
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
                className="mt-[10px] md:mt-[30px]"
            >
                <BlockRenderer blocks={post.blocks} textColor={post.textColor} />
            </RetroContainer>
        </main>
    );
}
