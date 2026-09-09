import React from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAudioRecorder } from './hooks/useAudioRecorder';

interface MicButtonProps {
  input: string;
  onTranscript: (newText: string) => void;
  lang?: string;
  disabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  input,
  onTranscript,
  lang = 'ca-ES',
  disabled = false,
}) => {
  const { t } = useTranslation();
  const {
    isRecording,
    isTranscribing,
    recordingSeconds,
    errorMessage,
    toggleRecording,
  } = useAudioRecorder({
    input,
    onTranscript,
    lang,
    disabled,
    t,
  });

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
        onClick={toggleRecording}
        disabled={disabled || isTranscribing}
        aria-label={
          isTranscribing
            ? t('chat.transcribing', 'Transcribint amb IA...')
            : isRecording
            ? t('chat.stopVoice', 'Aturar i transcriure')
            : t('chat.voiceInput', 'Dictar amb IA')
        }
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
