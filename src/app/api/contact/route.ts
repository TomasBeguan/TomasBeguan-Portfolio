import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid crashing during build if API key is missing
let resend: Resend | null = null;
const getResend = () => {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip);
    if (lastRequestTime && (now - lastRequestTime < 20000)) {
        return true;
    }
    rateLimitMap.set(ip, now);
    if (rateLimitMap.size > 1000) rateLimitMap.clear();
    return false;
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        // 1. Security: Rate Limiting
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: 'Too many attempts. Please wait.' }, { status: 429 });
        }

        const body = await req.json();
        const { name, email, message, honey } = body;

        // 2. Security: Honeypot
        if (honey) {
            return NextResponse.json({ success: true }); // Silently fail for bots
        }

        // 3. Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 4. Secure Sending via Resend (API Key)
        const resendInstance = getResend();
        if (!resendInstance) {
            console.error("Missing RESEND_API_KEY or failed to initialize Resend");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Send the email
        // Note: 'from' must be a domain you verify in Resend, or 'onboarding@resend.dev' for testing
        // For testing without a domain, use 'onboarding@resend.dev' and send ONLY to your registered email.
        const data = await resendInstance.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: 'tomasbeguan@gmail.com', // REPLACE THIS WITH YOUR VERIFIED EMAIL IN RESEND
            replyTo: email,
            subject: `[Portfolio] Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
