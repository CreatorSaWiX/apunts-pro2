import React, { useRef, useState, useEffect } from 'react';

interface YoutubeEmbedProps {
    /** Full YouTube URL or video ID */
    src: string;
    /** Optional caption shown below */
    caption?: string;
}

const getYoutubeId = (url: string) => {
    if (!url) return null;
    // If it's already just an 11-char ID
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
    src,
    caption,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Parse the video ID and build the embed URL
    // We add vq=hd1080 to request the best quality possible
    const videoId = getYoutubeId(src);
    const embedUrl = videoId 
        ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&vq=hd1080&modestbranding=1` 
        : null;

    // Lazy load: only inject the iframe once the card enters the viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '150px' } // Load slightly before it enters the viewport for a smoother UX
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="my-8 mx-auto max-w-5xl w-full">
            {/* 16:9 Aspect Ratio Container */}
            <div
                ref={containerRef}
                className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-950 relative border border-white/5"
            >
                {shouldLoad && embedUrl ? (
                    <iframe
                        src={embedUrl}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title="YouTube video player"
                        className={`w-full h-full block transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                    />
                ) : !embedUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/40 p-4 text-center">
                        <span className="text-xl">⚠️</span>
                        <span className="text-xs font-mono text-red-400">
                            Error: No s'ha pogut extreure l'ID del vídeo de YouTube.
                        </span>
                        <span className="text-[10px] text-slate-500 max-w-xs truncate">
                            URL proporcionada: {src}
                        </span>
                    </div>
                ) : null}
                
                {/* Placeholder shown before intersection OR while iframe is loading */}
                {embedUrl && !isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950">
                        <div className="w-8 h-8 rounded-full border-2 border-[#FF0000]/30 border-t-[#FF0000] animate-spin" />
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">
                            Carregant vídeo en alta definició…
                        </span>
                    </div>
                )}
            </div>

            {/* Optional caption */}
            {caption && (
                <p className="text-center text-xs text-slate-500 italic mt-3 px-4">
                    {caption}
                </p>
            )}
        </div>
    );
};

export default YoutubeEmbed;
