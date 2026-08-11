import { AlertCircle, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { m as motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isDestructive = false
}: ConfirmModalProps) => {
    const { t } = useTranslation();
    const finalTitle = title || t('common.confirmModal.title', 'Estàs segur?');
    const finalMessage = message || t('common.confirmModal.message', 'Aquesta acció no es pot desfer.');
    const finalConfirmText = confirmText || t('common.confirmModal.confirm', 'Confirmar');
    const finalCancelText = cancelText || t('common.confirmModal.cancel', 'Cancel·lar');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" hideCloseButton>
            <Modal.Layout className="flex-col">
                <Modal.Body className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 relative ${isDestructive ? 'text-rose-500' : 'text-sky-500'}`}
                        >
                            <div className={`absolute inset-0 rounded-full opacity-20 blur-xl ${isDestructive ? 'bg-rose-500' : 'bg-sky-500'}`} />
                            <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-inner ${isDestructive ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-sky-500/10 border border-sky-500/20'}`}>
                                {isDestructive ? <Trash2 size={28} /> : <AlertCircle size={28} />}
                            </div>
                        </motion.div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight">{finalTitle}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                                {finalMessage}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full mt-4">
                            <button type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition duration-200 border border-white/5 hover:border-white/10 active:scale-[0.98]"
                             aria-label="Botó interactiu">
                                {finalCancelText}
                            </button>
                            <button type="button"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition duration-200 shadow-lg active:scale-[0.98] ${isDestructive
                                    ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-rose-500/25 border border-rose-500/50'
                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25 border border-sky-500/50'
                                    }`}
                            >
                                {finalConfirmText}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal.Layout>
        </Modal>
    );
};

export default ConfirmModal;
