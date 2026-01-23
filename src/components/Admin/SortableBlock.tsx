"use client";

import { Block, BlockType } from "@/types";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, ArrowUp, ArrowDown, Trash, Plus } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { ModelUploader } from "./ModelUploader";
import { RetroButton } from "../RetroButton";
import { cn } from "@/lib/utils";
import React from "react";

interface SortableBlockProps {
    block: Block;
    index: number;
    editLang: 'es' | 'en';
    updateBlock: (id: string, updates: Partial<Block>) => void;
    removeBlock: (id: string) => void;
    moveBlock: (index: number, direction: 'up' | 'down') => void;
}

export const SortableBlock = ({
    block,
    index,
    editLang,
    updateBlock,
    removeBlock,
    moveBlock
}: SortableBlockProps) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={block}
            dragListener={false}
            dragControls={dragControls}
            className="border border-black p-2 bg-white relative group shadow-sm flex gap-3 items-start"
        >
            <div
                className="flex items-center self-stretch text-gray-400 cursor-grab active:cursor-grabbing hover:text-black transition-colors"
                title="Drag to reorder"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical size={20} />
            </div>

            <div className="flex-1 w-full min-w-0">
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
                            className="w-full border border-black p-1 font-mono h-24 text-sm resize-y"
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
                                        const url = window.prompt("Enter URL:", "https://");

                                        if (url) {
                                            const newText = text.substring(0, start) + `[${selected || 'text'}](${url})` + text.substring(end);
                                            updateBlock(block.id, editLang === 'en' ? { content_en: newText } : { content: newText });
                                        }
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
                            className="border border-black p-2 font-mono text-sm w-full"
                            placeholder="Description for modal..."
                        />
                        {block.content && <img src={block.content} alt="Preview" className="max-h-40 object-contain border border-gray-300 mt-2 self-start" />}
                        <label className="flex items-center gap-2 text-xs cursor-pointer select-none mt-2">
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
                                checked={block.allowModal !== false} // Default to true if undefined
                                onChange={e => updateBlock(block.id, { allowModal: e.target.checked })}
                                className="accent-black"
                            />
                            Clickable (Modal)
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
                            className="border border-black p-2 font-mono text-sm w-full"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <label className="text-xs font-bold mt-2">Video Title ({editLang.toUpperCase()})</label>
                        <input
                            value={(editLang === 'en' ? block.altText_en : block.altText) || ''}
                            onChange={e => updateBlock(block.id, editLang === 'en' ? { altText_en: e.target.value } : { altText: e.target.value })}
                            className="border border-black p-2 font-mono text-sm w-full"
                            placeholder="Title for the player bar..."
                        />
                    </div>
                ) : block.type === 'grid' ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-gray-100 p-2">
                            <label className="text-xs font-bold">Grid Images</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={block.allowModal !== false}
                                        onChange={e => updateBlock(block.id, { allowModal: e.target.checked })}
                                        className="accent-black"
                                    />
                                    Clickable
                                </label>
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
                            className="border border-black p-2 font-mono text-sm w-full"
                            placeholder="Description..."
                        />
                    </div>
                ) : block.type === 'carousel' ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-gray-100 p-2">
                            <label className="text-xs font-bold">Carousel Images</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={block.allowModal !== false}
                                        onChange={e => updateBlock(block.id, { allowModal: e.target.checked })}
                                        className="accent-black"
                                    />
                                    Clickable
                                </label>
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
                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={block.showAltText || false}
                                        onChange={e => updateBlock(block.id, { showAltText: e.target.checked })}
                                        className="accent-black"
                                    />
                                    Show Alt Text
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mb-2">
                            <label className="text-xs font-bold">Delay (seconds)</label>
                            <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={block.delay || 3}
                                onChange={e => updateBlock(block.id, { delay: parseFloat(e.target.value) })}
                                className="border border-black p-2 font-mono text-sm w-24"
                            />
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
                ) : null}
            </div>
        </Reorder.Item>
    );
};
