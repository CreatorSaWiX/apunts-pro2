import React from 'react';
import { m as motion } from 'framer-motion';
import { AuthCanvasBackground } from '../ui/system/AuthCanvasBackground';

interface AuthLayoutProps {
    children: React.ReactNode;
    variant: 'login' | 'register';
}

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, variant }) => {
    // Tweak selection color based on variant
    const selectionColor = variant === 'login' ? 'selection:bg-sky-500/30' : 'selection:bg-emerald-500/30';
    // Tweak noise opacity based on variant (register had 0.03, login had 0.01, let's compromise to 0.02 or keep logic)
    const noiseOpacity = variant === 'login' ? 'opacity-[0.01]' : 'opacity-[0.03]';
    // Tweak shimmer opacity
    const shimmerOpacity = variant === 'login' ? 'opacity-100' : 'opacity-50';

    return (
        <div className={`min-h-screen flex w-full bg-[#020617] text-slate-200 font-sans ${selectionColor} overflow-hidden relative`}>
            <AuthCanvasBackground variant={variant} />

            {/* Form Panel */}
            <div className="w-full h-screen flex items-center justify-center lg:justify-end lg:pr-[10%] xl:pr-[15%] p-6 sm:p-12 relative z-10 pointer-events-none">
                <div className="w-full max-w-md relative pointer-events-auto">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="bg-[#020617]/10 backdrop-blur-[2px] border border-white/5 border-t-white/10 border-l-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative"
                    >
                        {/* Contenidor intern per retallar efectes sense trencar el blur a Chrome */}
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                            {/* Noise texture overlay for premium feel */}
                            <div className={`absolute inset-0 ${noiseOpacity} mix-blend-overlay`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                            {/* Shimmer light effect over the panel */}
                            <div className={`absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-pulse ${shimmerOpacity}`} />
                        </div>

                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
