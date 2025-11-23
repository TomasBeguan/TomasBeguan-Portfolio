import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    // Simple hardcoded password for this local portfolio
    // In a real app, use environment variables
    if (password === 'admin123') {
        (await cookies()).set('admin_session', 'true', { httpOnly: true, path: '/' });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
