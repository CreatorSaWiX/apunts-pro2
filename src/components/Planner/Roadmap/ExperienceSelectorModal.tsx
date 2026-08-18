import React, { useState, useEffect, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Globe, Briefcase, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useRoadmapActions } from '../../../contexts/RoadmapContext';
import Modal from '../../ui/modals/Modal';
import { useTranslation } from 'react-i18next';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type ExpType = 'mobility' | 'internship';

interface UniversityItem {
    name: string;
    country: string;
    program?: string;
    webLink?: string;
    docLink?: string;
}

interface ExperienceDetails {
    destination?: string;
    program?: string;
    credits?: number;
    company?: string;
    role?: string;
}

interface SidebarItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    subtitle: string;
    active: boolean;
    onClick: () => void;
    colorClass: string;
}

const SidebarItem = ({
    icon: Icon,
    title,
    subtitle,
    active,
    onClick,
    colorClass
}: SidebarItemProps) => {
    return (
        <button type="button"
            onClick={onClick}
            className={`relative w-full flex items-center gap-4 p-4 rounded-2xl text-left transition duration-300 group overflow-hidden
                ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
        >
            {active && (
                <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
                ${active ? colorClass : 'bg-white/[0.03] text-slate-400 group-hover:text-slate-300'}`}
            >
                <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_currentColor]' : ''} />
            </div>

            <div className="flex flex-col">
                <span className={`text-sm font-bold transition-colors ${active ? 'text-white' : 'text-slate-300'}`}>
                    {title}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{subtitle}</span>
            </div>
        </button>
    );
};

interface PremiumInputProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    helpLink?: string;
}

const PremiumInput = ({ label, type = "text", value, onChange, placeholder, helpLink }: PremiumInputProps) => {
    return (
        <div className="group relative">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 group-focus-within:text-sky-400 transition-colors">{label}</label>
                {helpLink && (
                    <a href={helpLink} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-sky-400 transition-colors">
                        Info <ExternalLink size={10} />
                    </a>
                )}
            </div>
            <div className="relative">
                <input
                    type={type === 'number' ? 'text' : type}
                    inputMode={type === 'number' ? 'numeric' : undefined}
                    pattern={type === 'number' ? '[0-9]*' : undefined}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition font-medium"
                />
            </div>
        </div>
    );
};

interface PremiumSelectProps {
    label: string;
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    options?: string[];
    helpLink?: string;
}

