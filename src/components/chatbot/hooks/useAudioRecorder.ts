import { useState, useRef, useEffect, useCallback } from 'react';

const MAX_RECORDING_SECONDS = 60;
const MIN_RECORDING_DURATION_MS = 500;
const ERROR_AUTO_DISMISS_MS = 6000;

/**
 * Retorna el tipus MIME d'àudio compatible amb el navegador actual.
 */
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

/**
 * Converteix un Blob d'àudio a una cadena en base64 pura (sense el prefix de data URL).
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			resolve(result.split(',')[1] || '');
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};

/**
 * Obté el token de Firebase Auth esperant que l'estat d'autenticació estigui inicialitzat
 * per evitar condicions de carrera en navegadors com Brave o Safari.
 */
const getFirebaseAuthToken = async (): Promise<string | null> => {
	try {
		const { auth } = await import('../../../lib/firebase');
		if (!auth.currentUser && typeof auth.authStateReady === 'function') {
			await auth.authStateReady();
		}
		if (!auth.currentUser) return null;
		return await auth.currentUser.getIdToken();
	} catch (err) {
		console.error('Error obtaining Firebase auth token:', err);
		return null;
	}
};

export interface UseAudioRecorderOptions {
	onTranscript: (newText: string) => void;
	input: string;
	lang?: string;
	disabled?: boolean;
	t: (key: string, fallback: string) => string;
}

export interface UseAudioRecorderReturn {
	isRecording: boolean;
	isTranscribing: boolean;
	recordingSeconds: number;
	errorMessage: string | null;
	toggleRecording: () => void;
	startRecording: () => Promise<void>;
	stopRecording: () => void;
	cancelRecording: () => void;
	clearErrorMessage: () => void;
}

