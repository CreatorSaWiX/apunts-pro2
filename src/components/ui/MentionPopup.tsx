import React from 'react';
import type { UserMention } from '../../hooks/useMentions';

interface MentionPopupProps {
    users: UserMention[];
    onSelect: (username: string) => void;
    position?: 'top' | 'bottom';
}

const MentionPopup = ({ users, onSelect, position = 'top' }: MentionPopupProps) => {
    if (users.length === 0) return null;

    return (
        <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 z-50 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden`}>
            {users.map(user => (
                <button
                    key={user.id}
                    type="button"
                    onClick={() => onSelect(user.username)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-3 transition-colors border-b border-slate-800 last:border-0"
                >
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full bg-slate-800 object-cover" />
                    <span className="text-sm font-medium text-slate-200">@{user.username}</span>
                </button>
            ))}
        </div>
    );
};

export default MentionPopup;
