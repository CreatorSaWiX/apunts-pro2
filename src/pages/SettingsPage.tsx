import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import type { PlannerViewMode } from '../contexts/SettingsContext';
import { RoadmapProvider } from '../contexts/RoadmapContext';

import subjectsData from '../data/subjects.json';
import { Globe, LayoutGrid, Calendar, CalendarDays, Route, Github, X, Settings2, Sparkles, Command, Search, ChevronRight, Heart } from 'lucide-react';
import NavigationPill from '../components/ui/NavigationPill';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Contributor Interface
interface Contributor {
    uid: string;
    username: string;
    role: string;
    avatar: string;
}

// --- Tabs Configuration ---
type TabId = 'general' | 'planner' | 'subjects' | 'about';

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'planner', label: 'Planificador', icon: LayoutGrid },
    { id: 'subjects', label: 'Assignatures', icon: Route },
    { id: 'about', label: 'Quant a', icon: Sparkles },
];

const GeneralSection = () => {
    const { preferredLang, setPreferredLang } = useLanguage();
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-12 w-full"
        >
            <div className="flex gap-6 sm:gap-12">
                <button 
                    onClick={() => setPreferredLang('ca')}
                    className="relative group flex flex-col items-center gap-4 transition-all duration-500 outline-none"
                >
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 border ${preferredLang === 'ca' ? 'bg-sky-500/10 border-sky-400 text-sky-400 shadow-[0_0_40px_rgba(56,189,248,0.2)] scale-110' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-white hover:bg-white/5'}`}>
                        <Globe size={32} strokeWidth={preferredLang === 'ca' ? 2 : 1.5} />
                    </div>
                    <span className={`text-xs sm:text-sm font-black tracking-[0.2em] uppercase transition-colors duration-500 ${preferredLang === 'ca' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-600 group-hover:text-slate-400'}`}>Català</span>
                    {preferredLang === 'ca' && (
                        <motion.div layoutId="lang-active-glow" className="absolute -bottom-4 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,1)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                </button>

                <button 
                    onClick={() => setPreferredLang('es')}
                    className="relative group flex flex-col items-center gap-4 transition-all duration-500 outline-none"
                >
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 border ${preferredLang === 'es' ? 'bg-rose-500/10 border-rose-400 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.2)] scale-110' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-white hover:bg-white/5'}`}>
                        <Globe size={32} strokeWidth={preferredLang === 'es' ? 2 : 1.5} />
                    </div>
                    <span className={`text-xs sm:text-sm font-black tracking-[0.2em] uppercase transition-colors duration-500 ${preferredLang === 'es' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-600 group-hover:text-slate-400'}`}>Castellano</span>
                    {preferredLang === 'es' && (
                        <motion.div layoutId="lang-active-glow" className="absolute -bottom-4 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,1)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                </button>
            </div>
        </motion.div>
    );
};

const PlannerSection = () => {
    const { defaultPlannerView, setDefaultPlannerView } = useSettings();
    const plannerViews: { id: PlannerViewMode, icon: any, label: string }[] = [
        { id: 'board', icon: LayoutGrid, label: 'Tauler' },
        { id: 'calendar', icon: Calendar, label: 'Calendari' },
        { id: 'gantt', icon: CalendarDays, label: 'Timeline' },
        { id: 'roadmap', icon: Route, label: 'Roadmap' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-12 w-full"
        >
            <div className="flex gap-4 sm:gap-8">
                {plannerViews.map(view => {
                    const isActive = defaultPlannerView === view.id;
                    return (
                        <button 
                            key={view.id}
                            onClick={() => setDefaultPlannerView(view.id)}
                            className="relative group flex flex-col items-center gap-4 transition-all duration-500 outline-none"
                        >
                            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[28px] flex items-center justify-center transition-all duration-500 border ${isActive ? 'bg-white text-slate-950 border-white shadow-[0_0_40px_rgba(255,255,255,0.4)] scale-110' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-white hover:bg-white/5'}`}>
                                <view.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} className="sm:w-8 sm:h-8" />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase transition-colors duration-500 ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                {view.label}
                            </span>
                            {isActive && (
                                <motion.div layoutId="planner-active-glow" className="absolute -bottom-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

const SubjectsSection = () => {
    const { homeSubjects, setHomeSubjects } = useSettings();
    // const { nodes } = useRoadmap();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsCommandOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSubjects = subjectsData.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ).filter(s => !homeSubjects.includes(s.name));

    const toggleSubject = (subjectId: string) => {
        if (homeSubjects.includes(subjectId)) {
            setHomeSubjects(homeSubjects.filter(id => id !== subjectId));
        } else {
            setHomeSubjects([...homeSubjects, subjectId]);
        }
    };

    // const getSubjectStatus = (subjectId: string) => {
    //     const node = nodes.find(n => n.id === subjectId);
    //     return node?.data.status;
    // };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 w-full max-w-lg mx-auto"
        >
            {/* Minimalist Command Palette */}
            <div className="w-full relative z-50" ref={searchRef}>
                <motion.div 
                    className={`relative group cursor-text transition-all duration-500`}
                    onClick={() => setIsCommandOpen(true)}
                >
                    <div className={`relative flex items-center w-full bg-transparent border-b ${isCommandOpen ? 'border-sky-400' : 'border-white/10 hover:border-white/30'} transition-all duration-500 pb-2`}>
                        <Search size={24} className={`mr-4 ${isCommandOpen ? 'text-sky-400' : 'text-slate-600'} transition-colors duration-500`} strokeWidth={isCommandOpen ? 2 : 1.5} />
                        <input 
                            type="text" 
                            placeholder="Cerca assignatures..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsCommandOpen(true)}
                            className="w-full bg-transparent py-2 text-white text-2xl md:text-3xl font-light placeholder-slate-700 focus:outline-none"
                        />
                        {!isCommandOpen && (
                            <div className="absolute right-0 flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                <Command size={12} /> K
                            </div>
                        )}
                    </div>

                    {/* Dropdown Results - Hovering */}
                    <AnimatePresence>
                        {isCommandOpen && searchQuery.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, y: 20, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-full left-0 right-0 bg-[#0F172A]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-2xl max-h-[250px] overflow-y-auto custom-scrollbar overflow-hidden z-50 p-2 mt-2"
                            >
                                {filteredSubjects.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {filteredSubjects.map(subject => {
                                            const colorFamily = subject.colorToken ? subject.colorToken.split('-')[0] : 'sky';
                                            return (
                                                <button 
                                                    key={subject.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHomeSubjects([...homeSubjects, subject.name]);
                                                        setSearchQuery('');
                                                        setIsCommandOpen(false);
                                                    }}
                                                    className="flex items-center justify-between px-4 py-3 rounded-[16px] transition-all text-left group/item hover:bg-white/5"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full bg-${colorFamily}-500 shadow-[0_0_10px_rgba(var(--${colorFamily}-rgb),0.8)]`} />
                                                        <span className="font-bold text-white text-lg">{subject.name}</span>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-600 group-hover/item:text-white transition-colors" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-500 font-medium">Cap resultat</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Selected Subjects - Naked Pills */}
            <div className={`w-full flex flex-wrap justify-center gap-3 transition-all duration-500 ${isCommandOpen && searchQuery.length > 0 ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                <AnimatePresence mode="popLayout">
                    {homeSubjects.map((subjectId: string) => {
                        const subject = subjectsData.find(s => s.name === subjectId);
                        if (!subject) return null;
                        
                        // const status = getSubjectStatus(subject.name);
                        
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                key={subject.id}
                            >
                                <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300">
                                    <span className="font-black tracking-widest text-sm text-white">{subject.name}</span>
                                    <div className="w-px h-4 bg-white/20 mx-1" />
                                    <button 
                                        onClick={() => toggleSubject(subject.name)}
                                        className="text-slate-500 hover:text-red-400 transition-colors duration-300"
                                    >
                                        <X size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                    {homeSubjects.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-slate-600 text-sm font-medium italic mt-4"
                        >
                            No hi ha cap assignatura afegida.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const AboutSection = () => {
    const { preferredLang } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);

    const openContributors = async () => {
        setIsModalOpen(true);
        if (contributors.length > 0) return;

        setIsLoadingContributors(true);
        const uids = ["jV5Y63M77PcqIcOUCpLz76GTYMI3", "tHrqAkSatrV6FVcgfdSErLjyXL12",
            "YU5QuXAZ47dslUX8ruyriHHPfh82", "3cQsRL8DFch3HEk0nHVV1dMQJZl2", "9Z17ChM52YVGsyrIp6gH3ymjEfZ2"];
        const fetched: Contributor[] = [];

        for (const uid of uids) {
            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    fetched.push({
                        uid,
                        username: data.username || "Usuari",
                        role: data.role || (preferredLang === 'es' ? "Colaborador" : "Col·laborador"),
                        avatar: data.avatar || ""
                    });
                }
            } catch (e) { console.error("Error carregant col·laboradors", e); }
        }
        setContributors(fetched);
        setIsLoadingContributors(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 w-full"
        >
            <div className="flex flex-col items-center gap-10">
                <a 
                    href="https://github.com/CreatorSaWiX" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group flex flex-col items-center gap-3 outline-none"
                >
                    <span className="text-3xl sm:text-5xl font-black text-slate-600 tracking-tighter hover:text-white transition-colors duration-500">Repositori GitHub</span>
                    <Github size={24} className="text-slate-800 group-hover:text-white transition-colors duration-500" />
                </a>

                <button 
                    onClick={openContributors}
                    className="group flex flex-col items-center gap-3 outline-none"
                >
                    <span className="text-3xl sm:text-5xl font-black text-slate-600 tracking-tighter hover:text-rose-400 transition-colors duration-500">Contribuïdors</span>
                    <Heart size={24} className="text-slate-800 group-hover:text-rose-400 group-hover:fill-rose-400 transition-colors duration-500" />
                </button>
            </div>

            {/* Contributors Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0d16]/90 backdrop-blur-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md p-8 overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glowing background inside modal */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer z-20 outline-none"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8 relative z-10 mt-2">
                                <div className="mx-auto w-12 h-12 flex items-center justify-center mb-4 text-rose-500">
                                    <Heart size={32} className="fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-white mb-2">
                                    {preferredLang === 'es' ? 'Colaboradores' : 'Contribuidors'}
                                </h2>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {isLoadingContributors ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-rose-500 animate-spin" />
                                    </div>
                                ) : (
                                    contributors.map((user, i) => (
                                        <Link
                                            to={`/profile/${user.uid}`}
                                            key={i}
                                            onClick={() => setIsModalOpen(false)}
                                            className="block no-underline"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + i * 0.1 }}
                                                className="flex items-center gap-4 p-4 rounded-3xl bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer no-underline outline-none"
                                            >
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform relative">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{user.username.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center items-start">
                                                    <h3 className="text-white font-bold text-lg leading-none mb-1">
                                                        {user.username}
                                                    </h3>
                                                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{user.role}</p>
                                                </div>
                                                <ChevronRight size={18} className="text-slate-700 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300" />
                                            </motion.div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Main Page Component ---
const SettingsContent = () => {
    const [activeTab, setActiveTab] = useState<TabId>('general');

    return (
        <div className="w-full h-[100dvh] flex flex-col items-center justify-center relative z-10 overflow-hidden">
            
            {/* Minimalist Floating Header */}
            <div className="absolute top-[20%] md:top-1/4 -translate-y-1/2 flex flex-col items-center z-50">
                <div className="mb-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <NavigationPill>
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center justify-center gap-2 px-5 md:px-6 h-10 rounded-full transition-all duration-500 text-xs md:text-sm font-bold tracking-wide z-10 outline-none ${isActive ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="settings-active-tab-naked"
                                            className="absolute inset-0 bg-white/[0.08] border border-white/[0.1] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </NavigationPill>
                </div>
            </div>

            {/* Dynamic Content Area perfectly centered */}
            <main className="w-full flex items-center justify-center px-4 pt-16 md:pt-24 z-40">
                <AnimatePresence mode="wait">
                    {activeTab === 'general' && <GeneralSection key="general" />}
                    {activeTab === 'planner' && <PlannerSection key="planner" />}
                    {activeTab === 'subjects' && <SubjectsSection key="subjects" />}
                    {activeTab === 'about' && <AboutSection key="about" />}
                </AnimatePresence>
            </main>
        </div>
    );
};

const SettingsPage = () => {
    return (
        <div className="h-[100dvh] w-full relative font-sans overflow-hidden bg-[#0a0d16] selection:bg-sky-500/30 selection:text-sky-200">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-sky-500/5 rounded-full blur-[100px] md:blur-[120px]" />
            </div>
            
            <RoadmapProvider>
                <SettingsContent />
            </RoadmapProvider>
        </div>
    );
};

export default SettingsPage;
