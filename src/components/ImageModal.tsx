import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { RetroButton } from './RetroButton';
import { cn } from '@/lib/utils';

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    altText?: string;
    onClose: () => void;
    transparent?: boolean;
}

export const ImageModal = ({ isOpen, imageUrl, altText, onClose, transparent }: ImageModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.8)] p-4" onClick={onClose}>
            <div className="relative max-w-5xl w-fit max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                {/* Close Button - Desktop (Outside Right) */}
                <div className="hidden sm:block absolute left-full top-0 ml-2 pointer-events-auto z-50">
                    <RetroButton onClick={onClose} className="px-3 py-3 text-base bg-white hover:bg-red-500 hover:text-white border-white rounded-none">
                        <X size={30} />
                    </RetroButton>
                </div>

                {/* Close Button - Mobile (Inside Top-Right) */}
                <div className="block sm:hidden absolute top-4 right-4 pointer-events-auto z-50">
                    <RetroButton onClick={onClose} className="px-2 py-2 text-sm bg-white/90 hover:bg-red-500 hover:text-white border-black shadow-retro-sm">
                        <X size={20} />
                    </RetroButton>
                </div>

                {/* Image Container */}
                <div className={cn(
                    "p-2 w-fit h-fit max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col items-center",
                    transparent ? "bg-transparent shadow-none border-none" : "bg-white border-2 border-white shadow-retro-lg"
                )}>
                    <img
                        src={imageUrl}
                        alt={altText || "Full size view"}
                        className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                    />

                    {/* Alt Text Caption */}
                    {altText && (
                        <div className={cn(
                            "mt-2 pt-2 border-t-2 text-center",
                            transparent ? "border-white text-white" : "border-black text-black"
                        )}>
                            <p className="font-mono text-sm md:text-base">{altText}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
