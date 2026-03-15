import React, { useRef, useEffect, useState } from 'react';
import { Maximize, RotateCcw, Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
    url?: string;
    delay?: string | number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, delay = 3500 }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const delayMs = typeof delay === 'string' ? parseInt(delay, 10) : delay;

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.log("Autoplay bloquejat o error:", err);
                    setIsPlaying(false);
                });
        }
    }, [url]);

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
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                (videoRef.current as any).webkitRequestFullscreen();
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

    return (
        <div ref={containerRef} className="my-12 flex flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl mx-auto max-w-5xl group relative min-h-[100px]">
            {url ? (
                <>
                    <div className="relative w-full aspect-video flex items-center justify-center">
                        <video
                            ref={videoRef}
                            src={url}
                            playsInline
                            onEnded={handleEnded}
                            onClick={togglePlay}
                            className="w-full h-full object-contain block cursor-pointer"
                        />
                        
                        {/* Controls Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4 md:p-6 justify-between pointer-events-none">
                            <div className="flex items-center gap-3 pointer-events-auto">
                                <button 
                                    onClick={togglePlay}
                                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95"
                                    title={isPlaying ? "Pausar" : "Reproduir"}
                                >
                                    {isPlaying ? <Pause size={18} /> : <Play size={18} fill="white" />}
                                </button>
                                <button 
                                    onClick={handleRestart}
                                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95"
                                    title="Reiniciar"
                                >
                                    <RotateCcw size={18} />
                                </button>
                                <div className="text-[10px] text-white/70 font-mono uppercase tracking-[0.2em] bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                                    Looping
                                </div>
                            </div>

                            <button 
                                onClick={handleFullscreen}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                                title="Pantalla completa"
                            >
                                <Maximize size={18} />
                            </button>
                        </div>
                    </div>
                </>
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
