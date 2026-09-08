import { useState, useCallback, useEffect, useRef } from 'react';
import type { Message, ChatMeta } from '../constants';

const newId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

let firebaseModulesPromise: Promise<any> | null = null;
const getFirebase = () => {
  if (!firebaseModulesPromise) {
    firebaseModulesPromise = Promise.all([
      import('../../../lib/firebase'),
      import('firebase/firestore')
    ]);
  }
  return firebaseModulesPromise;
};

interface UseChatFirestoreOptions {
  user: any;
  isOpen: boolean;
  t: (key: string, fallback: string) => string;
  onCloseHistory?: () => void;
}

interface ChatDocData {
  title?: string;
  updatedAt?: number;
  history?: Message[];
}

/** Transforma les dades d'un document Firestore al format ChatMeta de manera optimitzada */
function formatChatDoc(
  id: string,
  data: ChatDocData,
  fallbackTitle: string
): ChatMeta {
  let searchableText = '';
  if (data.history && data.history.length > 0) {
    for (const m of data.history) {
      if (m?.content) {
        searchableText += m.content.toLowerCase() + ' ';
      }
    }
  }

  return {
    id,
    title: data.title || fallbackTitle,
    updatedAt: data.updatedAt || 0,
    searchableText: searchableText.trim(),
  };
}

export function useChatFirestore({ user, isOpen, t, onCloseHistory }: UseChatFirestoreOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState('');
  const [currentChatTitle, setCurrentChatTitle] = useState(() => t('chat.newChat', 'Nou Xat'));
  const [chatList, setChatList] = useState<ChatMeta[]>([]);
  const isInitialLoad = useRef(true);

  // Refs per estabilitzar callbacks i evitar re-renders innecessaris
  const onCloseHistoryRef = useRef(onCloseHistory);
  onCloseHistoryRef.current = onCloseHistory;

  const chatListRef = useRef(chatList);
  chatListRef.current = chatList;

  const fetchChatList = useCallback(async (): Promise<ChatMeta[]> => {
    if (!user) return [];
    try {
      const [{ db }, { collection, getDocs, orderBy, query }] = await getFirebase();
      const q = query(collection(db, 'users', user.id, 'chats'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      const fallbackTitle = t('chat.conversation', 'Conversa');
      return snap.docs.map((d: any) => formatChatDoc(d.id, d.data() as ChatDocData, fallbackTitle));
    } catch (err) {
      console.error('[useChatFirestore] Error fetching chat list:', err);
      return [];
    }
  }, [user, t]);

  const saveChat = useCallback(async (id: string, history: Message[], title: string) => {
    if (!user || !id) return;
    try {
      const [{ db }, { doc, setDoc }] = await getFirebase();
      await setDoc(doc(db, 'users', user.id, 'chats', id), { history, title, updatedAt: Date.now() });
    } catch (err) {
      console.error('[useChatFirestore] Error saving chat:', err);
    }
  }, [user]);

  const loadChat = useCallback(async (id: string) => {
    if (!user || !id) return;
    try {
      const [{ db }, { doc, getDoc }] = await getFirebase();
      const snap = await getDoc(doc(db, 'users', user.id, 'chats', id));
      if (snap.exists()) {
        const data = snap.data() as ChatDocData;
        setMessages(data.history || []);
        setCurrentChatTitle(data.title || t('chat.conversation', 'Conversa'));
      }
    } catch (err) {
      console.error('[useChatFirestore] Error loading chat:', err);
    }
  }, [user, t]);

  // Inicialització quan s'obre el panell de xat amb protecció contra condicions de cursa
  useEffect(() => {
    if (!isOpen || !user) return;
    let isMounted = true;
    isInitialLoad.current = true;

    fetchChatList().then((list) => {
      if (!isMounted) return;
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

    return () => {
      isMounted = false;
    };
  }, [isOpen, user, fetchChatList, t, loadChat]);

  const startNewChat = useCallback(async (closeHistory = true, skipSave = false) => {
    if (!skipSave && messages.length > 0 && currentChatId) {
      await saveChat(currentChatId, messages, currentChatTitle);
    }
    const id = newId();
    setCurrentChatId(id);
    setMessages([]);
    setCurrentChatTitle(t('chat.newChat', 'Nou Xat'));
    if (closeHistory) onCloseHistoryRef.current?.();
  }, [messages, currentChatId, currentChatTitle, saveChat, t]);

  const switchChat = useCallback(async (id: string, closeHistory = true, skipSave = false) => {
    if (!skipSave && messages.length > 0 && currentChatId) {
      await saveChat(currentChatId, messages, currentChatTitle);
    }
    setCurrentChatId(id);
    await loadChat(id);
    if (closeHistory) onCloseHistoryRef.current?.();
  }, [messages, currentChatId, currentChatTitle, saveChat, loadChat]);

  const deleteChat = useCallback(async (id: string) => {
    if (!user || !id) return;
    try {
      const [{ db }, { doc, deleteDoc }] = await getFirebase();
      await deleteDoc(doc(db, 'users', user.id, 'chats', id));
    } catch (err) {
      console.error('[useChatFirestore] Error deleting chat:', err);
    }

    const currentList = chatListRef.current;
    const newList = currentList.filter((c) => c.id !== id);
    setChatList(newList);

    if (id === currentChatId) {
      if (newList.length > 0) switchChat(newList[0].id, false, true);
      else startNewChat(false, true);
    }
  }, [user, currentChatId, switchChat, startNewChat]);

  const renameChat = useCallback(async (id: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!user || !id || !trimmedTitle) return;
    try {
      const [{ db }, { doc, updateDoc }] = await getFirebase();
      await updateDoc(doc(db, 'users', user.id, 'chats', id), { title: trimmedTitle });
    } catch (err) {
      console.error('[useChatFirestore] Error renaming chat:', err);
    }

    setChatList((prev) => prev.map((c) => (c.id === id ? { ...c, title: trimmedTitle } : c)));

    if (id === currentChatId) setCurrentChatTitle(trimmedTitle);
  }, [user, currentChatId]);

  return {
    messages,
    setMessages,
    currentChatId,
    setCurrentChatId,
    currentChatTitle,
    setCurrentChatTitle,
    chatList,
    setChatList,
    fetchChatList,
    saveChat,
    loadChat,
    startNewChat,
    switchChat,
    deleteChat,
    renameChat,
    isInitialLoad,
  };
}
