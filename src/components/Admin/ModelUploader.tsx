"use client";

import { useState } from "react";
import { Upload, Loader2, FileBox } from "lucide-react";

interface ModelUploaderProps {
    onUpload: (url: string) => void;
    currentValue?: string;
}

export function ModelUploader({ onUpload, currentValue }: ModelUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validExtensions = ['.glb', '.gltf', '.bin'];
        const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        if (!validExtensions.includes(extension)) {
            alert('Please upload a .glb, .gltf, or .bin file');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onUpload(data.url);
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <input
                    value={currentValue || ''}
                    onChange={(e) => onUpload(e.target.value)}
                    placeholder="Model URL (.glb/.gltf) or Upload ->"
                    className="flex-1 border border-black p-1 font-mono text-sm"
                />
                <label className="cursor-pointer">
                    <input type="file" accept=".glb,.gltf,.bin" className="hidden" onChange={handleFileChange} />
                    <div className="border-2 border-black bg-gray-200 hover:bg-white px-2 py-1 flex items-center gap-1 shadow-retro-sm active:translate-y-0.5 active:shadow-none transition-all">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span className="text-xs font-bold">UPLOAD 3D</span>
                    </div>
                </label>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">
                * Recommended: Use <b>.glb</b> files (single file). If using .gltf + .bin, references might break due to file renaming.
                <br />
                * <b>Multiple Textures?</b> Embed them in a single <b>.glb</b> file. The "Texture" field below is only for overriding the entire model's texture.
            </p>
            {currentValue && (
                <div className="border border-black p-2 bg-gray-100 flex items-center gap-2">
                    <FileBox size={24} />
                    <span className="text-xs font-mono truncate max-w-[200px]">{currentValue.split('/').pop()}</span>
                </div>
            )}
        </div>
    );
}
