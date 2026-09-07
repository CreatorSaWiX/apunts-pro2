import React, { useState, useEffect, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Bot, X, UploadCloud, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LoginGate } from './LoginGate';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import { MessagesOnly, ActiveStreamingMessage } from './MessageList';
import { SendButton } from './SendButton';
import { MicButton } from './MicButton';
import { ThinkingLevelSelector, type ThinkingLevel } from './ThinkingLevelSelector';

import { useChatFirestore } from './hooks/useChatFirestore';
import { useChatStream, COOLDOWN_MS } from './hooks/useChatStream';
import { useChatLayout } from './hooks/useChatLayout';

export const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const { aiSettings, setAiSettings } = useSettingsStore();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const aiName = aiSettings?.identity?.name;

  const renderAIAvatar = useCallback(
    (iconSize: number, iconClass: string) => {
      const url = aiSettings?.identity?.avatarUrl;
      if (!url) return <Bot size={iconSize} className={iconClass} />;
      if (url.startsWith('http')) {
        return <img src={url} alt="AI" className="w-full h-full object-cover rounded-[inherit]" />;
      }
      return (
        <span className="flex items-center justify-center w-full h-full text-[1.2em] leading-none select-none">
          {url}
        </span>
      );
    },
    [aiSettings?.identity?.avatarUrl]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [input, setInput] = useState('');

  const [thinkingLevel, setThinkingLevel] = useState<ThinkingLevel>(() => {
    return (localStorage.getItem('chat_thinking_level') as ThinkingLevel) || 'auto';
  });

  useEffect(() => {
    localStorage.setItem('chat_thinking_level', thinkingLevel);
  }, [thinkingLevel]);

  // ── Hook 3: Firestore sincronització i persistència ───────────────────────
  const {
    messages,
    setMessages,
    currentChatId,
    currentChatTitle,
    setCurrentChatTitle,
    chatList,
    setChatList,
    fetchChatList,
    saveChat,
    startNewChat,
    switchChat,
    deleteChat,
    renameChat,
    isInitialLoad,
  } = useChatFirestore({
    user,
    isOpen,
    t,
    onCloseHistory: () => setShowHistory(false),
  });

  // ── Hook 2: Backend crida i streaming SSE ─────────────────────────────────
  const {
    streamPhase,
    thoughtText,
    streamingText,
    sendMessage,
    lastSentAt,
  } = useChatStream();

  // ── Hook 1: Estat del layout, redimensionament, drag&drop i scroll ────────
  const {
    sidebarWidth,
    isResizing,
    setIsResizing,
    isDragging,
    attachedFile,
    setAttachedFile,
    processFile,
    messagesContainerRef,
    messagesEndRef,
    textareaRef,
    fileInputRef,
    scrollToBottom,
  } = useChatLayout({ isOpen, t });

  // Auto-scroll en actualitzacions de missatges
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      scrollToBottom(true);
    } else {
      scrollToBottom(false);
    }
  }, [messages, streamPhase, scrollToBottom]);

  // Auto-resize de l'àrea d'escriptura
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  }, [input]);

  // Enviament del missatge
  const handleSend = useCallback(async () => {
    if ((!input.trim() && !attachedFile) || streamPhase !== 'idle') return;

    const userMsg = input.trim() || `[Fitxer: ${attachedFile?.name}]`;
    const fileToSend = attachedFile;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setAttachedFile(null);

    await sendMessage({
      userMsg,
      attachedFile: fileToSend,
      messages,
      currentChatId,
      currentChatTitle,
      aiSettings,
      thinkingLevel,
      language: i18n.language,
      currentPath: location.pathname,
      setMessages,
      setCurrentChatTitle,
      saveChat,
      setAiSettings,
      t,
    });
  }, [
    input,
    attachedFile,
    streamPhase,
    messages,
    currentChatId,
    currentChatTitle,
    aiSettings,
    thinkingLevel,
    i18n.language,
    location.pathname,
    sendMessage,
    setMessages,
    setCurrentChatTitle,
    saveChat,
    setAiSettings,
    setAttachedFile,
    textareaRef,
    t,
  ]);

  const isHomePage = location.pathname === '/';

  return (
    <>
      <AnimatePresence>
        {!isOpen && !isHomePage && location.pathname !== '/planner' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full bg-slate-800 text-slate-300 border border-white/10 shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <Bot size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            style={{ width: `${sidebarWidth}px` }}
            transition={{
              type: isResizing ? 'tween' : 'spring',
              damping: 30,
              stiffness: 300,
              duration: isResizing ? 0 : undefined,
            }}
            className="fixed top-0 right-0 h-screen border-l border-white/5 shadow-2xl flex flex-col z-[2000] overflow-hidden max-w-full isolate"
          >
            {/* Fons blur */}
            <div className="absolute inset-0 z-[-1] bg-[#020617] overflow-hidden">
              <img
                src="data:image/webp;base64,UklGRlgBAABXRUJQVlA4IEwBAADQDQCdASrwAIcAPpFIoU0lpCMiIEgAsBIJaW7hAuE9nqvHMvZz5AKzeirh8/MXUVsn8uejLKAJOaFT0RDVQG2aHVUmu7TV/MW8j8bTN74Mxrlelr+L7wcXw5pDOQHcVRQLnomMfEmpbhaOIvvm+LKDGc8jcs9ZAAD+5RuPgy22KjEYaHVb/T4KpzaboZ837cgmaZuQ3AfJ/358UVn7Kor7PdSWeglnfN6PBnqZbM4phUlVCpp93nLmZD/W3pTt8oXiW3HHPu1UMHJM9cj/ahOwtz1QIbtlKAufGoEur39+8R85ZqgI/6VvmNXkb1zmSE1M2DWUQYWmdTAm5afHnOI3mPL7nWXOxmnQumrDC/WfEhJc8dfb82tQdGbrrxzlRWxMy3QqBSKY5TKH+OKRxeHz/vuIC97FEPVmQ2+C6CrkgsNcEKf5Cafa2gAAAA=="
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-[50px] scale-[1.4] select-none pointer-events-none transform-gpu translate-z-0"
              />
              <div className="absolute inset-0 bg-[#020617]/30 backdrop-blur-xl" />
            </div>

            {/* Login gate */}
            {!user && (
              <LoginGate aiName={aiName} setIsOpen={setIsOpen} renderAIAvatar={renderAIAvatar} />
            )}

            {/* Drag overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm border-2 border-dashed border-slate-500 m-4 rounded-3xl flex flex-col items-center justify-center"
                >
                  <UploadCloud size={48} className="text-slate-400 mb-4" />
                  <p className="text-xl font-medium text-slate-300">
                    {t('chat.dropToAttach', 'Deixa anar per adjuntar')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Panell d'Historial */}
            <AnimatePresence>
              {showHistory && (
                <ChatHistoryPanel
                  chatList={chatList}
                  currentChatId={currentChatId}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  setEditingId={setEditingId}
                  setEditingTitle={setEditingTitle}
                  setShowHistory={setShowHistory}
                  switchChat={switchChat}
                  renameChat={renameChat}
                  deleteChat={deleteChat}
                  startNewChat={startNewChat}
                />
              )}
            </AnimatePresence>

            {/* Resizer bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2 hover:bg-slate-500/20 cursor-col-resize z-50 transition-colors"
              onMouseDown={() => {
                setIsResizing(true);
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
              }}
            />

            {/* Àrea de Missatges */}
            <div
              ref={messagesContainerRef}
              className="absolute inset-0 overflow-y-auto px-4 pt-20 pb-52 md:px-6 md:pb-56 space-y-8 custom-scrollbar z-0 flex flex-col"
            >
              <MessagesOnly messages={messages} user={user} renderAIAvatar={renderAIAvatar} />
              <ActiveStreamingMessage
                streamPhase={streamPhase}
                thoughtText={thoughtText}
                streamingText={streamingText}
                renderAIAvatar={renderAIAvatar}
              />
              <div ref={messagesEndRef} className="h-8 shrink-0" />
            </div>

            {/* Capçalera flotant */}
            <div className="absolute top-0 left-0 w-full h-16 px-4 border-b border-white/5 flex justify-between items-center bg-[#020617]/50 backdrop-blur-xl z-10">
              <div className="text-sm font-medium text-slate-300 truncate max-w-[55%] ml-2">
                {currentChatTitle}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startNewChat()}
                  className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors"
                  title="Nova conversa"
                >
                  <Plus size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fetchChatList().then(setChatList).catch(console.error);
                    setShowHistory(true);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors"
                  title="Historial"
                >
                  <Clock size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Input inferior flotant */}
            <div className="absolute bottom-0 left-0 w-full p-4 pt-8 bg-gradient-to-t from-[#020617]/90 via-[#020617]/50 to-transparent z-10 pointer-events-none">
              <div className="pointer-events-auto relative flex flex-col gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 transition duration-300 focus-within:bg-white/10 focus-within:border-white/20 shadow-lg ring-1 ring-black/20">
                <AnimatePresence>
                  {attachedFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-2 pt-2"
                    >
                      <div className="relative inline-block border border-white/10 rounded-xl bg-slate-900/50 p-1 mt-2 ml-2">
                        {attachedFile.mimeType.startsWith('image/') ? (
                          <img
                            src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`}
                            alt="preview"
                            className="h-16 object-contain rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg">
                            <span className="text-xs font-bold text-slate-300">PDF</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg z-20"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex flex-col gap-1 w-full">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return;
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={t('chat.placeholder', 'Escriu a {{aiName}}...', { aiName })}
                    className="w-full bg-transparent px-2 py-1.5 text-[15px] text-slate-200 placeholder-slate-400 focus:outline-none resize-none min-h-[44px] max-h-[250px] custom-scrollbar"
                    rows={1}
                  />
                  <div className="flex items-center justify-between px-1 pb-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            processFile(e.target.files[0]);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors"
                        title={t('chat.attachFile', 'Adjuntar imatge o PDF')}
                      >
                        <Plus size={20} />
                      </button>
                      <ThinkingLevelSelector value={thinkingLevel} onChange={setThinkingLevel} />
                    </div>
                    <div className="flex items-center gap-1">
                      <MicButton
                        input={input}
                        onTranscript={setInput}
                        lang={
                          i18n.language?.startsWith('es')
                            ? 'es-ES'
                            : i18n.language?.startsWith('en')
                            ? 'en-US'
                            : 'ca-ES'
                        }
                        disabled={streamPhase !== 'idle'}
                      />
                      <SendButton
                        onClick={handleSend}
                        disabled={(!input.trim() && !attachedFile) || streamPhase !== 'idle'}
                        hasInput={!!(input.trim() || attachedFile)}
                        lastSentAt={lastSentAt}
                        cooldownMs={COOLDOWN_MS}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2.5 mb-0.5 pointer-events-auto">
                <p className="text-[10px] text-slate-500/60 font-medium tracking-wide">
                  {t('chat.warning', "L'IA pot cometre errors. No comparteixis dades sensibles ni personals.")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