const PremiumSelect = ({ label, value, onChange, options = [], helpLink }: PremiumSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group relative">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 group-focus-within:text-sky-400 transition-colors">{label}</label>
                {helpLink && (
                    <a href={helpLink} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-sky-400 transition-colors">
                        Info <ExternalLink size={10} />
                    </a>
                )}
            </div>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition font-medium flex justify-between items-center"
                >
                    {value}
                    <ChevronRight size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-50 w-full mt-2 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                            >
                                <div className="flex flex-col">
                                    {options.map((opt: string) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                                onChange({ target: { value: opt } });
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt ? 'bg-sky-500/10 text-sky-400 font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'} first:rounded-t-xl last:rounded-b-xl`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

interface PremiumComboboxProps {
    label: string;
    value: string;
    onChange: (val: string, program?: string) => void;
    placeholder?: string;
    options: UniversityItem[];
}

const PremiumCombobox = ({ label, value, onChange, placeholder, options }: PremiumComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
        opt.name.toLowerCase().includes(query.toLowerCase()) ||
        opt.country.toLowerCase().includes(query.toLowerCase())
    );

    const selectedOption = options.find((opt) => opt.name === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="group relative" ref={wrapperRef}>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 group-focus-within:text-sky-400 transition-colors">{label}</label>
            </div>
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/50 transition font-medium flex justify-between items-center cursor-pointer"
                >
                    <span className={value ? "text-white" : "text-slate-500"}>
                        {selectedOption ? `${selectedOption.name} (${selectedOption.country})` : (value || placeholder)}
                    </span>
                    <Search size={16} className="text-slate-500" />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 w-full mt-2 bg-[#0F172A]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-64"
                        >
                            <div className="p-3 border-b border-white/10 sticky top-0 bg-[#0F172A]">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={placeholder}
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">
                                {filteredOptions.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-500">
                                        No s'han trobat universitats
                                    </div>
                                ) : (
                                    filteredOptions.map((opt) => (
                                        <button
                                            key={opt.name}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.name, opt.program);
                                                setIsOpen(false);
                                                setQuery('');
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex flex-col justify-center border-b border-white/5 last:border-0 ${value === opt.name ? 'bg-sky-500/10 text-sky-400 font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <span className="font-bold text-slate-200">{opt.name}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-slate-400">{opt.country}</span>
                                                {opt.program && (
                                                    <span className="text-[9px] px-1.5 py-0.2 bg-white/5 text-slate-400 rounded border border-white/5">
                                                        {opt.program}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

let cachedUniversities: UniversityItem[] | null = null;

const ExperienceSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addExperienceNode } = useRoadmapActions();
    const [selectedType, setSelectedType] = useState<ExpType>('mobility');
    const [details, setDetails] = useState<ExperienceDetails>({});
    const [universities, setUniversities] = useState<UniversityItem[]>(cachedUniversities || []);
    const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

    useEffect(() => {
        if (!cachedUniversities) {
            fetch('/data/universities.json')
                .then(res => res.json())
                .then(data => {
                    cachedUniversities = data;
                    setUniversities(data);
                })
                .catch(err => console.error("Error loading universities:", err));
        }
    }, []);

    // Reset state when opening/closing
    useEffect(() => {
        if (isOpen) {
            setSelectedType('mobility');
            setDetails({ program: 'Erasmus+' });
            setMobileView('menu');
        }
    }, [isOpen]);

    const handleTabChange = (type: ExpType) => {
        setSelectedType(type);
        setDetails(type === 'mobility' ? { program: 'Erasmus+' } : {});
        setMobileView('content');
    };

    const handleAdd = () => {
        addExperienceNode(selectedType, details);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" fullScreenOnMobile className="bg-[#0F172A]/80 border-white/10 shadow-2xl backdrop-blur-3xl backdrop-saturate-150">
            <Modal.Layout>
                {/* SIDEBAR */}
                <Modal.Sidebar className={mobileView === 'menu' ? 'flex flex-1 md:flex-none !w-full md:!w-72' : 'hidden md:flex'}>
                    <Modal.Header>
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            {t('planner.roadmapExperienceSelector.addBlock', 'Afegir Bloc')}
                        </h2>
                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t('planner.roadmapExperienceSelector.configureSubtitle', 'Configura estades, pràctiques o projectes per al teu roadmap.')}</p>
                    </Modal.Header>

                    <div className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                        <SidebarItem
                            icon={Globe}
                            title={t('planner.roadmapExperienceSelector.mobility', 'Mobilitat')}
                            subtitle={t('planner.roadmapExperienceSelector.internationalStays', 'Estades Internacionals')}
                            active={selectedType === 'mobility'}
                            onClick={() => handleTabChange('mobility')}
                            colorClass="bg-amber-500/10 text-amber-400"
                        />
                        <SidebarItem
                            icon={Briefcase}
                            title={t('planner.roadmapExperienceSelector.internship', 'Pràctiques')}
                            subtitle={t('planner.roadmapExperienceSelector.companyExperience', 'Experiència en Empresa')}
                            active={selectedType === 'internship'}
                            onClick={() => handleTabChange('internship')}
                            colorClass="bg-teal-500/10 text-teal-400"
                        />
                    </div>
                </Modal.Sidebar>

                {/* CONTENT (Detail) */}
                <div className={`flex-1 flex-col relative bg-transparent overflow-hidden ${mobileView === 'content' ? 'flex' : 'hidden md:flex'}`}>
                    {/* Dynamic Content Area */}
                    <Modal.Body className="p-8 sm:p-12">
                        {/* Mobile Back Button */}
                        <button type="button" onClick={() => setMobileView('menu')} className="md:hidden self-start mb-6 flex items-center gap-2 text-white font-bold hover:text-slate-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            {t('common.back', 'Tornar')}
                        </button>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedType}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-xl mx-auto flex flex-col w-full"
                            >

                                {selectedType === 'mobility' && (
                                    <>
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">{t('planner.roadmapExperienceSelector.internationalStayTitle', 'Estada internacional')}</h3>
                                            <p className="text-slate-400 text-sm">{t('planner.roadmapExperienceSelector.internationalStayDesc', 'Afegeix el teu intercanvi Erasmus+, SICUE o altres programes internacionals.')}</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <PremiumCombobox
                                                    label={t('planner.roadmapExperienceSelector.universityDest', 'Universitat / Destí')}
                                                    placeholder={t('planner.roadmapExperienceSelector.searchPlaceholder', 'Cerca per nom o país...')}
                                                    options={universities}
                                                    value={details.destination || ''}
                                                    onChange={(val: string, program?: string) => {
                                                        setDetails({
                                                            ...details,
                                                            destination: val,
                                                            ...(program ? { program } : {})
                                                        });
                                                    }}
                                                />
                                                {(() => {
                                                    const selectedUni = universities.find(u => u.name === details.destination);
                                                    if (!selectedUni || (!selectedUni.webLink && !selectedUni.docLink)) return null;
                                                    return (
                                                        <div className="flex gap-4 mt-3 ml-1">
                                                            {selectedUni.webLink && (
                                                                <a href={selectedUni.webLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1.5 font-bold transition-colors">
                                                                    <ExternalLink size={12} /> {t('planner.roadmapExperienceSelector.officialWeb', 'Lloc Web Oficial')}
                                                                </a>
                                                            )}
                                                            {selectedUni.docLink && (
                                                                <a href={selectedUni.docLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1.5 font-bold transition-colors">
                                                                    <ExternalLink size={12} /> {t('planner.roadmapExperienceSelector.downloadDoc', 'Descarrega Documentació')}
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <PremiumSelect
                                                    label={t('planner.roadmapExperienceSelector.program', 'Programa')}
                                                    options={['Erasmus+', 'SICUE', 'Amèrica Llatina', 'UNITECH', 'Doble Titulació', "Mobilitat fora d'Europa"]}
                                                    value={details.program || 'Erasmus+'}
                                                    onChange={(e) => setDetails({ ...details, program: e.target.value })}
                                                />
                                                <PremiumInput
                                                    label={t('planner.roadmapExperienceSelector.creditsEcts', 'Crèdits (ECTS)')}
                                                    type="number"
                                                    placeholder="30"
                                                    value={details.credits || ''}
                                                    onChange={(e) => setDetails({ ...details, credits: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedType === 'internship' && (
                                    <>
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">{t('planner.roadmapExperienceSelector.internshipTitle', 'Pràctiques empresa')}</h3>
                                            <p className="text-slate-400 text-sm">{t('planner.roadmapExperienceSelector.internshipDesc', 'Afegeix pràctiques curriculars o extracurriculars al teu expedient.')}</p>
                                        </div>

                                        <div className="space-y-6">
                                            <PremiumInput
                                                label={t('planner.roadmapExperienceSelector.company', 'Empresa')}
                                                placeholder={t('planner.roadmapExperienceSelector.companyPlaceholder', 'Ex: Google, inLab FIB, etc.')}
                                                value={details.company || ''}
                                                onChange={(e) => setDetails({ ...details, company: e.target.value })}
                                            />

                                            <PremiumInput
                                                label={t('planner.roadmapExperienceSelector.role', 'Rol / Posició')}
                                                placeholder={t('planner.roadmapExperienceSelector.rolePlaceholder', 'Ex: Software Engineer Intern')}
                                                value={details.role || ''}
                                                onChange={(e) => setDetails({ ...details, role: e.target.value })}
                                            />

                                            <PremiumInput
                                                label={t('planner.roadmapExperienceSelector.recognitionCredits', 'Crèdits Reconeixement (ECTS)')}
                                                type="number"
                                                placeholder="12"
                                                value={details.credits || ''}
                                                onChange={(e) => setDetails({ ...details, credits: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Action Button Footer */}
                                <div className="pt-8 flex justify-end w-full">
                                    <button type="button"
                                        onClick={handleAdd}
                                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <span>{t('planner.roadmapExperienceSelector.addToRoadmap', 'Afegeix al Roadmap')}</span>
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />

                                        {/* Button Glow */}
                                        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </Modal.Body>
                </div>
            </Modal.Layout>
        </Modal>
    );
};

export default ExperienceSelectorModal;
