import React from 'react';

interface NavigationPillProps {
    children: React.ReactNode;
    className?: string;
}

const NavigationPill: React.FC<NavigationPillProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-[#0F172A]/80 backdrop-blur-[40px] p-1.5 rounded-full border border-white/[0.12] flex items-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:bg-[#0F172A]/90 hover:border-white/20 ${className}`}>
            {children}
        </div>
    );
};

export default NavigationPill;
