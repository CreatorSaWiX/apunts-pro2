import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { m as motion } from 'framer-motion';

interface VideoViewerProps {
    url: string;
    filename: string;
}

const VideoViewer = ({ url, filename }: VideoViewerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = clickPos * videoRef.current.duration;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
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
                {/* Progress Bar */}
                <div 
                    className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden relative"
                    onClick={handleProgressClick}
                >
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button type="button" onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <span className="text-xs font-medium text-white/80">{filename}</span>
                    </div>

                    <button type="button" onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                        <Maximize size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoViewer;
