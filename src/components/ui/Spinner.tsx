import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SpinnerVariant = 'primary' | 'white' | 'slate' | 'sky' | 'rose' | 'emerald' | 'fuchsia' | 'linkedin' | 'youtube' | 'black' | 'indigo';

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    className?: string;
    glow?: boolean;
}

const SIZE_MAP: Record<SpinnerSize, string> = {
    'xs': 'w-3.5 h-3.5 border-2',
    'sm': 'w-5 h-5 border-2',
    'md': 'w-6 h-6 border-2',
    'lg': 'w-8 h-8 border-2',
    'xl': 'w-10 h-10 border-2',
    '2xl': 'w-12 h-12 border-2'
};

const VARIANT_MAP: Record<SpinnerVariant, string> = {
    'primary': 'border-primary/20 border-t-primary',
    'white': 'border-white/20 border-t-white',
    'slate': 'border-slate-500/30 border-t-slate-500',
    'sky': 'border-sky-500/30 border-t-sky-500',
    'rose': 'border-rose-500/30 border-t-rose-500',
    'emerald': 'border-emerald-500/30 border-t-emerald-500',
    'fuchsia': 'border-fuchsia-500/30 border-t-fuchsia-500',
    'linkedin': 'border-[#0A66C2]/30 border-t-[#0A66C2]',
    'youtube': 'border-[#FF0000]/30 border-t-[#FF0000]',
    'black': 'border-black/30 border-t-black',
    'indigo': 'border-indigo-500/30 border-t-indigo-500'
};

const GLOW_MAP: Record<SpinnerVariant, string> = {
    'primary': 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    'white': 'shadow-[0_0_15px_rgba(255,255,255,0.5)]',
    'slate': 'shadow-[0_0_10px_rgba(100,116,139,0.3)]',
    'sky': 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
    'rose': 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    'emerald': 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    'fuchsia': 'shadow-[0_0_15px_rgba(217,70,239,0.5)]',
    'linkedin': 'shadow-[0_0_15px_rgba(10,102,194,0.5)]',
    'youtube': 'shadow-[0_0_15px_rgba(255,0,0,0.5)]',
    'black': 'shadow-[0_0_10px_rgba(0,0,0,0.3)]',
    'indigo': 'shadow-[0_0_15px_rgba(99,102,241,0.5)]'
};

const Spinner: React.FC<SpinnerProps> = ({ 
    size = 'md', 
    variant = 'sky', 
    className = '',
    glow = true
}) => {
    return (
        <div 
            className={`rounded-full animate-spin border-t-transparent ${SIZE_MAP[size]} ${VARIANT_MAP[variant]} ${glow ? GLOW_MAP[variant] : ''} ${className}`}
            role="status"
            aria-label="Carregant..."
        />
    );
};

export default Spinner;
