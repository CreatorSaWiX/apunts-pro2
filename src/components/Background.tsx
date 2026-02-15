import React from 'react';

const Background: React.FC = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#020617]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#020617] to-[#020617] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />

            {/* Top Left */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] min-w-[600px] min-h-[600px] 
                           bg-sky-500/30 rounded-full blur-[120px] opacity-30
                           animate-blob mix-blend-screen will-change-transform"
            />

            {/* Bottom Right */}
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] 
                           bg-indigo-600/30 rounded-full blur-[120px] opacity-30
                           animate-blob animation-delay-2000 mix-blend-screen will-change-transform"
            />

            {/* Mid Left */}
            <div
                className="absolute top-[40%] left-[-10%] w-[50vw] h-[50vw] min-w-[400px] min-h-[400px] 
                           bg-fuchsia-500/25 rounded-full blur-[100px] opacity-50
                           animate-blob animation-delay-4000 mix-blend-screen will-change-transform"
            />

            {/* Top Right */}
            <div
                className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] 
                           bg-teal-500/20 rounded-full blur-[100px] opacity-50
                           animate-blob animation-delay-2000 mix-blend-screen will-change-transform"
            />
        </div>
    );
};

export default Background;