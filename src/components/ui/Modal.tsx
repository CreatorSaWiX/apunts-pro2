import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full' | 'auto';
    closeOnOutsideClick?: boolean;
    className?: string;
    hideCloseButton?: boolean;
}

const SIZE_MAP = {
    'sm': 'max-w-sm w-full',
    'md': 'max-w-md w-full',
    'lg': 'max-w-lg w-full',
    'xl': 'max-w-xl w-full',
    '2xl': 'max-w-2xl w-full',
    '3xl': 'max-w-3xl w-full',
    '4xl': 'max-w-4xl w-full',
    '5xl': 'max-w-5xl w-full',
    '6xl': 'max-w-6xl w-full',
    'full': 'w-[95vw] max-w-7xl h-[90vh]',
    'auto': 'w-auto'
};

export const Modal = ({ 
    isOpen, 
    onClose, 
    children, 
    size = 'md', 
    closeOnOutsideClick = true,
    className = '',
    hideCloseButton = false
}: ModalProps) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#020617]/70 backdrop-blur-xl"
                        onClick={() => closeOnOutsideClick && onClose()}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`relative z-10 flex flex-col bg-[#0b0f19]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] max-h-[85vh] ${SIZE_MAP[size]} ${className}`}
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-50 pointer-events-none" />
                        {!hideCloseButton && (
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-[60] p-2 bg-black/40 hover:bg-white/10 hover:rotate-90 rounded-full transition-all duration-300 text-slate-400 hover:text-white border border-white/5 backdrop-blur-md"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        )}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export const ModalHeader = ({ title, children, className = '' }: { title?: string, children?: React.ReactNode, className?: string }) => (
    <div className={`p-6 border-b border-white/5 relative bg-white/[0.01] shrink-0 ${className}`}>
        {title && <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>}
        {children}
    </div>
);

export const ModalBody = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-slate-950/50 custom-scrollbar ${className}`}>
        {children}
    </div>
);

export const ModalSidebar = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`w-72 border-r border-white/5 bg-black/20 shrink-0 flex flex-col ${className}`}>
        {children}
    </div>
);

export const ModalLayout = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-1 overflow-hidden h-full w-full ${className}`}>
        {children}
    </div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Sidebar = ModalSidebar;
Modal.Layout = ModalLayout;

export default Modal;
