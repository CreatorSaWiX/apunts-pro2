import React from 'react';
import bgImage from '../assets/bg.webp';
import noiseSvg from '../assets/noise.svg';
import { useMobilePerformance } from '../hooks/useMobilePerformance';

const Background: React.FC = () => {
    const { isLiteMode } = useMobilePerformance();

    // En Lite Mode (Android 2G/3G o gamma baixa), evitem el renderitzat costós de blur(50px) i mix-blend-overlay
    if (isLiteMode) {
        return (
            <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#020617]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0c2340] to-[#020617] opacity-85" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-transparent via-[#020617] to-[#020617] opacity-60" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#020617]">
            <img
                src={bgImage}
                alt=""
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover blur-[50px] scale-[1.15] opacity-70 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-transparent via-[#020617] to-[#020617] opacity-60" />
            <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay" 
                style={{ backgroundImage: `url(${noiseSvg})` }} 
            />
        </div>
    );
};

export default Background;