import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import LiquidPanel from './LiquidPanel';

interface LiquidDropdownProps extends Omit<HTMLMotionProps<"div">, 'children'> {
    children: React.ReactNode;
    className?: string;
    panelClassName?: string;
    variant?: 'default' | 'darker';
}

const MotionLiquidPanel = motion(LiquidPanel as any);

const LiquidDropdown = React.forwardRef<HTMLDivElement, LiquidDropdownProps>(
    ({ children, className = '', panelClassName = '', variant = 'default', ...props }, ref) => {
        return (
                <motion.div
                    ref={ref}
                    initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)', y: 10 }}
                    animate={{ clipPath: 'inset(-10% -10% -10% -10% round 24px)', y: 0 }}
                    exit={{ clipPath: 'inset(100% 0% 0% 0% round 24px)', y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`z-50 ${className}`}
                    {...props}
                >
                    <LiquidPanel variant={variant} className={`overflow-hidden ${panelClassName}`}>
                        {children}
                    </LiquidPanel>
                </motion.div>
        );
    }
);

LiquidDropdown.displayName = 'LiquidDropdown';

export default LiquidDropdown;
