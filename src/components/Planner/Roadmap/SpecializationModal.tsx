import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../../ui/Modal';
import { specializations, type SpecializationData } from '../../../data/curriculum';
import { Briefcase, BookOpen, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SpecializationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSpecId: string | null;
    onSelect: (id: string) => void;
}

const themeColorMap = {
    indigo: {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]',
        gradient: 'from-indigo-500/20 to-transparent',
        dot: 'bg-indigo-500',
    },
    emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        gradient: 'from-emerald-500/20 to-transparent',
        dot: 'bg-emerald-500',
    },
    sky: {
        bg: 'bg-sky-500/10',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
        shadow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
        gradient: 'from-sky-500/20 to-transparent',
        dot: 'bg-sky-500',
    },
    amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        gradient: 'from-amber-500/20 to-transparent',
        dot: 'bg-amber-500',
    },
    rose: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
        gradient: 'from-rose-500/20 to-transparent',
        dot: 'bg-rose-500',
    }
};

export const SpecializationModal: React.FC<SpecializationModalProps> = ({ isOpen, onClose, currentSpecId, onSelect }) => {
    const { t } = useTranslation();
    const [previewSpecId, setPreviewSpecId] = useState<string | null>(null);

    const activeSpecId = previewSpecId || currentSpecId || specializations[0].id;
    const activeSpec = specializations.find(s => s.id === activeSpecId) as SpecializationData;
    
    const theme = themeColorMap[activeSpec.themeColor];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            overlayVariant="transparent"
            className="bg-[var(--glass-bg-darker)] border border-[var(--glass-border)] shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-3xl backdrop-saturate-150"
            hideCloseButton
        >
            <div className="flex flex-col md:flex-row flex-1 w-full h-full min-h-[500px] md:min-h-[600px] relative overflow-hidden">
                
                {/* Dynamic Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50 transition-colors duration-500 pointer-events-none`} />

                {/* Left Column: List */}
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col z-10 bg-[#020617]/40 overflow-y-auto custom-scrollbar min-h-0">
                    <div className="mb-6 shrink-0">
                        <h3 className="text-2xl font-bold text-white mb-2">{t('planner.roadmapSpecialization.specializationsTitle', 'Mencions')}</h3>
                        <p className="text-sm text-slate-400">{t('planner.roadmapSpecialization.chooseYourPath', 'Tria el teu camí cap a l\'excel·lència professional.')}</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 relative min-h-0">
                        {specializations.map(spec => {
                            const isSelected = currentSpecId === spec.id;
                            const isPreviewed = activeSpecId === spec.id;
                            const specTheme = themeColorMap[spec.themeColor];

                            return (
                                <div 
                                    key={spec.id}
                                    className="relative shrink-0"
                                >
                                    {/* Preview / Select Highlight Background */}
                                    {isPreviewed && (
                                        <motion.div
                                            layoutId="activeSpecBackground"
                                            className={`absolute inset-0 rounded-2xl ${specTheme.bg} ${specTheme.border} border`}
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    <button
                                        onClick={() => setPreviewSpecId(spec.id)}
                                        className="w-full relative z-10 text-left px-5 py-4 text-base font-medium rounded-2xl transition-colors flex items-center gap-4 group hover:bg-white/5"
                                    >
                                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isPreviewed ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                                        <span className={`transition-colors duration-300 ${isSelected ? 'text-white font-bold' : isPreviewed ? 'text-slate-200' : 'text-slate-400'}`}>
                                            {spec.name}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Details View */}
                <div className="w-full md:w-2/3 py-6 md:py-8 pr-6 md:pr-8 pl-4 md:pl-6 flex flex-col z-10 relative min-h-0 h-full">
                    
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pl-2 pr-2 md:pr-4 mb-4 min-h-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSpec.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className="text-3xl font-black text-white tracking-tight">{activeSpec.name}</h2>
                                </div>

                                <p className="text-base text-slate-300 leading-relaxed mb-6">
                                    {activeSpec.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Why Choose */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4 opacity-80">
                                        <Star size={16} className={theme.text} />
                                        {t('planner.roadmapSpecialization.whyChooseIt', 'Per què triar-la?')}
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {activeSpec.whyChoose}
                                    </p>
                                </div>

                                {/* Mandatory Subjects */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4 opacity-80">
                                        <BookOpen size={16} className={theme.text} />
                                        {t('planner.roadmapSpecialization.mandatory', 'Obligatòries')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeSpec.mandatory.map(sub => (
                                            <span key={sub} className="px-2.5 py-1 text-xs font-bold bg-white/5 border border-white/10 text-slate-300 rounded-lg shadow-sm">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Roles & Benefits */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4 opacity-80">
                                        <Briefcase size={16} className={theme.text} />
                                        {t('planner.roadmapSpecialization.careerPaths', 'Sortides Professionals')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {activeSpec.roles.map(role => (
                                            <li key={role} className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} shadow-[0_0_8px_currentColor] ${theme.text}`} />
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4 opacity-80">
                                        <Star size={16} className={theme.text} />
                                        {t('planner.roadmapSpecialization.keyBenefits', 'Beneficis Clau')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {activeSpec.benefits.map(benefit => (
                                            <li key={benefit} className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} shadow-[0_0_8px_currentColor] ${theme.text}`} />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    </div>

                    {/* Fixed Action Button */}
                    <div className="pt-4 border-t border-white/10 flex justify-end shrink-0 pl-2">
                        <button
                            onClick={() => {
                                onSelect(activeSpec.id);
                                onClose();
                            }}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${currentSpecId === activeSpec.id ? 'bg-white/10 text-white cursor-default opacity-50' : `bg-white text-black hover:scale-105 active:scale-95 ${theme.shadow}`}`}
                            disabled={currentSpecId === activeSpec.id}
                        >
                            {currentSpecId === activeSpec.id ? t('planner.roadmapSpecialization.alreadySelected', 'Ja Seleccionada') : t('planner.roadmapSpecialization.selectSpecialization', 'Seleccionar Especialitat')}
                            {currentSpecId !== activeSpec.id && <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );
};
