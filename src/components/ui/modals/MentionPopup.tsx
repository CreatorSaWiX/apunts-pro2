
import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { UserMention } from '../../../hooks/useMentions';

interface MentionPopupProps {
    users: UserMention[];
    onSelect: (username: string) => void;
    anchorRef?: React.RefObject<HTMLElement | null>;
    selectedIndex?: number;
    onClose?: () => void;
    position?: 'top' | 'bottom';
}

const MentionPopup = ({
    users,
    onSelect,
    anchorRef,
    selectedIndex = 0,
    onClose,
    position: _position = 'top'
}: MentionPopupProps) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    useLayoutEffect(() => {
        if (!anchorRef?.current) return;

        const updatePosition = () => {
            if (!anchorRef.current) return;
            const rect = anchorRef.current.getBoundingClientRect();
            const popupWidth = 270;
            const popupHeight = Math.min(users.length * 44 + 44, 230);

            let left = rect.left;
            if (left + popupWidth > window.innerWidth - 12) {
                left = window.innerWidth - popupWidth - 12;
            }
            if (left < 12) left = 12;

            // Prefer placing above the anchor
            let top = rect.top - popupHeight - 8;
            if (top < 10) {
                // If not enough room above, place below
                top = rect.bottom + 8;
            }

            setCoords({ top, left });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [anchorRef, users.length]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                !anchorRef?.current?.contains(e.target as Node)
            ) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [anchorRef, onClose]);

    // Auto-scroll the selected item into view
    useEffect(() => {
        if (!popupRef.current) return;
        const selectedEl = popupRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    if (users.length === 0) return null;

    // If anchorRef is not supplied or coords not ready, fallback to inline styling
    if (!anchorRef || !coords) {
        return (
            <div className="absolute bottom-full mb-2 left-0 z-50 w-68 max-h-56 overflow-y-auto custom-scrollbar bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-0.5">
                {users.map((user, idx) => (
                    <button
                        key={user.id}
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(user.username);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                            idx === selectedIndex
                                ? 'bg-sky-500/20 text-white border border-sky-500/30'
                                : 'hover:bg-white/10 text-slate-300 hover:text-white border border-transparent'
                        }`}
                    >
                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-full bg-slate-800 object-cover ring-1 ring-white/10 shrink-0" />
                        <span className="text-xs font-semibold text-white truncate flex items-center gap-0.5">
                            <span className="text-sky-400">@</span>{user.username}
                        </span>
                    </button>
                ))}
            </div>
        );
    }

    return createPortal(
        <div
            ref={popupRef}
            style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                zIndex: 99999
            }}
            className="w-68 max-h-56 overflow-y-auto custom-scrollbar bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-0.5"
        >
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1 flex items-center justify-between">
                <span className="text-sky-400">Mencions</span>
                <span className="text-[9px] text-slate-500 font-normal">↑↓ per triar, Enter</span>
            </div>
            {users.map((user, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                    <button
                        key={user.id}
                        type="button"
                        data-index={idx}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(user.username);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isSelected
                                ? 'bg-sky-500/20 text-white border border-sky-500/30 shadow-sm'
                                : 'hover:bg-white/10 text-slate-300 hover:text-white border border-transparent'
                        }`}
                    >
                        <img
                            src={user.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full bg-slate-800 object-cover ring-1 ring-white/10 shrink-0"
                            loading="lazy"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate flex items-center gap-0.5">
                                <span className="text-sky-400">@</span>
                                {user.username}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>,
        document.body
    );
};

export default MentionPopup;
