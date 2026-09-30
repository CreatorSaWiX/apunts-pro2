import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Spinner from '../Spinner';
import { Search, Image as ImageIcon, X } from 'lucide-react';

// Reliable, tested 200 OK fallback GIFs
const DEMO_GIFS = [
    { id: 'demo-1', url: 'https://media.giphy.com/media/v1.Y2lkPWE1YTU4ZDcwYzZteWZmeDh4eHNsM2tiMHh2enR6bXFrY21mMHk1dWJjcXp2NjQ3cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tphCApwvdtC1VJabZ1/200.gif', title: 'Cat coding' },
    { id: 'demo-2', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif', title: 'Celebration' },
    { id: 'demo-3', url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', title: 'Dancing' },
    { id: 'demo-4', url: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif', title: 'Mind blown' },
    { id: 'demo-5', url: 'https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif', title: 'Good job' },
    { id: 'demo-6', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', title: 'Typing cat' },
];

const FALLBACK_GIPHY_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';

interface GifPickerProps {
    onSelect: (gifUrl: string) => void;
    onClose: () => void;
    anchorRef?: React.RefObject<HTMLElement | null>;
}

export const GifPicker = ({ onSelect, onClose, anchorRef }: GifPickerProps) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [gifs, setGifs] = useState(DEMO_GIFS);
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY || FALLBACK_GIPHY_KEY;

    // 1. Calculate dynamic fixed coordinates escaping parent overflow-hidden containers
    useEffect(() => {
        const updatePosition = () => {
            const pickerWidth = 320;
            const pickerHeight = 360;

            if (anchorRef?.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                // Prefer placing above anchor
                let top = rect.top - pickerHeight - 8;
                if (top < 12) {
                    // If not enough room above, place below
                    top = rect.bottom + 8;
                }

                // Align right edge with button right edge
                let left = rect.right - pickerWidth;
                if (left + pickerWidth > window.innerWidth - 12) {
                    left = window.innerWidth - pickerWidth - 12;
                }
                if (left < 12) {
                    left = 12;
                }

                setCoords({ top, left });
            } else {
                // Fallback default: bottom-right
                setCoords({
                    top: Math.max(12, window.innerHeight - pickerHeight - 80),
                    left: Math.max(12, window.innerWidth - pickerWidth - 24)
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [anchorRef]);

    // 2. Click outside & Escape key listeners
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                pickerRef.current &&
                !pickerRef.current.contains(target) &&
                (!anchorRef?.current || !anchorRef.current.contains(target))
            ) {
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, anchorRef]);

    // 3. Fetch trending or searched GIFs from GIPHY with automatic key fallback
    useEffect(() => {
        let isCancelled = false;

        const fetchGifs = async () => {
            setLoading(true);
            setError(null);

            const fetchWithKey = async (key: string) => {
                const endpoint = search.trim()
                    ? `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(search.trim())}&limit=16&rating=g`
                    : `https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=16&rating=g`;

                const res = await fetch(endpoint);
                if (!res.ok) {
                    throw new Error(`HTTP error ${res.status}`);
                }
                const data = await res.json();
                if (data.meta && data.meta.status !== 200) {
                    throw new Error(data.meta.msg || 'GIPHY error');
                }
                return data;
            };

            try {
                let data: any;
                try {
                    data = await fetchWithKey(apiKey);
                } catch {
                    // Try fallback key if primary fails
                    if (apiKey !== FALLBACK_GIPHY_KEY) {
                        data = await fetchWithKey(FALLBACK_GIPHY_KEY);
                    } else {
                        throw new Error('Fallback failed');
                    }
                }

                if (isCancelled) return;

                const formattedGifs = (data.data || []).map((gif: any) => ({
                    id: gif.id,
                    url: gif.images?.fixed_height?.url || gif.images?.original?.url || '',
                    title: gif.title || 'GIF'
                })).filter((g: any) => !!g.url);

                if (formattedGifs.length > 0) {
                    setGifs(formattedGifs);
                } else {
                    setGifs([]);
                }
            } catch (err) {
                if (isCancelled) return;
                console.warn('[GifPicker] GIPHY API unreachable, using curated fallbacks:', err);
                // Filter local demo gifs on error
                const filtered = DEMO_GIFS.filter(g =>
                    g.title.toLowerCase().includes(search.toLowerCase())
                );
                setGifs(filtered.length > 0 ? filtered : DEMO_GIFS);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        const timeoutId = setTimeout(() => {
            fetchGifs();
        }, 300); // 300ms debounce

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [search, apiKey]);

    if (!coords) return null;

    return createPortal(
        <div
            ref={pickerRef}
            style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: '320px',
                height: '360px',
                zIndex: 9999
            }}
            className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
            {/* Header / Search */}
            <div className="p-3 bg-slate-950/60 border-b border-white/5 flex items-center gap-2 shrink-0">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cerca a GIPHY..."
                        autoFocus
                        className="w-full bg-slate-800/80 text-slate-200 text-xs px-3 py-2 pl-9 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500 transition border border-white/5"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    aria-label="Tancar"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar min-h-0">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full py-12 gap-2 text-slate-400">
                        <Spinner size="sm" variant="sky" />
                        <span className="text-xs">Carregant GIFs...</span>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="text-center py-2 text-amber-400 text-xs">
                                {error}
                            </div>
                        )}

                        {gifs.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {gifs.map((gif) => (
                                    <button
                                        type="button"
                                        key={gif.id}
                                        onClick={() => onSelect(gif.url)}
                                        className="relative aspect-video bg-slate-800/60 rounded-xl overflow-hidden hover:ring-2 hover:ring-sky-400 hover:scale-[1.02] active:scale-[0.98] transition group cursor-pointer border border-white/5"
                                        aria-label={gif.title}
                                    >
                                        <img
                                            src={gif.url}
                                            alt={gif.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-sky-950/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-sky-500 px-2 py-0.5 rounded-full shadow-md">
                                                Enviar
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center">
                                <ImageIcon size={28} className="mb-2 opacity-40 text-slate-400" />
                                <p>No s'han trobat GIFs.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-950/60 border-t border-white/5 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                    Powered by
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400">
                        GIPHY
                    </span>
                </span>
                <span className="text-[10px] text-slate-500">
                    {gifs.length} resultats
                </span>
            </div>
        </div>,
        document.body
    );
};

export default GifPicker;
