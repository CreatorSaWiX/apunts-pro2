import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ArrowUp, Plus, Clock, UploadCloud, Pencil, Trash2, Check, LogIn } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLocation } from 'react-router-dom';
import bgImage from '../assets/bg.webp';
import AIStreamingIndicator from './AIStreamingIndicator';
import type { StreamPhase } from './AIStreamingIndicator';
import { useTranslation } from 'react-i18next';

interface Message { id?: string; role: 'user' | 'model'; content: string; attachmentName?: string; attachmentType?: 'image' | 'pdf'; addedMemories?: string[]; }
interface ChatMeta { id: string; title: string; updatedAt: number; }

const newId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const MARKDOWN_CLS = `text-sm md:text-[15px]
  [&_p]:leading-relaxed [&_p]:mb-4
  [&_pre]:bg-[#0d1117] [&_pre]:border [&_pre]:border-white/5 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto
  [&_code]:text-slate-200 [&_code]:bg-slate-800/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-[13px]
  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-300
  [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline
  [&_h1]:text-slate-100 [&_h1]:font-semibold [&_h1]:text-xl [&_h1]:mb-3 [&_h1]:mt-6
  [&_h2]:text-slate-100 [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mb-3 [&_h2]:mt-6
  [&_h3]:text-slate-100 [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2 [&_h3]:mt-4
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:marker:text-slate-500
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:marker:text-slate-500
  [&_li]:my-1.5 [&_li>p]:inline
  [&_strong]:text-slate-200 [&_strong]:font-semibold
  [&_blockquote]:border-l-2 [&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400`;

const SendButton = ({ 
    onClick, 
    disabled, 
    hasInput, 
    lastSentTime, 
    cooldownMs 
}: { 
    onClick: () => void; 
    disabled: boolean; 
    hasInput: boolean; 
    lastSentTime: number; 
    cooldownMs: number 
}) => {
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const check = () => {
             const elapsed = Date.now() - lastSentTime;
             const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
             if (remaining > 0) setCooldown(remaining);
             else setCooldown(0);
        };
        check();
        if (Date.now() - lastSentTime < cooldownMs) {
            const timer = setInterval(check, 1000);
            return () => clearInterval(timer);
        }
    }, [lastSentTime, cooldownMs]);

    const { t } = useTranslation();

    return (
        <button type="button"
            onClick={onClick}
            disabled={disabled || cooldown > 0}
            title={cooldown > 0 ? t('chat.wait', 'Espera {{cooldown}}s', { cooldown }) : t('common.send', 'Enviar')}
            className={`shrink-0 rounded-full transition-all mb-0.5 mr-1 flex items-center justify-center
                ${cooldown > 0
                ? 'w-9 h-9 bg-white/10 text-slate-500 cursor-not-allowed text-xs font-mono font-semibold'
                : hasInput
                    ? 'p-2 bg-white text-black hover:bg-slate-200 shadow-md'
                    : 'p-2 bg-white/10 text-slate-500'
                }`}
        >
            {cooldown > 0 ? cooldown : <ArrowUp size={18} strokeWidth={3} />}
        </button>
    );
};

