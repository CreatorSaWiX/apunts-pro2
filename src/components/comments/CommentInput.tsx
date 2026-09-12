import { useState, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { resolveMediaUrl } from '../../lib/mediaUtils';
import { CUSTOM_EMOJIS, getCustomEmojiUrl } from '../../lib/emojis';
import { useMentions } from '../../hooks/useMentions';
import MentionPopup from '../ui/modals/MentionPopup';
import GifPicker from '../ui/modals/GifPicker';
import Spinner from '../ui/Spinner';
import type { CommentEntity } from '../../types/comments';

interface CommentInputProps {
    onSubmit: (
        content: string,
        replyToObj?: CommentEntity | null,
        mentionedUsers?: Array<{ id: string; username: string }>
    ) => Promise<any>;
    replyingTo: CommentEntity | null;
    onCancelReply: () => void;
    placeholder?: string;
    allowGifs?: boolean;
}

// Canonical entries [name, url]
const CUSTOM_EMOTES = Object.entries(CUSTOM_EMOJIS);

/**
 * Serializes the contentEditable DOM tree back to Markdown/string format.
 * Converts `<img data-emoji="name">` to `:name:`, `<br>` to `\n`,
 * and handles text nodes cleanly.
 */
const serializeEditorContent = (root: HTMLElement | null): string => {
    if (!root) return '';
    let result = '';

    const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            result += node.nodeValue?.replace(/\u00A0/g, ' ') || '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (el.tagName === 'IMG') {
                const emoji = el.dataset.emoji || el.getAttribute('alt')?.replace(/^:|:$/g, '');
                if (emoji) {
                    result += `:${emoji}:`;
                }
            } else if (el.tagName === 'BR') {
                result += '\n';
            } else {
                for (const child of Array.from(el.childNodes)) {
                    walk(child);
                }
                if (el.tagName === 'DIV' || el.tagName === 'P') {
                    result += '\n';
                }
            }
        }
    };

    walk(root);
    return result.trim();
};

