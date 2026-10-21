import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const ALLOWED_EXTENSIONS = new Set([
    '.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.svg',
    '.mp4', '.webm', '.mov',
    '.glb', '.gltf', '.bin',
]);

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const data = await request.formData();
    const file = data.get('file');

    if (!file || typeof file === 'string') {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    // Keep only the base name and safe characters (prevents "../" path tricks)
    const baseName = path.basename(file.name)
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._()-]/g, '');
    const ext = path.extname(baseName).toLowerCase();

    if (!baseName || !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ success: false, error: 'File type not allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${baseName}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
}
