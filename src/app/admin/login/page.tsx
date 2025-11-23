"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            router.push('/admin');
        } else {
            setError(true);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <RetroContainer title="System Login" className="max-w-md">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">PASSWORD:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-black p-2 font-mono outline-none focus:bg-gray-100"
                            autoFocus
                        />
                    </div>

                    {error && <p className="text-red-500 font-bold text-center blink">ACCESS DENIED</p>}

                    <RetroButton type="submit" className="justify-center">
                        ENTER SYSTEM
                    </RetroButton>
                </form>
            </RetroContainer>
        </main>
    );
}
