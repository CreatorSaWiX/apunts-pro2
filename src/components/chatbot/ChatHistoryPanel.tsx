import React, { useState, useMemo } from 'react';
import { m as motion } from 'framer-motion';
import { X, Check, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChatMeta } from './constants';

interface ChatHistoryPanelProps {
  chatList: ChatMeta[];
  currentChatId: string;
  setShowHistory: (show: boolean) => void;
  switchChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  startNewChat: () => void;
}

export const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  chatList,
  currentChatId,
  setShowHistory,
  switchChat,
  renameChat,
  deleteChat,
  startNewChat,
}) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) return chatList;
    const lower = searchTerm.toLowerCase();
    return chatList.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        (c.searchableText && c.searchableText.includes(lower))
    );
  }, [chatList, searchTerm]);

  const handleSaveRename = (id: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed) {
      renameChat(id, trimmed);
    }
    setEditingId(null);
  };

  const handleConfirmDelete = (id: string) => {
    deleteChat(id);
    setConfirmDeleteId(null);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const lang = i18n.language?.startsWith('es')
      ? 'es'
      : i18n.language?.startsWith('en')
      ? 'en'
      : 'ca';
    return new Date(timestamp).toLocaleDateString(lang, { day: '2-digit', month: 'short' });
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-[20] flex flex-col bg-[#020617]/90 backdrop-blur-2xl"
    >
      <div className="shrink-0 h-16 px-5 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">
          {t('chat.history', 'Historial de converses')}
        </span>
        <button
          type="button"
          onClick={() => setShowHistory(false)}
          aria-label={t('common.close', 'Tancar')}
          className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 py-2 border-b border-white/5 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('chat.searchHistory', 'Cercar...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-1">
        {filteredChats.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-10">
            {searchTerm
              ? t('chat.noSearchResults', 'Cap resultat trobat')
              : t('chat.noSavedChats', 'Sense converses desades')}
          </p>
        )}
        {filteredChats.map((chat) => {
          const isCurrent = chat.id === currentChatId;
          const isEditing = editingId === chat.id;
          const isDeleting = confirmDeleteId === chat.id;

          return (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onClick={() => {
                if (!isEditing && !isDeleting) {
                  switchChat(chat.id);
                }
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  className="flex-1 bg-transparent text-slate-200 text-sm focus:outline-none border-b border-slate-500"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSaveRename(chat.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 text-sm text-slate-300 truncate">{chat.title}</span>
              )}

              <span className="text-xs text-slate-600 shrink-0">
                {formatDate(chat.updatedAt)}
              </span>

              {/* Botons d'acció */}
              <div
                className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded-lg border border-red-500/30">
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(chat.id)}
                      title={t('chat.confirmDelete', 'Confirmar eliminació')}
                      aria-label={t('chat.confirmDelete', 'Confirmar eliminació')}
                      className="p-1 text-red-400 hover:text-red-300 rounded transition-colors"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      title={t('common.cancel', 'Cancel·lar')}
                      aria-label={t('common.cancel', 'Cancel·lar')}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : isEditing ? (
                  <button
                    type="button"
                    onClick={() => handleSaveRename(chat.id)}
                    aria-label={t('chat.saveTitle', 'Guardar títol')}
                    className="p-1 text-green-400 hover:text-green-300 rounded transition-colors"
                  >
                    <Check size={14} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(null);
                        setEditingId(chat.id);
                        setEditingTitle(chat.title);
                      }}
                      aria-label={t('chat.editTitle', 'Editar títol')}
                      className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setConfirmDeleteId(chat.id);
                      }}
                      aria-label={t('chat.deleteChat', 'Eliminar conversa')}
                      className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 p-4 border-t border-white/5">
        <button
          type="button"
          onClick={startNewChat}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> {t('chat.newConversation', 'Nova conversa')}
        </button>
      </div>
    </motion.div>
  );
}