const CommentInputComponent = ({
    onSubmit,
    replyingTo,
    onCancelReply,
    placeholder = 'Escriu un comentari... (Markdown permès, @ per mencionar)',
    allowGifs = true
}: CommentInputProps) => {
    const { user } = useAuth();
    const editorRef = useRef<HTMLDivElement>(null);
    const lastRangeRef = useRef<Range | null>(null);

    const [hasContent, setHasContent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [showGifPicker, setShowGifPicker] = useState(false);

    const {
        mentionSearch,
        setMentionSearch,
        handleInputChange,
        getMentionedUsers,
        suggestedUsers
    } = useMentions();

    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
            lastRangeRef.current = sel.getRangeAt(0).cloneRange();
        }
    }, []);

    const handleInput = useCallback(() => {
        saveSelection();
        if (!editorRef.current) return;
        const serialized = serializeEditorContent(editorRef.current);
        setHasContent(serialized.length > 0);

        // Check for mentions at current caret position
        const sel = window.getSelection();
        if (sel && sel.focusNode && editorRef.current.contains(sel.focusNode)) {
            const textNode = sel.focusNode;
            const text = textNode.nodeValue || '';
            const offset = sel.focusOffset;
            handleInputChange(text, offset);
        } else {
            setMentionSearch(null);
        }
    }, [saveSelection, handleInputChange, setMentionSearch]);

    const handleSend = useCallback(async () => {
        if (!editorRef.current || !user || isSubmitting) return;
        const text = serializeEditorContent(editorRef.current);
        if (!text) return;

        setIsSubmitting(true);
        try {
            const mentioned = getMentionedUsers(text, user.id);
            await onSubmit(text, replyingTo, mentioned);
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
            setHasContent(false);
            setMentionSearch(null);
            if (replyingTo) {
                onCancelReply();
            }
        } catch (err) {
            console.error('[CommentInput] Submit failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [user, isSubmitting, replyingTo, onSubmit, getMentionedUsers, onCancelReply, setMentionSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow shift+enter for multiline comments
                return;
            }
            e.preventDefault();
            handleSend();
        }
    };

    // Inserts the visual emoji directly into the contentEditable field
    const handleEmojiSelect = (emojiName: string) => {
        const url = getCustomEmojiUrl(emojiName) || CUSTOM_EMOJIS[emojiName];
        if (!url || !editorRef.current) return;

        editorRef.current.focus();

        const sel = window.getSelection();
        let range = lastRangeRef.current;
        if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
            range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
        }

        // Create emoji image element
        const img = document.createElement('img');
        img.src = url;
        img.alt = `:${emojiName}:`;
        img.dataset.emoji = emojiName;
        img.className = 'inline-block w-[1.3em] h-[1.3em] align-[-0.2em] mx-0.5 object-contain select-none pointer-events-none';
        img.setAttribute('draggable', 'false');

        // Append non-breaking space after emoji for smooth continued typing
        const space = document.createTextNode('\u00A0');

        range.deleteContents();
        range.insertNode(space);
        range.insertNode(img);

        // Move caret after the space
        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.collapse(true);
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
            lastRangeRef.current = newRange;
        }

        setHasContent(true);
        setShowEmojiPicker(false);
    };

    const handleSelectMention = (username: string) => {
        if (!editorRef.current) return;
        editorRef.current.focus();

        const sel = window.getSelection();
        let range = lastRangeRef.current;
        if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
            range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
        }

        // Replace trigger with mention text
        const mentionText = document.createTextNode(`@${username} `);
        range.insertNode(mentionText);

        const newRange = document.createRange();
        newRange.setStartAfter(mentionText);
        newRange.collapse(true);
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
            lastRangeRef.current = newRange;
        }

        setMentionSearch(null);
        setHasContent(true);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        handleInput();
    };

    const handleGifSelect = (gifUrl: string) => {
        onSubmit(gifUrl, replyingTo, []);
        setShowGifPicker(false);
        if (replyingTo) onCancelReply();
    };

    if (!user) {
        return (
            <div className="text-center py-3 text-xs text-slate-500 uppercase tracking-widest font-bold">
                Inicia sessió per participar a la conversa
            </div>
        );
    }

    const avatarUrl =
        resolveMediaUrl(user.avatar) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'U')}&background=random`;

    return (
        <div className="relative">
            {/* Replying banner indicator */}
            <AnimatePresence>
                {replyingTo && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 4, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs"
                    >
                        <span className="flex items-center gap-1.5 truncate">
                            <span>Responent a</span>
                            <b className="font-semibold text-white">@{replyingTo.username}</b>
                        </span>
                        <button
                            type="button"
                            onClick={onCancelReply}
                            className="p-0.5 hover:text-white transition-colors cursor-pointer ml-2"
                            title="Cancel·lar resposta"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Input Pill Bar */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/10 rounded-full p-1.5 pl-2 transition gap-2">
                {/* User Avatar */}
                <img
                    src={avatarUrl}
                    alt={user.username || 'User'}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10 bg-slate-800 self-center"
                    loading="lazy"
                />

                {/* Rich Input Editor Area */}
                <div className="relative flex-1 min-w-0 flex items-center">
                    {mentionSearch && (
                        <MentionPopup
                            users={suggestedUsers}
                            onSelect={handleSelectMention}
                            position="top"
                        />
                    )}

                    {!hasContent && (
                        <div className="absolute left-2 text-sm text-slate-500 pointer-events-none select-none truncate max-w-[calc(100%-16px)]">
                            {placeholder}
                        </div>
                    )}

                    <div
                        ref={editorRef}
                        contentEditable={true}
                        role="textbox"
                        aria-multiline="true"
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onKeyUp={saveSelection}
                        onMouseUp={saveSelection}
                        onBlur={saveSelection}
                        onPaste={handlePaste}
                        className="w-full bg-transparent border-none px-2 py-1.5 text-sm text-slate-100 focus:outline-none min-h-[32px] max-h-[100px] overflow-y-auto custom-scrollbar leading-5 break-words whitespace-pre-wrap"
                    />
                </div>

                {/* Actions Toolbar */}
                <div className="relative shrink-0 flex items-center gap-0.5 mr-0.5 self-center">
                    {/* Emoji Trigger */}
                    <div>
                        <button
                            type="button"
                            onClick={(e) => {
                                saveSelection();
                                if (!showEmojiPicker) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const pickerWidth = 288;
                                    const pickerHeight = 220;

                                    let top = rect.top - pickerHeight - 8;
                                    let left = rect.right - pickerWidth;

                                    if (top < 10) {
                                        top = rect.bottom + 8;
                                    }
                                    if (left < 10) left = 10;
                                    if (left + pickerWidth > window.innerWidth) {
                                        left = window.innerWidth - pickerWidth - 10;
                                    }

                                    setPickerPosition({ top, left });
                                    setShowEmojiPicker(true);
                                } else {
                                    setShowEmojiPicker(false);
                                }
                            }}
                            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                showEmojiPicker
                                    ? 'text-sky-400'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                            title="Seleccionar emoji"
                            aria-label="Seleccionar emoji"
                        >
                            <Smile size={19} />
                        </button>

                        {/* Emoji Popover rendered via Portal to prevent overflow-hidden clipping */}
                        {showEmojiPicker &&
                            createPortal(
                                <div className="fixed inset-0 z-[99990]">
                                    <div
                                        className="fixed inset-0 bg-transparent"
                                        onClick={() => setShowEmojiPicker(false)}
                                    />
                                    <div
                                        style={{ top: `${pickerPosition.top}px`, left: `${pickerPosition.left}px` }}
                                        className="fixed z-[100000] p-2.5 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl grid grid-cols-6 gap-1.5 w-72 max-h-52 overflow-y-auto custom-scrollbar"
                                    >
                                        {CUSTOM_EMOTES.map(([emojiName, emojiUrl]) => (
                                            <button
                                                key={emojiName}
                                                type="button"
                                                onClick={() => handleEmojiSelect(emojiName)}
                                                className="p-1.5 rounded-xl hover:bg-white/10 transition-transform hover:scale-115 flex items-center justify-center cursor-pointer"
                                                title={emojiName}
                                            >
                                                <img
                                                    src={emojiUrl}
                                                    alt={emojiName}
                                                    loading="lazy"
                                                    className="w-6 h-6 object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>,
                                document.body
                            )}
                    </div>

                    {/* GIF Trigger */}
                    {allowGifs && (
                        <button
                            type="button"
                            onClick={() => setShowGifPicker(true)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                            title="Inserir GIF"
                            aria-label="Inserir GIF"
                        >
                            <ImageIcon size={19} />
                        </button>
                    )}

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!hasContent || isSubmitting}
                        className={`p-1.5 rounded-full transition flex items-center justify-center cursor-pointer ${
                            hasContent && !isSubmitting
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 hover:bg-sky-400'
                                : 'bg-transparent text-slate-600 cursor-not-allowed'
                        }`}
                        title="Enviar comentari"
                        aria-label="Enviar comentari"
                    >
                        {isSubmitting ? <Spinner size="sm" variant="white" /> : <Send size={15} className="ml-0.5" />}
                    </button>
                </div>
            </div>

            {/* GIF Picker Modal */}
            {showGifPicker && (
                <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
            )}
        </div>
    );
};

export const CommentInput = memo(CommentInputComponent);
export default CommentInput;
