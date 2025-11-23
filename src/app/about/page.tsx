"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="h-[100dvh] w-full p-2 sm:p-4 flex flex-col items-center justify-start pt-[32px] overflow-hidden box-border fixed inset-0">
            <RetroContainer title="About Me" className="mt-[30px] flex-1 min-h-0">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 aspect-[3/4] border-2 border-black bg-gray-200 shrink-0 relative shadow-retro-sm">
                        {/* Placeholder for profile image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">
                            PHOTO
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-3xl font-bold uppercase border-b-2 border-black pb-2 inline-block">Tomas Beguan</h1>
                        <h2 className="text-xl text-gray-600">3D Designer & Visual Artist</h2>

                        <div className="text-lg space-y-4 font-medium">
                            <p>
                                Hi! I'm a digital artist obsessed with retro aesthetics, brutalism, and old-school technology.
                            </p>
                            <p>
                                I use Blender, Cinema 4D, and After Effects to create immersive visual experiences that bridge the gap between nostalgia and futurism.
                            </p>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Link href="/contact">
                                <RetroButton>Contact Me</RetroButton>
                            </Link>
                            <Link href="/portfolio">
                                <RetroButton className="bg-black text-white hover:bg-white hover:text-black">View Work</RetroButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
