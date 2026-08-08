import React, { useRef, useEffect, useState, type MouseEvent } from 'react';
import { Maximize, RotateCcw, Play, Pause, Gauge } from 'lucide-react';

interface VideoPlayerProps {
    url?: string;
    delay?: string | number;
}

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, delay = 3500 }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const delayMs = typeof delay === 'string' ? parseInt(delay, 10) : delay;

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.playbackRate = playbackRate;
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    }, [url]);

    const handleTimeUpdate = () => {
        if (!isDragging && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleEnded = () => {
        if (!isPlaying) return;
        setTimeout(() => {
            if (videoRef.current && isPlaying) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
            }
        }, delayMs);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
                (containerRef.current as any).webkitRequestFullscreen();
            }
        }
    };

    const handleRestart = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const cyclePlaybackRate = () => {
        const rates = [1, 1.25, 1.5, 2];
        const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
        const nextRate = rates[nextIdx];
        setPlaybackRate(nextRate);
        if (videoRef.current) {
            videoRef.current.playbackRate = nextRate;
        }
    };

    const handleProgressInteraction = (e: MouseEvent<HTMLDivElement> | React.MouseEvent | globalThis.MouseEvent) => {
        if (!progressRef.current || !videoRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const clampedPos = Math.max(0, Math.min(1, pos));
        const newTime = clampedPos * duration;

        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleProgressInteraction(e);
    };

    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (isDragging) {
                handleProgressInteraction(e as unknown as React.MouseEvent);
            }
        };
        const handleMouseUp = () => {
            if (isDragging) setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, duration]);

    // Ocultació de controls
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleContainerMouseMove = () => {
        setIsHovering(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (!isDragging) setIsHovering(false);
        }, 3000);
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl mx-auto max-w-5xl group relative min-h-[100px] not-prose"
            onMouseMove={handleContainerMouseMove}
            onMouseLeave={() => setIsHovering(false)}
        >
            {url ? (
                <div className="relative w-full flex items-center justify-center bg-black/20">
                    <video
                        ref={videoRef}
                        src={url}
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleEnded}
                        onClick={togglePlay}
                        className="w-full h-auto object-contain block cursor-pointer transition-opacity duration-500 m-0"
                    />

                    {/* Controls Overlay - Floating Island */}
                    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex flex-row items-center gap-3 md:gap-4 transition-all duration-500 ease-out transform ${isHovering || isDragging || !isPlaying
                        ? 'opacity-100 translate-y-0 scale-100 shadow-[0_20px_40px_rgba(0,0,0,0.5)]'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                        }`}>

                        {/* Play/Pause */}
                        <button type="button"
                            onClick={togglePlay}
                            className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 text-white transition-all hover:scale-105 active:scale-95 shrink-0"
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="white" />}
                        </button>

                        {/* Restart */}
                        <button type="button"
                            onClick={handleRestart}
                            className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 text-white transition-all hover:scale-105 active:scale-95 shrink-0 hidden sm:block"
                        >
                            <RotateCcw size={18} />
                        </button>

                        {/* Timeline */}
                        <div className="flex-1 flex items-center gap-2 md:gap-3 min-w-0">
                            <span className="text-white/60 text-[10px] font-mono tabular-nums">{formatTime(currentTime)}</span>

                            <div
                                className="flex-1 h-6 flex items-center cursor-pointer group/timeline relative"
                                onMouseDown={handleMouseDown}
                                ref={progressRef}
                            >
                                {/* Track background */}
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden transition-all duration-300 group-hover/timeline:h-2">
                                    {/* Progress fill (White) */}
                                    <div
                                        className="h-full bg-white rounded-full relative"
                                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                {/* Playhead handle */}
                                <div
                                    className={`absolute h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] -ml-1.5 transition-transform duration-200 ${isDragging ? 'scale-150' : 'scale-0 group-hover/timeline:scale-100'
                                        }`}
                                    style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                />
                            </div>

                            <span className="text-white/60 text-[10px] font-mono tabular-nums">{formatTime(duration)}</span>
                        </div>

                        {/* Speed */}
                        <button type="button"
                            onClick={cyclePlaybackRate}
                            className="px-2 md:px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 text-white transition-all flex items-center gap-1.5 text-[10px] md:text-xs font-mono font-bold shrink-0"
                        >
                            <Gauge size={14} className="opacity-70" />
                            {playbackRate}x
                        </button>

                        {/* Fullscreen */}
                        <button type="button"
                            onClick={handleFullscreen}
                            className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 text-white transition-all hover:scale-105 active:scale-95 shrink-0"
                        >
                            <Maximize size={18} />
                        </button>

                    </div>
                </div>
            ) : (
                <div className="text-red-400 font-mono text-xs p-8 flex flex-col items-center gap-2">
                    <span className="opacity-50 text-xl font-bold">⚠️</span>
                    [VideoPlayer Error]: url parameter is missing
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
