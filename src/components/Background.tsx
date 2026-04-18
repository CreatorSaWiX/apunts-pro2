import React from 'react';
import bgImage from '../assets/bg.webp';
import noiseSvg from '../assets/noise.svg';

const Background: React.FC = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#020617]">
            <img
                src={bgImage}
                alt=""
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover blur-[50px] scale-[1.15] opacity-70 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#020617] to-[#020617] opacity-60" />
            <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay" 
                style={{ backgroundImage: `url(${noiseSvg})` }} 
            />
        </div>
    );
};

export default Background;