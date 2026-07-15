import { useState, useEffect, useMemo } from 'react';
import { m as motion } from 'framer-motion';

import { Bell, Heart, MessageCircle, AtSign } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ca, es, enUS } from 'date-fns/locale';
import Modal from '../ui/Modal';
import NavigationPill from '../ui/NavigationPill';
import Spinner from '../ui/Spinner';
import { useTranslation } from 'react-i18next';

interface Notification {
    id: string;
    userId: string;
    type: 'reaction' | 'reply' | 'like' | 'mention'; // reaction, reply, like, mention
    content?: string; // emoji or preview
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar: string;
    resourceId: string; // solutionId
    resourceTitle: string;
    commentId: string;
    read: boolean;
    createdAt: any;
}

const InboxModal = ({ isOpen, onClose }: any) => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === 'es' ? es : i18n.language === 'en' ? enUS : ca;
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'mentions' | 'likes' | 'comments'>('all');

    useEffect(() => {
        if (isOpen && user) {
            fetchNotifications();
        }
    }, [isOpen, user]);

    const fetchNotifications = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Actually let's try just filtering by userId first to avoid index errors in dev
            const qSimple = query(collection(db, 'notifications'), where('userId', '==', user.id));

            const snapshot = await getDocs(qSimple);
            const notifs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
                .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            setNotifications(notifs);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notification: Notification & { ids?: string[] }) => {
        if (!notification.read) {
            try {
                const idsToUpdate = notification.ids || [notification.id];
                await Promise.all(idsToUpdate.map(id => updateDoc(doc(db, 'notifications', id), { read: true })));
                setNotifications(prev => prev.map(n => idsToUpdate.includes(n.id) ? { ...n, read: true } : n));
            } catch (error) {
                console.error("Error marking as read", error);
            }
        }
        onClose();
    };

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Error marking all read", error);
        }
    };

    const groupedNotifications = useMemo(() => {
        let filtered = notifications;
        if (filter === 'likes') {
            filtered = notifications.filter(n => n.type === 'like' || n.type === 'reaction');
        } else if (filter === 'comments') {
            filtered = notifications.filter(n => n.type === 'reply');
        } else if (filter === 'mentions') {
            filtered = notifications.filter(n => n.type === 'mention');
        }

        const groups = new Map<string, Notification & { count: number, ids: string[] }>();

        filtered.forEach(n => {
            const key = `${n.type}-${n.resourceId}-${n.fromUserId}-${n.type === 'reply' ? n.commentId : ''}`;
            
            if (groups.has(key)) {
                const group = groups.get(key)!;
                group.count += 1;
                group.ids.push(n.id);
                if (!n.read) group.read = false;
                if (n.createdAt?.seconds > group.createdAt?.seconds) {
                    group.createdAt = n.createdAt;
                }
            } else {
                groups.set(key, { ...n, count: 1, ids: [n.id] });
            }
        });

        return Array.from(groups.values()).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }, [notifications, filter]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <Modal.Header>
                <div className="relative flex items-center justify-between w-full">
                    <span className="text-xl font-bold text-white tracking-tight shrink-0 z-20">{t('notifications.inbox.title', 'Activitat')}</span>
                    
                    <div className="flex-1 flex justify-center px-2 sm:px-4 sm:absolute sm:left-1/2 sm:-translate-x-1/2 z-10">
                        <NavigationPill className="!p-1 flex gap-1 overflow-x-auto custom-scrollbar max-w-[200px] sm:max-w-[400px]">
                            {(['all', 'mentions', 'likes', 'comments'] as const).map(f => (
                                <button type="button"
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`relative px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${filter === f ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {filter === f && (
                                        <motion.div 
                                            layoutId="inbox-filter-pill"
                                            className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1)]"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        >
                                            <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                        </motion.div>
                                    )}
                                    <span className="relative z-10">{f === 'all' ? t('notifications.inbox.filters.all', 'Totes') : f === 'mentions' ? t('notifications.inbox.filters.mentions', 'Mencions') : f === 'likes' ? t('notifications.inbox.filters.likes', 'Likes') : t('notifications.inbox.filters.comments', 'Comentaris')}</span>
                                </button>
                            ))}
                        </NavigationPill>
                    </div>

                    <div className="shrink-0 z-20">
                        {notifications.some(n => !n.read) && (
                            <button type="button"
                                onClick={markAllAsRead}
                                className="hidden sm:block text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                            >
                                {t('notifications.inbox.markAllRead', 'Marcar tot com llegit')}
                            </button>
                        )}
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="!p-0 flex flex-col flex-1 overflow-hidden">
                {/* Filter navigation moved to header */}
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center min-h-[400px]">
                            <Spinner size="md" variant="indigo" />
                        </div>
                    ) : groupedNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                            <Bell size={48} className="opacity-20" />
                            <p>{t('notifications.inbox.empty', 'No hi ha res a mostrar aquí')}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {groupedNotifications.map(notification => {
                            const isPostNotification = 
                                notification.commentId?.startsWith('community_post') || 
                                notification.type === 'like' || 
                                (notification.type === 'reaction' && notification.commentId === notification.resourceId);
                            
                            const isLikeOrReaction = notification.type === 'reaction' || notification.type === 'like';
                            
                            const linkTo = isPostNotification ? '/comunitat' : `/tema/unknown/solucionaris/${notification.resourceId}`;
                            
                            return (
                            <Link
                                to={linkTo}
                                key={notification.id}
                                onClick={() => markAsRead(notification)}
                                className={`group flex items-start gap-4 p-4 rounded-xl border transition-all ${notification.read
                                    ? 'border-transparent hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                                    : 'bg-white/[0.08] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                                    }`}
                            >
                                <div className="relative mt-1">
                                    <img loading="lazy"
                                        src={notification.fromUserAvatar || `https://ui-avatars.com/api/?name=${notification.fromUserName}&background=random`}
                                        alt=""
                                        className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-slate-900"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-md ${isLikeOrReaction ? 'bg-pink-500/80 text-white shadow-pink-500/50' : (notification.type === 'mention' ? 'bg-amber-500/80 text-white shadow-amber-500/50' : 'bg-sky-500/80 text-white shadow-sky-500/50')
                                        }`}>
                                        {isLikeOrReaction ? <Heart size={10} fill="currentColor" /> : (notification.type === 'mention' ? <AtSign size={10} /> : <MessageCircle size={10} />)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-200">
                                                {notification.fromUserName}
                                            </span>
                                            {notification.count > 1 && (
                                                <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-md">
                                                    x{notification.count}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                            {notification.createdAt?.toDate ? formatDistanceToNow(notification.createdAt.toDate(), { locale: dateLocale }) : t('notifications.inbox.now', 'Ara')}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                        {notification.type === 'mention' ? (
                                            <>{t('notifications.inbox.mentioned', "T'ha mencionat a ")}<span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                        ) : isPostNotification ? (
                                            isLikeOrReaction 
                                                ? <>{t('notifications.inbox.likedPost', "Li ha agradat la teva publicació ")}<span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                                : <>{t('notifications.inbox.repliedPost', "Ha respost a la teva publicació ")}<span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                        ) : (
                                            !isLikeOrReaction ? (
                                                <>{t('notifications.inbox.repliedComment', "Ha respost al teu comentari a ")}<span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                            ) : (
                                                <>{t('notifications.inbox.reactedComment', "Ha reaccionat al teu comentari a ")}<span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                            )
                                        )}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                )}
                            </Link>
                            );
                        })}
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default InboxModal;
