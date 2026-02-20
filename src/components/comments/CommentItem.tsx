import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Smile, Trash2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom emotes from /public/emojis
const CUSTOM_EMOTES = [
    'neko.png', 'Neko_pout.png', 'catfire.PNG', 'neko_blep.PNG', 'Neko_Cat_Ok87.PNG',
    'cat_omg_ty.PNG', 'nekosmug.png', 'neko_giggle5.PNG', 'nekostress.png',
    'catafraid14.PNG', 'catdrama.PNG', 'nekoshy69.PNG', 'nekocandy.PNG',
    'neko_sleep8.PNG', 'nekogiveup.png', 'nekodumb.png', 'nekofat.png',
    'nekodrunk.PNG', 'nekocatmummy.PNG', 'nekosimp.png', 'nekosmirk17.PNG',
    'Neko3.png', 'cat_think.PNG', 'catpeek.png', 'cathammer.PNG',
    'cutieanger.PNG', 'neko_aw.PNG', 'neko_expect.PNG', 'neko_peak60.PNG',
    'nekocat_lie.PNG', 'nekocatshrug19.PNG', 'Lick.png', 'neko cat.webp',
    'emoji120.PNG', 'file35511.PNG', 'michifasha84.PNG', 'need73.PNG'
].map(file => `/emojis/${file}`);

export interface Comment {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    content: string;
    createdAt: any;
    reactions: Record<string, { emoji: string; username: string }>; // userId -> reaction data
    replyCount: number;
    replyTo?: {
        id: string;
        username: string;
        content: string;
    };
    replies?: Comment[]; // For client-side threading
}

interface CommentItemProps {
    comment: Comment;
    onReact: (commentId: string, emoji: string) => void;
    onReply: (comment: Comment) => void;
    onDelete?: (commentId: string) => void;
    isReply?: boolean;
}

