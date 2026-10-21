import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkPassword, createSessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const token = createSessionToken();

    if (token && checkPassword(body?.password)) {
        (await cookies()).set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
