"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import { cn } from "@/lib/utils";
import { Plus, Trash, ArrowUp, ArrowDown, Save, LogOut, Eye, EyeOff, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { ImageUploader } from "@/components/Admin/ImageUploader";

export interface Fanzine {
    id: string;
    slug: string;
    title: string;
    author: string;
    sourceImage: string;
    active: boolean;
    date: string;
}

export default function FanzinesAdminPage() {
    const [fanzines, setFanzines] = useState<Fanzine[]>([]);
    const [editingFanzine, setEditingFanzine] = useState<Fanzine | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check Auth
        fetch('/api/auth/check')
            .then(res => {
                if (!res.ok) {
                    router.push('/admin/login');
                } else {
                    setLoading(false);
                    fetch('/api/fanzines')
                        .then(res => res.json())
                        .then(data => {
                            setFanzines(data);
                            setHasUnsavedOrder(false);
                        });
                }
            });
    }, [router]);

    const handleCreateFanzine = () => {
        const newFanzine: Fanzine = {
            id: Date.now().toString(),
            title: "New Fanzine",
            slug: "new-fanzine-" + Date.now(),
            author: "Tomás Beguan",
            date: new Date().toISOString().split('T')[0],
            sourceImage: "",
            active: false
        };
        setEditingFanzine(newFanzine);
    };

    const handleToggleActive = async (fanzine: Fanzine, e: React.MouseEvent) => {
        e.stopPropagation();

        const updatedFanzine = { ...fanzine, active: !fanzine.active };
        setFanzines(fanzines.map(f => f.id === fanzine.id ? updatedFanzine : f));

        const res = await fetch('/api/fanzines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFanzine)
        });

        if (res.ok) {
            fetch('/api/fanzines').then(res => res.json()).then(data => setFanzines(data));
        } else {
            alert('Error updating fanzine status');
            fetch('/api/fanzines').then(res => res.json()).then(data => setFanzines(data));
        }
    };

    const handleMoveFanzine = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === fanzines.length - 1) return;

        const newFanzines = [...fanzines];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newFanzines[index], newFanzines[targetIndex]] = [newFanzines[targetIndex], newFanzines[index]];

        setFanzines(newFanzines);
        setHasUnsavedOrder(true);
    };

    const handleSaveOrder = async () => {
        const orderedIds = fanzines.map(f => f.id);
        const res = await fetch('/api/fanzines/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds })
        });

        if (res.ok) {
            setHasUnsavedOrder(false);
            alert('Order saved successfully!');
        } else {
            alert('Error saving order');
        }
    };

    const handleSaveFanzine = async () => {
        if (!editingFanzine) return;

        const res = await fetch('/api/fanzines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingFanzine)
        });

        if (res.ok) {
            alert('Fanzine saved!');
            fetch('/api/fanzines').then(res => res.json()).then(data => setFanzines(data));
            setEditingFanzine(null);
        } else {
            alert('Error saving fanzine');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">LOADING SYSTEM...</div>;

    if (editingFanzine) {
        return (
            <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
                <RetroContainer title={`Editing Fanzine: ${editingFanzine.title}`} onBack={() => setEditingFanzine(null)} className="md:flex-1 md:min-h-0 md:mt-8 mb-3 w-full max-w-4xl">
                    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full pb-32">
                        <div className="flex flex-col gap-2 pb-4">
                            <label className="font-bold">Title</label>
                            <input
                                value={editingFanzine.title || ''}
                                onChange={e => setEditingFanzine({ ...editingFanzine, title: e.target.value })}
                                className="border-2 border-black p-2 font-mono"
                            />
                            <label className="font-bold">Author</label>
                            <input
                                value={editingFanzine.author || ''}
                                onChange={e => setEditingFanzine({ ...editingFanzine, author: e.target.value })}
                                className="border-2 border-black p-2 font-mono"
                            />
                            <label className="font-bold">Slug (URL: /fanzine/[slug])</label>
                            <input
                                value={editingFanzine.slug || ''}
                                onChange={e => setEditingFanzine({ ...editingFanzine, slug: e.target.value })}
                                className="border-2 border-black p-2 font-mono text-sm text-gray-600"
                            />
                            <label className="font-bold">Date</label>
                            <input
                                type="date"
                                value={editingFanzine.date}
                                onChange={e => setEditingFanzine({ ...editingFanzine, date: e.target.value })}
                                className="border-2 border-black p-2 font-mono"
                            />
                            
                            <div className="mt-4 p-4 border-2 border-black bg-gray-50">
                                <label className="font-bold text-lg mb-2 block text-retro-green">Source Image (The 8-panel Zine Sheet)</label>
                                <p className="text-sm mb-4 text-gray-600">
                                    Upload the full sheet containing the 8 panels. The system will automatically extract the cover and all pages in the correct reading order.
                                </p>
                                <ImageUploader
                                    currentValue={editingFanzine.sourceImage}
                                    onUpload={(url) => setEditingFanzine({ ...editingFanzine, sourceImage: url })}
                                    maxWidth={4000} // Keep high res for fanzines
                                    quality={0.95}
                                />
                                {editingFanzine.sourceImage && (
                                    <div className="mt-4 border border-dashed border-gray-400 p-2 text-center">
                                        <p className="text-xs font-bold text-gray-500 mb-2">PREVIEW (RAW IMAGE)</p>
                                        <img src={editingFanzine.sourceImage} alt="Raw sheet" className="max-h-64 mx-auto object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button - Floating Fixed */}
                        <div className="fixed bottom-8 right-8 z-[100]">
                            <RetroButton
                                onClick={handleSaveFanzine}
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white border-green-700 flex gap-2 items-center justify-center py-3 px-6 shadow-retro hover:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            >
                                <Save size={20} />
                                <span className="font-bold">Save Fanzine</span>
                            </RetroButton>
                        </div>
                    </div>
                </RetroContainer >
            </main >
        );
    }

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer title="Fanzines CMS Admin" onBack={() => router.push('/admin')} className="md:flex-1 md:min-h-0 md:mt-8 mb-3 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Fanzines</h1>
                    <div className="flex gap-2">
                        {hasUnsavedOrder && (
                            <RetroButton onClick={handleSaveOrder} className="bg-green-100 border-green-600 text-green-700 animate-pulse">
                                <Save size={16} /> Save Order
                            </RetroButton>
                        )}
                        <RetroButton onClick={handleCreateFanzine}><Plus size={16} /> New Fanzine</RetroButton>
                    </div>
                </div>
                <Reorder.Group axis="y" values={fanzines} onReorder={(newOrder) => {
                    setFanzines(newOrder);
                    setHasUnsavedOrder(true);
                }} className="flex flex-col gap-2">
                    {fanzines.map((fanzine, index) => (
                        <Reorder.Item
                            key={fanzine.id}
                            value={fanzine}
                            className={`border border-black p-2 flex justify-between items-center bg-white hover:bg-gray-100 cursor-pointer ${!fanzine.active ? 'opacity-50 bg-gray-50' : ''}`}
                            onClick={() => setEditingFanzine(fanzine)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex items-center mr-2 text-gray-400 cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}>
                                    <GripVertical size={20} />
                                </div>
                                <div className="flex flex-col mr-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleMoveFanzine(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-500 hover:text-black disabled:opacity-20"
                                    >
                                        <ArrowUp size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleMoveFanzine(index, 'down')}
                                        disabled={index === fanzines.length - 1}
                                        className="text-gray-500 hover:text-black disabled:opacity-20"
                                    >
                                        <ArrowDown size={12} />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => handleToggleActive(fanzine, e)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title={fanzine.active ? "Deactivate" : "Activate"}
                                >
                                    {fanzine.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                {fanzine.sourceImage && (
                                    <div className="w-10 h-14 border border-black overflow-hidden relative">
                                        {/* CSS cropping to show cover (col 2, row 2) */}
                                        <div 
                                            className="absolute inset-0 w-full h-full"
                                            style={{
                                                backgroundImage: `url(${fanzine.sourceImage})`,
                                                backgroundSize: '400% 200%',
                                                backgroundPosition: '33.333% 100%'
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold">{fanzine.title}</span>
                                    <span className="text-[10px] text-gray-500">by {fanzine.author}</span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{fanzine.date}</span>
                        </Reorder.Item>
                    ))}
                    {fanzines.length === 0 && (
                        <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300">
                            No fanzines found. Create one!
                        </div>
                    )}
                </Reorder.Group>
            </RetroContainer>
        </main>
    );
}