const CommentItem = ({ comment, onReact, onReply, onDelete, isReply = false }: CommentItemProps) => {
    const { user } = useAuth();
    const [showReactorTooltip, setShowReactorTooltip] = useState<string | null>(null);
    const [areRepliesVisible, setAreRepliesVisible] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

    const handleTogglePicker = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!showPicker) {
            let top = e.clientY + 5;
            let left = e.clientX + 5;

            // Make sure the 288px wide picker doesn't overflow the right edge
            if (left + 288 > window.innerWidth) {
                left = window.innerWidth - 300;
            }
            if (left < 10) left = 10; // Left bleeding protection

            // Make sure it doesn't overflow the bottom
            if (top + 260 > window.innerHeight) {
                top = e.clientY - 265;
            }

            setPickerPosition({ top, left });
            setShowPicker(true);
        } else {
            setShowPicker(false);
        }
    };

    // Group reactions by emoji for display
    const reactionCounts = Object.entries(comment.reactions || {}).reduce((acc, [, data]) => {
        if (!acc[data.emoji]) acc[data.emoji] = [];
        acc[data.emoji].push(data.username);
        return acc;
    }, {} as Record<string, string[]>);

    const userReaction = user ? comment.reactions?.[user.id]?.emoji : null;

    // Helper to check if content is a GIF URL
    const isGif = (content: string) => {
        return content.startsWith('https://media.tenor.com') || content.match(/\.(gif|webp|jpg|png)$/i);
    };

    const isCustomEmoji = (emoji: string) => emoji.startsWith('/emojis/');

    return (
        <div className="flex flex-col">
            <div
                className={`flex gap-3 group/comment mt-4`}
            >
                {/* Avatar */}
                <Link to={`/profile/${comment.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                    <img
                        src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.username}&background=random`}
                        alt={comment.username}
                        className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-slate-800 object-cover ring-2 ring-slate-900`}
                    />
                </Link>

                {/* Content Body */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to={`/profile/${comment.userId}`}
                            className="font-bold text-slate-200 text-sm hover:underline hover:text-sky-400 transition-colors"
                        >
                            {comment.username}
                        </Link>

                        {/* TikTok style "replying to" indicator inside the reply item if it's a nested reply */}
                        {isReply && comment.replyTo && comment.replyTo.username && (
                            <span className="flex items-center gap-1 text-slate-500 text-xs">
                                <span className="text-[10px]">▶</span>
                                <Link
                                    to={`/profile/${comment.userId}`} // In a real app this might link to the replied user's profile, but we don't have their ID easily here without looking it up. keeping simple.
                                    className="font-medium text-slate-400 hover:text-sky-400"
                                >
                                    {comment.replyTo.username}
                                </Link>
                            </span>
                        )}

                        <span className="text-[10px] text-slate-500">
                            {comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: ca }) : 'Ara mateix'}
                        </span>
                        {user?.id === comment.userId && (
                            <div className="opacity-0 group-hover/comment:opacity-100 transition-opacity ml-auto">
                                <button
                                    onClick={() => onDelete?.(comment.id)}
                                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Text / Content */}
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {isGif(comment.content) ? (
                            <div className="mt-2 mb-2">
                                <img
                                    src={comment.content}
                                    alt="GIF"
                                    className="max-w-[250px] max-h-[250px] w-auto h-auto rounded-lg shadow-sm border border-white/5"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            comment.content
                        )}
                    </div>

                    {/* Reactions & Actions Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {/* Simple Reply Button (Text) */}
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Respondre
                        </button>

                        {/* Render existing reactions as badges */}
                        {Object.entries(reactionCounts).map(([emoji, users]) => (
                            <button
                                key={emoji}
                                onClick={() => user && onReact(comment.id, emoji)}
                                onMouseEnter={() => setShowReactorTooltip(emoji)}
                                onMouseLeave={() => setShowReactorTooltip(null)}
                                className={`
                                    relative group flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium transition-all border border-transparent
                                    ${userReaction === emoji
                                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                                    }
                                `}
                            >
                                {isCustomEmoji(emoji) ? (
                                    <img src={emoji} alt="reaction" className="w-4 h-4 object-contain" />
                                ) : (
                                    <span>{emoji}</span>
                                )}
                                <span>{users.length}</span>

                                {/* Tooltip */}
                                {showReactorTooltip === emoji && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[10px] text-white whitespace-nowrap z-10 pointer-events-none">
                                        {users.slice(0, 3).join(', ')}
                                        {users.length > 3 && ` i ${users.length - 3} més`}
                                    </div>
                                )}
                            </button>
                        ))}

                        {/* Add Reaction Button (Smile Icon) */}
                        <div className="relative">
                            <button
                                onClick={handleTogglePicker}
                                className={`text-slate-500 hover:text-sky-400 transition-opacity ${showPicker ? 'opacity-100 text-sky-400' : 'opacity-0 group-hover/comment:opacity-100'}`}
                                title="Afegir reacció"
                            >
                                <Smile size={14} />
                            </button>

                            {/* Quick Picker Popover - Portal at Document Body */}
                            {showPicker && createPortal(
                                <>
                                    <div
                                        className="fixed inset-0 z-[9990]"
                                        onClick={() => setShowPicker(false)}
                                    />
                                    <div
                                        className="fixed z-[10000] p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-64 overflow-y-auto custom-scrollbar overscroll-contain origin-top-left"
                                        style={{
                                            top: pickerPosition.top,
                                            left: pickerPosition.left,
                                        }}
                                    >
                                        {/* Custom Emotes */}
                                        {CUSTOM_EMOTES.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    if (user) onReact(comment.id, emoji);
                                                    setShowPicker(false);
                                                }}
                                                className={`p-1 rounded-lg hover:bg-slate-800 transition-transform hover:scale-110 flex items-center justify-center ${userReaction === emoji ? 'bg-sky-500/20' : ''}`}
                                            >
                                                <img src={emoji} alt="emoji" className="w-6 h-6 object-contain" loading="lazy" />
                                            </button>
                                        ))}
                                    </div>
                                </>,
                                document.body
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Replies Toggle (TikTok style) */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-2">
                    {!areRepliesVisible ? (
                        <button
                            onClick={() => setAreRepliesVisible(true)}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors group"
                        >
                            <div className="w-6 h-[1px] bg-slate-700 group-hover:bg-slate-500"></div>
                            <span>Veure {comment.replies.length} respostes</span>
                            <ChevronDown size={14} />
                        </button>
                    ) : (
                        <div className="flex flex-col">
                            {/* Render Replies */}
                            {comment.replies.map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    onReact={onReact}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                    isReply={true}
                                />
                            ))}

                            <button
                                onClick={() => setAreRepliesVisible(false)}
                                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors mt-3 group"
                            >
                                <div className="w-6 h-[1px] bg-slate-700 group-hover:bg-slate-500"></div>
                                <span>Amagar respostes</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
