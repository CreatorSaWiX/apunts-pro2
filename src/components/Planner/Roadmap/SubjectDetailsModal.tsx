import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ExternalLink, Users, Clock, Target, CheckSquare, Layers, Activity, Book, Key } from 'lucide-react';
import Spinner from '../../ui/Spinner';

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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
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
                            <div className="flex items-center justify-center min-h-[400px] w-full">
                                <Spinner size="2xl" variant="sky" />
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
                                        {[
                                            ...(data.professors?.length > 0 ? ['Professorat'] : []),
                                            ...(data.hours?.length > 0 ? ['Hores setmanals'] : []),
                                            ...(data.activities?.length > 0 ? ['Activitats'] : []),
                                            ...data.sections.map((s: any) => s.title)
                                        ].map((title: string) => {
                                            const isActive = activeTab === title;
                                            return (
                                                <button
                                                    key={title}
                                                    onClick={() => setActiveTab(title)}
                                                    className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 group overflow-hidden ${isActive
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
                                                        {TAB_ICONS[title] || <BookOpen size={16} />}
                                                    </div>
                                                    <span className={`relative z-10 text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{title}</span>
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
                                                <motion.div
                                                    key={activeTab}
                                                    initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
                                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                    exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
                                                    transition={{ duration: 0.5, type: "spring", bounce: 0, delay: 0.1 }}
                                                >
                                                    {activeTab === 'Professorat' && data.professors?.length > 0 && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {data.professors.map((prof: any, i: number) => (
                                                                <div key={i} className="group p-5 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 rounded-2xl flex items-start gap-4">
                                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-sky-400 font-bold text-lg shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                                        {prof.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-white font-bold truncate group-hover:text-sky-300 transition-colors">{prof.name}</h4>
                                                                        <p className="text-xs text-sky-400/80 font-mono mt-0.5 tracking-wider">{prof.role}</p>
                                                                        {prof.email && (
                                                                            <a href={`mailto:${prof.email}`} className="text-sm text-slate-400 hover:text-white truncate mt-2 flex items-center gap-2 transition-colors">
                                                                                <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                                                                </div>
                                                                                {prof.email}
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {activeTab === 'Activitats' && data.activities?.filter((a: any) => a.title).length > 0 && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {data.activities.filter((a: any) => a.title).map((act: any, i: number) => (
                                                                <div key={i} className={`p-6 bg-[#0a0f1c]/80 border ${act.isEvaluative ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-500/[0.02]' : 'border-white/5 shadow-xl'} rounded-3xl relative overflow-hidden group hover:bg-[#0f172a] transition-all duration-300`}>
                                                                    {act.isEvaluative && (
                                                                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl border-l border-b border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                                                            Acte Avaluatiu
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                                        <h3 className={`text-xl font-bold tracking-tight leading-tight ${act.isEvaluative ? 'text-amber-400' : 'text-white'}`}>{act.title}</h3>
                                                                        {act.week !== null && (
                                                                            <div className="shrink-0 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-sky-400 font-mono font-bold tracking-wider">
                                                                                Setmana {act.week}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                                                        {act.description}
                                                                    </p>

                                                                    {act.objectives?.length > 0 && (
                                                                        <div className="mb-6">
                                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Objectius relacionats</span>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {act.objectives.map((obj: string, j: number) => (
                                                                                    <span key={j} className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-black bg-sky-500/10 text-sky-400 border border-sky-500/30">
                                                                                        {obj}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {act.hours?.length > 0 && (
                                                                        <div className="mt-auto pt-4 border-t border-white/5">
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {act.hours.map((hour: any, j: number) => (
                                                                                    <div key={j} className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-2.5 py-1">
                                                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400">{hour.type}</span>
                                                                                        <span className="text-xs font-black text-white">{hour.value}h</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {activeTab === 'Hores setmanals' && data.hours?.length > 0 && (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                                            {data.hours.map((hour: any, i: number) => {
                                                                const colors = [
                                                                    '#0ea5e9', // sky-500
                                                                    '#10b981', // emerald-500
                                                                    '#d946ef', // fuchsia-500
                                                                    '#f59e0b', // amber-500
                                                                    '#6366f1'  // indigo-500
                                                                ];
                                                                const color = colors[i % colors.length];
                                                                const maxHours = Math.max(...data.hours.map((h: any) => h.value), 10);
                                                                const percentage = Math.min((hour.value / maxHours) * 100, 100) || 0;

                                                                return (
                                                                    <div key={i} className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl flex flex-col items-center justify-center relative group">
                                                                        {/* SVG Speedometer/Ring */}
                                                                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                                                {/* Background Track */}
                                                                                <circle
                                                                                    cx="50" cy="50" r="40"
                                                                                    fill="transparent"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="8"
                                                                                    className="text-slate-800"
                                                                                />
                                                                                {/* Animated Progress Ring */}
                                                                                <motion.circle
                                                                                    cx="50" cy="50" r="40"
                                                                                    fill="transparent"
                                                                                    stroke={color}
                                                                                    strokeWidth="8"
                                                                                    strokeLinecap="round"
                                                                                    strokeDasharray={251.2}
                                                                                    initial={{ strokeDashoffset: 251.2 }}
                                                                                    animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
                                                                                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                                                                                    style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                                                                                />
                                                                            </svg>
                                                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                                                <motion.span
                                                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                                    transition={{ delay: 0.5 + i * 0.1 }}
                                                                                    className="text-3xl font-black text-white"
                                                                                    style={{ textShadow: `0 0 15px ${color}80` }}
                                                                                >
                                                                                    {hour.value}
                                                                                </motion.span>
                                                                                <span className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">HORES</span>
                                                                            </div>
                                                                        </div>
                                                                        <h4 className="text-sm font-bold text-slate-200 text-center">{hour.type}</h4>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {data.sections.map((sec: any) => {
                                                        if (sec.title !== activeTab) return null;

                                                        // Enhance HTML for better Awwwards UI
                                                        let processedHtml = sec.html;

                                                        // 1. Fix Bootstrap collapses (e.g. in Competències)
                                                        processedHtml = processedHtml.replace(/class="panel-collapse collapse"/g, 'class="mt-4"');
                                                        processedHtml = processedHtml.replace(/data-bs-toggle="collapse"/g, '');

                                                        // 2. Bold the first segment of list items ONLY for Continguts
                                                        if (sec.title === 'Continguts') {
                                                            processedHtml = processedHtml.replace(/<li([^>]*)>\s*(.*?)(?:\s*<br>)([\s\S]*?)<\/li>/gi,
                                                                '<li$1><strong class="text-sky-400 text-xl mb-2 block">$2</strong><span class="text-slate-300 block">$3</span></li>'
                                                            );
                                                        }

                                                        // 3. Wrap ALL <li> inner contents in a <div> so we can use Flexbox without breaking text nodes
                                                        processedHtml = processedHtml.replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, '<li$1><div class="w-full">$2</div></li>');

                                                        // 4. Highlight Competency IDs (e.g., CT4.2, G6.2) safely without touching HTML tags
                                                        const tempHtml = `> ${processedHtml} <`;
                                                        processedHtml = tempHtml.replace(/>([^<]+)</g, (_, text) => {
                                                            return '>' + text.replace(/\b([A-Z]{1,3}[0-9]+(?:\.[0-9]+)?)\b/g,
                                                                '<span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.2)] ml-1 mr-0.5">$1</span>'
                                                            ) + '<';
                                                        }).slice(2, -2);

                                                        return (
                                                            <div
                                                                key={sec.title}
                                                                className="prose prose-invert prose-lg max-w-none 
                                                                    prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight 
                                                                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-10
                                                                    prose-h3:text-xl prose-h3:text-white prose-h3:mt-8
                                                                    prose-h4:text-lg prose-h4:text-sky-300 prose-h4:mt-6
                                                                    prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
                                                                    prose-strong:text-sky-300 prose-strong:font-bold
                                                                    prose-p:text-slate-300 prose-p:leading-relaxed 
                                                                    
                                                                    /* Premium Dashboard Cards for ALL Lists */
                                                                    [&_ul]:list-none [&_ul]:pl-0 
                                                                    [&_ol]:list-none [&_ol]:pl-0 [&_ol]:[counter-reset:item]
                                                                    
                                                                    /* Level 1 List Items (Main Cards) */
                                                                    [&>ul>li]:bg-[#0f172a]/80 [&>ul>li]:border [&>ul>li]:border-white/5 [&>ul>li]:rounded-3xl [&>ul>li]:p-6 [&>ul>li]:my-6 [&>ul>li]:shadow-xl [&>ul>li]:transition-all [&>ul>li]:duration-300 hover:[&>ul>li]:bg-[#1e293b]/80 hover:[&>ul>li]:border-sky-500/20 hover:[&>ul>li]:shadow-[0_0_30px_rgba(14,165,233,0.1)]
                                                                    [&>ol>li]:bg-[#0f172a]/80 [&>ol>li]:border [&>ol>li]:border-white/5 [&>ol>li]:rounded-3xl [&>ol>li]:p-6 [&>ol>li]:my-6 [&>ol>li]:shadow-xl [&>ol>li]:transition-all [&>ol>li]:duration-300 hover:[&>ol>li]:bg-[#1e293b]/80 hover:[&>ol>li]:border-sky-500/20 hover:[&>ol>li]:shadow-[0_0_30px_rgba(14,165,233,0.1)]
                                                                    
                                                                    /* Flexbox layout for OL to align the Custom Counter */
                                                                    [&>ol>li]:flex [&>ol>li]:gap-6 [&>ol>li]:items-start
                                                                    [&>ol>li]:[counter-increment:item]
                                                                    [&>ol>li]:before:content-[counter(item)_'.'] [&>ol>li]:before:text-sky-500 [&>ol>li]:before:font-black [&>ol>li]:before:text-4xl [&>ol>li]:before:leading-none [&>ol>li]:before:-mt-1
                                                                    
                                                                    /* Nested Lists (Inner Cards) */
                                                                    [&_li_ul]:mt-4 [&_li_ul]:space-y-3
                                                                    [&_li_li]:bg-white/[0.03] [&_li_li]:p-5 [&_li_li]:rounded-2xl [&_li_li]:border [&_li_li]:border-white/[0.02] hover:[&_li_li]:bg-white/[0.05] [&_li_li]:transition-colors
                                                                    [&_li_ol]:mt-4 [&_li_ol]:space-y-3
                                                                    
                                                                    /* Tables */
                                                                    prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
                                                                    prose-td:border prose-td:border-white/5 prose-td:p-4 prose-td:bg-white/[0.02]
                                                                    prose-th:border prose-th:border-white/10 prose-th:bg-white/[0.05] prose-th:p-4 prose-th:text-left prose-th:text-white"
                                                                dangerouslySetInnerHTML={{ __html: processedHtml }}
                                                            />
                                                        );
                                                    })}
                                                </motion.div>
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
