import React from 'react';
import { m as motion } from 'framer-motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onAnimationStart={(definition) => {
                // Reset scroll when the enter animation starts (not on exit)
                if (typeof definition === 'object' && 'opacity' in definition && definition.opacity === 1) {
                    window.scrollTo(0, 0);
                }
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
