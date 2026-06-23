import React from 'react';
import { tailwindColors } from '../../contexts/SubjectContext';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SpinnerVariant = 'primary' | 'white' | 'black' | 'linkedin' | 'youtube' | string;

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    className?: string;
    glow?: boolean;
}

const SIZE_MAP: Record<SpinnerSize, number> = {
    'xs': 16,
    'sm': 20,
    'md': 24,
    'lg': 32,
    'xl': 40,
    '2xl': 48
};

const STROKE_MAP: Record<SpinnerSize, number> = {
    'xs': 2.5,
    'sm': 3,
    'md': 3.5,
    'lg': 4,
    'xl': 4.5,
    '2xl': 5
};

const GRADIENT_MAP: Record<SpinnerVariant, { light: string, dark: string }> = {
    'primary': { light: 'rgba(var(--primary-rgb), 0.4)', dark: 'var(--primary)' },
    'white':   { light: 'rgba(255,255,255,0.2)', dark: '#ffffff' },
    'slate':   { light: '#cbd5e1', dark: '#475569' },
    'sky':     { light: '#bae6fd', dark: '#0ea5e9' },
    'rose':    { light: '#fecdd3', dark: '#e11d48' },
    'emerald': { light: '#a7f3d0', dark: '#059669' },
    'fuchsia': { light: '#f5d0fe', dark: '#c026d3' },
    'linkedin':{ light: '#93c5fd', dark: '#0A66C2' },
    'youtube': { light: '#fca5a5', dark: '#FF0000' },
    'black':   { light: '#d1d5db', dark: '#000000' },
    'indigo':  { light: '#c7d2fe', dark: '#4f46e5' }
};

const GLOW_MAP: Record<SpinnerVariant, string> = {
    'primary': 'drop-shadow(0 0 6px rgba(var(--primary-rgb), 0.5))',
    'white': 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
    'slate': 'drop-shadow(0 0 6px rgba(71,85,105,0.3))',
    'sky': 'drop-shadow(0 0 6px rgba(14,165,233,0.5))',
    'rose': 'drop-shadow(0 0 6px rgba(225,29,72,0.5))',
    'emerald': 'drop-shadow(0 0 6px rgba(5,150,105,0.5))',
    'fuchsia': 'drop-shadow(0 0 6px rgba(192,38,211,0.5))',
    'linkedin': 'drop-shadow(0 0 6px rgba(10,102,194,0.5))',
    'youtube': 'drop-shadow(0 0 6px rgba(255,0,0,0.5))',
    'black': 'none',
    'indigo': 'drop-shadow(0 0 6px rgba(79,70,229,0.5))'
};

const Spinner: React.FC<SpinnerProps> = ({ 
    size = 'md', 
    variant = 'sky', 
    className = '',
    glow = true
}) => {
    const pxSize = SIZE_MAP[size];
    const strokeWidth = STROKE_MAP[size];
    
    let colors = GRADIENT_MAP[variant as keyof typeof GRADIENT_MAP];
    let filterGlow = GLOW_MAP[variant as keyof typeof GLOW_MAP];

    if (!colors && tailwindColors[variant]) {
        colors = {
            light: `rgba(${tailwindColors[variant].primary_rgb}, 0.4)`,
            dark: tailwindColors[variant].primary
        };
        filterGlow = `drop-shadow(0 0 6px rgba(${tailwindColors[variant].primary_rgb}, 0.5))`;
    }

    if (!colors) {
        colors = GRADIENT_MAP['sky'];
        filterGlow = GLOW_MAP['sky'];
    }

    return (
        <div 
            className={`relative flex items-center justify-center shrink-0 ${className}`}
            style={{ width: pxSize, height: pxSize }}
            role="status"
            aria-label="Carregant..."
        >
            {/* Background Track */}
            <div 
                className="absolute inset-0 rounded-full"
                style={{
                    border: `${strokeWidth}px solid ${colors.light}`,
                    opacity: 0.15
                }}
            />
            
            {/* Spinning Gradient Ring */}
            <div 
                className="absolute inset-0 animate-spin"
                style={{ 
                    animationDuration: '0.8s', 
                    animationTimingFunction: 'linear',
                    filter: glow ? filterGlow : 'none'
                }}
            >
                {/* Conic Gradient */}
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0%, transparent 10%, ${colors.light} 30%, ${colors.dark} 100%)`,
                        WebkitMaskImage: `radial-gradient(closest-side, transparent calc(100% - ${strokeWidth}px - 0.5px), black calc(100% - ${strokeWidth}px + 0.5px))`,
                        maskImage: `radial-gradient(closest-side, transparent calc(100% - ${strokeWidth}px - 0.5px), black calc(100% - ${strokeWidth}px + 0.5px))`
                    }}
                />
                
                {/* Rounded Head Dot */}
                <div 
                    className="absolute"
                    style={{
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: strokeWidth,
                        height: strokeWidth,
                        backgroundColor: colors.dark,
                        borderRadius: '50%'
                    }}
                />
            </div>
        </div>
    );
};

export default Spinner;
