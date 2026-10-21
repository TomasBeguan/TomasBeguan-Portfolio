"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Fanzine } from "@/lib/data";

export function FanzineList({ fanzines }: { fanzines: Fanzine[] }) {
    const router = useRouter();

    return (
        <main className="w-full min-h-screen p-4 sm:p-8 pt-24 pb-20 flex flex-col items-center">
            <div className="w-full max-w-6xl flex justify-between items-end mb-8 border-b-4 border-black pb-4">
                <h1 className="font-chicago text-4xl sm:text-6xl text-retro-dark-blue drop-shadow-[4px_4px_0_#4ade80]">
                    FANZINES
                </h1>
                <button onClick={() => router.back()} className="font-chicago text-sm hover:underline">
                    VOLVER
                </button>
            </div>

            {fanzines.length === 0 ? (
                <div className="w-full text-center mt-20">
                    <span className="font-chicago text-gray-400">NO HAY FANZINES DISPONIBLES</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-6xl">
                    {fanzines.map(fanzine => (
                        <Link href={`/fanzine/${fanzine.slug}`} key={fanzine.id} className="group flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                            {/* Shows only the cover panel of the 4x2 zine sheet */}
                            <div className="w-full aspect-[10/14] border-4 border-black shadow-[8px_8px_0_0_#000] group-hover:shadow-[12px_12px_0_0_#4ade80] transition-all bg-white overflow-hidden relative">
                                {fanzine.sourceImage && (
                                    <div className="absolute w-[400%] h-[200%] -left-[100%] -top-[100%]">
                                        <Image
                                            src={fanzine.sourceImage}
                                            alt={fanzine.title}
                                            fill
                                            sizes="(max-width: 640px) 200vw, (max-width: 1024px) 150vw, 1200px"
                                            quality={85}
                                            className="object-fill"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center bg-white border-2 border-black p-2 w-full">
                                <h2 className="font-chicago text-sm sm:text-lg leading-tight break-words">{fanzine.title}</h2>
                                <p className="text-[10px] sm:text-xs font-bold text-gray-500 mt-1">{fanzine.author}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