export const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const { aiSettings, setAiSettings } = useSettings();
  const { t } = useTranslation();
  const aiName = aiSettings?.identity?.name;
  
  const renderAIAvatar = (iconSize: number, iconClass: string) => {
    const url = aiSettings?.identity?.avatarUrl;
    if (!url) return <Bot size={iconSize} className={iconClass} />;
    if (url.startsWith('http')) return <img src={url} alt="AI" className="w-full h-full object-cover rounded-[inherit]" />;
    return <span className="flex items-center justify-center w-full h-full text-[1.2em] leading-none select-none">{url}</span>;
  };

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(550);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState('');
  const [currentChatTitle, setCurrentChatTitle] = useState(t('chat.newChat', 'Nou Xat'));
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
  const lastSentAt = useRef<number>(0);   // anti-bypass: useRef no és accessible des del DOM
  const COOLDOWN_MS = 15_000;             // 15 segons entre peticions

  // ── Firebase helpers ──────────────────────────────────────────────────────

  const fetchChatList = useCallback(async (): Promise<ChatMeta[]> => {
    if (!user) return [];
    const [{ db }, { collection, getDocs, orderBy, query }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/firestore')
    ]);
    const q = query(collection(db, 'users', user.id, 'chats'), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, title: d.data().title || t('chat.conversation', 'Conversa'), updatedAt: d.data().updatedAt || 0 }));
  }, [user, t]);

  const saveChat = useCallback(async (id: string, history: Message[], title: string) => {
    if (!user || !id) return;
    const [{ db }, { doc, setDoc }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/firestore')
    ]);
    await setDoc(doc(db, 'users', user.id, 'chats', id), { history, title, updatedAt: Date.now() });
  }, [user]);

  const loadChat = useCallback(async (id: string) => {
    if (!user) return;
    const [{ db }, { doc, getDoc }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/firestore')
    ]);
    const snap = await getDoc(doc(db, 'users', user.id, 'chats', id));
    if (snap.exists()) {
      setMessages(snap.data().history || []);
      setCurrentChatTitle(snap.data().title || t('chat.conversation', 'Conversa'));
    }
  }, [user, t]);

  // ── Init on open ──────────────────────────────────────────────────────────
  // Init on open — reset scroll flag
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

  // Cleanup abort controller on unmount
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
      import('../lib/firebase'),
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
      import('../lib/firebase'),
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
    } else {
      root.style.width = '100%';
      document.documentElement.style.setProperty('--chatbot-width', '0px');
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
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = (e.target?.result as string).split(',')[1];
      setAttachedFile({ data: b64, mimeType: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
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

  // Scroll to bottom — use container ref to avoid dragging the window
  const scrollToBottom = useCallback((instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: instant ? 'instant' : 'smooth' });
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      scrollToBottom(true); // instant on initial load
    } else {
      scrollToBottom(false); // smooth for new messages
    }
  }, [messages, streamPhase, streamingText, scrollToBottom]);

  // ── Send ──────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    // — Cooldown guard (anti-bypass: la comprovació és aquí, no només al botó disabled)
    const elapsed = Date.now() - lastSentAt.current;
    if (elapsed < COOLDOWN_MS) return;
    if ((!input.trim() && !attachedFile) || streamPhase !== 'idle') return;

    // Marca el temps per iniciar el compte enrere visual al component fill
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
      try { pageText = (document.querySelector('main') || document.body).innerText.slice(0, 4000); } catch (_) { }

      const { auth } = await import('../lib/firebase');
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
          aiSettings
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        // Non-SSE error response (auth, validation, etc.)
        const errorData = await res.json().catch(() => ({ error: t('chat.errors.unknown', 'Error desconegut') }));
        throw new Error(errorData.error || 'Error');
      }

      // ── Parse SSE stream ─────────────────────────────────────────────
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

        // Parse SSE lines: each event ends with \n\n
        const events = sseBuffer.split('\n\n');
        // Keep the last incomplete chunk in the buffer
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

              case 'done':
                // Handled after the loop
                break;
            }
          } catch (parseErr: any) {
            if (eventType === 'error') throw parseErr;
            // Skip unparseable events
          }
        }
      }

      // ── Consolidate final message ───────────────────────────────────
      const finalText = fullReplyText || streamingText || t('chat.noResponse', 'Sense resposta.');
      const final = [...newMessages, { role: 'model' as const, content: finalText, addedMemories: metadata.memories_to_add }];
      setMessages(final);
      setStreamingText('');
      setStreamPhase('done');

      await saveChat(currentChatId, final, autoTitle);
      fetchChatList().then(setChatList);

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
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setMessages(prev => [...prev, { role: 'model', content: `**Error:** ${err.message}` }]);
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
            <div className="absolute inset-0 z-[-1] bg-[#020617]">
              <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover blur-[30px] scale-[1.2] select-none pointer-events-none" loading="lazy" />
              <div className="absolute inset-0 bg-[#020617]/30 backdrop-blur-xl" />
            </div>

            {/* Login gate — shown when user is not authenticated */}
            {!user && (
              <div className="absolute inset-0 z-[50] flex flex-col">
                {/* Mini header */}
                <div className="shrink-0 h-16 px-4 border-b border-white/5 flex items-center justify-between bg-[#020617]/50 backdrop-blur-xl">
                  <span className="text-sm font-medium text-slate-300 ml-2">{aiName}</span>
                  <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors"><X size={18} /></button>
                </div>
                {/* Login content */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center overflow-hidden">
                    {renderAIAvatar(28, "text-slate-400")}
                  </div>
                  <div>
                    <h2 className="text-slate-100 font-semibold text-lg mb-2">{aiName}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {t('chat.loginRequired', "L'assistent d'IA és exclusiu per als membres registrats\nInicia sessió per accedir a l'historial i al xat")}
                    </p>
                  </div>
                  <a
                    href="/login"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-2xl hover:bg-slate-100 transition-colors shadow-lg"
                  >
                    <LogIn size={18} />
                    {t('chat.login', 'Inicia sessió')}
                  </a>
                </div>
              </div>
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
              )}
            </AnimatePresence>

            {/* Resizer */}
            <div className="absolute left-0 top-0 bottom-0 w-2 hover:bg-slate-500/20 cursor-col-resize z-50 transition-colors"
              onMouseDown={() => { setIsResizing(true); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; }} />

            {/* Messages */}
            <div ref={messagesContainerRef} className="absolute inset-0 overflow-y-auto px-4 pt-20 pb-28 md:px-6 space-y-8 custom-scrollbar z-0 flex flex-col">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 min-h-[50vh]">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-4 opacity-70">
                     {renderAIAvatar(40, "text-slate-600")}
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={msg.id || `msg-${idx}-${msg.content.substring(0,10)}`} className={`flex w-full items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                      {renderAIAvatar(14, "text-slate-400")}
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-slate-100 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg' : 'text-slate-300'}`}>
                    {msg.role === 'user' ? (
                      <div className="space-y-2">
                        {msg.attachmentName && (
                          <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 w-fit ${msg.attachmentType === 'image'
                            ? 'bg-blue-500/15 border border-blue-400/20 text-blue-300'
                            : 'bg-orange-500/15 border border-orange-400/20 text-orange-300'
                            }`}>
                            <span>{msg.attachmentType === 'image' ? '🖼' : '📄'}</span>
                            <span className="truncate max-w-[180px]">{msg.attachmentName}</span>
                          </div>
                        )}
                        {msg.content && <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>}
                      </div>
                    ) : (
                      <div className="flex flex-col items-start">
                        <div className={MARKDOWN_CLS}>
                          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.addedMemories && msg.addedMemories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex -mt-1 mb-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-slate-400 tracking-wide select-none"
                          >
                            {t('chat.memoryUpdated', 'Memòria actualitzada')}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && user && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-6 h-6 rounded-md shrink-0 mt-1 object-cover border border-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`; }}
                    />
                  )}
                </div>
              ))}
              {/* AI Streaming Indicator (connecting / thinking) */}
              {(streamPhase === 'connecting' || streamPhase === 'thinking') && (
                <AIStreamingIndicator
                  phase={streamPhase}
                  thoughtText={thoughtText}
                  renderAvatar={renderAIAvatar}
                />
              )}
              {/* Streaming text (writing phase) */}
              {streamPhase === 'writing' && streamingText && (
                <div className="flex w-full items-start gap-3 justify-start">
                  <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    {renderAIAvatar(14, "text-slate-400")}
                  </div>
                  <div className="max-w-[85%] text-slate-300">
                    <div className={`${MARKDOWN_CLS} ai-cursor-blink`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{streamingText}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full h-16 px-4 border-b border-white/5 flex justify-between items-center bg-[#020617]/50 backdrop-blur-xl z-10">
              <div className="text-sm font-medium text-slate-300 truncate max-w-[55%] ml-2">{currentChatTitle}</div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={startNewChat} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors" title="Nova conversa"><Plus size={18} /></button>
                <button type="button" onClick={() => { fetchChatList().then(setChatList); setShowHistory(true); }} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors" title="Historial"><Clock size={18} /></button>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors ml-1"><X size={18} /></button>
              </div>
            </div>

            {/* Floating Input */}
            <div className="absolute bottom-0 left-0 w-full p-4 pt-8 bg-gradient-to-t from-[#020617]/90 via-[#020617]/50 to-transparent z-10 pointer-events-none">
              <div className="pointer-events-auto relative flex flex-col gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 transition-all duration-300 focus-within:bg-white/10 focus-within:border-white/20 shadow-lg ring-1 ring-black/20">
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
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
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
