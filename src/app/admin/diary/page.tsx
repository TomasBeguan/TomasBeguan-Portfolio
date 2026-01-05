"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import { cn } from "@/lib/utils";
import { Plus, Trash, ArrowUp, ArrowDown, Save, LogOut } from "lucide-react";
import { ImageUploader } from "@/components/Admin/ImageUploader";

interface DiaryPage {
    id: string;
    front: string;
    back: string;
}

interface DiaryData {
    cover: string;
    backCover: string;
    pages: DiaryPage[];
    aspectRatio?: string;
    borderRadius?: string;
}

export default function DiaryAdminPage() {
    const [diary, setDiary] = useState<DiaryData>({ cover: '', backCover: '', pages: [], aspectRatio: '14/10', borderRadius: '4px' });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check Auth
        fetch('/api/auth/check')
            .then(res => {
                if (!res.ok) {
                    router.push('/admin/login');
                } else {
                    setLoading(false);
                    // Load diary data
                    fetch('/api/diary')
                        .then(res => res.json())
                        .then(data => {
                            if (data && !data.error) {
                                setDiary({
                                    ...data,
                                    aspectRatio: data.aspectRatio || '14/10',
                                    borderRadius: data.borderRadius || '4px'
                                });
                            }
                        });
                }
            });
    }, [router]);

    const handleSave = async () => {
        const res = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(diary)
        });

        if (res.ok) {
            alert('Diary saved!');
        } else {
            alert('Error saving diary');
        }
    };

    const addPage = () => {
        const newPage: DiaryPage = {
            id: Date.now().toString(),
            front: '',
            back: ''
        };
        setDiary({ ...diary, pages: [...diary.pages, newPage] });
    };

    const removePage = (id: string) => {
        setDiary({ ...diary, pages: diary.pages.filter(p => p.id !== id) });
    };

    const movePage = (index: number, direction: 'up' | 'down') => {
        const newPages = [...diary.pages];
        if (direction === 'up' && index > 0) {
            [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
        } else if (direction === 'down' && index < newPages.length - 1) {
            [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
        }
        setDiary({ ...diary, pages: newPages });
    };

    const updatePage = (id: string, updates: Partial<DiaryPage>) => {
        setDiary({
            ...diary,
            pages: diary.pages.map(p => p.id === id ? { ...p, ...updates } : p)
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">LOADING SYSTEM...</div>;

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-16">
            <RetroContainer title="DIARY CMS" onBack={() => router.push('/admin')} className="md:flex-1 md:min-h-0 mb-3 max-w-4xl w-full">
                <div className="flex flex-col gap-8 p-4">

                    <div className="flex justify-between items-center bg-gray-100 p-4 border-2 border-dashed border-black">
                        <h2 className="font-chicago text-xl">DIARY CONFIGURATION</h2>
                        <div className="flex gap-2">
                            <RetroButton onClick={handleSave} className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                                <Save size={16} /> SAVE DIARY
                            </RetroButton>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Book Proportions */}
                        <div className="bg-white border-2 border-black p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="font-chicago text-[10px] uppercase">Book Proportions</label>
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-chicago text-gray-400">CUSTOM:</span>
                                    <input
                                        type="text"
                                        value={diary.aspectRatio}
                                        onChange={(e) => setDiary({ ...diary, aspectRatio: e.target.value })}
                                        placeholder="14/10"
                                        className="border-2 border-black px-1 py-0.5 text-[10px] font-chicago w-16 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['1/1', '4/3', '14/10', '16/9', '10/14'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setDiary({ ...diary, aspectRatio: v })}
                                        className={cn(
                                            "px-2 py-1 border-2 text-[10px] font-chicago transition-all",
                                            diary.aspectRatio === v ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"
                                        )}
                                    >
                                        {v}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setDiary({ ...diary, aspectRatio: 'cover' })}
                                    className={cn(
                                        "px-2 py-1 border-2 text-[10px] font-chicago transition-all bg-retro-green/10",
                                        diary.aspectRatio === 'cover' ? "bg-black text-retro-green border-black" : "text-retro-green border-retro-green/30 hover:border-retro-green"
                                    )}
                                >
                                    AUTO (COVER)
                                </button>
                            </div>
                        </div>

                        {/* Page Rounding */}
                        <div className="bg-white border-2 border-black p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="font-chicago text-[10px] uppercase">Page Rounding</label>
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-chicago text-gray-400">CUSTOM:</span>
                                    <input
                                        type="text"
                                        value={diary.borderRadius}
                                        onChange={(e) => setDiary({ ...diary, borderRadius: e.target.value })}
                                        placeholder="4px"
                                        className="border-2 border-black px-1 py-0.5 text-[10px] font-chicago w-16 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: 'Sharp', value: '0px' },
                                    { label: 'Soft', value: '4px' },
                                    { label: 'Round', value: '15px' },
                                    { label: 'Oval', value: '40px' },
                                    { label: 'Full', value: '100px' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setDiary({ ...diary, borderRadius: opt.value })}
                                        className={cn(
                                            "px-2 py-1 border-2 text-[10px] font-chicago transition-all",
                                            diary.borderRadius === opt.value ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase text-sm">Main Cover</label>
                            <ImageUploader
                                currentValue={diary.cover}
                                onUpload={(url) => setDiary({ ...diary, cover: url })}
                            />
                            {diary.cover && <img src={diary.cover} className="h-40 object-contain border-2 border-black mt-2 self-center" alt="Cover preview" />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase text-sm">Back Cover</label>
                            <ImageUploader
                                currentValue={diary.backCover}
                                onUpload={(url) => setDiary({ ...diary, backCover: url })}
                            />
                            {diary.backCover && <img src={diary.backCover} className="h-40 object-contain border-2 border-black mt-2 self-center" alt="Back cover preview" />}
                        </div>
                    </div>

                    <div className="border-t-2 border-black pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-chicago text-lg">INNER PAGES ({diary.pages.length})</h3>
                            <RetroButton onClick={addPage} className="flex items-center gap-2 text-xs">
                                <Plus size={14} /> ADD NEW LEAF
                            </RetroButton>
                        </div>

                        <div className="flex flex-col gap-6">
                            {diary.pages.map((page, index) => (
                                <div key={page.id} className="border-2 border-black bg-white p-4 relative group shadow-retro transition-all hover:-translate-y-1">
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-black text-white font-chicago px-2 py-1 text-xs border-2 border-white">
                                        LEAF {index + 1}
                                    </div>

                                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => movePage(index, 'up')} className="hover:bg-gray-200 p-1"><ArrowUp size={16} /></button>
                                        <button onClick={() => movePage(index, 'down')} className="hover:bg-gray-200 p-1"><ArrowDown size={16} /></button>
                                        <button onClick={() => removePage(page.id)} className="text-red-500 hover:bg-red-50 p-1"><Trash size={16} /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase text-gray-400">Front (Right Side)</label>
                                            <ImageUploader
                                                currentValue={page.front}
                                                onUpload={(url) => updatePage(page.id, { front: url })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase text-gray-400">Back (Left Side)</label>
                                            <ImageUploader
                                                currentValue={page.back}
                                                onUpload={(url) => updatePage(page.id, { back: url })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {diary.pages.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 text-gray-400 font-chicago italic">
                                    NO INTERIOR PAGES ADDED YET
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
