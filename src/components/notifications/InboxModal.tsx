import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Heart, MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

interface Notification {
    id: string;
    userId: string;
    type: 'reaction' | 'reply'; // reaction, reply
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

    const markAsRead = async (notification: Notification) => {
        if (!notification.read) {
            try {
                await updateDoc(doc(db, 'notifications', notification.id), { read: true });
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[700px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/5"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <Bell size={20} />
                        </div>
                        Activitat
                    </h2>
                    <div className="flex items-center gap-2">
                        {notifications.some(n => !n.read) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                            >
                                Marcar tot com llegit
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all backdrop-blur-sm ml-2"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                            <Bell size={48} className="opacity-20" />
                            <p>No tens notificacions recents</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map(notification => (
                                <Link
                                    to={`/tema/unknown/solucionaris/${notification.resourceId}`}
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
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0f172a] ${notification.type === 'reaction' ? 'bg-pink-500 text-white' : 'bg-sky-500 text-white'
                                            }`}>
                                            {notification.type === 'reaction' ? <Heart size={10} fill="currentColor" /> : <MessageCircle size={10} />}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-sm font-bold text-slate-200">
                                                {notification.fromUserName}
                                            </span>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                                {notification.createdAt?.toDate ? formatDistanceToNow(notification.createdAt.toDate(), { locale: ca }) : 'Ara'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                            {notification.type === 'reply' ? (
                                                <>Ha respost al teu comentari a <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                            ) : (
                                                <>Ha reaccionat al teu comentari a <span className="text-indigo-400 font-medium">{notification.resourceTitle}</span></>
                                            )}
                                        </p>
                                    </div>

                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InboxModal;
