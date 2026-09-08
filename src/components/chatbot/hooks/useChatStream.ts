import { useState, useRef, useCallback, useEffect } from 'react';
import type { StreamPhase } from '../../AIStreamingIndicator';
import type { Message } from '../constants';
import type { AttachedFile } from './useChatLayout';

export const COOLDOWN_MS = 15_000;

interface SendMessageOptions {
  userMsg: string;
  attachedFile: AttachedFile | null;
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

/**
 * Extreu el text principal de la pàgina activa de manera segura i optimitzada
 * sense clonar elements innecessaris ni el propi xat.
 */
function extractPageText(): string {
  try {
    const mainEl =
      document.querySelector('main article') ||
      document.querySelector('main') ||
      document.querySelector('#content');

    if (!mainEl) return '';

    const clone = mainEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.katex-html, script, style, svg, nav, footer, header, [aria-hidden="true"]').forEach((el) => el.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 3000);
  } catch (_) {
    return '';
  }
}

export function useChatStream() {
  const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
  const [thoughtText, setThoughtText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [activeGrounding, setActiveGrounding] = useState<any>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingUpdateRAF = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<{ text?: string; thought?: string }>({});
  const lastSentAt = useRef<number>(0);

  // Cancel·la animacions o peticions pendents en desmuntar
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (streamingUpdateRAF.current) {
        cancelAnimationFrame(streamingUpdateRAF.current);
        streamingUpdateRAF.current = null;
      }
    };
  }, []);

  // Actualització visual suau de text amb requestAnimationFrame (màxim 60fps)
  const scheduleUIUpdate = (text?: string, thought?: string) => {
    if (text !== undefined) pendingUpdatesRef.current.text = text;
    if (thought !== undefined) pendingUpdatesRef.current.thought = thought;

    if (!streamingUpdateRAF.current) {
      streamingUpdateRAF.current = requestAnimationFrame(() => {
        streamingUpdateRAF.current = null;
        if (pendingUpdatesRef.current.text !== undefined) {
          setStreamingText(pendingUpdatesRef.current.text);
        }
        if (pendingUpdatesRef.current.thought !== undefined) {
          setThoughtText(pendingUpdatesRef.current.thought);
        }
      });
    }
  };

  const flushUIUpdates = (finalText?: string, finalThought?: string) => {
    if (streamingUpdateRAF.current) {
      cancelAnimationFrame(streamingUpdateRAF.current);
      streamingUpdateRAF.current = null;
    }
    pendingUpdatesRef.current = {};
    if (finalText !== undefined) setStreamingText(finalText);
    if (finalThought !== undefined) setThoughtText(finalThought);
  };

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    } else {
      setStreamPhase('idle');
    }
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
    flushUIUpdates('', '');
    setActiveGrounding(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let fullThoughtText = '';
    let fullReplyText = '';
    const requestStartTime = Date.now();
    let thoughtDurationMs = 0;

    try {
      const pageText = extractPageText();

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
          const dataLines: string[] = [];

          for (const line of eventBlock.split('\n')) {
            if (line.startsWith('event:')) {
              eventType = line.replace(/^event:\s*/, '').trim();
            } else if (line.startsWith('data:')) {
              dataLines.push(line.replace(/^data:\s*/, ''));
            }
          }

          if (dataLines.length === 0) continue;
          const eventData = dataLines.join('\n');

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
                flushUIUpdates('', undefined);
                setStreamPhase('thinking');
                break;

              case 'thought':
                if (parsed.text) {
                  fullThoughtText += parsed.text;
                  setStreamPhase('thinking');
                  scheduleUIUpdate(undefined, fullThoughtText);
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
                  scheduleUIUpdate(fullReplyText, undefined);
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

      // Actualització de memòries a la configuració d'IA
      if (metadata.memory_actions && metadata.memory_actions.length > 0 && setAiSettings) {
        setAiSettings((prev: any) => {
          let updatedMemories = [...(prev?.userContext?.memories || [])];
          for (const action of metadata.memory_actions || []) {
            const act = (action.action || '').toUpperCase();
            if (act === 'ADD' && action.new_fact) {
              if (!updatedMemories.includes(action.new_fact)) updatedMemories.push(action.new_fact);
            } else if (act === 'DELETE' && action.old_fact) {
              updatedMemories = updatedMemories.filter((m) => m !== action.old_fact);
            } else if ((act === 'UPDATE' || act === 'MODIFY') && action.old_fact && action.new_fact) {
              updatedMemories = updatedMemories.map((m) => (m === action.old_fact ? action.new_fact! : m));
            }
          }
          return {
            ...prev,
            userContext: {
              ...prev?.userContext,
              memories: updatedMemories,
            },
            updatedAt: Date.now(),
          };
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
      const isAbort = err.name === 'AbortError';

      // Si s'atura la generació però ja s'havia generat text, preservem la resposta parcial
      if (isAbort && fullReplyText.trim()) {
        const partialMessages: Message[] = [
          ...newMessages,
          {
            id: crypto.randomUUID(),
            role: 'model' as const,
            content: fullReplyText.trim(),
            thoughtText: fullThoughtText || undefined,
            thoughtTimeMs: thoughtDurationMs || undefined,
          },
        ];
        setMessages(partialMessages);
        saveChat(currentChatId, partialMessages, autoTitle).catch(() => {});
      } else if (!isAbort) {
        const errorMsg = err.message || t('chat.errors.failedToConnect', 'Error de connexió');
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'model' as const,
            content: `⚠️ **Error:** ${errorMsg}`,
          },
        ]);
      }
    } finally {
      flushUIUpdates('', '');
      setStreamPhase('idle');
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
