"use client";

import { Post } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface PostFooterProps {
    post: Post;
    textColor?: string;
}

export function PostFooter({ post, textColor = '#333333' }: PostFooterProps) {
    const { language } = useLanguage();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";

        // dateStr is YYYY-MM-DD
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        if (language === 'es') {
            const months = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];
            return `${day} de ${months[month - 1]} de ${year}`;
        } else {
            return date.toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const title = (language === 'en' && post.title_en) ? post.title_en : post.title;
    const category = (language === 'en' && post.category_en) ? post.category_en : post.category;
    const formattedDate = formatDate(post.date);

    return (
        <footer
            className="mt-12 pt-8 border-t-2 border-black/10 dark:border-white/10 flex flex-col gap-2 items-center text-center opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: textColor }}
        >
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm md:text-base font-chicago uppercase tracking-wider">
                <span>{title}</span>
                {category && (
                    <>
                        <span className="opacity-30">•</span>
                        <span>{category}</span>
                    </>
                )}
                {formattedDate && (
                    <>
                        <span className="opacity-30">•</span>
                        <span>{formattedDate}</span>
                    </>
                )}
            </div>
            <p className="text-[10px] font-mono opacity-50">
                Tomas Beguan © {new Date().getFullYear()}
            </p>
        </footer>
    );
}
