import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily
let resend: Resend | null = null;
const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!resend && apiKey) {
        resend = new Resend(apiKey);
    }
    return resend;
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip);
    if (lastRequestTime && (now - lastRequestTime < 20000)) { // 20 seconds
        return true;
    }
    rateLimitMap.set(ip, now);
    if (rateLimitMap.size > 1000) rateLimitMap.clear();
    return false;
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        // 1. Rate Limiting
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Demasiados intentos. Por favor espera un momento / Too many attempts. Please wait.' }, 
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, email, message, honey } = body;

        // 2. Honeypot
        if (honey) {
            return NextResponse.json({ success: true });
        }

        // 3. Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Todos los campos son obligatorios / All fields are required' }, { status: 400 });
        }

        const resendInstance = getResend();
        
        // 4. Handle Missing API Key
        if (!resendInstance) {
            console.error("Missing RESEND_API_KEY in environment variables");
            
            // In development, we can mock a success if the user hasn't set up the API key yet
            // to allow them to test the UI flow.
            if (process.env.NODE_ENV === 'development') {
                console.warn("⚠️ API Key missing. Returning MOCK success for development.");
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                return NextResponse.json({ success: true, mock: true });
            }

            return NextResponse.json(
                { error: 'Error de configuración del servidor (Falta API Key)' }, 
                { status: 500 }
            );
        }

        // 5. Send Email
        const { data, error } = await resendInstance.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL || 'tomasbeguan@gmail.com',
            replyTo: email,
            subject: `[Portfolio] Nuevo mensaje de ${name}`,
            text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: error.message || 'Error al enviar el email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
