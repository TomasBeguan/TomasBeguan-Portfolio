import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Post } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/posts.json');

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const posts = JSON.parse(fileContents);
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newPost: Post = await request.json();
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const posts: Post[] = JSON.parse(fileContents);

        // Add or Update
        const index = posts.findIndex(p => p.id === newPost.id);
        if (index !== -1) {
            posts[index] = newPost;
        } else {
            posts.push(newPost);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}
