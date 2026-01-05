import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/diary.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            // Return default empty structure if file doesn't exist
            return NextResponse.json({ cover: '', backCover: '', pages: [] });
        }
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load diary' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save diary' }, { status: 500 });
    }
}