export function useAudioRecorder({
	onTranscript,
	input,
	lang = 'ca-ES',
	disabled = false,
	t,
}: UseAudioRecorderOptions): UseAudioRecorderReturn {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [recordingSeconds, setRecordingSeconds] = useState(0);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioStreamRef = useRef<MediaStream | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number>(0);
	const isCancelledRef = useRef<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Refs per estabilitzar callbacks i evitar closures obsolets
	const inputRef = useRef(input);
	inputRef.current = input;

	const onTranscriptRef = useRef(onTranscript);
	onTranscriptRef.current = onTranscript;

	const langRef = useRef(lang);
	langRef.current = lang;

	const tRef = useRef(t);
	tRef.current = t;

	const clearErrorMessage = useCallback(() => {
		setErrorMessage(null);
	}, []);

	// Descartar automàticament els missatges d'error després del temps establert
	useEffect(() => {
		if (!errorMessage) return;
		const timer = setTimeout(() => setErrorMessage(null), ERROR_AUTO_DISMISS_MS);
		return () => clearTimeout(timer);
	}, [errorMessage]);

	const cleanupTracks = useCallback(() => {
		if (audioStreamRef.current) {
			audioStreamRef.current.getTracks().forEach((track) => track.stop());
			audioStreamRef.current = null;
		}
	}, []);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	// Neteja segura en desmuntar el component per evitar fuites de memòria o peticions òrfenes
	useEffect(() => {
		return () => {
			isCancelledRef.current = true;
			clearTimer();
			abortControllerRef.current?.abort();

			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
				try {
					mediaRecorderRef.current.stop();
				} catch (_) {}
			}
			cleanupTracks();
		};
	}, [clearTimer, cleanupTracks]);

	const handleTranscribeAudio = useCallback(async (blob: Blob, mimeType: string) => {
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;

		setIsTranscribing(true);
		setErrorMessage(null);

		try {
			// 1. Obtenir token de Firebase Auth
			const token = await getFirebaseAuthToken();
			if (!token) {
				throw new Error(
					tRef.current('chat.micAuthRequired', 'Cal iniciar sessió per transcriure veu.')
				);
			}

			// 2. Convertir Blob a Base64
			const audioBase64 = await blobToBase64(blob);

			if (isCancelledRef.current || controller.signal.aborted) return;

			// Netejar paràmetres de còdec (ex: 'audio/webm;codecs=opus' -> 'audio/webm') per a Gemini
			const cleanMime = mimeType.split(';')[0];

			const res = await fetch('/api/transcribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					audio: audioBase64,
					mimeType: cleanMime,
					language: langRef.current,
				}),
				signal: controller.signal,
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({ error: 'Error en transcriure' }));
				throw new Error(errorData.error || 'Error en el servidor de transcripció');
			}

			const data = await res.json();
			const transcribedText = data.text?.trim();

			if (transcribedText && !isCancelledRef.current && !controller.signal.aborted) {
				const base = inputRef.current.trim();
				onTranscriptRef.current(base ? `${base} ${transcribedText}` : transcribedText);
			}
		} catch (err: unknown) {
			if (controller.signal.aborted || isCancelledRef.current) return;

			console.error('Transcription error:', err);
			const message =
				err instanceof Error
					? err.message
					: tRef.current('chat.micNetworkError', "Error de connexió en enviar l'àudio.");
			setErrorMessage(message);
		} finally {
			if (!isCancelledRef.current && !controller.signal.aborted) {
				setIsTranscribing(false);
			}
		}
	}, []);

	const stopRecording = useCallback(() => {
		clearTimer();
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
			try {
				mediaRecorderRef.current.stop();
			} catch (err) {
				console.error('Error stopping recorder:', err);
			}
		}
	}, [clearTimer]);

	const cancelRecording = useCallback(() => {
		isCancelledRef.current = true;
		clearTimer();
		abortControllerRef.current?.abort();

		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
			try {
				mediaRecorderRef.current.stop();
			} catch (_) {}
		}
		cleanupTracks();
		setIsRecording(false);
		setRecordingSeconds(0);
		setIsTranscribing(false);
	}, [clearTimer, cleanupTracks]);

	const startRecording = useCallback(async () => {
		if (disabled || isTranscribing) return;

		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
			setErrorMessage(
				tRef.current('chat.micNotSupported', "Gravació d'àudio no suportada en aquest navegador.")
			);
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

			recorder.ondataavailable = (e: BlobEvent) => {
				if (e.data && e.data.size > 0) {
					audioChunksRef.current.push(e.data);
				}
			};

			recorder.onerror = (e: Event) => {
				console.error('MediaRecorder error event:', e);
				cleanupTracks();
				clearTimer();
				setIsRecording(false);
				setRecordingSeconds(0);
				setErrorMessage(
					tRef.current('chat.micRecordingError', "Error inesperat durant la gravació d'àudio.")
				);
			};

			recorder.onstop = () => {
				cleanupTracks();
				clearTimer();
				setIsRecording(false);
				setRecordingSeconds(0);

				if (isCancelledRef.current) return;

				const durationMs = Date.now() - startTimeRef.current;
				if (durationMs < MIN_RECORDING_DURATION_MS || audioChunksRef.current.length === 0) {
					return;
				}

				// Fallback de MIME segur: agafem el que el recorder ha utilitzat o el detectat inicialment
				const effectiveMime = (recorder.mimeType || detectedMime || 'audio/mp4').split(';')[0];
				const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });
				handleTranscribeAudio(audioBlob, effectiveMime);
			};

			// Gravació completa sense timeslice per evitar corrupció d'àudio MP4 a Safari
			recorder.start();
			const startTime = Date.now();
			startTimeRef.current = startTime;
			setIsRecording(true);
			setRecordingSeconds(0);

			clearTimer();
			timerRef.current = setInterval(() => {
				const elapsed = Math.floor((Date.now() - startTime) / 1000);
				setRecordingSeconds(elapsed);
				if (elapsed >= MAX_RECORDING_SECONDS) {
					stopRecording();
				}
			}, 250);
		} catch (err: unknown) {
			console.error('getUserMedia error:', err);
			cleanupTracks();
			clearTimer();
			setIsRecording(false);

			const errorName = err instanceof DOMException ? err.name : (err as { name?: string })?.name;
			if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
				setErrorMessage(
					tRef.current(
						'chat.micPermissionDenied',
						'Permís de micròfon denegat. Habilita el micròfon al teu navegador.'
					)
				);
			} else {
				setErrorMessage(tRef.current('chat.micAccessError', 'No es pot accedir al micròfon.'));
			}
		}
	}, [disabled, isTranscribing, clearTimer, cleanupTracks, handleTranscribeAudio, stopRecording]);

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
		cancelRecording,
		clearErrorMessage,
	};
}
