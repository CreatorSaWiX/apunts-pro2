import { AlertCircle, Trash2 } from 'lucide-react';
import Modal from './Modal';

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
    title = "Estàs segur?",
    message = "Aquesta acció no es pot desfer.",
    confirmText = "Confirmar",
    cancelText = "Cancel·lar",
    isDestructive = false
}: ConfirmModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" hideCloseButton>
            <Modal.Layout className="flex-col">
                <Modal.Body className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-sky-500/10 text-sky-500'
                            }`}>
                            {isDestructive ? <Trash2 size={24} /> : <AlertCircle size={24} />}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full mt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-white/5"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-lg ${isDestructive
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal.Layout>
        </Modal>
    );
};

export default ConfirmModal;
