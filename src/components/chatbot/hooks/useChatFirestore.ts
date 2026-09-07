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

export function useChatFirestore({ user, isOpen, t, onCloseHistory }: UseChatFirestoreOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState('');
  const [currentChatTitle, setCurrentChatTitle] = useState(() => t('chat.newChat', 'Nou Xat'));
  const [chatList, setChatList] = useState<ChatMeta[]>([]);
  const isInitialLoad = useRef(true);

  const fetchChatList = useCallback(async (): Promise<ChatMeta[]> => {
    if (!user) return [];
    const [{ db }, { collection, getDocs, orderBy, query }] = await getFirebase();
    const q = query(collection(db, 'users', user.id, 'chats'), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => {
      const data = d.data();
      const historyText = data.history ? data.history.map((m: any) => m.content).join(' ').toLowerCase() : '';
      return {
        id: d.id,
        title: data.title || t('chat.conversation', 'Conversa'),
        updatedAt: data.updatedAt || 0,
        searchableText: historyText
      };
    });
  }, [user, t]);

  const saveChat = useCallback(async (id: string, history: Message[], title: string) => {
    if (!user || !id) return;
    const [{ db }, { doc, setDoc }] = await getFirebase();
    await setDoc(doc(db, 'users', user.id, 'chats', id), { history, title, updatedAt: Date.now() });
  }, [user]);

  const loadChat = useCallback(async (id: string) => {
    if (!user) return;
    const [{ db }, { doc, getDoc }] = await getFirebase();
    const snap = await getDoc(doc(db, 'users', user.id, 'chats', id));
    if (snap.exists()) {
      setMessages(snap.data().history || []);
      setCurrentChatTitle(snap.data().title || t('chat.conversation', 'Conversa'));
    }
  }, [user, t]);

  // Inicialització quan s'obre el panell de xat
  useEffect(() => {
    if (!isOpen || !user) return;
    isInitialLoad.current = true;
    fetchChatList().then((list) => {
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

  const startNewChat = useCallback(async (closeHistory = true, skipSave = false) => {
    if (!skipSave && messages.length > 0 && currentChatId) {
      await saveChat(currentChatId, messages, currentChatTitle);
    }
    const id = newId();
    setCurrentChatId(id);
    setMessages([]);
    setCurrentChatTitle(t('chat.newChat', 'Nou Xat'));
    if (closeHistory) onCloseHistory?.();
  }, [messages, currentChatId, currentChatTitle, saveChat, t, onCloseHistory]);

  const switchChat = useCallback(async (id: string, closeHistory = true, skipSave = false) => {
    if (!skipSave && messages.length > 0 && currentChatId) {
      await saveChat(currentChatId, messages, currentChatTitle);
    }
    setCurrentChatId(id);
    await loadChat(id);
    if (closeHistory) onCloseHistory?.();
  }, [messages, currentChatId, currentChatTitle, saveChat, loadChat, onCloseHistory]);

  const deleteChat = useCallback(async (id: string) => {
    if (!user) return;
    const [{ db }, { doc, deleteDoc }] = await getFirebase();
    await deleteDoc(doc(db, 'users', user.id, 'chats', id));
    const newList = chatList.filter((c) => c.id !== id);
    setChatList(newList);
    if (id === currentChatId) {
      if (newList.length > 0) switchChat(newList[0].id, false, true);
      else startNewChat(false, true);
    }
  }, [user, chatList, currentChatId, switchChat, startNewChat]);

  const renameChat = useCallback(async (id: string, title: string) => {
    if (!user || !title.trim()) return;
    const [{ db }, { doc, updateDoc }] = await getFirebase();

    await updateDoc(doc(db, 'users', user.id, 'chats', id), { title: title.trim() });
    setChatList((prev) => prev.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)));

    if (id === currentChatId) setCurrentChatTitle(title.trim());
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
