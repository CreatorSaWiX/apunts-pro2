import React from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import LiquidPanel from './LiquidPanel';

interface LiquidToolbarProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    position?: 'bottom' | 'sticky';
}

export const LiquidToolbar: React.FC<LiquidToolbarProps> = ({ children, className = '', delay = 0.5, position = 'bottom' }) => {
    const [isReady, setIsReady] = React.useState(false);

    const isSticky = position === 'sticky';

    return (
        <motion.div
            initial={isSticky ? { y: -50, opacity: 0 } : { y: 250 }}
            animate={isSticky ? { y: 0, opacity: 1 } : { y: 0 }}
            transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
            onAnimationComplete={() => setIsReady(true)}
            className={`${isSticky ? 'sticky top-24 z-40 mb-8' : 'fixed bottom-6 sm:bottom-10 inset-x-0 z-40 sm:z-50'} flex justify-center pointer-events-none ${isReady ? '!transform-none' : ''} px-4`}
        >
            <motion.div 
                layout
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className={`relative flex items-center pointer-events-auto max-w-full ${className}`}
            >
                <motion.div className="absolute inset-0 pointer-events-none" style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
                    <LiquidPanel className="w-full h-full !rounded-full">{null}</LiquidPanel>
                </motion.div>
                <div className="relative flex items-center gap-1 p-2 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <AnimatePresence mode="popLayout">
                        {children}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

import type { HTMLMotionProps } from 'framer-motion';

interface LiquidToolbarButtonProps extends HTMLMotionProps<'button'> {
    active?: boolean;
    variant?: 'default' | 'custom';
    children: React.ReactNode;
}

export const LiquidToolbarButton: React.FC<LiquidToolbarButtonProps> = ({ active, variant = 'default', children, className = '', ...props }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover="hover"
            whileTap="tap"
            variants={{ hover: {}, tap: {} }}
            className={`
                relative shrink-0 px-2 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-bold transition duration-300 group
                ${variant === 'default' ? (
                    active 
                        ? 'text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                ) : ''}
                ${className}
            `}
            {...props}
        >
            {active && variant === 'default' && (
                <motion.div
                    layout="position"
                    className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                </motion.div>
            )}
            <motion.div
                layout="position"
                variants={{
                    hover: { scale: 1.05 },
                    tap: { scale: 0.95 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative z-10 flex items-center gap-2"
            >
                {children}
            </motion.div>
        </motion.button>
    );
};
