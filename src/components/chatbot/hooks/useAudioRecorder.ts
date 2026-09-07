import { useState, useRef, useEffect, useCallback } from 'react';

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

interface UseAudioRecorderOptions {
  onTranscript: (newText: string) => void;
  input: string;
  lang?: string;
  disabled?: boolean;
  t: (key: string, fallback: string) => string;
}

export function useAudioRecorder({
  onTranscript,
  input,
  lang = 'ca-ES',
  disabled = false,
  t,
}: UseAudioRecorderOptions) {
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
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopAudioTracks = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const handleTranscribeAudio = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping recorder:', err);
      }
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (disabled || isTranscribing) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMessage(t('chat.micNotSupported', "Gravació d'àudio no suportada en aquest navegador."));
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

        if (duration < 0.5 || audioChunksRef.current.length === 0) {
          return;
        }

        const effectiveMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });
        handleTranscribeAudio(audioBlob, effectiveMime);
      };

      recorder.start(250);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('[Clouffy Mic] getUserMedia error:', err);
      stopAudioTracks();
      setIsRecording(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setErrorMessage(t('chat.micPermissionDenied', 'Permís de micròfon denegat. Habilita el micròfon al teu navegador.'));
      } else {
        setErrorMessage(t('chat.micAccessError', 'No es pot accedir al micròfon.'));
      }
    }
  }, [disabled, isTranscribing, t, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isTranscribing,
    recordingSeconds,
    errorMessage,
    toggleRecording,
    startRecording,
    stopRecording,
  };
}
