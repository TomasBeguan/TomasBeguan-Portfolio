import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/fanzines.json');

export async function POST(request: Request) {
    try {
        const { orderedIds } = await request.json();
        
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const fanzines = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        
        // Create new array based on orderedIds
        const reorderedFanzines = orderedIds.map((id: string) => 
            fanzines.find((p: any) => p.id === id)
        ).filter(Boolean); // Remove any undefined in case of mismatches

        fs.writeFileSync(dataFilePath, JSON.stringify(reorderedFanzines, null, 2));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reorder fanzines' }, { status: 500 });
    }
}
