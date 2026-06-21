import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ExternalLink, Users, Clock, Target, CheckSquare, Layers, Activity, Book, Key } from 'lucide-react';

interface SubjectDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectId: string | null;
}

const TAB_ICONS: Record<string, React.ReactNode> = {
    'Professorat': <Users size={16} />,
    'Hores setmanals': <Clock size={16} />,
    'Competències': <Target size={16} />,
    'Objectius': <CheckSquare size={16} />,
    'Continguts': <Layers size={16} />,
    'Activitats': <Activity size={16} />,
    'Metodologia docent': <BookOpen size={16} />,
    "Mètode d'avaluació": <CheckSquare size={16} />,
    'Bibliografia': <Book size={16} />,
    'Capacitats prèvies': <Key size={16} />
};

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({ isOpen, onClose, subjectId }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('');

    useEffect(() => {
        if (isOpen && subjectId) {
            setLoading(true);
            // Fetch the JSON dynamically
            fetch(`/data/subjects/${subjectId}.json`)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    return res.json();
                })
                .then(json => {
                    setData(json);
                    if (json.sections && json.sections.length > 0) {
                        setActiveTab(json.sections[0].title);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load subject details:', err);
                    setData(null);
                    setLoading(false);
                });
        }
    }, [isOpen, subjectId]);

    // Keyboard shortcut to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    {/* Deep Blur Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="w-[95vw] max-w-6xl h-[90vh] relative z-10 flex bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)]"
                    >
                        {/* Immersive Animated Background inside Modal */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15)_0%,transparent_50%)] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.15)_0%,transparent_50%)] pointer-events-none" />
                        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none animate-[pulse_10s_ease-in-out_infinite]" />
                        
                        {/* Huge Acronym Watermark Integrated */}
                        {data && (
                            <div className="absolute -top-10 -right-10 text-[250px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none select-none z-0 transform rotate-12">
                                {data.acronim}
                            </div>
                        )}

                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                                <div className="w-12 h-12 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-slate-400 font-mono tracking-widest uppercase text-xs animate-pulse">Carregant informació de la FIB...</p>
                            </div>
                        ) : !data ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                                <BookOpen size={48} className="text-slate-600 mb-4" />
                                <h3 className="text-xl font-bold text-slate-300 mb-2">Informació no disponible</h3>
                                <p className="text-slate-500 max-w-md">No s'han pogut descarregar les dades de la FIB per aquesta assignatura. És possible que no estigui disponible al pla d'estudis actual.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors font-medium">Tancar</button>
                            </div>
                        ) : (
                            <>
                                {/* Sidebar Navigation & Stats */}
                                <div className="w-80 border-r border-white/5 bg-black/20 shrink-0 relative flex flex-col backdrop-blur-sm z-10">
                                    {/* Close Button Top Left */}
                                    <div className="p-6 pb-2">
                                        <button 
                                            onClick={onClose}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 text-slate-400 hover:text-white group flex items-center justify-center border border-white/10 hover:border-white/20"
                                        >
                                            <X size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    {/* Subject Identity */}
                                    <div className="px-6 py-4 flex flex-col">
                                        <h2 className="text-4xl font-black text-white tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                            {data.acronim}
                                        </h2>
                                        {data.web && (
                                            <a href={data.web} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors">
                                                <span>FIB Oficial</span>
                                                <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="px-6 py-2 grid grid-cols-2 gap-3 mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Crèdits</span>
                                            <span className="text-xl font-bold text-slate-200">{data.credits || '—'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Tipus</span>
                                            <span className="text-sm font-semibold text-emerald-400 truncate">{data.type || 'Obligatòria'}</span>
                                        </div>
                                    </div>

                                    {/* Tabs List */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6 flex flex-col gap-1">
                                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold px-3 py-2 mt-2 mb-1">Seccions</h3>
                                        {data.sections.map((sec: any) => {
                                            const isActive = activeTab === sec.title;
                                            return (
                                                <button
                                                    key={sec.title}
                                                    onClick={() => setActiveTab(sec.title)}
                                                    className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 group overflow-hidden ${
                                                        isActive 
                                                        ? 'text-white' 
                                                        : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <motion.div 
                                                            layoutId="activeTabIndicator"
                                                            className="absolute inset-0 bg-white/10 rounded-xl"
                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                        />
                                                    )}
                                                    <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                                        {TAB_ICONS[sec.title] || <BookOpen size={16} />}
                                                    </div>
                                                    <span className={`relative z-10 text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{sec.title}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden bg-white/[0.01]">
                                    {/* Top Area for Summary/Requirements */}
                                    <div className="p-8 pb-4 shrink-0 border-b border-white/5">
                                        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
                                            {activeTab}
                                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                        </h1>
                                        {data.summary && activeTab === data.sections[0]?.title && (
                                            <div className="text-sm text-slate-300 leading-relaxed max-w-4xl p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md italic">
                                                "{data.summary}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                                        <div className="max-w-4xl">
                                            <AnimatePresence mode="wait">
                                                {data.sections.map((sec: any) => {
                                                    if (sec.title !== activeTab) return null;
                                                    return (
                                                        <motion.div 
                                                            key={sec.title}
                                                            initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
                                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                            exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
                                                            transition={{ duration: 0.5, type: "spring", bounce: 0, delay: 0.1 }}
                                                            className="prose prose-invert prose-lg prose-sky max-w-none 
                                                                prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight 
                                                                prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-10
                                                                prose-h3:text-xl prose-h3:text-sky-300
                                                                prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
                                                                prose-strong:text-white prose-strong:font-bold
                                                                prose-p:text-slate-300 prose-p:leading-relaxed 
                                                                prose-li:text-slate-300 prose-ul:list-disc prose-ul:pl-5
                                                                prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
                                                                prose-td:border prose-td:border-white/5 prose-td:p-4 prose-td:bg-white/[0.02]
                                                                prose-th:border prose-th:border-white/10 prose-th:bg-white/[0.05] prose-th:p-4 prose-th:text-left prose-th:text-white"
                                                            dangerouslySetInnerHTML={{ __html: sec.html }}
                                                        />
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubjectDetailsModal;
