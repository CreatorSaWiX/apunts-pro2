import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Reply, ExternalLink, ChevronRight } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { decryptMessage } from '../../utils/encryption';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ComposeMessageModal from './ComposeMessageModal';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    receiverId: string;
    subject: string;
    body: string;
    relatedProblemId?: string;
    relatedTopicId?: string;
    read: boolean;
    createdAt: any;
}

const MailboxModal = ({ isOpen, onClose }: any) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchMessages();
        }
    }, [isOpen, user]);

    const fetchMessages = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const q = query(
                collection(db, 'messages'),
                where('receiverId', '==', user.id)
            );
            const snapshot = await getDocs(q);
            const msgs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Message))
                .sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                });
            setMessages(msgs);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReadMessage = async (msg: Message) => {
        if (!msg.read) {
            try {
                await updateDoc(doc(db, 'messages', msg.id), { read: true });
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
            } catch (e) {
                console.error("Error marking as read", e);
            }
        }
        setSelectedMessage(msg);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-5xl h-[700px] shadow-2xl relative flex overflow-hidden ring-1 ring-white/5"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 text-slate-400 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all backdrop-blur-sm"
                >
                    <X size={18} />
                </button>

                {/* Left Panel: List */}
                <div className={`w-full md:w-[350px] border-r border-white/5 flex flex-col bg-slate-900/50 ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
                                <Mail size={20} />
                            </div>
                            Bústia
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3">
                                <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-slate-500 font-medium">Sincronitzant...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
                                <Mail size={32} className="opacity-20" />
                                <span className="text-sm">No tens missatges</span>
                            </div>
                        ) : (
                            <div className="flex flex-col p-3 gap-2">
                                {messages.map(msg => (
                                    <motion.div
                                        key={msg.id}
                                        layoutId={msg.id}
                                        onClick={() => handleReadMessage(msg)}
                                        className={`group relative p-4 rounded-xl cursor-pointer transition-all border border-transparent ${selectedMessage?.id === msg.id
                                            ? 'bg-sky-500/10 border-sky-500/20'
                                            : 'hover:bg-white/5 hover:border-white/5'
                                            }`}
                                    >
                                        {!msg.read && (
                                            <span className="absolute top-4 right-4 w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                                        )}

                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedMessage?.id === msg.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                {msg.senderName.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {msg.senderName}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Ara'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`text-sm truncate leading-relaxed ${!msg.read ? 'text-slate-200 font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                            {msg.subject}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Content */}
                <div className={`w-full md:flex-1 flex flex-col bg-[#0f172a] relative ${!selectedMessage ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                    {selectedMessage ? (
                        <>
                            {/* Mobile Back Button */}
                            <div className="md:hidden p-4 border-b border-white/5 flex items-center gap-2">
                                <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                    <Reply className="rotate-180" size={20} />
                                </button>
                                <span className="font-medium text-white">Torna</span>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={selectedMessage.id}
                                className="flex flex-col h-full"
                            >
                                <div className="p-8 border-b border-white/5 bg-slate-900/30">
                                    {/* Subject and Actions */}
                                    {/* Subject */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-white leading-tight">
                                            {selectedMessage.subject}
                                        </h3>
                                    </div>

                                    {/* Sender Info - Clickable Profile */}
                                    <div className="flex items-center justify-between">
                                        <Link
                                            to={`/profile/${selectedMessage.senderId}`}
                                            className="flex items-center gap-4 group/profile"
                                            onClick={onClose} // Close modal when navigating to profile
                                        >
                                            <div className="relative">
                                                <img
                                                    src={selectedMessage.senderAvatar}
                                                    className="w-12 h-12 rounded-full bg-slate-800 ring-2 ring-slate-800 group-hover/profile:ring-sky-500 transition-all"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <div className="text-base font-bold text-white flex items-center gap-2 group-hover/profile:text-sky-400 transition-colors">
                                                    {selectedMessage.senderName}
                                                    <ExternalLink size={12} className="opacity-0 group-hover/profile:opacity-100 transition-opacity text-slate-500" />
                                                </div>
                                                <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                                                    <span>Enviat el {selectedMessage.createdAt?.toDate().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-light text-lg">
                                            {decryptMessage(selectedMessage.body)}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/5">
                                        {selectedMessage.relatedProblemId && (
                                            <Link
                                                to={`/tema/${selectedMessage.relatedTopicId}/solucionaris/${selectedMessage.relatedProblemId}`}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all border border-emerald-500/20 group"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink size={16} />
                                                <span>Veure Exercici {selectedMessage.relatedProblemId}</span>
                                                <ChevronRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => setIsReplyOpen(true)}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transform hover:-translate-y-0.5"
                                        >
                                            <Reply size={18} />
                                            Respondre al missatge
                                        </button>
                                    </div>

                                    <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest justify-center opacity-50">
                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                        Missatge encriptat (AES-256)
                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 opacity-50">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                                <Mail size={48} />
                            </div>
                            <p className="text-lg font-medium">Selecciona un missatge per llegir-lo</p>
                        </div>
                    )}
                </div>

                {/* Reply Modal */}
                {isReplyOpen && selectedMessage && (
                    <ComposeMessageModal
                        isOpen={isReplyOpen}
                        onClose={() => setIsReplyOpen(false)}
                        receiverId={selectedMessage.senderId}
                        receiverName={selectedMessage.senderName}
                        initialSubject={selectedMessage.subject.toUpperCase().startsWith('RE:') ? selectedMessage.subject : `RE: ${selectedMessage.subject}`}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default MailboxModal;
