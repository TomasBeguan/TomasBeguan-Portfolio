"use client";

import { RetroWindow } from "@/components/RetroWindow";
import { DiaryBook } from "@/components/Book/DiaryBook";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DiaryData {
    cover: string;
    backCover: string;
    pages: { front: string, back: string }[];
    aspectRatio?: string;
    borderRadius?: string;
}

export default function DiarioPage() {
    const { t } = useLanguage();
    const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/diary')
            .then(res => res.json())
            .then(data => {
                setDiaryData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 pt-6 sm:pt-16 transition-colors duration-300">
            {/* Mac OS Window with CSS Book */}
            <RetroWindow title="diario.exe" className="w-full max-w-5xl md:flex-1 md:min-h-0 mb-3 flex flex-col overflow-hidden shadow-2xl">
                <div className="w-full h-full min-h-[500px] flex items-center justify-center relative bg-stone-50 dark:bg-stone-900 transition-colors duration-300 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-gray-400" size={32} />
                            <span className="font-chicago text-gray-400 text-sm">LOADING DIARY...</span>
                        </div>
                    ) : diaryData ? (
                        <DiaryBook
                            cover={diaryData.cover}
                            backCover={diaryData.backCover}
                            pages={diaryData.pages}
                            aspectRatio={diaryData.aspectRatio}
                            borderRadius={diaryData.borderRadius}
                        />
                    ) : (
                        <div className="font-chicago text-gray-400">FAILED TO LOAD DIARY DATA</div>
                    )}

                    {!loading && diaryData && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50">
                            <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-6 py-3 rounded-full border-2 border-black dark:border-white text-[10px] md:text-sm font-chicago tracking-widest animate-bounce shadow-retro dark:shadow-none">
                                {t("diario_hint") || "CLICK EN LAS PAGINAS PARA PASAR"}
                            </div>
                        </div>
                    )}
                </div>
            </RetroWindow>
        </main>
    );
}
