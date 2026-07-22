import React from 'react';
import { m as motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import LiquidPanel from './LiquidPanel';

interface LiquidDropdownProps extends Omit<HTMLMotionProps<"div">, 'children'> {
    children: React.ReactNode;
    className?: string;
    panelClassName?: string;
    variant?: 'default' | 'darker';
}

const LiquidDropdown = React.forwardRef<HTMLDivElement, LiquidDropdownProps>(
    ({ children, className = '', panelClassName = '', variant = 'darker', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex flex-col gap-1 p-2 min-w-50 pointer-events-auto z-50 ${className}`}
                {...props}
            >
                <LiquidPanel className="absolute inset-0 pointer-events-none" variant={variant}>{null}</LiquidPanel>
                <div className={`relative z-10 flex flex-col gap-1 ${panelClassName}`}>
                    {children}
                </div>
            </motion.div>
        );
    }
);

LiquidDropdown.displayName = 'LiquidDropdown';

export default LiquidDropdown;
