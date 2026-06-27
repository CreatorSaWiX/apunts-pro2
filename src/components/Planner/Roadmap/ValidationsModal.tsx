import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../../ui/Modal';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { CFGS_DEGREES } from '../../../data/cfgs';
import { GraduationCap, Sparkles, BookOpen, Layers, Plus, ArrowRight } from 'lucide-react';

interface ValidationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'cfgs' | 'custom';

const FIB_ACTIVITIES = [
    { name: "Seminaris d'Empresa", credits: 1 },
    { name: "Programa Talent", credits: 2 },
    { name: "Emprenedoria FIB-Esade", credits: 2 },
    { name: "Delegat d'assignatura", credits: 1 },
    { name: "Projecte ECTS", credits: 1 }
];

export const ValidationsModal: React.FC<ValidationsModalProps> = ({ isOpen, onClose }) => {
    const { nodes, addCFGSValidations, addCustomValidation } = useRoadmap();
    const [activeTab, setActiveTab] = useState<Tab>('cfgs');
    
    // Determinar quin CFGS està aplicat actualment mirant els nodes
    const currentAppliedCFGSId = useMemo(() => {
        const cfgsNode = nodes.find(n => n.id.startsWith('CFGS_'));
        if (cfgsNode) {
            const match = CFGS_DEGREES.find(c => cfgsNode.data.description === `Convalidació de CFGS: ${c.title}`);
            return match ? match.id : null;
        }
        return null;
    }, [nodes]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customName, setCustomName] = useState('');
    const [customCredits, setCustomCredits] = useState<number | ''>('');

    // Auto-seleccionar el CFGS actual en obrir el modal
    React.useEffect(() => {
        if (isOpen) {
            if (activeTab === 'cfgs' && currentAppliedCFGSId && !selectedId) {
                setSelectedId(currentAppliedCFGSId);
            }
        } else {
            // Reset state when closed
            setSelectedId(null);
            setActiveTab('cfgs');
            setCustomName('');
            setCustomCredits('');
        }
    }, [isOpen, currentAppliedCFGSId]);

    const handleApplyCFGS = () => {
        if (selectedId && selectedId !== currentAppliedCFGSId) {
            addCFGSValidations(selectedId);
            onClose();
        }
    };

    const handleApplyCustom = () => {
        if (customName && customCredits) {
            addCustomValidation(customName, Number(customCredits));
            onClose();
        }
    };

    const selectedCFGS = useMemo(() => CFGS_DEGREES.find(c => c.id === selectedId), [selectedId]);
    const totalCFGSCredits = selectedCFGS 
        ? selectedCFGS.modules.reduce((acc, curr) => acc + curr.credits, 0) 
        : 0;

    const isCurrentlyApplied = activeTab === 'cfgs' && selectedId === currentAppliedCFGSId;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            overlayVariant="transparent"
            className="bg-[var(--glass-bg-darker)] border border-[var(--glass-border)] shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-3xl backdrop-saturate-150"
            hideCloseButton
        >
            <div className="flex flex-col md:flex-row flex-1 w-full h-full min-h-[600px] md:h-[75vh] relative overflow-hidden">
                
                {/* No background gradient to match ExperienceSelectorModal */}

                {/* Left Column: Sidebar List */}
                <div className="w-full md:w-[360px] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col z-10 bg-[#020617]/40 overflow-y-auto custom-scrollbar min-h-0 shrink-0">
                    <div className="mb-8 shrink-0">
                        <h3 className="text-2xl font-bold text-white mb-2">Convalidacions</h3>
                        <p className="text-sm text-slate-400">Afegeix crèdits a la teva motxilla a través de cicles formatius o activitats extraescolars.</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 relative min-h-0">
                        
                        {/* Custom Activities Tab */}
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 pl-2">Altres Activitats</h4>
                            <div className="relative shrink-0">
                                {activeTab === 'custom' && (
                                    <motion.div
                                        layoutId="active-sidebar-pill"
                                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full z-20"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <button
                                    onClick={() => setActiveTab('custom')}
                                    className={`w-full relative z-10 text-left px-5 py-4 text-base font-medium rounded-2xl transition-colors flex items-center gap-4 group ${activeTab === 'custom' ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${activeTab === 'custom' ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                                    <div className="flex flex-col min-w-0">
                                        <span className={`transition-colors duration-300 font-bold ${activeTab === 'custom' ? 'text-white' : 'text-slate-400'}`}>
                                            Activitats Universitàries
                                        </span>
                                        <span className="text-xs text-slate-500 truncate mt-0.5">Game Jams, Esports, Idiomes</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* CFGS List */}
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 pl-2">Cicles Formatius (CFGS)</h4>
                            <div className="flex flex-col gap-2">
                                {CFGS_DEGREES.map(cfgs => {
                                    const isSelected = activeTab === 'cfgs' && selectedId === cfgs.id;
                                    const isApplied = currentAppliedCFGSId === cfgs.id;
                                    const totalCredits = cfgs.modules.reduce((acc, curr) => acc + curr.credits, 0);

                                    return (
                                        <div key={cfgs.id} className="relative shrink-0">
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="active-sidebar-pill"
                                                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full z-20"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <button
                                                onClick={() => { setActiveTab('cfgs'); setSelectedId(cfgs.id); }}
                                                className={`w-full relative z-10 text-left px-5 py-4 text-base font-medium rounded-2xl transition-colors flex items-center gap-4 group pr-4 ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${isSelected ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                                                <div className="flex flex-col min-w-0 flex-1 gap-1">
                                                    <span className={`transition-colors duration-300 font-bold line-clamp-2 text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                        {cfgs.title.split(' (')[0]}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-500 font-bold border border-white/10 px-1.5 py-[1px] rounded uppercase">
                                                            {cfgs.title.includes('LOE') ? 'LOE' : 'LOGSE'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-bold">
                                                            {totalCredits} ECTS
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="flex-1 py-6 md:py-8 pr-6 md:pr-8 pl-4 md:pl-8 flex flex-col z-10 relative min-h-0 h-full">
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 min-h-0">
                        <AnimatePresence mode="wait">
                            {activeTab === 'cfgs' && selectedId && selectedCFGS ? (
                                <motion.div
                                    key={`cfgs-${selectedId}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">{selectedCFGS.title}</h2>
                                        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                                            En aplicar aquesta convalidació, les següents assignatures s'afegiran directament al teu expedient. Es substituirà qualsevol CFGS que ja tinguessis convalidat prèviament.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8 shrink-0 max-w-sm">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Crèdits Obtinguts</div>
                                            <div className="text-2xl font-black text-white">+{totalCFGSCredits} <span className="text-sm text-white/50">ECTS</span></div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mòduls Reconeixements</div>
                                            <div className="text-2xl font-black text-white">{selectedCFGS.modules.length}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-80">
                                            <Layers size={14} className="text-white/70" />
                                            Assignatures Convalidades
                                        </h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-4">
                                            {selectedCFGS.modules.map((mod, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                                                    <span className="text-sm font-bold text-slate-200">{mod.name}</span>
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                                                        <BookOpen size={12} /> {mod.credits} ECTS
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : activeTab === 'custom' ? (
                                <motion.div
                                    key="custom"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-black text-white tracking-tight mb-4">Activitats Universitàries</h2>
                                        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
                                            Afegeix manualment els crèdits reconeguts per activitats extracadèmiques com l'esport, idiomes o representació estudiantil. Aquests s'afegiran com a optatives superades.
                                        </p>
                                        <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/30">
                                                <Sparkles size={14} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Límit Recomanat</div>
                                                <div className="text-sm font-bold text-white">6 ECTS màxim per l'itinerari</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Suggeriments Oficials FIB</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {FIB_ACTIVITIES.map((act, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            setCustomName(act.name);
                                                            setCustomCredits(act.credits);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-xs font-medium text-slate-300 transition-colors flex items-center gap-2"
                                                    >
                                                        {act.name}
                                                        <span className="text-[10px] text-slate-500 bg-black/40 px-1.5 rounded">{act.credits} cr</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nom de l'activitat</label>
                                                <input 
                                                    type="text"
                                                    value={customName}
                                                    onChange={(e) => setCustomName(e.target.value)}
                                                    placeholder="Ex: Delegat d'assignatura"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crèdits ECTS</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number"
                                                        min="0.5"
                                                        step="0.5"
                                                        value={customCredits}
                                                        onChange={(e) => setCustomCredits(e.target.value ? Number(e.target.value) : '')}
                                                        placeholder="2"
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold pointer-events-none">
                                                        ECTS
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center h-full"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                        <GraduationCap size={24} className="text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Selecciona un cicle</h3>
                                    <p className="text-sm text-slate-400 max-w-xs">
                                        Tria un Cicle Formatiu per veure quines assignatures se't convalidaran automàticament.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    {(activeTab === 'cfgs' && selectedId) || (activeTab === 'custom') ? (
                        <div className="pt-4 border-t border-white/10 flex justify-end shrink-0 pl-2">
                            <button
                                onClick={activeTab === 'cfgs' ? handleApplyCFGS : handleApplyCustom}
                                disabled={(activeTab === 'custom' && (!customName || !customCredits)) || isCurrentlyApplied}
                                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all disabled:cursor-not-allowed ${isCurrentlyApplied ? 'bg-white/10 text-white opacity-50 shadow-none' : 'bg-white text-black hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                            >
                                {activeTab === 'cfgs' ? (isCurrentlyApplied ? 'Ja Seleccionada' : `Aplicar ${totalCFGSCredits} ECTS`) : "Afegir a l'expedient"}
                                {!isCurrentlyApplied && (activeTab === 'custom' ? <Plus size={18} /> : <ArrowRight size={18} />)}
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </Modal>
    );
};

export default ValidationsModal;
