import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: any;
    theme?: 'sky' | 'emerald';
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
    label,
    icon: Icon,
    theme = 'sky',
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && value.toString().length > 0;
    const isFloating = isFocused || hasValue;

    const gradients = {
        sky: 'from-sky-500 to-indigo-500',
        emerald: 'from-emerald-500 to-sky-500'
    };

    const borderColors = {
        sky: 'focus-within:border-sky-500/50',
        emerald: 'focus-within:border-emerald-500/50'
    };

    return (
        <div className="relative group w-full">
            <div className="relative">
                {/* Glow Background */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-r ${gradients[theme]} rounded-xl blur transition-all duration-500 ${
                        isFocused ? 'opacity-30 scale-105' : 'opacity-0 scale-100'
                    }`} 
                />
                
                {/* Main Input Container */}
                <div 
                    className={`relative flex items-center bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden transition-all duration-500 ${borderColors[theme]} focus-within:bg-slate-900/90 focus-within:shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 h-[56px]`}
                >
                    <div className="pl-4 pr-3 flex items-center justify-center h-full">
                        <motion.div
                            animate={{ 
                                scale: isFocused ? 1.15 : 1, 
                                color: isFocused ? (theme === 'sky' ? '#38bdf8' : '#34d399') : '#64748b' 
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <Icon size={18} />
                        </motion.div>
                    </div>
                    
                    <div className="relative w-full h-full flex flex-col justify-center">
                        <motion.label
                            initial={false}
                            animate={{
                                y: isFloating ? -10 : 0,
                                scale: isFloating ? 0.75 : 1,
                                color: isFocused ? (theme === 'sky' ? '#38bdf8' : '#34d399') : '#94a3b8'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="absolute left-0 origin-left font-semibold tracking-wide pointer-events-none text-sm z-20"
                            style={{ top: '18px' }}
                        >
                            {label}
                        </motion.label>
                        
                        <input
                            {...props}
                            value={value}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                props.onBlur?.(e);
                            }}
                            className={`w-full h-full bg-transparent pr-4 pt-5 pb-1 text-white placeholder:text-transparent focus:outline-none text-sm font-medium z-10 relative [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] ${props.className || ''}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
