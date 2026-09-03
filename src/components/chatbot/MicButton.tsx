import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface MicButtonProps {
  input: string;
  onTranscript: (newText: string) => void;
  lang?: string;
  disabled?: boolean;
}

const getSupportedMimeType = (): string => {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return '';
};

export const MicButton: React.FC<MicButtonProps> = ({
  input,
  onTranscript,
  lang = 'ca-ES',
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const inputRef = useRef(input);
  inputRef.current = input;

  // Auto-dismiss error message after 6 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 6000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopAudioTracks = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  };

  const handleTranscribeAudio = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const audioBase64 = await base64Promise;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: audioBase64,
          mimeType,
          language: lang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error en transcriure' }));
        throw new Error(errorData.error || 'Error en el servidor de transcripció');
      }

      const data = await res.json();
      const transcribedText = data.text?.trim();

      if (transcribedText) {
        const base = inputRef.current.trim();
        onTranscript(base ? `${base} ${transcribedText}` : transcribedText);
      }
    } catch (err: any) {
      console.error('[Clouffy Mic] Transcription error:', err);
      setErrorMessage(err?.message || t('chat.micNetworkError', "Error de connexió en enviar l'àudio."));
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    if (disabled || isTranscribing) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMessage(t('chat.micNotSupported', 'Gravació d\'àudio no suportada en aquest navegador.'));
      return;
    }

    setErrorMessage(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const duration = (Date.now() - startTimeRef.current) / 1000;
        stopAudioTracks();

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsRecording(false);
        setRecordingSeconds(0);

        // Ignore very brief clicks (< 0.5s)
        if (duration < 0.5 || audioChunksRef.current.length === 0) {
          return;
        }

        const effectiveMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });
        handleTranscribeAudio(audioBlob, effectiveMime);
      };

      recorder.start(250); // collect chunk every 250ms
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          // Auto-stop after 60 seconds
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('[Clouffy Mic] MediaRecorder start error:', err);
      stopAudioTracks();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(t('chat.micPermissionDenied', 'Permís de micròfon denegat. Revisa els permisos del navegador.'));
      } else if (err.name === 'NotFoundError') {
        setErrorMessage(t('chat.micNoMic', "No s'ha detectat cap micròfon."));
      } else {
        setErrorMessage(err?.message || 'Error en activar el micròfon');
      }
      setIsRecording(false);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping mediaRecorder:', err);
      }
    }
  }, []);

  const handleClick = () => {
    if (isTranscribing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
  };

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
        onClick={handleClick}
        disabled={disabled || isTranscribing}
        title={
          isTranscribing
            ? t('chat.transcribing', 'Transcribint amb IA...')
            : isRecording
            ? t('chat.stopVoice', 'Aturar i transcriure')
            : t('chat.voiceInput', 'Dictar amb IA')
        }
        className={`relative shrink-0 p-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
          disabled || isTranscribing
            ? 'opacity-60 cursor-not-allowed text-slate-400 bg-white/5'
            : isRecording
            ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] pr-3 pl-2.5'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
        }`}
      >
        {isRecording && (
          <motion.span
            className="absolute inset-0 rounded-full bg-red-500/30 -z-0 pointer-events-none"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        )}

        <span className="relative z-10 flex items-center justify-center">
          {isTranscribing ? (
            <Loader2 size={17} className="animate-spin text-sky-400" />
          ) : isRecording ? (
            <Square size={14} className="fill-red-400 text-red-400" />
          ) : (
            <Mic size={18} />
          )}
        </span>

        {isRecording && (
          <span className="relative z-10 text-[11px] font-mono font-medium text-red-300 leading-none">
            {formatTimer(recordingSeconds)}
          </span>
        )}
      </button>
    </div>
  );
};
