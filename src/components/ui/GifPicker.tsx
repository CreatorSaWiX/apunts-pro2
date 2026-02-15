import { useState, useEffect } from 'react';
import { Search, Loader, Image as ImageIcon, AlertCircle, X } from 'lucide-react';

// Fallback GIFs in case no API key or error
const DEMO_GIFS = [
    { id: '1', url: 'https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif', title: 'Rick Roll' },
    { id: '2', url: 'https://media.tenor.com/-pA3F3lU-pQAAAAd/coding.gif', title: 'Coding fast' },
    { id: '3', url: 'https://media.tenor.com/GfSX-u7VZQ4AAAAC/coding.gif', title: 'Hacker' },
    { id: '4', url: 'https://media.tenor.com/Images/error.gif', title: 'Error' },
    { id: '5', url: 'https://media.tenor.com/p0G_bmnW1bUAAAAC/thumbs-up.gif', title: 'Thumbs up' },
    { id: '6', url: 'https://media.tenor.com/l5_u4J0x1Q0AAAAC/cool-dog.gif', title: 'Cool' },
];

interface GifPickerProps {
    onSelect: (gifUrl: string) => void;
    onClose: () => void;
}

const GifPicker = ({ onSelect, onClose }: GifPickerProps) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [gifs, setGifs] = useState(DEMO_GIFS);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

    // Initial load (Trending) or Search
    useEffect(() => {
        const fetchGifs = async () => {
            if (!apiKey) {
                // Filter local demo gifs if no key
                const filtered = DEMO_GIFS.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
                setGifs(filtered);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const endpoint = search
                    ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${search}&limit=12&rating=g`
                    : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12&rating=g`;

                const res = await fetch(endpoint);
                const data = await res.json();

                if (data.meta && data.meta.status !== 200) {
                    throw new Error(data.meta.msg || 'Error fetching GIFs');
                }

                const formattedGifs = data.data.map((gif: any) => ({
                    id: gif.id,
                    url: gif.images.fixed_height.url, // Use fixed height for grid, or original/downsized
                    title: gif.title
                }));

                setGifs(formattedGifs);
            } catch (err) {
                console.error("Giphy Error:", err);
                setError("Error carregant GIFs. Comprova la clau API.");
                // Fallback to demo
                setGifs(DEMO_GIFS);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchGifs();
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [search, apiKey]);

    return (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col">
            {/* Header / Search */}
            <div className="p-3 bg-slate-900 border-b border-white/5 flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cerca a GIPHY..."
                        className="w-full bg-slate-800 text-slate-200 text-xs px-3 py-2 pl-9 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500 transition-all"
                        autoFocus
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto max-h-[300px] p-2 custom-scrollbar min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full py-8">
                        <Loader size={20} className="animate-spin text-sky-500" />
                    </div>
                ) : (
                    <>
                        {/* API Key Warning */}
                        {!apiKey && (
                            <div className="mb-3 px-2 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-200 flex items-center gap-2">
                                <AlertCircle size={12} />
                                <span>No API Key. Mostrant demos.</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-4 text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        {gifs.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {gifs.map(gif => (
                                    <button
                                        key={gif.id}
                                        onClick={() => onSelect(gif.url)}
                                        className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-sky-500 transition-all group"
                                    >
                                        <img
                                            src={gif.url}
                                            alt={gif.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Enviar</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                                <p>No s'han trobat GIFs.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-slate-900 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    Powered by
                    <span className="font-bold text-slate-300">GIPHY</span>
                </span>
                {!apiKey && (
                    <a href="https://developers.giphy.com/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-sky-400 hover:underline">
                        Aconseguir API Key
                    </a>
                )}
            </div>
        </div>
    );
};

export default GifPicker;
