import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface MicButtonProps {
  input: string;
  onTranscript: (newText: string) => void;
  lang?: string;
  disabled?: boolean;
}

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const MicButton: React.FC<MicButtonProps> = ({
  input,
  onTranscript,
  lang = 'ca-ES',
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isListeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');
  const inputRef = useRef(input);
  inputRef.current = input;

  const SpeechClass = getSpeechRecognition();

  // Auto-dismiss error message after 6 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 6000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (disabled) return;

    // 1. If currently listening, stop immediately
    if (isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      return;
    }

    // 2. Check browser support
    if (!SpeechClass) {
      setErrorMessage(t('chat.micNotSupported', 'Reconeixement de veu no suportat en aquest navegador.'));
      return;
    }

    setErrorMessage(null);

    // Clean up any stale instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      // NOTE: recognition.start() MUST be called strictly synchronously inside the user's click gesture!
      const recognition = new SpeechClass();
      const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      recognition.continuous = !isSafari;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = lang;

      // Save the text that was already in the input so we append to it
      const base = inputRef.current.trim();
      baseTextRef.current = base ? `${base} ` : '';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          sessionTranscript += event.results[i][0].transcript;
        }
        if (sessionTranscript) {
          const base = baseTextRef.current;
          onTranscript(base ? `${base}${sessionTranscript.trimStart()}` : sessionTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal pause in speaking, ignore
          return;
        }

        if (event.error === 'not-allowed') {
          setErrorMessage(t('chat.micPermissionDenied', 'Permís de micròfon denegat. Revisa els permisos del navegador.'));
        } else if (event.error === 'network') {
          setErrorMessage(t('chat.micNetworkError', 'Servei de veu no disponible o bloquejat pel navegador.'));
        } else if (event.error === 'audio-capture') {
          setErrorMessage(t('chat.micNoMic', "No s'ha detectat cap micròfon."));
        } else if (event.error === 'language-not-supported') {
          setErrorMessage(`Idioma ${lang} no suportat pel navegador.`);
        } else {
          setErrorMessage(`Error: ${event.error}`);
        }

        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;

      // Directly invoke synchronously inside the user activation
      recognition.start();
    } catch (err: any) {
      console.error('[Clouffy Mic] Failed to start:', err);
      isListeningRef.current = false;
      setIsListening(false);
      setErrorMessage(err?.message || 'Error en activar el micròfon');
    }
  }, [disabled, SpeechClass, lang, onTranscript, t]);

  if (!SpeechClass) return null;

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[calc(100%+10px)] right-0 bg-[#0f172a]/95 text-red-200 text-[11px] px-3 py-2 rounded-xl border border-red-500/30 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.7)] backdrop-blur-xl max-w-[260px] text-center z-50 flex items-center gap-2 leading-snug select-none origin-bottom-right"
          >
            <AlertCircle size={14} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        title={isListening ? t('chat.stopVoice', 'Aturar dictat') : t('chat.voiceInput', 'Dictar per veu')}
        className={`relative shrink-0 p-2 rounded-full transition-all flex items-center justify-center ${
          disabled
            ? 'opacity-40 cursor-not-allowed text-slate-500'
            : isListening
            ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
        }`}
      >
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-full bg-red-500/30 -z-0 pointer-events-none"
            animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </span>
      </button>
    </div>
  );
};
