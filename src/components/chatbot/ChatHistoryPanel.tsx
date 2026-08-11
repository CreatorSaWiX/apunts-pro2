import React from 'react';
import { m as motion } from 'framer-motion';
import { X, Check, Pencil, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChatMeta } from './constants';

interface ChatHistoryPanelProps {
  chatList: ChatMeta[];
  currentChatId: string;
  editingId: string | null;
  editingTitle: string;
  setEditingId: (id: string | null) => void;
  setEditingTitle: (title: string) => void;
  setShowHistory: (show: boolean) => void;
  switchChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  startNewChat: () => void;
}

export const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  chatList,
  currentChatId,
  editingId,
  editingTitle,
  setEditingId,
  setEditingTitle,
  setShowHistory,
  switchChat,
  renameChat,
  deleteChat,
  startNewChat
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-[20] flex flex-col bg-[#020617]/90 backdrop-blur-2xl"
    >
      <div className="shrink-0 h-16 px-5 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{t('chat.history', 'Historial de converses')}</span>
        <button type="button" onClick={() => setShowHistory(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-1">
        {chatList.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-10">{t('chat.noSavedChats', 'Sense converses desades')}</p>
        )}
        {chatList.map(chat => (
          <div
            key={chat.id}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${chat.id === currentChatId ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => switchChat(chat.id)}
          >
            {editingId === chat.id ? (
              <input
                autoFocus
                className="flex-1 bg-transparent text-slate-200 text-sm focus:outline-none border-b border-slate-500"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') renameChat(chat.id, editingTitle); if (e.key === 'Escape') setEditingId(null); }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-sm text-slate-300 truncate">{chat.title}</span>
            )}
            <span className="text-xs text-slate-600 shrink-0">
              {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString('ca', { day: '2-digit', month: 'short' }) : ''}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
              {editingId === chat.id ? (
                <button type="button" onClick={() => renameChat(chat.id, editingTitle)} className="p-1 text-green-400 hover:text-green-300 rounded transition-colors"><Check size={14} /></button>
              ) : (
                <button type="button" onClick={() => { setEditingId(chat.id); setEditingTitle(chat.title); }} className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"><Pencil size={14} /></button>
              )}
              <button type="button" onClick={() => deleteChat(chat.id)} className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 p-4 border-t border-white/5">
        <button type="button"
          onClick={startNewChat}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> {t('chat.newConversation', 'Nova conversa')}
        </button>
      </div>
    </motion.div>
  );
};
