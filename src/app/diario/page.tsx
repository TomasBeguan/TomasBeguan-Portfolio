"use client";

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
    glossy?: boolean;
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
        <main className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative p-4 transition-colors duration-300">
            {loading ? (
                <div className="flex flex-col items-center gap-4 z-10">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                    <span className="font-chicago text-[10px] uppercase tracking-widest text-gray-400">Cargando diario...</span>
                </div>
            ) : diaryData && (
                <div className="w-full h-full flex items-center justify-center">
                    <DiaryBook
                        cover={diaryData.cover}
                        backCover={diaryData.backCover}
                        pages={diaryData.pages}
                        aspectRatio={diaryData.aspectRatio}
                        borderRadius={diaryData.borderRadius}
                        glossy={diaryData.glossy}
                    />
                </div>
            )}

            {/* Hint for users */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 text-[10px] font-chicago flex flex-col items-center gap-2 z-10">
                <div className="w-px h-8 bg-black/20" />
                <span className="tracking-[0.2em]">{t("diario_hint") || "ARRASTRA LAS ESQUINAS PARA PASAR PÁGINA"}</span>
            </div>
        </main>
    );
}
