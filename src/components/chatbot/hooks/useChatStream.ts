import { useState, useRef, useCallback, useEffect } from 'react';
import type { StreamPhase } from '../../AIStreamingIndicator';
import type { Message } from '../constants';

export const COOLDOWN_MS = 15_000;

interface SendMessageOptions {
  userMsg: string;
  attachedFile: { data: string; mimeType: string; name: string } | null;
  messages: Message[];
  currentChatId: string;
  currentChatTitle: string;
  aiSettings: any;
  thinkingLevel: string;
  language: string;
  currentPath: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCurrentChatTitle: (title: string) => void;
  saveChat: (id: string, history: Message[], title: string) => Promise<void>;
  setAiSettings?: (settings: any) => void;
  t: (key: string, fallback: string) => string;
}

export function useChatStream() {
  const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
  const [thoughtText, setThoughtText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [activeGrounding, setActiveGrounding] = useState<any>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingUpdateRAF = useRef<number | null>(null);
  const lastSentAt = useRef<number>(0);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (streamingUpdateRAF.current) {
        cancelAnimationFrame(streamingUpdateRAF.current);
      }
    };
  }, []);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setStreamPhase('idle');
  }, []);

  const sendMessage = useCallback(async ({
    userMsg,
    attachedFile,
    messages,
    currentChatId,
    currentChatTitle,
    aiSettings,
    thinkingLevel,
    language,
    currentPath,
    setMessages,
    setCurrentChatTitle,
    saveChat,
    setAiSettings,
    t,
  }: SendMessageOptions) => {
    const elapsed = Date.now() - lastSentAt.current;
    if (elapsed < COOLDOWN_MS) return;
    if ((!userMsg.trim() && !attachedFile) || streamPhase !== 'idle') return;

    lastSentAt.current = Date.now();

    const isFirst = messages.length === 0;
    const autoTitle = isFirst ? userMsg.slice(0, 45) : currentChatTitle;
    if (isFirst) setCurrentChatTitle(autoTitle);

    const newMessages: Message[] = [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: userMsg,
        ...(attachedFile
          ? {
              attachmentName: attachedFile.name,
              attachmentType: (attachedFile.mimeType === 'application/pdf' ? 'pdf' : 'image') as 'image' | 'pdf',
            }
          : {}),
      },
    ];

    setMessages(newMessages);
    setStreamPhase('connecting');
    setThoughtText('');
    setStreamingText('');
    setActiveGrounding(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let fullThoughtText = '';
    const requestStartTime = Date.now();
    let thoughtDurationMs = 0;

    try {
      let pageText = '';
      try {
        const source = document.querySelector('main') || document.body;
        const clone = source.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('.katex-html, script, style, svg, nav, footer, header').forEach((el) => el.remove());
        pageText = (clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 3000);
      } catch (_) {
        pageText = '';
      }

      const { auth } = await import('../../../lib/firebase');
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10),
          currentPath,
          pageText,
          image: attachedFile ? { data: attachedFile.data, mimeType: attachedFile.mimeType } : undefined,
          aiSettings,
          thinkingLevel,
          language,
        }),
        signal: controller.signal,
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
      let metadata: { memory_actions?: { action: string; old_fact?: string; new_fact?: string }[] } = {};
      let grounding: any = null;

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

              case 'reset':
                fullReplyText = '';
                thoughtDurationMs = 0;
                setStreamingText('');
                setStreamPhase('thinking');
                break;

              case 'thought':
                if (parsed.text) {
                  fullThoughtText += parsed.text;
                  setStreamPhase('thinking');
                  setThoughtText(fullThoughtText);
                }
                break;

              case 'delta':
              case 'chunk':
                if (parsed.text) {
                  if (fullThoughtText && !thoughtDurationMs) {
                    thoughtDurationMs = Date.now() - requestStartTime;
                  }
                  fullReplyText += parsed.text;
                  setStreamPhase('writing');
                  setStreamingText(fullReplyText);
                }
                break;

              case 'grounding':
                grounding = parsed;
                setActiveGrounding(parsed);
                break;

              case 'metadata':
                metadata = parsed;
                break;

              case 'error':
                throw new Error(parsed.message || parsed.error || 'Error en streaming');
            }
          } catch (e: any) {
            if (e.message && e.message !== 'Unexpected end of JSON input') {
              throw e;
            }
          }
        }
      }

      // Memory actions update
      if (metadata.memory_actions && metadata.memory_actions.length > 0 && setAiSettings) {
        setAiSettings((prev: any) => {
          let updatedMemories = [...(prev?.context?.userMemories || [])];
          for (const action of metadata.memory_actions || []) {
            if (action.action === 'add' && action.new_fact) {
              if (!updatedMemories.includes(action.new_fact)) updatedMemories.push(action.new_fact);
            } else if (action.action === 'delete' && action.old_fact) {
              updatedMemories = updatedMemories.filter((m) => m !== action.old_fact);
            } else if (action.action === 'modify' && action.old_fact && action.new_fact) {
              updatedMemories = updatedMemories.map((m) => (m === action.old_fact ? action.new_fact! : m));
            }
          }
          return { ...prev, context: { ...prev?.context, userMemories: updatedMemories } };
        });
      }

      const finalMessages: Message[] = [
        ...newMessages,
        {
          id: crypto.randomUUID(),
          role: 'model' as const,
          content: fullReplyText,
          addedMemories: metadata.memory_actions?.map((a) => a.new_fact || a.old_fact || '').filter(Boolean),
          groundingMetadata: grounding,
          thoughtText: fullThoughtText || undefined,
          thoughtTimeMs: thoughtDurationMs || undefined,
        },
      ];

      setMessages(finalMessages);
      await saveChat(currentChatId, finalMessages, autoTitle);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const errorMsg = err.message || t('chat.errors.failedToConnect', 'Error de connexió');
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'model' as const,
          content: `⚠️ **Error:** ${errorMsg}`,
        },
      ]);
    } finally {
      setStreamPhase('idle');
      setStreamingText('');
      setThoughtText('');
      setActiveGrounding(null);
    }
  }, [streamPhase]);

  return {
    streamPhase,
    thoughtText,
    streamingText,
    activeGrounding,
    sendMessage,
    stopStreaming,
    lastSentAt,
  };
}
