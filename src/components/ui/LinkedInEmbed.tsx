import React, { useRef, useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';

interface LinkedInEmbedProps {
    /** Full LinkedIn embed URL (urn:li:ugcPost:...) */
    src: string;
    /** Height of the embed in px (default 399) */
    height?: string | number;
    /** Width of the embed in px (default "100%") */
    width?: string | number;
    /** Optional caption shown below */
    caption?: string;
}

const LinkedInEmbed: React.FC<LinkedInEmbedProps> = ({
    src,
    height = 399,
    width = '100%',
    caption,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

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
            { rootMargin: '200px' } // start loading 200px before it's visible
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const h = typeof height === 'string' ? parseInt(height, 10) : height;

    return (
        <div
            ref={containerRef}
            className="my-10 mx-auto max-w-5xl rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 shadow-2xl"
            style={{ minHeight: h + 48 }}
        >
            {/* Header bar */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-slate-800/60">
                <Linkedin size={16} className="text-[#0A66C2]" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                    LinkedIn
                </span>
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[10px] text-slate-500 hover:text-sky-400 transition-colors font-mono"
                >
                    Veure a LinkedIn ↗
                </a>
            </div>

            {/* Embed area */}
            <div className="w-full" style={{ height: h }}>
                {shouldLoad ? (
                    <iframe
                        src={src}
                        height={h}
                        width={width}
                        frameBorder={0}
                        allowFullScreen
                        title="LinkedIn embed"
                        className="w-full block"
                        loading="lazy"
                    />
                ) : (
                    /* Placeholder shown before intersection */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950/40">
                        <div className="w-8 h-8 rounded-full border-2 border-[#0A66C2]/30 border-t-[#0A66C2] animate-spin" />
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                            Carregant vídeo…
                        </span>
                    </div>
                )}
            </div>

            {/* Optional caption */}
            {caption && (
                <p className="text-center text-xs text-slate-500 italic px-4 py-2 border-t border-white/5">
                    {caption}
                </p>
            )}
        </div>
    );
};

export default LinkedInEmbed;
