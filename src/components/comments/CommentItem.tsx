import { useState, useEffect, memo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ca, es, enUS } from 'date-fns/locale';
import { Trash2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CUSTOM_EMOJIS, getCustomEmojiUrl } from '../../lib/emojis';
import { resolveMediaUrl } from '../../lib/mediaUtils';
import CommentReactions from './CommentReactions';
import type { CommentEntity } from '../../types/comments';

export type Comment = CommentEntity;

const dateLocales: Record<string, any> = { ca, es, en: enUS };

export interface CommentItemProps {
    comment: CommentEntity;
    onReact: (commentId: string, emoji: string) => void;
    onReply: (comment: CommentEntity) => void;
    onDelete?: (commentId: string) => void;
    isReply?: boolean;
    onNavigateToProfile?: (username: string) => void;
    forceExpanded?: boolean;
}

const isGif = (content: string) => {
    return content.startsWith('https://media.tenor.com') || content.match(/\.(gif|webp|jpg|png)$/i);
};

const CommentItemComponent = ({
    comment,
    onReact,
    onReply,
    onDelete,
    isReply = false,
    onNavigateToProfile,
    forceExpanded = false
}: CommentItemProps) => {
    const { user } = useAuth();
    const { i18n } = useTranslation();
    const [userToggled, setUserToggled] = useState<boolean | null>(null);

    // Automatically unlock and open when a forceExpanded signal arrives
    useEffect(() => {
        if (forceExpanded) {
            setUserToggled(true);
        }
    }, [forceExpanded]);

    const areRepliesVisible = userToggled !== null ? userToggled : (forceExpanded || false);

    const isCurrentUser = !!user && comment.userId === user.id;
    const isModerator = user?.role === 'moderador' || user?.role === 'editor' || user?.role === 'admin';
    const canDelete = !comment.isDeleted && (isCurrentUser || isModerator) && !!onDelete;

    const authorUsername = isCurrentUser ? user.username || comment.username : comment.username;
    const authorAvatar = isCurrentUser ? user.avatar || comment.userAvatar : comment.userAvatar;

    const dateLocale = dateLocales[i18n.language] || ca;
    const formattedDate = comment.createdAt?.toDate
        ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: dateLocale })
        : 'Ara mateix';

    const avatarUrl =
        resolveMediaUrl(authorAvatar) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorUsername)}&background=random`;

    const handleProfileClick = (e: React.MouseEvent) => {
        if (onNavigateToProfile) {
            e.preventDefault();
            onNavigateToProfile(authorUsername);
        }
    };

    // Replies exist only on root comments (depth 1 social-media pattern)
    const hasReplies = !isReply && comment.replies && comment.replies.length > 0;

    return (
        <div className="flex flex-col">
            <div className="flex items-start gap-3 group/comment py-1.5">
                {/* User Avatar */}
                {comment.isDeleted ? (
                    <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0">
                        <span className="text-slate-600 text-xs">✕</span>
                    </div>
                ) : (
                    <Link
                        to={`/profile/${authorUsername}`}
                        onClick={handleProfileClick}
                        className="shrink-0 hover:opacity-85 transition-opacity"
                    >
                        <img
                            loading="lazy"
                            src={avatarUrl}
                            alt={authorUsername}
                            className="w-8 h-8 rounded-full bg-slate-800 object-cover ring-1 ring-white/10"
                        />
                    </Link>
                )}

                {/* Content Body */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {comment.isDeleted ? (
                            <span className="text-xs font-semibold text-slate-500 italic">[Suprimit]</span>
                        ) : (
                            <Link
                                to={`/profile/${authorUsername}`}
                                onClick={handleProfileClick}
                                className="font-bold text-slate-200 text-xs sm:text-sm hover:underline hover:text-sky-400 transition-colors"
                            >
                                {authorUsername}
                            </Link>
                        )}

                        {/* Recipient tag */}
                        {isReply && comment.replyTo && comment.replyTo.username && !comment.isDeleted && (
                            <span className="text-[11px] text-slate-500 font-medium">
                                ▶ @{comment.replyTo.username}
                            </span>
                        )}

                        <span className="text-[11px] text-slate-500">{formattedDate}</span>

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete?.(comment.id)}
                                className="opacity-0 group-hover/comment:opacity-100 transition-opacity ml-auto text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                                title={isModerator && !isCurrentUser ? 'Eliminar com a moderador' : 'Eliminar comentari'}
                                aria-label="Eliminar comentari"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>

                    {/* Comment Body / Markdown */}
                    {comment.isDeleted ? (
                        <p className="text-slate-500 text-xs italic py-0.5">
                            Aquest comentari ha estat suprimit.
                        </p>
                    ) : (
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                            {isGif(comment.content) ? (
                                <div className="mt-1 mb-2">
                                    <img
                                        loading="lazy"
                                        src={comment.content}
                                        alt="GIF"
                                        className="max-w-[260px] max-h-[220px] w-auto h-auto rounded-xl shadow-lg border border-white/10"
                                    />
                                </div>
                            ) : (
                                <div className="text-xs sm:text-sm text-slate-200 leading-normal break-words [&_pre]:my-1.5 [&_pre]:p-2 [&_pre]:bg-slate-950 [&_pre]:border [&_pre]:border-white/5 [&_pre]:rounded-lg [&_code]:text-sky-300 [&_code]:bg-sky-500/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_a]:text-sky-400 [&_a]:underline">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => (
                                                <p className="m-0 p-0 leading-normal">{children}</p>
                                            ),
                                            img: ({ alt, src, ...props }) => {
                                                const isCustomEmote =
                                                    (alt && !!getCustomEmojiUrl(alt)) ||
                                                    (src && (Object.values(CUSTOM_EMOJIS).includes(src) || src.includes('emoji') || src.includes('.png') || src.includes('.PNG') || src.includes('.webp')));
                                                if (isCustomEmote || !src) {
                                                    return (
                                                        <img
                                                            loading="lazy"
                                                            src={src}
                                                            alt={alt || 'emoji'}
                                                            {...props}
                                                            className="inline-block w-[1.25em] h-[1.25em] m-0 align-[-0.2em] object-contain select-none"
                                                        />
                                                    );
                                                }
                                                return (
                                                    <img
                                                        loading="lazy"
                                                        src={src}
                                                        alt={alt}
                                                        {...props}
                                                        className="max-w-full max-h-[360px] w-auto h-auto rounded-xl my-1.5 border border-white/10 shadow-lg object-contain block"
                                                    />
                                                );
                                            },
                                            a: ({ ...props }) => (
                                                <a
                                                    {...props}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sky-400 hover:underline"
                                                />
                                            )
                                        }}
                                    >
                                        {comment.content
                                            ? comment.content.replace(
                                                  /:([a-zA-Z0-9_\-\s]+?):/g,
                                                  (match, name) => {
                                                      const url = getCustomEmojiUrl(name);
                                                      return url ? `![${name.trim()}](${url})` : match;
                                                  }
                                              )
                                            : ''}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer Actions: Reply button & Reactions */}
                    {!comment.isDeleted && (
                        <div className="flex items-center gap-3 mt-1.5">
                            {user && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserToggled(true);
                                        onReply(comment);
                                    }}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                >
                                    Respondre
                                </button>
                            )}

                            <CommentReactions
                                commentId={comment.id}
                                reactions={comment.reactions}
                                currentUserId={user?.id}
                                onReact={onReact}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Depth-1 Flat Thread: All replies render directly under the root item */}
            {hasReplies && (
                <div className="ml-8 sm:ml-9 mt-1">
                    {!areRepliesVisible ? (
                        <button
                            type="button"
                            onClick={() => setUserToggled(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-400 transition-colors cursor-pointer py-1"
                        >
                            <span>
                                Veure {comment.replies!.length}{' '}
                                {comment.replies!.length === 1 ? 'resposta' : 'respostes'}
                            </span>
                            <ChevronDown size={13} />
                        </button>
                    ) : (
                        <div className="flex flex-col space-y-1 mt-1">
                            {comment.replies!.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    onReact={onReact}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                    isReply={true}
                                    onNavigateToProfile={onNavigateToProfile}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={() => setUserToggled(false)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors cursor-pointer py-1 text-left"
                            >
                                Amagar respostes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const CommentItem = memo(CommentItemComponent);
export default CommentItem;
