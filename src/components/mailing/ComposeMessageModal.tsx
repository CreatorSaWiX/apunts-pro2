import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, AlertCircle, FileCode, Code } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

import ProblemSelectorModal from './ProblemSelectorModal';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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


            let receiverAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${receiverName}`;
            try {
                const { getDoc, doc } = await import('firebase/firestore');
                const docSnap = await getDoc(doc(db, 'users', receiverId));
                if (docSnap.exists() && docSnap.data().avatar) {
                    receiverAvatar = docSnap.data().avatar;
                }
            } catch (err) {
                console.error(t('mailing.compose.errAvatar', "No s'ha pogut verificar la foto del receptor"), err);
            }

            await addDoc(collection(db, 'messages'), {
                senderId: user.id,
                senderName: user.username,
                senderAvatar: user.avatar,
                receiverId: receiverId,
                receiverName: receiverName,
                receiverAvatar: receiverAvatar,
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
        } catch (err) {
            console.error(err);
            setError(t('mailing.compose.errSendFailed', 'Error en enviar el missatge. Torna-ho a provar.'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" overlayVariant="transparent">
            <Modal.Header>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tracking-tight">{t('mailing.compose.title', 'Redactar missatge')}</span>
                    <span className="text-xs text-slate-400 mt-1">{t('mailing.compose.sendingTo', 'Enviant a')} <span className="text-white font-medium">{receiverName}</span></span>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                >
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
