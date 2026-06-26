import React from 'react';
import { motion } from 'framer-motion';
import LiquidPanel from './LiquidPanel';

interface LiquidToolbarProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const LiquidToolbar: React.FC<LiquidToolbarProps> = ({ children, className = '', delay = 0.5 }) => {
    const [isReady, setIsReady] = React.useState(false);

    return (
        <motion.div
            initial={{ y: 250 }}
            animate={{ y: 0 }}
            transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
            onAnimationComplete={() => setIsReady(true)}
            className={`fixed bottom-6 sm:bottom-10 inset-x-0 z-50 flex justify-center pointer-events-none ${isReady ? '!transform-none' : ''}`}
        >
            <div className={`relative flex items-center pointer-events-auto ${className}`}>
                <LiquidPanel className="absolute inset-0 !rounded-full pointer-events-none" />
                <div className="relative flex items-center gap-1 p-2 overflow-visible">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

interface LiquidToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    variant?: 'default' | 'custom';
    children: React.ReactNode;
}

export const LiquidToolbarButton: React.FC<LiquidToolbarButtonProps> = ({ active, variant = 'default', children, className = '', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`
                shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                ${variant === 'default' ? (
                    active 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                ) : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.button>
    );
};
