import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Briefcase, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import Modal from '../../ui/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type ExpType = 'mobility' | 'internship';

const SidebarItem = ({ 
    icon: Icon, 
    title, 
    subtitle,
    active, 
    onClick,
    colorClass
}: { 
    icon: any, 
    title: string, 
    subtitle: string,
    active: boolean, 
    onClick: () => void,
    colorClass: string
}) => {
    return (
        <button 
            onClick={onClick}
            className={`relative w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 group overflow-hidden
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

const PremiumInput = ({ label, type = "text", value, onChange, placeholder, helpLink }: any) => {
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
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-medium"
                />
            </div>
        </div>
    );
};

const PremiumSelect = ({ label, value, onChange, options = [], helpLink }: any) => {
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
                    className="w-full text-left bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-medium flex justify-between items-center"
                >
                    {value}
                    <ChevronRight size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay per tancar el desplegable en fer clic fora */}
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



const PremiumCombobox = ({ label, value, onChange, placeholder, options }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter options based on query
    const filteredOptions = options.filter((opt: any) => 
        opt.name.toLowerCase().includes(query.toLowerCase()) || 
        opt.country.toLowerCase().includes(query.toLowerCase())
    );

    // Selected option object
    const selectedOption = options.find((opt: any) => opt.name === value);

    // Close when clicking outside
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
                    className={`w-full bg-slate-900/50 border ${isOpen ? 'border-sky-500/50 ring-1 ring-sky-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white flex items-center gap-3 transition-all font-medium cursor-text`}
                    onClick={() => setIsOpen(true)}
                >
                    <Search size={16} className={isOpen ? 'text-sky-400' : 'text-slate-500'} />
                    <input
                        type="text"
                        value={isOpen ? query : (value || '')}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                            // Permetem escriptura lliure per si no hi és a la llista
                            if (!isOpen) onChange(e.target.value); 
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className="bg-transparent border-none outline-none w-full placeholder:text-slate-600"
                    />
                    {value && !isOpen && selectedOption?.flag && (
                         <div className="flex items-center gap-2 shrink-0">
                             <span className="text-lg">{selectedOption.flag}</span>
                         </div>
                    )}
                </div>
                
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 w-full mt-2 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex flex-col p-1">
                                {filteredOptions.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-slate-500 text-center font-medium">Cap resultat trobat</div>
                                ) : (
                                    filteredOptions.map((opt: any) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.name, opt.program);
                                                setQuery('');
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 text-sm transition-all rounded-lg flex items-center justify-between group/item
                                                ${value === opt.name ? 'bg-sky-500/10 text-sky-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{opt.flag}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{opt.name}</span>
                                                    <span className={`text-[10px] ${value === opt.name ? 'text-sky-500/70' : 'text-slate-500'} group-hover/item:text-slate-400 transition-colors`}>{opt.country}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] px-2 py-1 rounded-md uppercase tracking-wider font-bold shrink-0
                                                ${opt.program.includes('Erasmus') ? 'bg-blue-500/10 text-blue-400' : 
                                                  opt.program.includes('Amèrica') ? 'bg-orange-500/10 text-orange-400' : 
                                                  'bg-purple-500/10 text-purple-400'}`}
                                            >
                                                {opt.program}
                                            </span>
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


const ExperienceSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { addExperienceNode } = useRoadmap();
    const [selectedType, setSelectedType] = useState<ExpType>('mobility');
    const [details, setDetails] = useState<any>({});
    const [universities, setUniversities] = useState<any[]>([]);

    useEffect(() => {
        fetch('/data/universities.json')
            .then(res => res.json())
            .then(data => setUniversities(data))
            .catch(err => console.error("Error loading universities:", err));
    }, []);

    // Reset state when opening/closing
    useEffect(() => {
        if (isOpen) {
            setSelectedType('mobility');
            setDetails({ program: 'Erasmus+' });
        }
    }, [isOpen]);

    const handleTabChange = (type: ExpType) => {
        setSelectedType(type);
        setDetails(type === 'mobility' ? { program: 'Erasmus+' } : {});
    };

    const handleAdd = () => {
        addExperienceNode(selectedType, details);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" overlayVariant="transparent">
            <Modal.Layout>
                {/* SIDEBAR */}
                <Modal.Sidebar>
                    <Modal.Header>
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            Afegir Bloc
                        </h2>
                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Configura estades, pràctiques o projectes per al teu roadmap.</p>
                    </Modal.Header>
                    
                    <div className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                <SidebarItem 
                                    icon={Globe} 
                                    title="Mobilitat" 
                                    subtitle="Estades Internacionals"
                                    active={selectedType === 'mobility'} 
                                    onClick={() => handleTabChange('mobility')} 
                                    colorClass="bg-amber-500/10 text-amber-400"
                                />
                                <SidebarItem 
                                    icon={Briefcase} 
                                    title="Pràctiques" 
                                    subtitle="Experiència en Empresa"
                                    active={selectedType === 'internship'} 
                                    onClick={() => handleTabChange('internship')} 
                                    colorClass="bg-teal-500/10 text-teal-400"
                                />
                        </div>
                </Modal.Sidebar>

                {/* CONTENT (Detail) */}
                <div className="flex-1 flex flex-col relative bg-transparent overflow-hidden">
                    {/* Dynamic Content Area */}
                    <Modal.Body className="p-8 sm:p-12">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedType}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-xl mx-auto h-full flex flex-col"
                                    >
                                        
                                        {selectedType === 'mobility' && (
                                            <>
                                                <div className="mb-10">
                                                    <h3 className="text-3xl font-black text-white tracking-tight mb-2">Estada internacional</h3>
                                                    <p className="text-slate-400 text-sm">Afegeix el teu intercanvi Erasmus+, SICUE o altres programes internacionals.</p>
                                                </div>

                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <PremiumCombobox
                                                            label="Universitat / Destí"
                                                            placeholder="Cerca per nom o país..."
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
                                                                            <ExternalLink size={12} /> Lloc Web Oficial
                                                                        </a>
                                                                    )}
                                                                    {selectedUni.docLink && (
                                                                        <a href={selectedUni.docLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1.5 font-bold transition-colors">
                                                                            <ExternalLink size={12} /> Descarrega Documentació
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <PremiumSelect 
                                                            label="Programa" 
                                                            options={['Erasmus+', 'SICUE', 'Amèrica Llatina', 'UNITECH', 'Doble Titulació', "Mobilitat fora d'Europa"]}
                                                            value={details.program || 'Erasmus+'}
                                                            onChange={(e: any) => setDetails({...details, program: e.target.value})}
                                                        />
                                                        <PremiumInput 
                                                            label="Crèdits (ECTS)" 
                                                            type="number"
                                                            placeholder="30"
                                                            value={details.credits || ''}
                                                            onChange={(e: any) => setDetails({...details, credits: parseInt(e.target.value) || 0})}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {selectedType === 'internship' && (
                                            <>
                                                <div className="mb-10">
                                                    <h3 className="text-3xl font-black text-white tracking-tight mb-2">Pràctiques empresa</h3>
                                                    <p className="text-slate-400 text-sm">Afegeix pràctiques curriculars o extracurriculars al teu expedient.</p>
                                                </div>

                                                <div className="space-y-6 flex-1">
                                                    <PremiumInput 
                                                        label="Empresa" 
                                                        placeholder="Ex: Google, inLab FIB, etc."
                                                        value={details.company || ''}
                                                        onChange={(e: any) => setDetails({...details, company: e.target.value})}
                                                    />
                                                    
                                                    <PremiumInput 
                                                        label="Rol / Posició" 
                                                        placeholder="Ex: Software Engineer Intern"
                                                        value={details.role || ''}
                                                        onChange={(e: any) => setDetails({...details, role: e.target.value})}
                                                    />

                                                    <PremiumInput 
                                                        label="Crèdits Reconeixement (ECTS)" 
                                                        type="number"
                                                        placeholder="12"
                                                        value={details.credits || ''}
                                                        onChange={(e: any) => setDetails({...details, credits: parseInt(e.target.value) || 0})}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Action Button Footer */}
                                        <div className="pt-8 mt-auto flex justify-end">
                                            <button 
                                                onClick={handleAdd}
                                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <span>Afegeix al Roadmap</span>
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
