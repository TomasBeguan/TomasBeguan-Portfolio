"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RetroContainer } from "@/components/RetroContainer";
import { Fanzine } from "@/app/admin/fanzines/page";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FanzinesPage() {
    const [fanzines, setFanzines] = useState<Fanzine[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/fanzines')
            .then(res => res.json())
            .then(data => {
                // Filter only active fanzines
                setFanzines(data.filter((f: Fanzine) => f.active));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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

            {loading ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                    <span className="font-chicago text-xs uppercase tracking-widest text-gray-400">CARGANDO FANZINES...</span>
                </div>
            ) : fanzines.length === 0 ? (
                <div className="w-full text-center mt-20">
                    <span className="font-chicago text-gray-400">NO HAY FANZINES DISPONIBLES</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                    {fanzines.map(fanzine => (
                        <Link href={`/fanzine/${fanzine.slug}`} key={fanzine.id} className="group flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                            {/* Visualizer using Next.js Image for optimization */}
                            <div className="w-full aspect-[10/14] border-4 border-black shadow-[8px_8px_0_0_#000] group-hover:shadow-[12px_12px_0_0_#4ade80] transition-all bg-white overflow-hidden relative">
                                {fanzine.sourceImage && (
                                    <div className="absolute w-[400%] h-[200%] -left-[100%] -top-[100%]">
                                        <Image
                                            src={fanzine.sourceImage}
                                            alt={fanzine.title}
                                            fill
                                            sizes="(max-width: 640px) 200vw, (max-width: 1024px) 150vw, 1200px"
                                            quality={100}
                                            className="object-fill"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center bg-white border-2 border-black p-2 w-full">
                                <h2 className="font-chicago text-lg leading-tight break-words">{fanzine.title}</h2>
                                <p className="text-xs font-bold text-gray-500 mt-1">{fanzine.author}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
