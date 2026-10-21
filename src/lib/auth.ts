import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const SESSION_COOKIE = 'admin_session';

/**
 * Admin password comes from the ADMIN_PASSWORD env var.
 * In development only, falls back to 'admin123' so the local admin keeps working
 * until you add ADMIN_PASSWORD to .env.local. In production there is no fallback.
 */
function getPassword(): string | null {
    const fromEnv = process.env.ADMIN_PASSWORD;
    if (fromEnv) return fromEnv;
    if (process.env.NODE_ENV !== 'production') return 'admin123';
    return null;
}

function sign(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(input: unknown): boolean {
    const password = getPassword();
    if (!password || typeof input !== 'string') return false;
    return safeEqual(input, password);
}

/** Token stored in the cookie: an HMAC that can't be forged without the password. */
export function createSessionToken(): string | null {
    const password = getPassword();
    if (!password) return null;
    return sign('admin-session-v1', password);
}

export async function isAdmin(): Promise<boolean> {
    const expected = createSessionToken();
    if (!expected) return false;
    const cookieStore = await cookies();
    const value = cookieStore.get(SESSION_COOKIE)?.value;
    return !!value && safeEqual(value, expected);
}

/** Use at the top of any write route: `const denied = await requireAdmin(); if (denied) return denied;` */
export async function requireAdmin(): Promise<NextResponse | null> {
    if (await isAdmin()) return null;
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
