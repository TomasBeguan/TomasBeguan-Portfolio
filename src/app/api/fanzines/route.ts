import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/fanzines.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            // Return empty array if file doesn't exist
            return NextResponse.json([]);
        }
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load fanzines' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const postData = await request.json();
        
        let fanzines = [];
        if (fs.existsSync(dataFilePath)) {
            fanzines = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        }

        const existingIndex = fanzines.findIndex((p: any) => p.id === postData.id);
        
        if (existingIndex >= 0) {
            fanzines[existingIndex] = postData;
        } else {
            // New fanzine, add to beginning
            fanzines.unshift(postData);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(fanzines, null, 2));
        return NextResponse.json({ success: true, fanzine: postData });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save fanzine' }, { status: 500 });
    }
}
