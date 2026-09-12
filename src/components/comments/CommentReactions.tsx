import { useState, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import { CUSTOM_EMOJIS, getCustomEmojiUrl } from '../../lib/emojis';
import { resolveMediaUrl } from '../../lib/mediaUtils';
import type { CommentReactionUser } from '../../types/comments';

interface CommentReactionsProps {
    commentId: string;
    reactions: Record<string, CommentReactionUser>;
    currentUserId?: string;
    onReact: (commentId: string, emoji: string) => void;
}

// Canonical entries [name, url]
const CUSTOM_EMOTES = Object.entries(CUSTOM_EMOJIS);

const CommentReactionsComponent = ({
    commentId,
    reactions,
    currentUserId,
    onReact
}: CommentReactionsProps) => {
    const [showReactorTooltip, setShowReactorTooltip] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

    // Group reactions by emoji key
    const reactionGroups = useMemo(() => {
        const groups: Record<string, { count: number; users: string[]; hasUserReacted: boolean }> = {};
        for (const [userId, data] of Object.entries(reactions || {})) {
            if (!data?.emoji) continue;
            if (!groups[data.emoji]) {
                groups[data.emoji] = { count: 0, users: [], hasUserReacted: false };
            }
            groups[data.emoji].count++;
            groups[data.emoji].users.push(data.username || 'Usuari');
            if (currentUserId && userId === currentUserId) {
                groups[data.emoji].hasUserReacted = true;
            }
        }
        return groups;
    }, [reactions, currentUserId]);

    const handleTogglePicker = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!showPicker) {
            const rect = e.currentTarget.getBoundingClientRect();
            let top = rect.bottom + 6;
            let left = rect.left;

            // Prevent right overflow
            if (left + 288 > window.innerWidth) {
                left = window.innerWidth - 300;
            }
            if (left < 10) left = 10;

            // Prevent bottom overflow
            if (top + 240 > window.innerHeight) {
                top = rect.top - 245;
            }

            setPickerPosition({ top, left });
            setShowPicker(true);
        } else {
            setShowPicker(false);
        }
    };

    const renderReactionIcon = (emoji: string) => {
        // 1. Direct or case-insensitive custom emoji lookup
        const customUrl = getCustomEmojiUrl(emoji);
        if (customUrl) {
            return (
                <img
                    src={customUrl}
                    alt={emoji}
                    loading="lazy"
                    className="w-4 h-4 object-contain"
                />
            );
        }

        // 2. Lookup legacy asset path or hashed name containing the key (e.g., '/assets/catpeek-DU5Jt6HD.png')
        const matchedKey = Object.keys(CUSTOM_EMOJIS).find(
            (key) => emoji.toLowerCase().includes(key.toLowerCase())
        );
        if (matchedKey && CUSTOM_EMOJIS[matchedKey]) {
            return (
                <img
                    src={CUSTOM_EMOJIS[matchedKey]}
                    alt={matchedKey}
                    loading="lazy"
                    className="w-4 h-4 object-contain"
                />
            );
        }

        // 3. Fallback for image paths or remote URLs (/assets/, /emojis/, http, data:, or image extensions)
        if (
            emoji.startsWith('/') ||
            emoji.startsWith('http') ||
            emoji.startsWith('data:') ||
            /\.(png|webp|gif|jpg|svg)/i.test(emoji)
        ) {
            return (
                <img
                    src={resolveMediaUrl(emoji)}
                    alt="reaction"
                    loading="lazy"
                    className="w-4 h-4 object-contain"
                />
            );
        }

        // 4. Fallback for native Unicode emojis (e.g. '👍', '❤️', '🚀')
        return <span className="text-xs">{emoji}</span>;
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {/* Render existing reaction badges */}
            {Object.entries(reactionGroups).map(([emoji, group]) => (
                <div key={emoji} className="relative">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => currentUserId && onReact(commentId, emoji)}
                        onMouseEnter={() => setShowReactorTooltip(emoji)}
                        onMouseLeave={() => setShowReactorTooltip(null)}
                        className={`
                            relative flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all duration-200 border cursor-pointer
                            ${
                                group.hasUserReacted
                                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                                    : 'bg-slate-800/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:border-white/10 hover:text-slate-200'
                            }
                        `}
                    >
                        {renderReactionIcon(emoji)}
                        <span className="font-mono text-[10px]">{group.count}</span>
                    </motion.button>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showReactorTooltip === emoji && (
                            <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 2, scale: 0.95 }}
                                transition={{ duration: 0.12 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-slate-200 whitespace-nowrap z-50 pointer-events-none shadow-xl"
                            >
                                {group.users.slice(0, 3).join(', ')}
                                {group.users.length > 3 && ` i ${group.users.length - 3} més`}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}

            {/* Quick Picker Trigger - visible on mobile, hover-revealed on desktop */}
            {currentUserId && (
                <div className="relative">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleTogglePicker}
                        className={`p-1 rounded-full transition-all cursor-pointer ${
                            showPicker
                                ? 'text-sky-400 bg-sky-500/10 opacity-100'
                                : 'text-slate-500 hover:text-sky-400 hover:bg-white/5 opacity-0 group-hover/comment:opacity-100'
                        }`}
                        title="Afegir reacció"
                        aria-label="Afegir reacció"
                    >
                        <Smile size={14} />
                    </motion.button>

                    {/* Valid Tailwind Arbitrary Z-Index values z-[9990] and z-[10000] */}
                    {showPicker &&
                        createPortal(
                            <>
                                <div
                                    className="fixed inset-0 z-[9990] bg-transparent"
                                    onClick={() => setShowPicker(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    className="fixed z-[10000] p-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-56 overflow-y-auto custom-scrollbar overscroll-contain"
                                    style={{
                                        top: pickerPosition.top,
                                        left: pickerPosition.left
                                    }}
                                >
                                    {CUSTOM_EMOTES.map(([emojiName, emojiUrl]) => (
                                        <button
                                            key={emojiName}
                                            type="button"
                                            onClick={() => {
                                                onReact(commentId, emojiName);
                                                setShowPicker(false);
                                            }}
                                            className="p-1.5 rounded-xl hover:bg-white/10 transition-transform hover:scale-115 flex items-center justify-center cursor-pointer"
                                            title={emojiName}
                                        >
                                            <img
                                                src={emojiUrl}
                                                alt={emojiName}
                                                className="w-6 h-6 object-contain"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </motion.div>
                            </>,
                            document.body
                        )}
                </div>
            )}
        </div>
    );
};

export const CommentReactions = memo(CommentReactionsComponent);
export default CommentReactions;
