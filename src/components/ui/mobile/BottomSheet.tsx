import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    fullBleed?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, subtitle, children, fullBleed = false }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling when bottom sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[998] bg-[#020617]/20 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Bottom Sheet Modal */}
            {isOpen && (
                <motion.div
                    key="modal"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={{}}
                        className={`fixed bottom-0 inset-x-0 mx-auto w-full lg:max-w-2xl bg-[#0F172A]/30 backdrop-blur-xl border-white/12 border-t lg:border-x rounded-t-[2.5rem] shadow-2xl z-[999] flex flex-col max-h-[85vh] ${fullBleed ? 'pb-0 pt-6 px-0 gap-4' : 'p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-[max(1.5rem,env(safe-area-inset-left))] gap-6'}`}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-[-8px] shrink-0" />

                        {/* Header */}
                        <div className={`flex items-start justify-between shrink-0 ${fullBleed ? 'px-6' : ''}`}>
                            <div className="flex flex-col">
                                {title && (
                                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors ml-4 shrink-0"
                                aria-label="Tancar">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className={`overflow-y-auto overscroll-contain flex-1 min-h-0 ${fullBleed ? '' : '-mx-2 px-2 pb-4'}`}>
                            {children}
                        </div>
                    </motion.div>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;

    return createPortal(content, document.body);
};

export default BottomSheet;
