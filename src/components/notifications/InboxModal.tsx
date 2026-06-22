import { useState, useEffect, useMemo } from 'react';

import { Bell, Heart, MessageCircle, AtSign } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import Modal from '../ui/Modal';

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
                <div className="flex items-center justify-between w-full pr-8">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white tracking-tight">Activitat</span>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                        >
                            Marcar tot com llegit
                        </button>
                    )}
                </div>
            </Modal.Header>

            <Modal.Body className="p-2 flex flex-col max-h-[70vh]">
                <div className="flex items-center gap-2 p-2 shrink-0 overflow-x-auto custom-scrollbar border-b border-white/5">
                    {(['all', 'mentions', 'likes', 'comments'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                        >
                            {f === 'all' ? 'Totes' : f === 'mentions' ? 'Mencions' : f === 'likes' ? 'Likes' : 'Comentaris'}
                        </button>
                    ))}
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : groupedNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                            <Bell size={48} className="opacity-20" />
                            <p>No hi ha res a mostrar aquí</p>
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
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${notification.read
                                    ? 'bg-transparent border-transparent hover:bg-white/5'
                                    : 'bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10'
                                    }`}
                            >
                                <div className="relative mt-1">
                                    <img
                                        src={notification.fromUserAvatar || `https://ui-avatars.com/api/?name=${notification.fromUserName}&background=random`}
                                        alt=""
                                        className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-slate-900"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0f172a] ${isLikeOrReaction ? 'bg-pink-500 text-white' : (notification.type === 'mention' ? 'bg-amber-500 text-white' : 'bg-sky-500 text-white')
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
                                            {notification.createdAt?.toDate ? formatDistanceToNow(notification.createdAt.toDate(), { locale: ca }) : 'Ara'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                        {notification.type === 'mention' ? (
                                            <>T'ha mencionat a <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                        ) : isPostNotification ? (
                                            isLikeOrReaction 
                                                ? <>Li ha agradat la teva publicació <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                                : <>Ha respost a la teva publicació <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                        ) : (
                                            !isLikeOrReaction ? (
                                                <>Ha respost al teu comentari a <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                            ) : (
                                                <>Ha reaccionat al teu comentari a <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
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
