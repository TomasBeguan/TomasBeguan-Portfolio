"use client";

import { use, useEffect, useState } from "react";
import { DiaryBook } from "@/components/Book/DiaryBook";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fanzine } from "@/app/admin/fanzines/page";
import Link from "next/link";

interface DiaryData {
    cover: string;
    backCover: string;
    pages: { front: string; back: string }[];
}

export default function FanzineViewerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [fanzine, setFanzine] = useState<Fanzine | null>(null);
    const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/fanzines')
            .then(res => res.json())
            .then(async (data: Fanzine[]) => {
                const decodedSlug = decodeURIComponent(slug);
                const found = data.find(f => f.slug === decodedSlug && f.active);
                if (!found) {
                    setError("Fanzine no encontrado");
                    setLoading(false);
                    return;
                }
                setFanzine(found);

                if (!found.sourceImage) {
                    setError("El fanzine no tiene imagen");
                    setLoading(false);
                    return;
                }

                try {
                    const extracted = await processFanzineImage(found.sourceImage);
                    setDiaryData(extracted);
                } catch (e) {
                    setError("Error procesando el fanzine");
                    console.error(e);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error de conexión");
                setLoading(false);
            });
    }, [slug]);

    const processFanzineImage = async (imageUrl: string): Promise<DiaryData> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const panelWidth = img.width / 4;
                const panelHeight = img.height / 2;

                const extractPanel = (col: number, row: number, rotate: boolean) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = panelWidth;
                    canvas.height = panelHeight;
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) return '';

                    ctx.save();
                    if (rotate) {
                        ctx.translate(panelWidth / 2, panelHeight / 2);
                        ctx.rotate(Math.PI);
                        ctx.translate(-panelWidth / 2, -panelHeight / 2);
                    }
                    ctx.drawImage(img, col * panelWidth, row * panelHeight, panelWidth, panelHeight, 0, 0, panelWidth, panelHeight);
                    ctx.restore();
                    
                    return canvas.toDataURL('image/jpeg', 0.95);
                };

                // Zine Layout:
                // Row 0 (Top, needs 180deg rotation):
                // Col 0: Page 7, Col 1: Page 6, Col 2: Page 5, Col 3: Page 4
                // Row 1 (Bottom, no rotation):
                // Col 0: Page 8 (Back), Col 1: Page 1 (Cover), Col 2: Page 2, Col 3: Page 3

                const cover = extractPanel(1, 1, false);
                const backCover = extractPanel(0, 1, false);
                
                const p2 = extractPanel(2, 1, false);
                const p3 = extractPanel(3, 1, false);
                
                const p4 = extractPanel(3, 0, true);
                const p5 = extractPanel(2, 0, true);
                
                const p6 = extractPanel(1, 0, true);
                const p7 = extractPanel(0, 0, true);

                resolve({
                    cover,
                    backCover,
                    pages: [
                        { front: p2, back: p3 },
                        { front: p4, back: p5 },
                        { front: p6, back: p7 }
                    ]
                });
            };
            img.onerror = () => reject(new Error("Error loading image"));
            img.src = imageUrl;
        });
    };

    return (
        <main className="w-full h-[calc(100vh-2rem)] overflow-hidden flex flex-col items-center justify-center relative p-4 bg-gray-100">
            <Link 
                href="/fanzine" 
                className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 font-chicago text-xs bg-white border-2 border-black px-4 py-2 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#4ade80] transition-all"
            >
                &lt; VOLVER
            </Link>

            {loading ? (
                <div className="flex flex-col items-center gap-4 z-10">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                    <span className="font-chicago text-[10px] uppercase tracking-widest text-gray-400">Procesando fanzine...</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center gap-4 z-10">
                    <span className="font-chicago text-red-500">{error}</span>
                </div>
            ) : diaryData && (
                <div className="w-full h-full flex items-center justify-center mt-8">
                    <DiaryBook
                        cover={diaryData.cover}
                        backCover={diaryData.backCover}
                        pages={diaryData.pages}
                        width={1400}
                        height={2000}
                        borderRadius="0px"
                        glossy={false}
                    />
                </div>
            )}

            {/* Hint for users */}
            {!loading && !error && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 text-[10px] font-chicago flex flex-col items-center gap-2 z-10">
                    <div className="w-px h-8 bg-black/20" />
                    <span className="tracking-[0.2em]">ARRASTRA LAS ESQUINAS PARA PASAR PÁGINA</span>
                </div>
            )}
        </main>
    );
}
