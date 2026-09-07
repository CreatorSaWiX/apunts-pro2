import { useState, useRef, useEffect, useCallback } from 'react';

interface UseChatLayoutOptions {
  isOpen: boolean;
  t: (key: string, fallback: string) => string;
}

export function useChatLayout({ isOpen, t }: UseChatLayoutOptions) {
  const [sidebarWidth, setSidebarWidth] = useState(550);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ data: string; mimeType: string; name: string } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ─────────────────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert(t('chat.errors.invalidFileType', "Només s'accepten imatges i PDFs."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t('chat.errors.fileTooLarge', "L'arxiu és massa gran. Màxim 5MB."));
      return;
    }
    let aborted = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (aborted) return;
      const b64 = (e.target?.result as string).split(',')[1];
      setAttachedFile({ data: b64, mimeType: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
    return () => {
      aborted = true;
      reader.abort();
    };
  }, [t]);

  const processFileRef = useRef(processFile);
  useEffect(() => {
    processFileRef.current = processFile;
  }, [processFile]);

  // Drag & drop
  useEffect(() => {
    if (!isOpen) return;
    const onOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const onLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files?.length) {
        processFileRef.current(e.dataTransfer.files[0]);
      }
    };
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, [isOpen]);

  // ── Layout / resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.getElementById('root') || document.body;

    if (isOpen && window.innerWidth > 768) {
      root.style.width = `calc(100vw - ${sidebarWidth}px)`;
      document.documentElement.style.setProperty('--chatbot-width', `${sidebarWidth}px`);
    }

    return () => {
      root.style.width = '100%';
      document.documentElement.style.setProperty('--chatbot-width', '0px');
    };
  }, [isOpen, sidebarWidth]);

  useEffect(() => {
    let rafId: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const w = window.innerWidth - e.clientX;
        if (w > 350 && w < window.innerWidth * 0.9) setSidebarWidth(w);
      });
    };

    const onUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isResizing]);

  // ── Auto scroll ───────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: instant ? 'instant' : 'smooth' });
  }, []);

  return {
    sidebarWidth,
    setSidebarWidth,
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
  };
}
