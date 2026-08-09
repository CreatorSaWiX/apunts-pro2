import React, { useState, useRef, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import LiquidPanel from '../glass/LiquidPanel';

export interface FabAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string; // Optional Tailwind color class for the icon/text
}

export interface FabMenuProps {
    actions: FabAction[];
    mainIcon?: React.ReactNode;
    activeIcon?: React.ReactNode;
    className?: string; // Additional classes for positioning (default bottom-6 right-6)
}

export const FabMenu: React.FC<FabMenuProps> = ({ 
    actions, 
    mainIcon = <Plus size={24} />, 
    activeIcon = <X size={24} />,
    className = "bottom-6 right-6"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={menuRef} className={`fixed z-[100] sm:hidden ${className}`}>
            {/* Backdrop Blur to focus user attention when open */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm -z-10"
                        style={{ left: 0, top: 0, width: '100vw', height: '100vh' }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Menu Items */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.05
                                }
                            },
                            hidden: {
                                transition: {
                                    staggerChildren: 0.03,
                                    staggerDirection: -1
                                }
                            }
                        }}
                        className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-3"
                    >
                        {actions.map((action) => (
                            <motion.button
                                key={action.id}
                                type="button"
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 pr-2 group ${action.color || 'text-white'}`}
                            >
                                <span className="relative text-sm font-semibold tracking-wide px-4 py-2 opacity-100 sm:opacity-0 sm:-translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    <div className="absolute inset-0 -z-10">
                                        <LiquidPanel className="w-full h-full !rounded-xl">{null}</LiquidPanel>
                                    </div>
                                    <span className="relative z-10">{action.label}</span>
                                </span>
                                <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden transition-colors group-hover:brightness-125">
                                    <div className="absolute inset-0 -z-10">
                                        <LiquidPanel className="w-full h-full !rounded-[16px]">{null}</LiquidPanel>
                                    </div>
                                    <div className="relative z-10 drop-shadow-md">
                                        {action.icon}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-white relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-full transition-colors"
            >
                <div className="absolute inset-0 -z-10">
                    <LiquidPanel className="w-full h-full !rounded-full">{null}</LiquidPanel>
                </div>
                
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isOpen ? 'close' : 'open'}
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative z-10 drop-shadow-lg"
                    >
                        {isOpen ? activeIcon : mainIcon}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
};
