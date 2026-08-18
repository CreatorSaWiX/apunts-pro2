import React, { useState, useEffect, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, FileCode, Code, User, Search } from 'lucide-react';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

import ProblemSelectorModal from './ProblemSelectorModal';
import Spinner from '../ui/Spinner';
import Modal from '../ui/modals/Modal';
import { useTranslation } from 'react-i18next';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface ComposeMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId?: string;
    receiverName?: string;
    initialSubject?: string;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
    isOpen,
    onClose,
    receiverId,
    receiverName,
    initialSubject = ''
}) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Exercise selector
    const [isProblemSelectorOpen, setIsProblemSelectorOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<{ id: string; title: string; topicId?: string } | null>(null);

    // User selector state
    const [allUsers, setAllUsers] = useState<{id: string, username: string, avatar: string}[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState<{id: string, username: string, avatar: string} | null>(
        receiverId && receiverName ? { id: receiverId, username: receiverName, avatar: '' } : null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const [isFetchingUsers, setIsFetchingUsers] = useState(false);

    useEffect(() => {
        if (!receiverId) {
            const fetchUsers = async () => {
                setIsFetchingUsers(true);
                try {
                    const snap = await getDocs(collection(db, 'usernames'));
                    setAllUsers(snap.docs.map(doc => ({ 
                        id: doc.data().uid, 
                        username: doc.id, 
                        avatar: doc.data().avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.id}` 
                    })));
                } catch (err) {
                    console.error("Error fetching users for compose", err);
                } finally {
                    setIsFetchingUsers(false);
                }
            };
            fetchUsers();
        }
    }, [receiverId]);

    const filteredUsers = searchQuery.trim() 
        ? allUsers.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) && u.id !== user?.id).slice(0, 5) 
        : [];

    const handleSelectProblem = (problem: { id: string; title: string; topicId?: string }) => {
        setSelectedProblem(problem);
        if (!subject.includes(`[${problem.id}]`)) {
            setSubject(prev => `[${problem.id}] ${prev}`.trim());
        }
        setIsProblemSelectorOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReceiver) {
            setError(t('mailing.compose.errNoReceiver', 'Si us plau, selecciona un destinatari.'));
            return;
        }

        if (!subject.trim()) {
            setError(t('mailing.compose.errNoSubject', 'Si us plau, introdueix un assumpte per al missatge.'));
            return;
        }

        if (!body.trim()) {
            setError(t('mailing.compose.errEmptyBody', 'El missatge no pot estar buit.'));
            return;
        }

        if (!user) {
            setError(t('mailing.compose.errNotLoggedIn', "Has d'iniciar sessió per enviar missatges."));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let finalReceiverAvatar = selectedReceiver.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedReceiver.username}`;
            try {
                const { getDoc, doc } = await import('firebase/firestore');
                const docSnap = await getDoc(doc(db, 'users', selectedReceiver.id));
                if (docSnap.exists() && docSnap.data().avatar) {
                    finalReceiverAvatar = docSnap.data().avatar;
                }
            } catch (err) {
                console.error("No s'ha pogut verificar la foto del receptor", err);
            }

            await addDoc(collection(db, 'messages'), {
                senderId: user.id,
                senderName: user.username,
                senderAvatar: user.avatar,
                receiverId: selectedReceiver.id,
                receiverName: selectedReceiver.username,
                receiverAvatar: finalReceiverAvatar,
                subject: subject,
                body: body,
                relatedProblemId: selectedProblem ? selectedProblem.id : null,
                relatedTopicId: selectedProblem ? selectedProblem.topicId : null,
                read: false,
                createdAt: serverTimestamp()
            });

            onClose();
            setBody('');
            setSubject('');
            setSelectedProblem(null);
            setSearchQuery('');
            if (!receiverId) setSelectedReceiver(null);
        } catch (err) {
            console.error(err);
            setError(t('mailing.compose.errSendFailed', 'Error en enviar el missatge. Torna-ho a provar.'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" fullScreenOnMobile={true}>
            <Modal.Header>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tracking-tight">{t('mailing.compose.title', 'Redactar missatge')}</span>
                    {receiverId && receiverName && (
                        <span className="text-xs text-slate-400 mt-1">{t('mailing.compose.sendingTo', 'Enviant a')} <span className="text-white font-medium">{receiverName}</span></span>
                    )}
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {!receiverId && (
                        <div className="space-y-3 relative" ref={dropdownRef}>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('mailing.compose.to', 'Per a')}</label>
                            {selectedReceiver ? (
                                <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl">
                                    <img src={selectedReceiver.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedReceiver.username}`} alt="" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm text-white font-medium flex-1">{selectedReceiver.username}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedReceiver(null)}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search size={16} className="text-slate-400" />
                                    </div>
                                    <Modal.Input
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder={t('mailing.compose.searchUser', 'Cerca usuari per nom...')}
                                        className="pl-9"
                                    />
                                    
                                    <AnimatePresence>
                                        {isDropdownOpen && searchQuery.trim() && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                                            >
                                                {filteredUsers.length > 0 ? (
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {filteredUsers.map(u => (
                                                            <button
                                                                key={u.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedReceiver(u);
                                                                    setSearchQuery('');
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition text-left"
                                                            >
                                                                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-800" />
                                                                <span className="text-sm font-medium text-white">{u.username}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-slate-400">
                                                        {isFetchingUsers 
                                                            ? t('mailing.compose.searchingUsers', "Cercant usuaris...")
                                                            : t('mailing.compose.noUsersFound', "No s'han trobat usuaris")}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('mailing.compose.subject', 'Assumpte')}</label>
                            <button
                                type="button"
                                onClick={() => setIsProblemSelectorOpen(true)}
                                className="text-xs flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors px-2 py-1 rounded-md hover:bg-sky-500/10"
                            >
                                <FileCode size={14} />
                                {t('mailing.compose.linkExercise', 'Vincular exercici')}
                            </button>
                        </div>

                        <div className="relative group">
                            <Modal.Input
                                value={subject}
                                onChange={(e) => {
                                    setSubject(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder={t('mailing.compose.subjectPlaceholder', "[P12345] Dubte d'aquest exercici")}
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
                                    <div className="font-medium text-sky-100">{t('mailing.compose.linkedExercise', 'Exercici Vinculat')}</div>
                                    <div className="text-xs text-sky-400 truncate">{selectedProblem.id} - {selectedProblem.title}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedProblem(null); setSubject(prev => prev.replace(`[${selectedProblem.id}]`, '').trim()); }}
                                    className="p-2 hover:bg-sky-500/20 rounded-lg text-sky-400 hover:text-sky-200 transition-colors"
                                    aria-label="Tancar">
                                    <X size={16} />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                {t('mailing.compose.messageBody', 'Missatge')}
                            </label>
                            <button type="button" className="text-xs text-sky-400 flex items-center gap-1 hover:text-sky-300 transition-colors" onClick={() => setBody(prev => prev + '\n```cpp\n// El teu codi aquí\n```\n')}>
                                <Code size={14} /> {t('mailing.compose.addCode', 'Afegeix Codi')}
                            </button>
                        </div>
                        <Modal.Textarea
                            value={body}
                            onChange={(e) => {
                                setBody(e.target.value);
                                if (error) setError('');
                            }}
                            className="min-h-[200px]"
                            placeholder={t('mailing.compose.bodyPlaceholder', "Escriu el teu missatge aquí... (Pots fer servir ```cpp per afegir codi)")}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-rose-400 text-sm p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <Modal.Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3"
                        >
                            {isLoading ? <Spinner size="sm" variant="white" glow={false} /> : <Send size={18} />}
                            {isLoading ? t('mailing.compose.sending', 'Enviant missatge...') : t('mailing.compose.send', 'Enviar missatge')}
                        </Modal.Button>
                    </div>
                </form>
            </Modal.Body>

            <ProblemSelectorModal
                isOpen={isProblemSelectorOpen}
                onClose={() => setIsProblemSelectorOpen(false)}
                onSelect={handleSelectProblem}
            />
        </Modal>
    );
};

export default ComposeMessageModal;
