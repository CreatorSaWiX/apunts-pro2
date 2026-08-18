import React, { type ReactNode } from 'react';

interface FloatingActionButtonProps {
    onClick: () => void;
    icon: ReactNode;
    ariaLabel?: string;
    title?: string;
    wrapperClassName?: string;
    className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onClick,
    icon,
    ariaLabel,
    title,
    wrapperClassName = 'md:hidden touch-landscape:block fixed bottom-28 right-4 z-50',
    className = 'bg-[#0a0a0a]/40',
}) => {
    return (
        <div className={wrapperClassName}>
            <button
                type="button"
                onClick={onClick}
                className={`group relative w-14 h-14 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white rounded-full flex items-center justify-center transition duration-300 active:scale-95 overflow-hidden ${className}`}
                aria-label={ariaLabel}
                title={title}
            >
                <div className="absolute inset-0 rounded-full border border-white/20" />
                {icon}
            </button>
        </div>
    );
};

export default FloatingActionButton;
