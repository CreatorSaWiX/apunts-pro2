import React from 'react';

interface NavigationPillProps {
    children: React.ReactNode;
    className?: string;
}

const NavigationPill: React.FC<NavigationPillProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-[#0F172A]/70 backdrop-blur-[40px] p-1.5 rounded-full border border-white/[0.12] flex items-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:bg-[#0F172A]/80 hover:border-white/20 ${className}`}>
            {/* Subtle noise texture overlay for realism */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            {children}
        </div>
    );
};

export default NavigationPill;
