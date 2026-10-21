"use client";

import { DiaryBook } from "@/components/Book/DiaryBook";
import { useLanguage } from "@/context/LanguageContext";
import type { DiaryData } from "@/lib/data";

export function DiarioView({ diaryData }: { diaryData: DiaryData }) {
    const { t } = useLanguage();

    return (
        <main className="w-full h-[calc(100vh-2rem)] overflow-hidden flex flex-col items-center justify-center relative p-4 transition-colors duration-300">
            <div className="w-full h-full flex items-center justify-center">
                <DiaryBook
                    cover={diaryData.cover}
                    backCover={diaryData.backCover}
                    pages={diaryData.pages}
                    width={diaryData.width}
                    height={diaryData.height}
                    borderRadius={diaryData.borderRadius}
                    glossy={diaryData.glossy}
                    staticLeft={diaryData.staticLeft}
                    staticRight={diaryData.staticRight}
                />
            </div>

            {/* Hint for users */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 text-[10px] font-chicago flex flex-col items-center gap-2 z-10">
                <div className="w-px h-8 bg-black/20" />
                <span className="tracking-[0.2em]">{t("diario_hint") || "ARRASTRA LAS ESQUINAS PARA PASAR PÁGINA"}</span>
            </div>
        </main>
    );
}
