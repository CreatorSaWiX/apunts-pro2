import { useState, useRef, useEffect, useCallback } from 'react';

export interface AttachedFile {
  data: string;
  mimeType: string;
  name: string;
}

interface UseChatLayoutOptions {
  isOpen: boolean;
  t: (key: string, fallback: string) => string;
}

export function useChatLayout({ isOpen, t }: UseChatLayoutOptions) {
  const [sidebarWidth, setSidebarWidth] = useState(550);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeReaderRef = useRef<FileReader | null>(null);

  const tRef = useRef(t);
  tRef.current = t;

  // ── Gestió de fitxers adjunts ─────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert(tRef.current('chat.errors.invalidFileType', "Només s'accepten imatges i PDFs."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(tRef.current('chat.errors.fileTooLarge', "L'arxiu és massa gran. Màxim 5MB."));
      return;
    }

    if (activeReaderRef.current) {
      try {
        activeReaderRef.current.abort();
      } catch (_) {}
    }

    const reader = new FileReader();
    activeReaderRef.current = reader;

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const b64 = result.split(',')[1];
        setAttachedFile({ data: b64, mimeType: file.type, name: file.name });
      }
      activeReaderRef.current = null;
    };

    reader.onerror = () => {
      console.error('[useChatLayout] Error reading file:', reader.error);
      activeReaderRef.current = null;
    };

    reader.readAsDataURL(file);
  }, []);

  // Cancel·lació de lectors de fitxers actius en desmuntar
  useEffect(() => {
    return () => {
      if (activeReaderRef.current) {
        try {
          activeReaderRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // ── Drag & Drop lliure de parpelleig (amb comptador de profunditat) ─────────
  useEffect(() => {
    if (!isOpen) return;

    let dragCounter = 0;

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      // Només activem el panell si s'estan arrossegant fitxers (no text seleccionat)
      if (e.dataTransfer?.types?.includes('Files')) {
        dragCounter++;
        setIsDragging(true);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setIsDragging(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);
      if (e.dataTransfer?.files?.length) {
        processFile(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);

    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
      setIsDragging(false);
    };
  }, [isOpen, processFile]);

  // ── Layout adaptatiu i reactiu al canvi de mida de pantalla ────────────────
  useEffect(() => {
    const root = document.getElementById('root') || document.body;

    const updateLayout = () => {
      if (isOpen && window.innerWidth > 768) {
        root.style.width = `calc(100vw - ${sidebarWidth}px)`;
        document.documentElement.style.setProperty('--chatbot-width', `${sidebarWidth}px`);
      } else {
        root.style.width = '100%';
        document.documentElement.style.setProperty('--chatbot-width', '0px');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      root.style.width = '100%';
      document.documentElement.style.setProperty('--chatbot-width', '0px');
    };
  }, [isOpen, sidebarWidth]);

  // ── Redimensionament del sidebar (amb neteja de cursor i userSelect) ───────
  useEffect(() => {
    if (!isResizing) return;

    let rafId: number | null = null;

    const onMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const w = window.innerWidth - e.clientX;
        if (w > 350 && w < window.innerWidth * 0.9) {
          setSidebarWidth(w);
        }
      });
    };

    const onUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('blur', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('blur', onUp);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // ── Auto-scroll suau ──────────────────────────────────────────────────────
  const scrollToBottom = useCallback((instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: instant ? 'instant' : 'smooth',
    });
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
