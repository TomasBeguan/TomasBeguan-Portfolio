"use client";

import React, { useState, useEffect, memo } from "react";
import { RetroButton } from "@/components/RetroButton";
import { Upload, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface ImageUploaderProps {
    onUpload: (url: string, width?: number, height?: number) => void;
    currentValue?: string;
    maxWidth?: number;
    quality?: number;
}

export const ImageUploader = memo(({ onUpload, currentValue, maxWidth, quality }: ImageUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [inputValue, setInputValue] = useState(currentValue || '');

    // Sync local state with prop if prop changes externally
    useEffect(() => {
        setInputValue(currentValue || '');
    }, [currentValue]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const originalFile = e.target.files?.[0];
        if (!originalFile) return;

        setUploading(true);

        try {
            // Get dimensions
            const img = new Image();
            img.src = URL.createObjectURL(originalFile);
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            const { naturalWidth, naturalHeight } = img;

            // Compress image before upload
            const file = await compressImage(originalFile, maxWidth, quality);

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onUpload(data.url, naturalWidth, naturalHeight);
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading or compressing');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={() => {
                        if (inputValue !== currentValue) {
                            onUpload(inputValue);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (inputValue !== currentValue) {
                                onUpload(inputValue);
                            }
                        }
                    }}
                    placeholder="Image URL or Upload ->"
                    className="flex-1 border border-black p-1 font-mono text-sm"
                />
                <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div className="border-2 border-black bg-gray-200 hover:bg-white px-2 py-1 flex items-center gap-1 shadow-retro-sm active:translate-y-0.5 active:shadow-none transition-all">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span className="text-xs font-bold">UPLOAD</span>
                    </div>
                </label>
            </div>
            {currentValue && (
                <div className="border border-black p-1 bg-gray-100 w-24 h-24 flex items-center justify-center overflow-hidden">
                    <img
                        src={currentValue}
                        alt="Preview"
                        loading="lazy"
                        className="max-w-full max-h-full object-contain pixelated"
                    />
                </div>
            )}
        </div>
    );
});

ImageUploader.displayName = 'ImageUploader';
