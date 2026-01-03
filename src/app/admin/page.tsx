"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import { Block, Post, BlockType } from "@/types";
import { cn } from "@/lib/utils";
import { Plus, Trash, ArrowUp, ArrowDown, Save, LogOut, Eye, EyeOff } from "lucide-react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { ModelUploader } from "@/components/Admin/ModelUploader";

const CATEGORIES = [
    { es: "Animación 3D", en: "3D Animation" },
    { es: "Modelo 3D", en: "3D Model" },
    { es: "Texturizado 3D", en: "3D Texturing" },
    { es: "Arte digital", en: "Digital art" },
    { es: "Arte tradicional", en: "Traditional art" },
    { es: "Animación 2D", en: "2D Animation" },
    { es: "Desarrollo de videojuegos", en: "Game development" },
    { es: "Fotografía", en: "Photography" },
];

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editLang, setEditLang] = useState<'es' | 'en'>('es');
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
                    // Load posts
                    fetch('/api/posts')
                        .then(res => res.json())
                        .then(data => setPosts(data));
                }
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const handleCreatePost = () => {
        const newPost: Post = {
            id: Date.now().toString(),
            title: "New Project",
            slug: "new-project-" + Date.now(),
            date: new Date().toISOString().split('T')[0],
            thumbnail: "",
            blocks: []
        };
        setEditingPost(newPost);
    };

    const handleToggleActive = async (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();

        // Optimistic update - immediately update UI
        const updatedPost = { ...post, active: !post.active };
        setPosts(posts.map(p => p.id === post.id ? updatedPost : p));

        // Then update server
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost)
        });

        if (res.ok) {
            // Refresh list to ensure sync with server
            fetch('/api/posts').then(res => res.json()).then(data => setPosts(data));
        } else {
            alert('Error updating post status');
            // Revert optimistic update on error
            fetch('/api/posts').then(res => res.json()).then(data => setPosts(data));
        }
    };

    const handleMovePost = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === posts.length - 1) return;

        const newPosts = [...posts];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];

        // Optimistic update
        setPosts(newPosts);

        // Send new order to server
        const orderedIds = newPosts.map(p => p.id);
        const res = await fetch('/api/posts/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds })
        });

        if (!res.ok) {
            alert('Error reordering posts');
            // Revert
            fetch('/api/posts').then(res => res.json()).then(data => setPosts(data));
        }
    };


    const handleSavePost = async () => {
        if (!editingPost) return;

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingPost)
        });

        if (res.ok) {
            alert('Post saved!');
            // Refresh list
            fetch('/api/posts').then(res => res.json()).then(data => setPosts(data));
            setEditingPost(null);
        } else {
            alert('Error saving post');
        }
    };

    const addBlock = (type: BlockType) => {
        if (!editingPost) return;
        const newBlock: Block = {
            id: Date.now().toString(),
            type,
            content: "",
            items: type === 'grid' ? [] : undefined
        };
        setEditingPost({
            ...editingPost,
            blocks: [...editingPost.blocks, newBlock]
        });
    };

    const updateBlock = (id: string, updates: Partial<Block>) => {
        if (!editingPost) return;
        setEditingPost({
            ...editingPost,
            blocks: editingPost.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
        });
    };

    const removeBlock = (id: string) => {
        if (!editingPost) return;
        setEditingPost({
            ...editingPost,
            blocks: editingPost.blocks.filter(b => b.id !== id)
        });
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (!editingPost) return;
        const newBlocks = [...editingPost.blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        setEditingPost({ ...editingPost, blocks: newBlocks });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">LOADING SYSTEM...</div>;

    if (editingPost) {
        return (
            <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
                <RetroContainer title={`Editing: ${editingPost.title}`} onBack={() => setEditingPost(null)} className="md:flex-1 md:min-h-0 md:mt-8 mb-3">
                    <div className="flex flex-col gap-4">
                        {/* Language Toggle */}
                        <div className="flex bg-gray-200 border-2 border-black p-1 gap-1 self-start sticky top-0 z-20">
                            <button
                                onClick={() => setEditLang('es')}
                                className={cn(
                                    "px-4 py-1 font-chicago text-xs transition-all",
                                    editLang === 'es' ? "bg-black text-white" : "hover:bg-gray-300"
                                )}
                            >
                                ESPAÑOL
                            </button>
                            <button
                                onClick={() => setEditLang('en')}
                                className={cn(
                                    "px-4 py-1 font-chicago text-xs transition-all",
                                    editLang === 'en' ? "bg-black text-white" : "hover:bg-gray-300"
                                )}
                            >
                                ENGLISH
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 border-b-2 border-black pb-4">
                            <label className="font-bold">Title ({editLang.toUpperCase()})</label>
                            <input
                                value={(editLang === 'en' ? editingPost.title_en : editingPost.title) || ''}
                                onChange={e => {
                                    if (editLang === 'en') {
                                        setEditingPost({ ...editingPost, title_en: e.target.value });
                                    } else {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                        setEditingPost({ ...editingPost, title, slug });
                                    }
                                }}
                                className="border-2 border-black p-2 font-mono"
                            />
                            <label className="font-bold">Slug (URL)</label>
                            <input
                                value={editingPost.slug || ''}
                                onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })}
                                className="border-2 border-black p-2 font-mono text-sm text-gray-600"
                            />
                            <label className="font-bold">Date</label>
                            <input
                                type="date"
                                value={editingPost.date}
                                onChange={e => setEditingPost({ ...editingPost, date: e.target.value })}
                                className="border-2 border-black p-2 font-mono"
                            />
                            <label className="font-bold">Thumbnail</label>
                            <ImageUploader
                                currentValue={editingPost.thumbnail}
                                onUpload={(url, width, height) => setEditingPost({
                                    ...editingPost,
                                    thumbnail: url,
                                    thumbnailWidth: width,
                                    thumbnailHeight: height
                                })}
                                maxWidth={800}
                                quality={0.95}
                            />
                            <label className="font-bold mt-2">Thumbnail 3D Model (Optional)</label>
                            <ModelUploader
                                currentValue={editingPost.thumbnailModel}
                                onUpload={(url) => setEditingPost({ ...editingPost, thumbnailModel: url })}
                            />
                            {editingPost.thumbnailModel && (
                                <div className="flex flex-col gap-1 mt-2">
                                    <label className="text-xs font-bold">3D Thumbnail Background</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            value={editingPost.thumbnail3dBackgroundColor || '#f9fafb'}
                                            onChange={e => setEditingPost({ ...editingPost, thumbnail3dBackgroundColor: e.target.value })}
                                            className="h-8 w-12 cursor-pointer border border-black"
                                        />
                                        <button
                                            onClick={() => setEditingPost({ ...editingPost, thumbnail3dBackgroundColor: undefined })}
                                            className="text-xs underline text-red-500"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="border-t-2 border-black pt-4 mt-2">
                                <label className="font-bold block mb-2">Card Customization</label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold">Card Background</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={editingPost.cardBackgroundColor || '#f9fafb'}
                                                    onChange={e => setEditingPost({ ...editingPost, cardBackgroundColor: e.target.value })}
                                                    className="h-8 w-12 cursor-pointer border border-black"
                                                    disabled={editingPost.usePostBackgroundForCard}
                                                />
                                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={editingPost.usePostBackgroundForCard || false}
                                                        onChange={e => setEditingPost({ ...editingPost, usePostBackgroundForCard: e.target.checked })}
                                                        className="accent-black"
                                                    />
                                                    Use Post Background
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold">Card Text</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={editingPost.cardTextColor || '#333333'}
                                                    onChange={e => setEditingPost({ ...editingPost, cardTextColor: e.target.value })}
                                                    className="h-8 w-12 cursor-pointer border border-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold">Category ({editLang.toUpperCase()})</label>
                                        <select
                                            value={(editLang === 'en' ? editingPost.category_en : editingPost.category) || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                const cat = CATEGORIES.find(c => c.es === val || c.en === val);
                                                if (cat) {
                                                    setEditingPost({
                                                        ...editingPost,
                                                        category: cat.es,
                                                        category_en: cat.en
                                                    });
                                                } else {
                                                    setEditingPost({
                                                        ...editingPost,
                                                        category: val,
                                                        category_en: val
                                                    });
                                                }
                                            }}
                                            className="border border-black p-2 font-mono text-sm"
                                        >
                                            <option value="">Select Category...</option>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.en} value={editLang === 'en' ? cat.en : cat.es}>
                                                    {editLang === 'en' ? cat.en : cat.es}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-2 border-black pt-4 mt-2">
                                <label className="font-bold block mb-2">Post Background</label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold">Background Color</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={editingPost.backgroundColor || '#ffffff'}
                                                onChange={e => setEditingPost({ ...editingPost, backgroundColor: e.target.value })}
                                                className="h-8 w-12 cursor-pointer border border-black"
                                            />
                                            <button
                                                onClick={() => setEditingPost({ ...editingPost, backgroundColor: undefined })}
                                                className="text-xs underline text-red-500"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold">Text Color</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={editingPost.textColor || '#000000'}
                                                onChange={e => setEditingPost({ ...editingPost, textColor: e.target.value })}
                                                className="h-8 w-12 cursor-pointer border border-black"
                                            />
                                            <button
                                                onClick={() => setEditingPost({ ...editingPost, textColor: undefined })}
                                                className="text-xs underline text-red-500"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold">Background Image</label>
                                        <ImageUploader
                                            currentValue={editingPost.backgroundImage || ''}
                                            onUpload={(url) => setEditingPost({ ...editingPost, backgroundImage: url })}
                                        />
                                    </div>

                                    {editingPost.backgroundImage && (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold">Image Opacity ({editingPost.backgroundOpacity || 100}%)</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={editingPost.backgroundOpacity ?? 100}
                                                    onChange={e => setEditingPost({ ...editingPost, backgroundOpacity: parseInt(e.target.value) })}
                                                    className="w-full cursor-pointer accent-black"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold">Blend Mode</label>
                                                <select
                                                    value={editingPost.backgroundBlendMode || 'normal'}
                                                    onChange={e => setEditingPost({ ...editingPost, backgroundBlendMode: e.target.value })}
                                                    className="border border-black p-2 font-mono text-sm"
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="multiply">Multiply</option>
                                                    <option value="screen">Screen</option>
                                                    <option value="overlay">Overlay</option>
                                                    <option value="darken">Darken</option>
                                                    <option value="lighten">Lighten</option>
                                                    <option value="color-dodge">Color Dodge</option>
                                                    <option value="color-burn">Color Burn</option>
                                                    <option value="hard-light">Hard Light</option>
                                                    <option value="soft-light">Soft Light</option>
                                                    <option value="difference">Difference</option>
                                                    <option value="exclusion">Exclusion</option>
                                                    <option value="hue">Hue</option>
                                                    <option value="saturation">Saturation</option>
                                                    <option value="color">Color</option>
                                                    <option value="luminosity">Luminosity</option>
                                                </select>
                                                {/* Mini Preview */}
                                                <div className="h-12 w-full border border-black mt-1 relative overflow-hidden">
                                                    <div
                                                        className="absolute inset-0 z-0"
                                                        style={{ backgroundColor: editingPost.backgroundColor || '#ffffff' }}
                                                    />
                                                    <div
                                                        className="absolute inset-0 z-1"
                                                        style={{
                                                            backgroundImage: `url(${editingPost.backgroundImage})`,
                                                            backgroundSize: editingPost.backgroundSize || (editingPost.backgroundMode === 'cover' ? 'cover' : editingPost.backgroundMode === 'contain' ? 'contain' : editingPost.backgroundMode === 'stretch' ? '100% 100%' : 'auto'),
                                                            backgroundRepeat: editingPost.backgroundMode === 'repeat' ? 'repeat' : 'no-repeat',
                                                            backgroundPosition: 'center',
                                                            opacity: (editingPost.backgroundOpacity || 100) / 100,
                                                            mixBlendMode: editingPost.backgroundBlendMode as any || 'normal'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold">Image Size (Dimension)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={editingPost.backgroundSize || ''}
                                                        onChange={e => setEditingPost({ ...editingPost, backgroundSize: e.target.value })}
                                                        className="border border-black p-2 font-mono text-sm flex-1"
                                                        placeholder="e.g. 50%, 300px, cover"
                                                    />
                                                    {/* Quick Scale Slider Helper */}
                                                    <div className="flex flex-col gap-0 w-24">
                                                        <label className="text-[10px] text-gray-500">Scale Helper</label>
                                                        <input
                                                            type="range"
                                                            min="10"
                                                            max="200"
                                                            step="10"
                                                            defaultValue="100"
                                                            onChange={e => setEditingPost({ ...editingPost, backgroundSize: `${e.target.value}%` })}
                                                            className="w-full cursor-pointer accent-gray-500 h-4"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold">Image Fill Mode</label>
                                                <select
                                                    value={editingPost.backgroundMode || 'cover'}
                                                    onChange={e => setEditingPost({ ...editingPost, backgroundMode: e.target.value as any })}
                                                    className="border border-black p-2 font-mono text-sm"
                                                >
                                                    <option value="cover">Cover (Crop to Fill)</option>
                                                    <option value="contain">Contain (Fit)</option>
                                                    <option value="stretch">Stretch (Fill)</option>
                                                    <option value="repeat">Repeat (Pattern)</option>
                                                    <option value="no-repeat">No Repeat</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {editingPost.blocks.map((block, index) => (
                                <div key={block.id} className="border border-gray-400 p-2 bg-gray-50 relative group">
                                    <div className="absolute right-2 top-2 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => moveBlock(index, 'up')}><ArrowUp size={16} /></button>
                                        <button onClick={() => moveBlock(index, 'down')}><ArrowDown size={16} /></button>
                                        <button onClick={() => removeBlock(block.id)} className="text-red-500"><Trash size={16} /></button>
                                    </div>
                                    <span className="text-xs font-bold uppercase text-gray-500 mb-2 block">{block.type}</span>

                                    {block.type === 'text' || block.type === 'header' || block.type === 'subtitle' ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold">Content ({editLang.toUpperCase()})</label>
                                                <span className="text-[10px] text-gray-400 italic">Editing {editLang === 'es' ? 'Spanish' : 'English'} version</span>
                                            </div>
                                            <textarea
                                                id={`textarea-${block.id}`}
                                                value={(editLang === 'en' ? block.content_en : block.content) || ''}
                                                onChange={e => updateBlock(block.id, editLang === 'en' ? { content_en: e.target.value } : { content: e.target.value })}
                                                className="w-full border border-black p-1 font-mono h-24 text-sm"
                                            />
                                            <div className="flex gap-2 flex-wrap items-center">
                                                <button
                                                    className="text-xs border border-black px-2 hover:bg-black hover:text-white transition-colors font-bold"
                                                    onClick={() => {
                                                        const textarea = document.getElementById(`textarea-${block.id}`) as HTMLTextAreaElement;
                                                        if (textarea) {
                                                            const start = textarea.selectionStart;
                                                            const end = textarea.selectionEnd;
                                                            const text = textarea.value;
                                                            const selected = text.substring(start, end);
                                                            const newText = text.substring(0, start) + `**${selected || 'bold'}**` + text.substring(end);
                                                            updateBlock(block.id, editLang === 'en' ? { content_en: newText } : { content: newText });
                                                        }
                                                    }}
                                                >
                                                    B
                                                </button>
                                                <button
                                                    className="text-xs border border-black px-2 hover:bg-black hover:text-white transition-colors italic font-serif"
                                                    onClick={() => {
                                                        const textarea = document.getElementById(`textarea-${block.id}`) as HTMLTextAreaElement;
                                                        if (textarea) {
                                                            const start = textarea.selectionStart;
                                                            const end = textarea.selectionEnd;
                                                            const text = textarea.value;
                                                            const selected = text.substring(start, end);
                                                            const newText = text.substring(0, start) + `*${selected || 'italic'}*` + text.substring(end);
                                                            updateBlock(block.id, editLang === 'en' ? { content_en: newText } : { content: newText });
                                                        }
                                                    }}
                                                >
                                                    i
                                                </button>
                                                <button
                                                    className="text-xs border border-black px-2 hover:bg-black hover:text-white transition-colors"
                                                    onClick={() => {
                                                        const textarea = document.getElementById(`textarea-${block.id}`) as HTMLTextAreaElement;
                                                        if (textarea) {
                                                            const start = textarea.selectionStart;
                                                            const end = textarea.selectionEnd;
                                                            const text = textarea.value;
                                                            const selected = text.substring(start, end);
                                                            const newText = text.substring(0, start) + `[${selected || 'text'}](${block.linkColor || '#7c3aed'})` + text.substring(end);
                                                            updateBlock(block.id, editLang === 'en' ? { content_en: newText } : { content: newText });
                                                        }
                                                    }}
                                                >
                                                    Link
                                                </button>

                                                <div className="flex items-center gap-1 border-l pl-2 border-gray-300">
                                                    <span className="text-[10px] font-bold">COLOR</span>
                                                    <input
                                                        type="color"
                                                        id={`color-picker-${block.id}`}
                                                        className="h-6 w-8 cursor-pointer border border-black p-0"
                                                        defaultValue="#ff0000"
                                                    />
                                                    <button
                                                        className="text-xs border border-black px-2 hover:bg-black hover:text-white transition-colors"
                                                        onClick={() => {
                                                            const textarea = document.getElementById(`textarea-${block.id}`) as HTMLTextAreaElement;
                                                            const colorInput = document.getElementById(`color-picker-${block.id}`) as HTMLInputElement;

                                                            if (textarea && colorInput) {
                                                                const color = colorInput.value;
                                                                const start = textarea.selectionStart;
                                                                const end = textarea.selectionEnd;
                                                                const text = textarea.value;
                                                                const selected = text.substring(start, end);
                                                                const newText = text.substring(0, start) + `[${selected || 'text'}]\{${color}\}` + text.substring(end);
                                                                updateBlock(block.id, editLang === 'en' ? { content_en: newText } : { content: newText });
                                                            }
                                                        }}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 ml-auto">
                                                    <label className="text-xs font-bold">Link Color</label>
                                                    <input
                                                        type="color"
                                                        value={block.linkColor || '#7c3aed'}
                                                        onChange={e => updateBlock(block.id, { linkColor: e.target.value })}
                                                        className="h-6 w-12 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : block.type === 'image' ? (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold">Image URL</label>
                                            <ImageUploader
                                                currentValue={block.content}
                                                onUpload={(url, width, height) => updateBlock(block.id, {
                                                    content: url,
                                                    width,
                                                    height
                                                })}
                                            />
                                            <label className="text-xs font-bold mt-2">Alt Text / Caption ({editLang.toUpperCase()})</label>
                                            <input
                                                value={(editLang === 'en' ? block.altText_en : block.altText) || ''}
                                                onChange={e => updateBlock(block.id, editLang === 'en' ? { altText_en: e.target.value } : { altText: e.target.value })}
                                                className="border border-black p-2 font-mono text-sm"
                                                placeholder="Description for modal..."
                                            />
                                            {block.content && <img src={block.content} alt="Preview" className="max-h-40 object-contain border border-gray-300 mt-2" />}
                                            <label className="flex items-center gap-2 text-xs cursor-pointer select-none mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={block.noBorder || false}
                                                    onChange={e => updateBlock(block.id, { noBorder: e.target.checked })}
                                                    className="accent-black"
                                                />
                                                No Border
                                            </label>
                                            <label className="flex items-center gap-2 text-xs cursor-pointer select-none mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={block.pixelate || false}
                                                    onChange={e => updateBlock(block.id, { pixelate: e.target.checked })}
                                                    className="accent-black"
                                                />
                                                Pixelate Image (Nearest Neighbor)
                                            </label>
                                        </div>
                                    ) : block.type === 'video' ? (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold">Video URL (YouTube/Vimeo)</label>
                                            <input
                                                value={block.content}
                                                onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                className="border border-black p-2 font-mono text-sm"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                            <label className="text-xs font-bold mt-2">Video Title ({editLang.toUpperCase()})</label>
                                            <input
                                                value={(editLang === 'en' ? block.altText_en : block.altText) || ''}
                                                onChange={e => updateBlock(block.id, editLang === 'en' ? { altText_en: e.target.value } : { altText: e.target.value })}
                                                className="border border-black p-2 font-mono text-sm"
                                                placeholder="Title for the player bar..."
                                            />
                                        </div>
                                    ) : block.type === 'grid' ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold">Grid Images</label>
                                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={block.noBorder || false}
                                                        onChange={e => updateBlock(block.id, { noBorder: e.target.checked })}
                                                        className="accent-black"
                                                    />
                                                    No Border
                                                </label>
                                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={block.pixelate || false}
                                                        onChange={e => updateBlock(block.id, { pixelate: e.target.checked })}
                                                        className="accent-black"
                                                    />
                                                    Pixelate
                                                </label>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {block.items?.map((item, i) => (
                                                    <div key={i} className="flex gap-2 items-start border border-gray-300 p-2 relative group">
                                                        <div className="h-24 min-w-[3rem] max-w-[12rem] flex-shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                            <img src={item} alt="" className="h-full w-auto object-contain" />
                                                        </div>
                                                        <div className="flex flex-col gap-1 flex-1">
                                                            <label className="text-xs font-bold">Alt Text ({editLang.toUpperCase()})</label>
                                                            <input
                                                                value={((editLang === 'en' ? block.itemAlts_en : block.itemAlts) || [])[i] || ''}
                                                                onChange={e => {
                                                                    const currentAlts = editLang === 'en' ? (block.itemAlts_en || []) : (block.itemAlts || []);
                                                                    const newAlts = [...currentAlts];
                                                                    // Ensure array is long enough
                                                                    while (newAlts.length <= i) newAlts.push('');
                                                                    newAlts[i] = e.target.value;
                                                                    updateBlock(block.id, editLang === 'en' ? { itemAlts_en: newAlts } : { itemAlts: newAlts });
                                                                }}
                                                                className="border border-black p-1 font-mono text-xs w-full"
                                                                placeholder="Caption..."
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newItems = block.items?.filter((_, idx) => idx !== i);
                                                                const newAlts = block.itemAlts?.filter((_, idx) => idx !== i);
                                                                updateBlock(block.id, { items: newItems, itemAlts: newAlts });
                                                            }}
                                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="w-full h-24 border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-xs text-gray-400 font-bold">ADD IMAGE</span>
                                                        <ImageUploader
                                                            currentValue=""
                                                            onUpload={(url) => {
                                                                const newItems = [...(block.items || []), url];
                                                                const newAlts = [...(block.itemAlts || []), ''];
                                                                updateBlock(block.id, { items: newItems, itemAlts: newAlts });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : block.type === 'link' ? (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold">Buttons</label>
                                            <div className="flex flex-col gap-4">
                                                {(block.buttons && block.buttons.length > 0 ? block.buttons : [{
                                                    text: block.linkText || block.content || 'Button',
                                                    text_en: block.linkText_en,
                                                    url: block.linkUrl || '#',
                                                    bgColor: block.bgColor,
                                                    textColor: block.textColor,
                                                    borderColor: block.borderColor,
                                                    iconUrl: block.iconUrl
                                                }]).map((btn, i) => (
                                                    <div key={i} className="border border-gray-300 p-2 bg-white relative group">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex gap-2">
                                                                <div className="flex flex-col gap-1 flex-1">
                                                                    <label className="text-[10px] font-bold">Text ({editLang.toUpperCase()})</label>
                                                                    <input
                                                                        value={(editLang === 'en' ? btn.text_en : btn.text) || ''}
                                                                        onChange={e => {
                                                                            const newButtons = [...(block.buttons || [{
                                                                                text: block.linkText || block.content || 'Button',
                                                                                text_en: block.linkText_en,
                                                                                url: block.linkUrl || '#',
                                                                                bgColor: block.bgColor,
                                                                                textColor: block.textColor,
                                                                                borderColor: block.borderColor,
                                                                                iconUrl: block.iconUrl
                                                                            }])];
                                                                            if (editLang === 'en') {
                                                                                newButtons[i] = { ...newButtons[i], text_en: e.target.value };
                                                                            } else {
                                                                                newButtons[i] = { ...newButtons[i], text: e.target.value };
                                                                            }
                                                                            updateBlock(block.id, { buttons: newButtons });
                                                                        }}
                                                                        className="border border-black p-1 font-mono text-xs w-full"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1 flex-1">
                                                                    <label className="text-[10px] font-bold">URL</label>
                                                                    <input
                                                                        value={btn.url}
                                                                        onChange={e => {
                                                                            const url = e.target.value;
                                                                            const iconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
                                                                            const newButtons = [...(block.buttons || [{
                                                                                text: block.linkText || block.content || 'Button',
                                                                                url: block.linkUrl || '#',
                                                                                bgColor: block.bgColor,
                                                                                textColor: block.textColor,
                                                                                borderColor: block.borderColor,
                                                                                iconUrl: block.iconUrl
                                                                            }])];
                                                                            newButtons[i] = { ...newButtons[i], url, iconUrl };
                                                                            updateBlock(block.id, { buttons: newButtons });
                                                                        }}
                                                                        className="border border-black p-1 font-mono text-xs w-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="flex flex-col gap-1 flex-1">
                                                                    <label className="text-[10px] font-bold">BG</label>
                                                                    <input
                                                                        type="color"
                                                                        value={btn.bgColor || '#ffffff'}
                                                                        onChange={e => {
                                                                            const newButtons = [...(block.buttons || [{
                                                                                text: block.linkText || block.content || 'Button',
                                                                                url: block.linkUrl || '#',
                                                                                bgColor: block.bgColor,
                                                                                textColor: block.textColor,
                                                                                borderColor: block.borderColor,
                                                                                iconUrl: block.iconUrl
                                                                            }])];
                                                                            newButtons[i] = { ...newButtons[i], bgColor: e.target.value };
                                                                            updateBlock(block.id, { buttons: newButtons });
                                                                        }}
                                                                        className="h-6 w-full cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1 flex-1">
                                                                    <label className="text-[10px] font-bold">Text</label>
                                                                    <input
                                                                        type="color"
                                                                        value={btn.textColor || '#333333'}
                                                                        onChange={e => {
                                                                            const newButtons = [...(block.buttons || [{
                                                                                text: block.linkText || block.content || 'Button',
                                                                                url: block.linkUrl || '#',
                                                                                bgColor: block.bgColor,
                                                                                textColor: block.textColor,
                                                                                borderColor: block.borderColor,
                                                                                iconUrl: block.iconUrl
                                                                            }])];
                                                                            newButtons[i] = { ...newButtons[i], textColor: e.target.value };
                                                                            updateBlock(block.id, { buttons: newButtons });
                                                                        }}
                                                                        className="h-6 w-full cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1 flex-1">
                                                                    <label className="text-[10px] font-bold">Border</label>
                                                                    <input
                                                                        type="color"
                                                                        value={btn.borderColor || '#333333'}
                                                                        onChange={e => {
                                                                            const newButtons = [...(block.buttons || [{
                                                                                text: block.linkText || block.content || 'Button',
                                                                                url: block.linkUrl || '#',
                                                                                bgColor: block.bgColor,
                                                                                textColor: block.textColor,
                                                                                borderColor: block.borderColor,
                                                                                iconUrl: block.iconUrl
                                                                            }])];
                                                                            newButtons[i] = { ...newButtons[i], borderColor: e.target.value };
                                                                            updateBlock(block.id, { buttons: newButtons });
                                                                        }}
                                                                        className="h-6 w-full cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newButtons = (block.buttons || [{
                                                                    text: block.linkText || block.content || 'Button',
                                                                    url: block.linkUrl || '#',
                                                                    bgColor: block.bgColor,
                                                                    textColor: block.textColor,
                                                                    borderColor: block.borderColor,
                                                                    iconUrl: block.iconUrl
                                                                }]).filter((_, idx) => idx !== i);
                                                                updateBlock(block.id, { buttons: newButtons });
                                                            }}
                                                            className="absolute top-1 right-1 text-red-500 hover:bg-red-50 p-1 rounded"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <RetroButton
                                                    onClick={() => {
                                                        const currentButtons = block.buttons || [{
                                                            text: block.linkText || block.content || 'Button',
                                                            text_en: block.linkText_en,
                                                            url: block.linkUrl || '#',
                                                            bgColor: block.bgColor,
                                                            textColor: block.textColor,
                                                            borderColor: block.borderColor,
                                                            iconUrl: block.iconUrl
                                                        }];
                                                        updateBlock(block.id, {
                                                            buttons: [...currentButtons, {
                                                                text: 'New Button',
                                                                url: '#',
                                                                bgColor: '#ffffff',
                                                                textColor: '#000000',
                                                                borderColor: '#000000'
                                                            }]
                                                        });
                                                    }}
                                                    className="text-xs w-full justify-center py-2 border-dashed"
                                                >
                                                    <Plus size={14} /> Add Button
                                                </RetroButton>
                                            </div>
                                        </div>
                                    ) : block.type === 'model3d' ? (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold">3D Model (.glb/.gltf)</label>
                                            <ModelUploader
                                                currentValue={block.content}
                                                onUpload={(url) => updateBlock(block.id, { content: url })}
                                            />
                                            <label className="text-xs font-bold mt-2">Texture (Optional)</label>
                                            <ImageUploader
                                                currentValue={block.textureUrl || ''}
                                                onUpload={(url) => updateBlock(block.id, { textureUrl: url })}
                                            />
                                            <label className="text-xs font-bold mt-2">Alt Text / Caption ({editLang.toUpperCase()})</label>
                                            <input
                                                value={(editLang === 'en' ? block.altText_en : block.altText) || ''}
                                                onChange={e => updateBlock(block.id, editLang === 'en' ? { altText_en: e.target.value } : { altText: e.target.value })}
                                                className="border border-black p-2 font-mono text-sm"
                                                placeholder="Description..."
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        {/* Add Block Section - Always Visible */}
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t-2 border-black">
                            <span className="text-sm font-bold">ADD NEW BLOCK</span>
                            <div className="flex gap-2 flex-wrap">
                                <RetroButton onClick={() => addBlock('header')} className="text-xs">Header</RetroButton>
                                <RetroButton onClick={() => addBlock('text')} className="text-xs">Text</RetroButton>
                                <RetroButton onClick={() => addBlock('subtitle')} className="text-xs">Subtitle</RetroButton>
                                <RetroButton onClick={() => addBlock('image')} className="text-xs">Image</RetroButton>
                                <RetroButton onClick={() => addBlock('video')} className="text-xs">Video</RetroButton>
                                <RetroButton onClick={() => addBlock('grid')} className="text-xs">Grid</RetroButton>
                                <RetroButton onClick={() => addBlock('link')} className="text-xs">Button</RetroButton>
                                <RetroButton onClick={() => addBlock('model3d')} className="text-xs">3D Model</RetroButton>
                            </div>
                        </div>

                        {/* Save Button - Always Visible */}
                        <div className="flex justify-end mt-4 pb-8">
                            <RetroButton onClick={handleSavePost} className="bg-green-600 text-white hover:bg-green-500 hover:text-white border-green-700 flex gap-2 w-full justify-center py-3 shadow-[4px_4px_0px_0px_#14532d] hover:shadow-[2px_2px_0px_0px_#14532d]">
                                <Save size={16} /> Save Post
                            </RetroButton>
                        </div>
                    </div>
                </RetroContainer >
            </main >
        );
    }

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer title="CMS Admin" className="md:flex-1 md:min-h-0 md:mt-8 mb-3">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Projects</h1>
                    <div className="flex gap-2">
                        <RetroButton onClick={handleLogout} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"><LogOut size={16} /></RetroButton>
                        <RetroButton onClick={handleCreatePost}><Plus size={16} /> New Project</RetroButton>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {posts.map((post, index) => (
                        <div key={post.id} className={`border border-black p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer ${!post.active ? 'opacity-50 bg-gray-50' : ''}`} onClick={() => setEditingPost(post)}>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col mr-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleMovePost(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-500 hover:text-black disabled:opacity-20"
                                    >
                                        <ArrowUp size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleMovePost(index, 'down')}
                                        disabled={index === posts.length - 1}
                                        className="text-gray-500 hover:text-black disabled:opacity-20"
                                    >
                                        <ArrowDown size={12} />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => handleToggleActive(post, e)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title={post.active ? "Deactivate" : "Activate"}
                                >
                                    {post.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                {post.thumbnail && (
                                    <img src={post.thumbnail} alt="" className="w-10 h-10 object-cover border border-black" />
                                )}
                                <span className="font-bold">{post.title}</span>
                            </div>
                            <span className="text-xs text-gray-500">{post.date}</span>
                        </div>
                    ))}
                </div>
            </RetroContainer>
        </main>
    );
}
