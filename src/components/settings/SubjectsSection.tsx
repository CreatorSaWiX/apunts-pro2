import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Search, Command, ChevronRight, X } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { tailwindColors } from '../../contexts/SubjectContext';
import subjectsData from '../../data/subjects.json';
import NavigationPill from '../ui/NavigationPill';
import { Modal } from '../ui/Modal';

export const SubjectsSection = () => {
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
