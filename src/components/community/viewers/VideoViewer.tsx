import { useRef, useState, memo, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface VideoViewerProps {
    url: string;
    filename: string;
}

const VideoViewer = ({ url, filename }: VideoViewerProps) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current && videoRef.current.duration) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    }, []);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && videoRef.current.duration) {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            videoRef.current.currentTime = clickPos * videoRef.current.duration;
            setProgress(clickPos * 100);
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        const target = containerRef.current || videoRef.current;
        if (!target) return;
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error);
            setIsFullscreen(false);
        } else {
            target.requestFullscreen().catch(console.error);
            setIsFullscreen(true);
        }
    }, []);

    const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!videoRef.current || !videoRef.current.duration) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none"
        >
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
                    onClick={togglePlay}
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform"
                    >
                        <Play size={32} className="ml-1" fill="currentColor" />
                    </motion.div>
                </div>
            )}

            {/* Custom Controls */}
            <div className={`absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                {/* Progress Bar with accessibility */}
                <div 
                    role="slider"
                    tabIndex={0}
                    aria-label={t('community.viewers.videoProgress', 'Progrés del vídeo')}
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden relative focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={handleProgressClick}
                    onKeyDown={handleProgressKeyDown}
                >
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-label={isPlaying ? t('common.pause', 'Pausar') : t('common.play', 'Reproduir')}
                            className="text-white hover:text-primary transition-colors p-1"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button
                            type="button"
                            onClick={toggleMute}
                            aria-label={isMuted ? t('community.viewers.unmute', 'Activar so') : t('community.viewers.mute', 'Silenciar')}
                            className="text-white hover:text-primary transition-colors p-1"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <span className="text-xs font-medium text-white/80 truncate max-w-48 sm:max-w-xs">{filename}</span>
                    </div>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? t('common.minimize', 'Minimitzar') : t('common.fullscreen', 'Pantalla completa')}
                        className="text-white hover:text-primary transition-colors p-1"
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(VideoViewer);
