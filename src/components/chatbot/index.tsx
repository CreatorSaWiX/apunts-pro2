import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Bot, X, UploadCloud, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StreamPhase } from '../AIStreamingIndicator';

import { LoginGate } from './LoginGate';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import { MessageList } from './MessageList';
import { SendButton } from './SendButton';
import type { Message, ChatMeta } from './constants';

const newId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const { aiSettings, setAiSettings } = useSettingsStore();
  const { t, i18n } = useTranslation();
  const aiName = aiSettings?.identity?.name;
  
  const renderAIAvatar = useCallback((iconSize: number, iconClass: string) => {
    const url = aiSettings?.identity?.avatarUrl;
    if (!url) return <Bot size={iconSize} className={iconClass} />;
    if (url.startsWith('http')) return <img src={url} alt="AI" className="w-full h-full object-cover rounded-[inherit]" />;
    return <span className="flex items-center justify-center w-full h-full text-[1.2em] leading-none select-none">{url}</span>;
  }, [aiSettings?.identity?.avatarUrl]);

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(550);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState('');
  const [currentChatTitle, setCurrentChatTitle] = useState(() => t('chat.newChat', 'Nou Xat'));
  const [chatList, setChatList] = useState<ChatMeta[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [input, setInput] = useState('');
  const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
  const [thoughtText, setThoughtText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [lastSentTime, setLastSentTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSentAt = useRef<number>(0);
  const COOLDOWN_MS = 15_000;

  // ── Firebase helpers ──────────────────────────────────────────────────────
  const fetchChatList = useCallback(async (): Promise<ChatMeta[]> => {
    if (!user) return [];
    const [{ db }, { collection, getDocs, orderBy, query }] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore')
    ]);
    const q = query(collection(db, 'users', user.id, 'chats'), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, title: d.data().title || t('chat.conversation', 'Conversa'), updatedAt: d.data().updatedAt || 0 }));
  }, [user, t]);

  const saveChat = useCallback(async (id: string, history: Message[], title: string) => {
    if (!user || !id) return;
    const [{ db }, { doc, setDoc }] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore')
    ]);
    await setDoc(doc(db, 'users', user.id, 'chats', id), { history, title, updatedAt: Date.now() });
  }, [user]);

  const loadChat = useCallback(async (id: string) => {
    if (!user) return;
    const [{ db }, { doc, getDoc }] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore')
    ]);
    const snap = await getDoc(doc(db, 'users', user.id, 'chats', id));
    if (snap.exists()) {
      setMessages(snap.data().history || []);
      setCurrentChatTitle(snap.data().title || t('chat.conversation', 'Conversa'));
    }
  }, [user, t]);

  // ── Init on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !user) return;
    isInitialLoad.current = true;
    fetchChatList().then(list => {
      if (list.length === 0) {
        const id = newId();
        setCurrentChatId(id);
        setMessages([]);
        setCurrentChatTitle(t('chat.newChat', 'Nou Xat'));
        setChatList([]);
      } else {
        setChatList(list);
        setCurrentChatId(list[0].id);
        loadChat(list[0].id);
      }
    });
  }, [isOpen, user, fetchChatList, t, loadChat]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const startNewChat = useCallback(async () => {
    if (messages.length > 0 && currentChatId) await saveChat(currentChatId, messages, currentChatTitle);
    const id = newId();
    setCurrentChatId(id);
    setMessages([]);
    setCurrentChatTitle(t('chat.newChat', 'Nou Xat'));
    setInput('');
    setShowHistory(false);
  }, [messages, currentChatId, currentChatTitle, saveChat, t]);

  const switchChat = useCallback(async (id: string) => {
    if (messages.length > 0 && currentChatId) await saveChat(currentChatId, messages, currentChatTitle);
    setCurrentChatId(id);
    await loadChat(id);
    setShowHistory(false);
  }, [messages, currentChatId, currentChatTitle, saveChat, loadChat]);

  const deleteChat = useCallback(async (id: string) => {
    if (!user) return;
    const [{ db }, { doc, deleteDoc }] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore')
    ]);
    await deleteDoc(doc(db, 'users', user.id, 'chats', id));
    const newList = chatList.filter(c => c.id !== id);
    setChatList(newList);
    if (id === currentChatId) {
      if (newList.length > 0) switchChat(newList[0].id);
      else startNewChat();
    }
  }, [user, chatList, currentChatId, switchChat, startNewChat]);

  const renameChat = useCallback(async (id: string, title: string) => {
    if (!user || !title.trim()) return;
    const [{ db }, { doc, updateDoc }] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore')
    ]);
    
    await updateDoc(doc(db, 'users', user.id, 'chats', id), { title: title.trim() });
    setChatList(prev => prev.map(c => c.id === id ? { ...c, title: title.trim() } : c));
    
    if (id === currentChatId) setCurrentChatTitle(title.trim());
    
    setEditingId(null);
  }, [user, currentChatId]);

  // ── Layout / resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.getElementById('root') || document.body;

    if (isOpen && window.innerWidth > 768) {
      root.style.width = `calc(100vw - ${sidebarWidth}px)`;
      document.documentElement.style.setProperty('--chatbot-width', `${sidebarWidth}px`);
    }

    return () => { root.style.width = '100%'; document.documentElement.style.setProperty('--chatbot-width', '0px'); };
  }, [isOpen, sidebarWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const w = window.innerWidth - e.clientX;
      if (w > 350 && w < window.innerWidth * 0.9) setSidebarWidth(w);
    };

    const onUp = () => { setIsResizing(false); document.body.style.cursor = 'default'; document.body.style.userSelect = 'auto'; };
    if (isResizing) { window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); }
    
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isResizing]);

  // ── File handling ─────────────────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { alert(t('chat.errors.invalidFileType', "Només s'accepten imatges i PDFs.")); return; }
    if (file.size > 5 * 1024 * 1024) { alert(t('chat.errors.fileTooLarge', "L'arxiu és massa gran. Màxim 5MB.")); return; }
    let aborted = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (aborted) return;
      const b64 = (e.target?.result as string).split(',')[1];
      setAttachedFile({ data: b64, mimeType: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
    // Return cleanup for consumers that need abort support
    return () => { aborted = true; reader.abort(); };
  }, [t]);

  useEffect(() => {
    if (!isOpen) return;
    const onOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onLeave = (e: DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e: DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer?.files?.length) processFile(e.dataTransfer.files[0]); };
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => { window.removeEventListener('dragover', onOver); window.removeEventListener('dragleave', onLeave); window.removeEventListener('drop', onDrop); };
  }, [isOpen, processFile]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  }, [input]);

  const scrollToBottom = useCallback((instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: instant ? 'instant' : 'smooth' });
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      scrollToBottom(true);
    } else {
      scrollToBottom(false);
    }
  }, [messages, streamPhase, streamingText, scrollToBottom]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const elapsed = Date.now() - lastSentAt.current;
    if (elapsed < COOLDOWN_MS) return;
    if ((!input.trim() && !attachedFile) || streamPhase !== 'idle') return;

    lastSentAt.current = Date.now();
    setLastSentTime(Date.now());
    const userMsg = input.trim() || `[Fitxer: ${attachedFile?.name}]`;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const fileToSend = attachedFile;
    setAttachedFile(null);
    const isFirst = messages.length === 0;
    const autoTitle = isFirst ? userMsg.slice(0, 45) : currentChatTitle;
    if (isFirst) setCurrentChatTitle(autoTitle);
    const newMessages = [...messages, {
      role: 'user' as const,
      content: userMsg,
      ...(fileToSend ? { attachmentName: fileToSend.name, attachmentType: (fileToSend.mimeType === 'application/pdf' ? 'pdf' : 'image') as 'image' | 'pdf' } : {})
    }];
    setMessages(newMessages);
    setStreamPhase('connecting');
    setThoughtText('');
    setStreamingText('');

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let pageText = '';
      try { pageText = (document.querySelector('main') || document.body).innerText.slice(0, 4000); } catch (_) {
          console.debug('Failed to read page text');
      }

      const { auth } = await import('../../lib/firebase');
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10),
          currentPath: window.location.pathname,
          pageText,
          image: fileToSend ? { data: fileToSend.data, mimeType: fileToSend.mimeType } : undefined,
          aiSettings,
          language: i18n.language
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: t('chat.errors.unknown', 'Error desconegut') }));
        throw new Error(errorData.error || 'Error');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error(t('chat.errors.streamingNotSupported', 'El navegador no suporta streaming'));

      const decoder = new TextDecoder();
      let sseBuffer = '';
      let fullReplyText = '';
      let metadata: { keywords?: string[]; memories_to_add?: string[] } = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const events = sseBuffer.split('\n\n');
        sseBuffer = events.pop() || '';

        for (const eventBlock of events) {
          if (!eventBlock.trim()) continue;

          let eventType = 'message';
          let eventData = '';

          for (const line of eventBlock.split('\n')) {
            if (line.startsWith('event: ')) {
              eventType = line.substring(7).trim();
            } else if (line.startsWith('data: ')) {
              eventData = line.substring(6);
            }
          }

          if (!eventData) continue;

          try {
            const parsed = JSON.parse(eventData);

            switch (eventType) {
              case 'status':
                if (parsed.phase === 'thinking') setStreamPhase('thinking');
                else if (parsed.phase === 'writing') setStreamPhase('writing');
                break;
              case 'thought':
                setStreamPhase('thinking');
                setThoughtText(prev => prev + parsed.text);
                break;
              case 'delta':
                if (fullReplyText === '') setStreamPhase('writing');
                fullReplyText += parsed.text;
                setStreamingText(fullReplyText);
                break;
              case 'metadata':
                metadata = parsed;
                break;
              case 'error':
                throw new Error(parsed.message || t('chat.errors.serverError', 'Error del servidor'));
            }
          } catch (parseErr: unknown) {
            if (eventType === 'error') throw parseErr;
          }
        }
      }

      const finalText = fullReplyText || streamingText || t('chat.noResponse', 'Sense resposta.');
      const final = [...newMessages, { role: 'model' as const, content: finalText, addedMemories: metadata.memories_to_add }];
      setMessages(final);
      setStreamingText('');
      setStreamPhase('done');

      await saveChat(currentChatId, final, autoTitle);
      fetchChatList().then(setChatList).catch(console.error);

      if (metadata.memories_to_add && metadata.memories_to_add.length > 0) {
        setAiSettings({
          ...aiSettings,
          userContext: {
            ...aiSettings.userContext,
            userPreferredName: aiSettings.userContext?.userPreferredName || '',
            memories: [...(aiSettings.userContext?.memories || []), ...metadata.memories_to_add]
          }
        });
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj?.name === 'AbortError') return;
      setMessages(prev => [...prev, { role: 'model', content: `**Error:** ${errorObj?.message || 'Error desconegut'}` }]);
    } finally {
      setStreamPhase('idle');
      setThoughtText('');
      setStreamingText('');
    }
  };

  const isHomePage = location.pathname === '/';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <AnimatePresence>
        {!isOpen && !isHomePage && location.pathname !== '/planner' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
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
            initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            style={{ width: `${sidebarWidth}px` }}
            transition={{ type: isResizing ? 'tween' : 'spring', damping: 30, stiffness: 300, duration: isResizing ? 0 : undefined }}
            className="fixed top-0 right-0 h-screen border-l border-white/5 shadow-2xl flex flex-col z-[2000] overflow-hidden max-w-full isolate"
          >
            {/* Background */}
            <div className="absolute inset-0 z-[-1] bg-[#020617] overflow-hidden">
              <img 
                src="data:image/webp;base64,UklGRlgBAABXRUJQVlA4IEwBAADQDQCdASrwAIcAPpFIoU0lpCMiIEgAsBIJaW7hAuE9nqvHMvZz5AKzeirh8/MXUVsn8uejLKAJOaFT0RDVQG2aHVUmu7TV/MW8j8bTN74Mxrlelr+L7wcXw5pDOQHcVRQLnomMfEmpbhaOIvvm+LKDGc8jcs9ZAAD+5RuPgy22KjEYaHVb/T4KpzaboZ837cgmaZuQ3AfJ/358UVn7Kor7PdSWeglnfN6PBnqZbM4phUlVCpp93nLmZD/W3pTt8oXiW3HHPu1UMHJM9cj/ahOwtz1QIbtlKAufGoEur39+8R85ZqgI/6VvmNXkb1zmSE1M2DWUQYWmdTAm5afHnOI3mPL7nWXOxmnQumrDC/WfEhJc8dfb82tQdGbrrxzlRWxMy3QqBSKY5TKH+OKRxeHz/vuIC97FEPVmQ2+C6CrkgsNcEKf5Cafa2gAAAA==" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-[50px] scale-[1.4] select-none pointer-events-none" 
              />
              <div className="absolute inset-0 bg-[#020617]/30 backdrop-blur-xl" />
            </div>

            {/* Login gate — shown when user is not authenticated */}
            {!user && (
              <LoginGate 
                 aiName={aiName} 
                 setIsOpen={setIsOpen} 
                 renderAIAvatar={renderAIAvatar} 
              />
            )}

            {/* Drag overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm border-2 border-dashed border-slate-500 m-4 rounded-3xl flex flex-col items-center justify-center">
                  <UploadCloud size={48} className="text-slate-400 mb-4" />
                  <p className="text-xl font-medium text-slate-300">{t('chat.dropToAttach', 'Deixa anar per adjuntar')}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Panel */}
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

            {/* Resizer */}
            <div className="absolute left-0 top-0 bottom-0 w-2 hover:bg-slate-500/20 cursor-col-resize z-50 transition-colors"
              onMouseDown={() => { setIsResizing(true); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; }} />

            {/* Messages */}
            <MessageList 
              messages={messages}
              user={user}
              streamPhase={streamPhase}
              thoughtText={thoughtText}
              streamingText={streamingText}
              renderAIAvatar={renderAIAvatar}
              messagesEndRef={messagesEndRef}
              messagesContainerRef={messagesContainerRef}
            />

            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full h-16 px-4 border-b border-white/5 flex justify-between items-center bg-[#020617]/50 backdrop-blur-xl z-10">
              <div className="text-sm font-medium text-slate-300 truncate max-w-[55%] ml-2">{currentChatTitle}</div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={startNewChat} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors" title="Nova conversa"><Plus size={18} /></button>
                <button type="button" onClick={() => { fetchChatList().then(setChatList).catch(console.error); setShowHistory(true); }} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors" title="Historial"><Clock size={18} /></button>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors ml-1"><X size={18} /></button>
              </div>
            </div>

            {/* Floating Input */}
            <div className="absolute bottom-0 left-0 w-full p-4 pt-8 bg-gradient-to-t from-[#020617]/90 via-[#020617]/50 to-transparent z-10 pointer-events-none">
              <div className="pointer-events-auto relative flex flex-col gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 transition duration-300 focus-within:bg-white/10 focus-within:border-white/20 shadow-lg ring-1 ring-black/20">
                <AnimatePresence>
                  {attachedFile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-2 pt-2">
                      <div className="relative inline-block border border-white/10 rounded-xl bg-slate-900/50 p-1 mt-2 ml-2">
                        {attachedFile.mimeType.startsWith('image/') ? (
                          <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} alt="preview" className="h-16 object-contain rounded-lg" loading="lazy" />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg"><span className="text-xs font-bold text-slate-300">PDF</span></div>
                        )}
                        <button type="button" onClick={() => setAttachedFile(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg z-20"><X size={14} /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-end gap-2">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf"
                    onChange={e => { if (e.target.files?.[0]) { processFile(e.target.files[0]); e.target.value = ''; } }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors mb-0.5 ml-1" title={t('chat.attachFile', 'Adjuntar imatge o PDF')}>
                    <Plus size={20} />
                  </button>
                  <textarea
                    ref={textareaRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.nativeEvent.isComposing) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={t('chat.placeholder', 'Escriu a {{aiName}}...', { aiName })}
                    className="flex-1 bg-transparent px-1 py-2.5 text-[15px] text-slate-200 placeholder-slate-400 focus:outline-none resize-none min-h-[44px] max-h-[250px] custom-scrollbar"
                    rows={1}
                  />
                  <SendButton
                    onClick={handleSend}
                    disabled={(!input.trim() && !attachedFile) || streamPhase !== 'idle'}
                    hasInput={!!(input.trim() || attachedFile)}
                    lastSentTime={lastSentTime}
                    cooldownMs={COOLDOWN_MS}
                  />
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
