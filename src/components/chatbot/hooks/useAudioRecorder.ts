import { useState, useRef, useEffect, useCallback } from 'react';

const getSupportedMimeType = (): string => {
	if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
	const candidates = [
		'audio/webm',
		'audio/webm;codecs=opus',
		'audio/mp4',
		'audio/ogg;codecs=opus',
		'audio/ogg',
		'audio/aac',
		'audio/wav',
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
	const isCancelledRef = useRef<boolean>(false);

	// Refs per estabilitzar callbacks i evitar closures obsolets
	const inputRef = useRef(input);
	inputRef.current = input;

	const onTranscriptRef = useRef(onTranscript);
	onTranscriptRef.current = onTranscript;

	const langRef = useRef(lang);
	langRef.current = lang;

	// Descartar automàticament els missatges d'error després de 6 segons
	useEffect(() => {
		if (!errorMessage) return;
		const timer = setTimeout(() => setErrorMessage(null), 6000);
		return () => clearTimeout(timer);
	}, [errorMessage]);

	const cleanupTracks = () => {
		if (audioStreamRef.current) {
			audioStreamRef.current.getTracks().forEach((track) => track.stop());
			audioStreamRef.current = null;
		}
	};

	// Neteja segura en desmuntar el component per evitar fuites de memòria
	useEffect(() => {
		return () => {
			isCancelledRef.current = true;
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
				try {
					mediaRecorderRef.current.stop();
				} catch (_) {}
			}
			cleanupTracks();
		};
	}, []);

	const handleTranscribeAudio = async (blob: Blob, mimeType: string) => {
		setIsTranscribing(true);
		setErrorMessage(null);

		try {
			const reader = new FileReader();
			const base64Promise = new Promise<string>((resolve, reject) => {
				reader.onloadend = () => {
					const result = reader.result as string;
					resolve(result.split(',')[1] || '');
				};
				reader.onerror = reject;
			});
			reader.readAsDataURL(blob);
			const audioBase64 = await base64Promise;

			if (isCancelledRef.current) return;

			// Netejar paràmetres de còdec (ex: 'audio/webm;codecs=opus' -> 'audio/webm') per a Gemini
			const cleanMime = mimeType.split(';')[0];

			const res = await fetch('/api/transcribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					audio: audioBase64,
					mimeType: cleanMime,
					language: langRef.current,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({ error: 'Error en transcriure' }));
				throw new Error(errorData.error || 'Error en el servidor de transcripció');
			}

			const data = await res.json();
			const transcribedText = data.text?.trim();

			if (transcribedText && !isCancelledRef.current) {
				const base = inputRef.current.trim();
				onTranscriptRef.current(base ? `${base} ${transcribedText}` : transcribedText);
			}
		} catch (err: any) {
			if (!isCancelledRef.current) {
				console.error('Transcription error:', err);
				setErrorMessage(err?.message || t('chat.micNetworkError', "Error de connexió en enviar l'àudio."));
			}
		} finally {
			if (!isCancelledRef.current) {
				setIsTranscribing(false);
			}
		}
	};

	const stopRecording = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
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

		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
			setErrorMessage(t('chat.micNotSupported', "Gravació d'àudio no suportada en aquest navegador."));
			return;
		}

		setErrorMessage(null);
		audioChunksRef.current = [];
		isCancelledRef.current = false;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioStreamRef.current = stream;

			const detectedMime = getSupportedMimeType();
			const options: MediaRecorderOptions = detectedMime ? { mimeType: detectedMime } : {};
			const recorder = new MediaRecorder(stream, options);
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (e) => {
				if (e.data && e.data.size > 0) {
					audioChunksRef.current.push(e.data);
				}
			};

			recorder.onstop = () => {
				cleanupTracks();
				setIsRecording(false);
				setRecordingSeconds(0);

				if (isCancelledRef.current) return;

				const duration = (Date.now() - startTimeRef.current) / 1000;
				if (duration < 0.5 || audioChunksRef.current.length === 0) {
					return;
				}

				// Fallback de MIME segur: agafem el que el recorder ha utilitzat o el detectat inicialment
				const effectiveMime = (recorder.mimeType || detectedMime || 'audio/mp4').split(';')[0];
				const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });
				handleTranscribeAudio(audioBlob, effectiveMime);
			};

			// Gravació completa sense timeslice per evitar corrupció d'àudio MP4 a Safari
			recorder.start();
			startTimeRef.current = Date.now();
			setIsRecording(true);
			setRecordingSeconds(0);

			let seconds = 0;
			timerRef.current = setInterval(() => {
				seconds += 1;
				setRecordingSeconds(seconds);
				if (seconds >= 60) {
					stopRecording();
				}
			}, 1000);
		} catch (err: any) {
			console.error('getUserMedia error:', err);
			cleanupTracks();
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
