import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import type { PlannerViewMode } from '../contexts/SettingsContext';
import { tailwindColors } from '../contexts/SubjectContext';
import { RoadmapProvider } from '../contexts/RoadmapContext';

import subjectsData from '../data/subjects.json';
import { Globe, LayoutGrid, Calendar, CalendarDays, Route, Github, X, Settings2, Sparkles, Command, Search, ChevronRight, Heart, Bot, Save, ChevronLeft, Trash2, Code } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import FileUploader from '../components/ui/FileUploader';
import NavigationPill from '../components/ui/NavigationPill';
import { Modal } from '../components/ui/Modal';

// Contributor Interface
interface Contributor {
    uid: string;
    username: string;
    role: string;
    avatar: string;
}

// --- Tabs Configuration ---
type TabId = 'general' | 'ai' | 'about';

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'ai', label: 'Assistent IA', icon: Bot },
    { id: 'about', label: 'Quant a', icon: Sparkles },
];

const GeneralSection = () => {
    const { preferredLang, setPreferredLang } = useLanguage();

    return (
        <div id="general" className="flex flex-col items-start gap-8 w-full pt-4 pb-12">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Idioma</h2>
                    <p className="text-slate-400 text-sm font-medium">L'idioma principal de l'aplicació.</p>
                </div>

                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto relative">
                    <button
                        onClick={() => setPreferredLang('ca')}
                        className="relative flex-1 sm:w-36 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'ca' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`relative z-10 transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>Català</span>
                    </button>

                    <button
                        onClick={() => setPreferredLang('es')}
                        className="relative flex-1 sm:w-36 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'es' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`relative z-10 transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>Castellano</span>
                    </button>
                </div>
            </div>
        </div>
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
        <div id="planner" className="flex flex-col items-start gap-6 w-full pt-6 pb-12 border-b border-white/5">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-1">Vista del Planificador</h2>
                <p className="text-slate-400 text-sm font-medium">Tria la vista per defecte a la pestanya Planificador.</p>
            </div>

            <div className="grid grid-cols-2 sm:flex flex-wrap gap-3 w-full">
                {plannerViews.map(view => {
                    const isActive = defaultPlannerView === view.id;
                    return (
                        <button
                            key={view.id}
                            onClick={() => setDefaultPlannerView(view.id)}
                            className={`relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 border outline-none flex-1 sm:flex-none ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                        >
                            <view.icon size={20} className={`transition-colors duration-300 z-10 relative ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className={`text-sm font-semibold transition-colors duration-300 z-10 relative ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                {view.label}
                            </span>
                            {isActive && (
                                <motion.div layoutId="planner-active-indicator" className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const SubjectsSection = () => {
    const { homeSubjects, setHomeSubjects, customSubjectColors, setCustomSubjectColors } = useSettings();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const [editingSubjectColor, setEditingSubjectColor] = useState<string | null>(null);
    const [previewSubject, setPreviewSubject] = useState<string>('');

    useEffect(() => {
        if (homeSubjects.length > 0 && !homeSubjects.includes(previewSubject)) {
            setPreviewSubject(homeSubjects[0]);
        }
    }, [homeSubjects, previewSubject]);

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

    return (
        <div id="subjects" className="flex flex-col gap-6 w-full pt-6 pb-12">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-1">Assignatures</h2>
                <p className="text-slate-400 text-sm font-medium">Gestiona les teves assignatures a l'Inici. Pots personalitzar el color de cadascuna.</p>
            </div>

            {/* Premium Command Palette */}
            <div className="w-full relative z-40" ref={searchRef}>
                <div
                    className={`relative flex items-center w-full bg-white/[0.03] border rounded-xl transition-all duration-300 overflow-hidden ${isCommandOpen ? 'border-white/30 bg-white/[0.06]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'}`}
                >
                    <Search size={20} className={`ml-4 mr-3 ${isCommandOpen ? 'text-white' : 'text-slate-500'} transition-colors duration-300`} />
                    <input
                        type="text"
                        placeholder="Cerca i afegeix assignatures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsCommandOpen(true)}
                        className="w-full bg-transparent py-3.5 text-white text-base font-medium placeholder-slate-600 focus:outline-none"
                    />
                    {!isCommandOpen && (
                        <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                            <Command size={12} /> K
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isCommandOpen && searchQuery.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 8, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 bg-[#0a0d16]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar overflow-hidden p-2 z-50"
                        >
                            {filteredSubjects.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {filteredSubjects.map(subject => {
                                        const defaultColor = subject.colorToken ? subject.colorToken.split('-')[0] : 'sky';
                                        const colorFamily = customSubjectColors[subject.name] || defaultColor;
                                        return (
                                            <button
                                                key={subject.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setHomeSubjects([...homeSubjects, subject.name]);
                                                    setSearchQuery('');
                                                    setIsCommandOpen(false);
                                                }}
                                                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group/item hover:bg-white/[0.05]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full bg-${colorFamily}-500`} />
                                                    <span className="font-bold text-slate-200">{subject.name}</span>
                                                </div>
                                                <ChevronRight size={18} className="text-slate-600 group-hover/item:text-white transition-colors" />
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-slate-500 font-medium">No s'han trobat resultats</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selected Subjects - Glass Pills Preview */}
            <div className={`w-full transition-all duration-300 ${isCommandOpen && searchQuery.length > 0 ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                <Reorder.Group
                    axis="x"
                    values={homeSubjects}
                    onReorder={setHomeSubjects}
                    className="flex flex-wrap gap-3 w-full"
                >
                    <AnimatePresence mode="popLayout">
                        {homeSubjects.map((subjectId: string) => {
                            const subject = subjectsData.find(s => s.name === subjectId);
                            if (!subject) return null;

                            const colorKey = customSubjectColors[subject.name] || (subject.colorToken ? subject.colorToken.split('-')[0] : 'sky');
                            const colorHex = tailwindColors[colorKey]?.primary || '#0ea5e9';

                            return (
                                <Reorder.Item
                                    value={subjectId}
                                    key={subjectId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    onDragStart={() => { isDraggingRef.current = true; }}
                                    onDragEnd={() => { setTimeout(() => { isDraggingRef.current = false; }, 150); }}
                                    className="cursor-grab active:cursor-grabbing outline-none"
                                >
                                    <div className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-sm pointer-events-auto">
                                        <button
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                if (!isDraggingRef.current) setEditingSubjectColor(subject.name); 
                                            }}
                                            className="flex items-center gap-2.5 outline-none group/btn cursor-pointer"
                                        >
                                            <div
                                                className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover/btn:scale-125"
                                                style={{ backgroundColor: colorHex }}
                                            />
                                            <span className="font-bold text-sm text-slate-200 transition-colors duration-300 pointer-events-none">{subject.name}</span>
                                        </button>
                                        <div className="w-px h-3 bg-white/10 mx-1 pointer-events-none" />
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubject(subject.name); }}
                                            className="text-slate-500 hover:text-rose-400 transition-colors duration-300 outline-none cursor-pointer"
                                        >
                                            <X size={14} strokeWidth={2.5} className="pointer-events-none" />
                                        </button>
                                    </div>
                                </Reorder.Item>
                            );
                        })}
                    </AnimatePresence>
                </Reorder.Group>

                {homeSubjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-slate-600 text-sm font-medium italic mt-2"
                    >
                        Cap assignatura afegida actualment.
                    </motion.div>
                )}
            </div>

            {/* Navbar Preview */}
            <div className="w-full mt-2 flex flex-col gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vista Prèvia del Navbar</span>
                    <span className="text-[13px] text-slate-400">Així es veurà el teu menú principal.</span>
                </div>

                <div className="flex items-center mt-2 relative z-10 w-full h-[72px] bg-[#0a0d16] rounded-xl border border-white/5 px-4 shadow-inner overflow-x-auto custom-scrollbar">
                    {homeSubjects.length > 0 ? (
                        <NavigationPill>
                            <AnimatePresence mode="popLayout">
                                {homeSubjects.map(subj => {
                                    const isActive = previewSubject === subj || (previewSubject === '' && subj === homeSubjects[0]);

                                    const subjectData = subjectsData.find(s => s.name === subj);
                                    const colorKey = customSubjectColors[subj] || (subjectData?.colorToken ? subjectData.colorToken.split('-')[0] : 'sky');
                                    const colorHex = tailwindColors[colorKey]?.primary || '#0ea5e9';
                                    const colorRgb = tailwindColors[colorKey]?.primary_rgb || '14, 165, 233';

                                    return (
                                        <motion.button
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            key={subj}
                                            onClick={() => setPreviewSubject(subj)}
                                            className={`relative px-4 h-9 flex items-center justify-center rounded-full text-[12px] font-black tracking-widest transition-colors duration-300 z-10 whitespace-nowrap outline-none ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill-preview"
                                                    className="absolute inset-0 rounded-full border border-white/[0.15] z-[-1]"
                                                    style={{
                                                        backgroundColor: colorHex,
                                                        boxShadow: `inset 0 1px 1px rgba(255,255,255,0.3), 0 0 15px rgba(${colorRgb}, 0.5)`
                                                    }}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                >
                                                    <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                                </motion.div>
                                            )}
                                            {subj.toUpperCase()}
                                        </motion.button>
                                    );
                                })}
                            </AnimatePresence>
                        </NavigationPill>
                    ) : (
                        <span className="text-slate-600 text-sm italic w-full text-center">Afegeix assignatures per veure el navbar</span>
                    )}
                </div>
            </div>

            <Modal
                isOpen={!!editingSubjectColor}
                onClose={() => setEditingSubjectColor(null)}
                size="md"
                overlayVariant="transparent"
            >
                {editingSubjectColor && (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white">Color de {editingSubjectColor}</h3>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                            {Object.keys(tailwindColors).map(colorKey => {
                                const isSelected = (customSubjectColors[editingSubjectColor] || subjectsData.find(s => s.name === editingSubjectColor)?.colorToken?.split('-')[0] || 'sky') === colorKey;
                                return (
                                    <button
                                        key={colorKey}
                                        onClick={() => {
                                            setCustomSubjectColors(prev => ({ ...prev, [editingSubjectColor]: colorKey }));
                                            setEditingSubjectColor(null);
                                        }}
                                        className="group relative flex items-center justify-center w-full aspect-square rounded-full outline-none"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-110 group-hover:opacity-80'}`}
                                            style={{
                                                backgroundColor: tailwindColors[colorKey].primary,
                                                boxShadow: isSelected ? `0 0 20px rgba(${tailwindColors[colorKey].primary_rgb}, 0.7)` : 'none'
                                            }}
                                        />
                                        {isSelected && (
                                            <motion.div layoutId="color-selected-ring" className="absolute inset-0 rounded-full border-2 border-white pointer-events-none drop-shadow-md" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                            <button
                                onClick={() => {
                                    const newColors = { ...customSubjectColors };
                                    delete newColors[editingSubjectColor];
                                    setCustomSubjectColors(newColors);
                                    setEditingSubjectColor(null);
                                }}
                                className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider outline-none"
                            >
                                Restablir per defecte
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const InputField = ({ label, value, onChange, placeholder, type = "text", subLabel = "" }: any) => (
    <div className="space-y-2 w-full">
        <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-slate-200">{label}</label>
            {subLabel && <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{subLabel}</span>}
        </div>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
            placeholder={placeholder}
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, minHeight = "100px" }: any) => (
    <div className="space-y-2 w-full">
        {label && <label className="block text-sm font-semibold text-slate-200">{label}</label>}
        <textarea
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all resize-y custom-scrollbar"
            style={{ minHeight }}
            placeholder={placeholder}
        />
    </div>
);

const AISection = () => {
    const { user } = useAuth();
    const { aiSettings, setAiSettings } = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editingSoulField, setEditingSoulField] = useState<'rules' | 'boundaries' | 'customDirectives' | null>(null);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, 'users', user.id);
            await setDoc(docRef, { aiSettings, updatedAt: Date.now() }, { merge: true });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving AI settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id="ai" className="flex flex-col gap-10 w-full pt-4 pb-16">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Assistent IA</h2>
                    <p className="text-slate-400 text-sm font-medium">Configura la personalitat i el comportament del teu copilot.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold transition-all outline-none disabled:opacity-50"
                >
                    {isSaving ? <Spinner size="sm" variant="white" /> : <Save size={18} />}
                    <span>{showSuccess ? 'Guardat!' : 'Guardar'}</span>
                </button>
            </div>

            <div className="space-y-8">
                {/* IDENTITY GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">1</div>
                        <h3 className="text-lg font-bold text-white">Identitat (Qui soc)</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-end gap-6">
                            <div className="relative w-24 h-24 rounded-[32px] border border-white/10 overflow-hidden bg-white/[0.03] flex-shrink-0 flex items-center justify-center group shadow-lg">
                                {aiSettings.identity.avatarUrl ? (
                                    <img src={aiSettings.identity.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <Bot size={36} className="text-slate-500 group-hover:text-sky-400 transition-colors duration-300" />
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-1">Canviar</span>
                                </div>

                                <FileUploader
                                    maxFiles={1}
                                    variant="avatar"
                                    onUploadComplete={(atts) => {
                                        if (atts.length > 0) {
                                            setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, avatarUrl: atts[0].url } })
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex-1">
                                <InputField
                                    label="Nom de la IA"
                                    value={aiSettings.identity.name || ''}
                                    onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, name: e.target.value } })}
                                    placeholder="ex: Cloufy"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Pronoms"
                                value={aiSettings.identity.pronouns || ''}
                                onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, pronouns: e.target.value } })}
                                placeholder="ex: he, she, they"
                            />

                            <div className="space-y-2 w-full">
                                <div className="flex items-baseline justify-between">
                                    <label className="text-sm font-semibold text-slate-200">Com vols que et digui?</label>
                                    <button
                                        onClick={() => setAiSettings({ ...aiSettings, userContext: { ...aiSettings.userContext, userPreferredName: user?.username || 'Estudiant' } })}
                                        className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Usar nom d'usuari
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={aiSettings.userContext?.userPreferredName || ''}
                                    onChange={(e) => setAiSettings({ ...aiSettings, userContext: { ...aiSettings.userContext, userPreferredName: e.target.value } })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
                                    placeholder="ex: mestre, cap..."
                                />
                            </div>
                        </div>

                        <TextAreaField
                            label="Personalitat (Vibe)"
                            value={aiSettings.identity.vibe || ''}
                            onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, vibe: e.target.value } })}
                            placeholder="Defineix el to general, l'estil de conversa i com et farà sentir la IA..."
                            minHeight="80px"
                        />
                    </div>
                </div>

                {/* SOUL GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">2</div>
                        <h3 className="text-lg font-bold text-white">Ànima (Regles de comportament)</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        {[
                            { id: 'rules', label: 'Regles (Rules)', placeholder: 'Ex: Respon sempre en català, sigues breu, utilitza format markdown...', minHeight: '120px' },
                            { id: 'boundaries', label: 'Límits (Boundaries)', placeholder: "Ex: No facis els exercicis per mi, guia'm. No responguis sobre temes fora d'informàtica...", minHeight: '100px' },
                            { id: 'customDirectives', label: 'Directrius Personalitzades', placeholder: 'Qualsevol altra indicació crítica per a la IA.', minHeight: '80px' }
                        ].map(field => (
                            <div key={field.id} className="space-y-2 w-full relative">
                                <label className="block text-sm font-semibold text-slate-200">{field.label}</label>
                                <div className="relative w-full rounded-xl overflow-hidden group border border-white/5">
                                    <textarea
                                        readOnly
                                        value={aiSettings.soul[field.id as keyof typeof aiSettings.soul] || ''}
                                        className="w-full bg-slate-900/40 px-4 py-3 text-white placeholder-slate-600 transition-all resize-y custom-scrollbar filter blur-[4px] opacity-60 select-none pointer-events-none"
                                        style={{ minHeight: field.minHeight }}
                                        placeholder={field.placeholder}
                                    />
                                    {/* Overlay center button */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0d16]/40 group-hover:bg-[#0a0d16]/60 transition-colors z-10">
                                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider mb-3 drop-shadow-md">Això ho gestiona l'IA autònomament</p>
                                        <button
                                            onClick={() => setEditingSoulField(field.id as any)}
                                            className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-xs transition-all backdrop-blur-md"
                                        >
                                            Forçar Modificació
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MEMORIES GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">3</div>
                            <h3 className="text-lg font-bold text-white">Memòria a Llarg Termini</h3>
                        </div>
                        <p className="text-sm text-slate-400">
                            Aquests són els detalls que la IA ha après sobre tu per personalitzar la teva experiència.
                        </p>
                    </div>

                    <div>
                        {(!aiSettings.userContext?.memories || aiSettings.userContext.memories.length === 0) ? (
                            <div className="p-6 bg-white/[0.03] rounded-xl border border-white/5 text-slate-500 text-sm font-medium flex justify-center items-center">
                                La IA encara no té memòries guardades.
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {aiSettings.userContext.memories.map((mem, idx) => (
                                    <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                                        <span className="text-sm text-slate-300 font-medium leading-relaxed">{mem}</span>
                                        <button
                                            onClick={() => {
                                                const newMems = [...(aiSettings.userContext?.memories || [])];
                                                newMems.splice(idx, 1);
                                                setAiSettings({
                                                    ...aiSettings,
                                                    userContext: { ...aiSettings.userContext, userPreferredName: aiSettings.userContext?.userPreferredName || '', memories: newMems }
                                                });
                                            }}
                                            className="shrink-0 text-slate-500 hover:text-rose-500 transition-colors p-1 bg-white/5 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                                            title="Esborrar memòria"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Soul Edit Modal */}
            <Modal
                isOpen={!!editingSoulField}
                onClose={() => setEditingSoulField(null)}
                size="3xl"
                overlayVariant="transparent"
            >
                <div className="p-8 flex flex-col h-full">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Modificant {editingSoulField === 'rules' ? 'Regles (Rules)' : editingSoulField === 'boundaries' ? 'Límits (Boundaries)' : 'Directrius Personalitzades'}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Aquests canvis seran apresos immediatament i passaran a formar part de l'ànima de l'assistent.
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 space-y-3">

                        <textarea
                            value={aiSettings.soul[editingSoulField as keyof typeof aiSettings.soul] || ''}
                            onChange={(e) => setAiSettings({
                                ...aiSettings,
                                soul: { ...aiSettings.soul, [editingSoulField as string]: e.target.value }
                            })}
                            className="w-full flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all resize-none custom-scrollbar text-sm leading-relaxed"
                            placeholder="Escriu aquí les instruccions..."
                        />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setEditingSoulField(null)}
                            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 px-10 rounded-2xl transition-colors text-base flex justify-center items-center gap-2"
                        >
                            <Save size={20} />
                            Desar a l'ànima
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
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
        <div id="about" className="flex flex-col gap-10 w-full pt-4 pb-24">
            <h2 className="text-2xl font-bold text-white w-full border-b border-white/10 pb-4">Quant a</h2>
            <p className="text-slate-400 text-sm font-medium -mt-6">Informació sobre el projecte i les persones que el fan possible.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a
                    href="https://github.com/CreatorSaWiX"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden outline-none h-48"
                >
                    <div className="z-10">
                        <Github size={32} className="text-white mb-4" />
                        <h3 className="text-2xl font-black text-white tracking-tight">Repositori</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Codi obert a GitHub</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-1/4 translate-y-1/4">
                        <Github size={120} />
                    </div>
                </a>

                <button
                    onClick={openContributors}
                    className="group relative text-left flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-500 overflow-hidden outline-none h-48"
                >
                    <div className="z-10">
                        <Heart size={32} className="text-rose-400 mb-4" />
                        <h3 className="text-2xl font-black text-white tracking-tight">Contribuïdors</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">L'equip darrere el projecte</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-1/4 translate-y-1/4 text-rose-500">
                        <Heart size={120} />
                    </div>
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
                            className="relative w-full max-w-lg p-8 overflow-hidden rounded-[40px] bg-slate-900 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glowing background inside modal */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer z-20 outline-none bg-white/5 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8 relative z-10 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                                    <Heart size={28} className="fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight text-white leading-none">
                                        {preferredLang === 'es' ? 'Colaboradores' : 'Contribuïdors'}
                                    </h2>
                                    <p className="text-slate-400 font-medium mt-1">L'equip de desenvolupament</p>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                {isLoadingContributors ? (
                                    <div className="flex justify-center items-center py-12">
                                        <Spinner size="lg" variant="rose" />
                                    </div>
                                ) : (
                                    contributors.map((user, i) => (
                                        <Link
                                            to={`/profile/${user.uid}`}
                                            key={i}
                                            onClick={() => setIsModalOpen(false)}
                                            className="block no-underline outline-none"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * i }}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer"
                                            >
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform relative">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <span className="text-xl">{user.username.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center items-start">
                                                    <h3 className="text-white font-bold text-lg leading-none mb-1">
                                                        {user.username}
                                                    </h3>
                                                    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">{user.role}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:text-rose-400 text-slate-600 transition-all">
                                                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SettingsContent = () => {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const navigate = useNavigate();

    const renderActiveSection = () => {
        switch (activeTab) {
            case 'general': return (
                <div className="flex flex-col">
                    <GeneralSection />
                    <PlannerSection />
                    <SubjectsSection />
                </div>
            );
            case 'ai': return <AISection />;
            case 'about': return <AboutSection />;
            default: return null;
        }
    };

    return (
        <div className="w-full h-[100dvh] bg-[#0a0d16] text-slate-300 overflow-hidden relative selection:bg-sky-500/30 selection:text-sky-200">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[150px] opacity-70" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] opacity-70" />
                <div className="noise-bg absolute inset-0 opacity-[0.03]" />
            </div>

            {/* Scrolling Wrapper (Scrollbar at the far right) */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
                <div className="w-full max-w-[1100px] mx-auto min-h-full flex flex-col md:flex-row relative">
                    {/* Sidebar (Desktop) / Header (Mobile) */}
                    <aside className="w-full md:w-[280px] shrink-0 flex flex-col z-20 md:sticky md:top-0 md:h-[100dvh] relative bg-transparent border-none">
                        <div className="p-6 md:p-8 flex items-center justify-between md:justify-start">
                            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-neutral-500 hover:text-white transition-colors outline-none mr-2 md:hidden">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xs font-semibold text-neutral-500 tracking-wider hidden sm:block">Ajustaments</span>
                            {/* Mobile Close Button */}
                            <button
                                onClick={() => navigate(-1)}
                                className="md:hidden p-2 rounded-full text-neutral-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Centered Nav */}
                        <nav className="flex-1 flex md:flex-col justify-start md:justify-center overflow-x-auto custom-scrollbar px-6 md:px-8 gap-1 md:overflow-x-hidden hide-scrollbar py-2">
                            {TABS.map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`shrink-0 group relative flex items-center px-4 py-3 transition-all duration-300 outline-none text-left rounded-xl`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active-tab"
                                                className="absolute inset-0 bg-white/10 rounded-xl"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <div className="relative z-10 flex items-center gap-3">
                                            <tab.icon
                                                size={18}
                                                className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}
                                            />
                                            <span className={`font-medium text-[14px] transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                                                {tab.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 h-auto relative z-20 pb-16">
                        <div className="w-full px-6 py-8 md:px-12 md:py-20 flex flex-col items-start justify-start min-h-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    {renderActiveSection()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => {
    return (
        <RoadmapProvider>
            <SettingsContent />
        </RoadmapProvider>
    );
};

export default SettingsPage;
