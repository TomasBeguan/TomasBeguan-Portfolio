import React from 'react';
import { X } from 'lucide-react';
import { RetroButton } from './RetroButton';

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    altText?: string;
    onClose: () => void;
}

export const ImageModal = ({ isOpen, imageUrl, altText, onClose }: ImageModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <div className="absolute -top-12 right-0 pointer-events-auto z-50">
                    <RetroButton onClick={onClose} className="px-4 py-1 text-sm bg-white hover:bg-red-500 hover:text-white border-white">
                        <X size={20} />
                    </RetroButton>
                </div>

                {/* Image Container */}
                <div className="bg-white p-2 border-2 border-white shadow-retro-lg w-auto h-auto max-h-[85vh] overflow-hidden flex flex-col">
                    <img
                        src={imageUrl}
                        alt={altText || "Full size view"}
                        className="w-full h-full object-contain flex-1 min-h-0"
                    />

                    {/* Alt Text Caption */}
                    {altText && (
                        <div className="mt-2 pt-2 border-t-2 border-black text-center">
                            <p className="font-mono text-sm md:text-base">{altText}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
