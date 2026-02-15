import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader, AlertCircle, FileCode } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { encryptMessage } from '../../utils/encryption';
import ProblemSelectorModal from './ProblemSelectorModal';

interface ComposeMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
    initialSubject?: string;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
    isOpen,
    onClose,
    receiverId,
    receiverName,
    initialSubject = ''
}) => {
    const { user } = useAuth();
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Exercise selector
    const [isProblemSelectorOpen, setIsProblemSelectorOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<{ id: string; title: string; topicId?: string } | null>(null);

    const handleSelectProblem = (problem: { id: string; title: string; topicId?: string }) => {
        setSelectedProblem(problem);
        // Automatically add snippet to subject if empty or just append
        if (!subject.includes(`[${problem.id}]`)) {
            setSubject(prev => `[${problem.id}] ${prev}`.trim());
        }
        setIsProblemSelectorOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('Has d\'iniciar sessió per enviar missatges.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const encryptedBody = encryptMessage(body);

            await addDoc(collection(db, 'messages'), {
                senderId: user.id,
                senderName: user.username,
                senderAvatar: user.avatar,
                receiverId: receiverId,
                receiverName: receiverName,
                subject: subject,
                body: encryptedBody,
                relatedProblemId: selectedProblem ? selectedProblem.id : null,
                relatedTopicId: selectedProblem ? selectedProblem.topicId : null,
                read: false,
                createdAt: serverTimestamp()
            });

            onClose();
            setBody('');
            setSubject('');
            setSelectedProblem(null);
        } catch (err) {
            console.error(err);
            setError('Error en enviar el missatge. Torna-ho a provar.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg p-0 shadow-2xl relative ring-1 ring-white/5 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-slate-900/50 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Send size={20} className="text-sky-400" />
                                Redactar missatge
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Enviant a <span className="text-white font-medium">{receiverName}</span></p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assumpte</label>
                                <button
                                    type="button"
                                    onClick={() => setIsProblemSelectorOpen(true)}
                                    className="text-xs flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors px-2 py-1 rounded-md hover:bg-sky-500/10"
                                >
                                    <FileCode size={14} />
                                    Vincular exercici
                                </button>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium"
                                    placeholder="[P12345] Dubte d'aquest exercici"
                                    required
                                />
                            </div>

                            {selectedProblem && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sm text-sky-200"
                                >
                                    <div className="p-2 bg-sky-500/20 rounded-lg">
                                        <FileCode size={16} className="text-sky-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sky-100">Exercici Vinculat</div>
                                        <div className="text-xs text-sky-400 truncate">{selectedProblem.id} - {selectedProblem.title}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedProblem(null); setSubject(prev => prev.replace(`[${selectedProblem.id}]`, '').trim()); }}
                                        className="p-2 hover:bg-sky-500/20 rounded-lg text-sky-400 hover:text-sky-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                Missatge
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 normal-case font-normal flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    Encriptat amb AES-256
                                </span>
                            </label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 outline-none resize-none transition-all leading-relaxed"
                                placeholder="Escriu el teu missatge aquí..."
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                                Enviar missatge
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Nested Modal for Problem Selection */}
            {isProblemSelectorOpen && (
                <ProblemSelectorModal
                    isOpen={isProblemSelectorOpen}
                    onClose={() => setIsProblemSelectorOpen(false)}
                    onSelect={handleSelectProblem}
                />
            )}
        </>
    );
};

export default ComposeMessageModal;
