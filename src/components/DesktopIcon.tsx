import React from 'react';

interface DesktopIconProps {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const DesktopIcon = ({ label, icon, onClick, className = "" }: DesktopIconProps) => {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col items-center gap-2 cursor-pointer group ${className}`}
        >
            <div className="relative transition-transform group-hover:-translate-y-1">
                {icon}
            </div>
            <span className="text-sm font-silkscreen text-black bg-white px-1 group-hover:bg-black group-hover:text-white transition-colors">
                {label}
            </span>
        </div>
    );
};
