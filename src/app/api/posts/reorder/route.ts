import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Post } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/posts.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const orderedIds: string[] = body.orderedIds;

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const posts: Post[] = JSON.parse(fileContents);

        // Update order for each post
        const updatedPosts = posts.map(post => {
            const newOrder = orderedIds.indexOf(post.id);
            if (newOrder !== -1) {
                return { ...post, order: newOrder };
            }
            return post;
        });

        // Sort posts by order to keep the file organized (optional but good for debugging)
        updatedPosts.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

        fs.writeFileSync(dataFilePath, JSON.stringify(updatedPosts, null, 2));

        return NextResponse.json({ success: true, posts: updatedPosts });
    } catch (error) {
        console.error('Error reordering posts:', error);
        return NextResponse.json({ error: 'Failed to reorder posts' }, { status: 500 });
    }
}
