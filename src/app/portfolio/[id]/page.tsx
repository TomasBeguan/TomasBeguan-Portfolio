import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RetroContainer } from "@/components/RetroContainer";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PostFooter } from "@/components/PostFooter";
import { getActivePost, getActivePosts, getPostExcerpt } from "@/lib/data";

// Only published posts get a page; drafts/tests (active: false) now return 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return getActivePosts().map((post) => ({
        id: post.slug || post.id, // The param is named 'id' in the folder structure
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = getActivePost(id);
    if (!post) return {};

    const description = getPostExcerpt(post) || `${post.category ?? "Proyecto"} — Tomás Beguan`;
    const image = post.thumbnail && !post.thumbnail.startsWith("http") ? post.thumbnail : undefined;
    const url = `/portfolio/${post.slug || post.id}`;

    return {
        title: post.title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            title: post.title,
            description,
            url,
            publishedTime: post.date,
            images: image ? [{ url: image }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
            images: image ? [image] : undefined,
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // 'id' here will contain the slug from the URL
    const post = getActivePost(id);

    if (!post) {
        notFound();
    }

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer
                title={post.title}
                title_en={post.title_en}
                backgroundColor={post.backgroundColor}
                backgroundImage={post.backgroundImage}
                backgroundMode={post.backgroundMode}
                backgroundOpacity={post.backgroundOpacity}
                backgroundSize={post.backgroundSize}
                backgroundBlendMode={post.backgroundBlendMode}
                className="md:mt-8 mb-3"
            >
                <div className="flex flex-col min-h-full">
                    <div className="flex-1">
                        <BlockRenderer blocks={post.blocks} textColor={post.textColor} />
                    </div>
                    <PostFooter post={post} textColor={post.textColor} />
                </div>
            </RetroContainer>
        </main>
    );
}
