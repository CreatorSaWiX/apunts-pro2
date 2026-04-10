import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { encryptMessage } from '../utils/encryption';
import { Send, X, MessageSquareHeart, Sparkles, Loader2 } from 'lucide-react';

const ADMIN_UID = "jV5Y63M77PcqIcOUCpLz76GTYMI3"; // <-- Canvieu això pel vostre UID de Firebase

const FeedbackModal: React.FC = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Només mostrem el modal si no hi ha una marca al localStorage
        const hasSeenFeedback = localStorage.getItem('has_submitted_feedback');
        if (!hasSeenFeedback) {
            // Un petit delay perquè no salti de cop només entrar, sinó que se senti natural
            const timer = setTimeout(() => setIsVisible(true), 3500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Evitar que torni a sortir mai més, encara que cancel·li
        localStorage.setItem('has_submitted_feedback', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!message.trim()) {
            setError('Si us plau, escriu una mica de text.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Ocultem la complexitat i encriptem tal com funciona el sistema de missatges
            const encryptedBody = encryptMessage(message);

            await addDoc(collection(db, 'messages'), {
                senderId: user?.id || 'anonymous_feedback',
                senderName: user?.username || 'Usuari Anònim',
                senderAvatar: user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=Anonim',
                receiverId: ADMIN_UID,
                receiverName: 'Administrador Apunts',
                receiverAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
                subject: 'Feedback Automàtic Web',
                body: encryptedBody,
                read: false,
                createdAt: serverTimestamp()
            });

            handleClose(); // Tanca i guarda al localStorage
        } catch (err) {
            console.error('Error enviant feedback:', err);
            setError('Vaja, hi ha hagut un petit error en enviar el feedback.');
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop premium amb blur i foscor intensa */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Contenidor Principal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                    >
                        {/* Brillantor decorativa a la part superior */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-emerald-400 via-sky-400 to-indigo-500" />
                        
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 blur-3xl rounded-full" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />

                        <div className="relative p-6 sm:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                                        <MessageSquareHeart size={24} className="text-sky-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            Què et sembla la web?
                                            <Sparkles size={16} className="text-amber-400 animate-pulse" />
                                        </h2>
                                        <p className="text-sm text-slate-400 mt-0.5">
                                            Resposta anònima, no cal estar registrat.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                    aria-label="Tancar"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="PRO2 hauría de ser taronja en lloc de blau! >:c"
                                        className="w-full h-32 px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 resize-none transition-all"
                                        disabled={isSubmitting}
                                    />
                                    {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel·lar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || message.trim() === ''}
                                        className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold shadow-lg overflow-hidden transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-sky-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative flex items-center gap-2">
                                            {isSubmitting ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                            {isSubmitting ? 'Enviant...' : 'Enviar Feedback'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
