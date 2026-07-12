import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full' | 'auto';
    closeOnOutsideClick?: boolean;
    className?: string;
    hideCloseButton?: boolean;
    overlayVariant?: 'default' | 'transparent';
}

const SIZE_MAP = {
    'sm': 'max-w-sm w-full',
    'md': 'max-w-md w-full',
    'lg': 'max-w-lg w-full',
    'xl': 'max-w-xl w-full',
    '2xl': 'max-w-2xl w-full h-[70vh] min-h-[500px]',
    '3xl': 'max-w-3xl w-full h-[75vh] min-h-[500px]',
    '4xl': 'max-w-4xl w-full h-[80vh] min-h-[600px]',
    '5xl': 'max-w-5xl w-full h-[85vh] min-h-[600px]',
    '6xl': 'max-w-6xl w-full h-[85vh] min-h-[600px]',
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
    hideCloseButton = false,
    overlayVariant = 'default'
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

    const content = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 ${overlayVariant === 'transparent' ? 'bg-[#020617]/20 backdrop-blur-sm' : 'bg-[#020617]/50 backdrop-blur-md'}`}
                        onClick={() => closeOnOutsideClick && onClose()}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`relative z-10 flex flex-col ${overlayVariant === 'transparent' ? 'bg-[#0F172A]/30' : 'bg-[#0F172A]/70'} backdrop-blur-[40px] border border-white/[0.12] rounded-[32px] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_60px_rgba(0,0,0,0.6)] max-h-[85vh] ${SIZE_MAP[size]} ${className}`}
                    >
                        {/* Subtle noise texture overlay for realism */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                        
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-50 pointer-events-none" />
                        {!hideCloseButton && (
                            <button type="button" 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-[60] p-2 bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 rounded-full transition-all duration-300 text-slate-400 hover:text-white border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        )}
                        <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
};

const ModalHeader = ({ title, children, className = '' }: { title?: string, children?: React.ReactNode, className?: string }) => (
    <div className={`p-6 border-b border-white/[0.08] relative shrink-0 ${className}`}>
        {title && <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>}
        {children}
    </div>
);

const ModalBody = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar ${className}`}>
        {children}
    </div>
);

const ModalSidebar = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`w-72 border-r border-white/[0.08] bg-white/[0.02] shrink-0 flex flex-col ${className}`}>
        {children}
    </div>
);

const ModalLayout = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-1 overflow-hidden h-full w-full ${className}`}>
        {children}
    </div>
);

const ModalInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = '', ...props }, ref) => (
    <input
        ref={ref}
        className={`w-full bg-black/20 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm ${className}`}
        {...props}
    />
));
ModalInput.displayName = 'ModalInput';

const ModalTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className = '', ...props }, ref) => (
    <textarea
        ref={ref}
        className={`w-full bg-black/20 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] rounded-2xl px-4 py-3 text-slate-300 placeholder:text-slate-600 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[120px] resize-y custom-scrollbar ${className}`}
        {...props}
    />
));
ModalTextarea.displayName = 'ModalTextarea';

const ModalButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>(({ className = '', variant = 'primary', ...props }, ref) => {
    let variantStyles = '';
    switch (variant) {
        case 'primary':
            variantStyles = 'bg-gradient-to-r from-primary/90 to-accent/90 hover:from-primary hover:to-accent text-white shadow-lg shadow-primary/20';
            break;
        case 'secondary':
            variantStyles = 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-slate-300 hover:text-white';
            break;
        case 'danger':
            variantStyles = 'bg-rose-500/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20';
            break;
        case 'ghost':
            variantStyles = 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white';
            break;
    }

    return (
        <button type="button"
            ref={ref}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:transform-none disabled:cursor-not-allowed ${variantStyles} ${className}`}
            {...props}
        />
    );
});
ModalButton.displayName = 'ModalButton';


Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Sidebar = ModalSidebar;
Modal.Layout = ModalLayout;
Modal.Input = ModalInput;
Modal.Textarea = ModalTextarea;
Modal.Button = ModalButton;

export default Modal;
