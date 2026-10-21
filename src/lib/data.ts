// Server-only module (uses fs). Don't import it from "use client" components.
import fs from 'fs';
import path from 'path';
import { Post } from '@/types';

// Server-side helpers to read the JSON "database" in src/data.
// Pages use these directly instead of fetching their own API routes,
// so content is rendered on the server (faster first paint + indexable by Google).

const dataDir = path.join(process.cwd(), 'src/data');

function readJson<T>(file: string, fallback: T): T {
    try {
        return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')) as T;
    } catch {
        return fallback;
    }
}

export function getAllPosts(): Post[] {
    return readJson<Post[]>('posts.json', []).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

export function getActivePosts(): Post[] {
    return getAllPosts().filter(post => post.active !== false);
}

export function getActivePost(slugOrId: string): Post | undefined {
    const decoded = decodeURIComponent(slugOrId);
    return getActivePosts().find(p => p.slug === decoded || p.id === decoded);
}

/** First text block, trimmed, without the rich-text markup. Used for meta descriptions. */
export function getPostExcerpt(post: Post, max = 160): string {
    const text = post.blocks.find(b => b.type === 'text' && b.content?.trim())?.content ?? '';
    const plain = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\{[^}]+\}/g, '$1')
        .replace(/\*\*?([^*]+)\*\*?/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    return plain.length > max ? plain.slice(0, max - 1).trimEnd() + '…' : plain;
}

export interface DiaryData {
    cover: string;
    backCover: string;
    pages: { front: string; back: string }[];
    width?: number;
    height?: number;
    borderRadius?: string;
    glossy?: boolean;
    staticLeft?: string;
    staticRight?: string;
}

export function getDiary(): DiaryData {
    return readJson<DiaryData>('diary.json', { cover: '', backCover: '', pages: [] });
}

export interface Fanzine {
    id: string;
    title: string;
    slug: string;
    author: string;
    sourceImage: string;
    active: boolean;
    date: string;
}

export function getActiveFanzines(): Fanzine[] {
    return readJson<Fanzine[]>('fanzines.json', []).filter(f => f.active);
}
