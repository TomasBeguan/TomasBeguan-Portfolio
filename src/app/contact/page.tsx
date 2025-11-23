"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";

export default function ContactPage() {
    return (
        <main className="min-h-screen p-4 flex flex-col items-center justify-center">
            <RetroContainer title="Contact Me" className="max-w-xl">
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold uppercase text-sm">Name</label>
                        <input type="text" className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow" placeholder="Your Name" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-bold uppercase text-sm">Email</label>
                        <input type="email" className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow" placeholder="your@email.com" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-bold uppercase text-sm">Message</label>
                        <textarea rows={5} className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow resize-none" placeholder="Tell me about your project..."></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <RetroButton type="submit">Send Message</RetroButton>
                    </div>
                </form>
            </RetroContainer>
        </main>
    );
}
