import React from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle, RefreshCw, X, BookOpen, Edit2, Trash2, Globe, Building2, Briefcase } from 'lucide-react';
import type { SubjectNodeData, SubjectStatus } from '../../../contexts/RoadmapContext';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { useTranslation } from 'react-i18next';

interface SubjectContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    nodeId: string | null;
    nodeData: SubjectNodeData | null;
    position: { x: number; y: number } | null;
    onOpenDetails?: () => void;
}

const SubjectContextMenu: React.FC<SubjectContextMenuProps> = ({ isOpen, onClose, nodeId, nodeData, position, onOpenDetails }) => {
    const { t } = useTranslation();
    const { updateNodeStatus, updateNodeGrade, removeNode } = useRoadmap();

    if (!isOpen || !nodeId || !nodeData || !position) return null;

    const getBadgeInfo = () => {
        if (nodeData.type === 'mobility') return { text: t('planner.roadmapSubjectContextMenu.badgeMobility', 'MOBILITAT'), color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
        if (nodeData.type === 'internship') return { text: t('planner.roadmapSubjectContextMenu.badgeInternship', 'PRÀCTIQUES'), color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
        if (nodeData.type === 'tfg') return { text: t('planner.roadmapSubjectContextMenu.badgeTfg', 'TFG'), color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
        if (nodeData.type === 'tfm') return { text: t('planner.roadmapSubjectContextMenu.badgeTfm', 'TFM'), color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
        if (nodeData.type === 'specialization') return { text: nodeId, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' };
        if (nodeData.type === 'optional') return { text: nodeId, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
        return { text: nodeId, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
    };
    const badge = getBadgeInfo();

    const handleStatusChange = (status: SubjectStatus) => {
        updateNodeStatus(nodeId, status);
        if (status !== 'passed') {
            onClose(); // Auto-close context menu after selection unless they need to input a grade
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible backdrop just to catch clicks outside */}
                    <div
                        className="fixed inset-0 z-[100]"
                        onClick={onClose}
                        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
                    />

                    {/* Popover */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{ left: position.x, top: position.y }}
                        className="fixed z-[110] w-64 bg-slate-900/80 border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] p-2 backdrop-blur-2xl overflow-hidden"
                    >
                        {/* Glow Behind */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-500/20 rounded-full blur-[40px] pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-[40px] pointer-events-none" />

                        <div className="px-4 pt-3 pb-4 border-b border-white/5 mb-2 relative z-10">
                            <h3 className="text-white font-black tracking-tight leading-tight mb-1 pr-6">{nodeData.label}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${badge.color}`}>
                                    {badge.text}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-bold tracking-wider border border-white/5">
                                    {nodeData.credits} ECTS
                                </span>
                            </div>
                            <button type="button" aria-label={t('common.close', 'Tancar')} onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10">
                                <X size={12} />
                            </button>
                        </div>

                        <div className="space-y-1 relative z-10 px-1 pb-1">
                            {['mobility', 'internship'].includes(nodeData.type) && (
                                <div className="px-3 py-2 mb-2 border-b border-white/5 flex flex-col gap-4">
                                    {nodeData.type === 'mobility' && (
                                        <>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Globe size={12} /> {t('planner.roadmapSubjectContextMenu.destination', 'Destí')}</span>
                                                <span className="text-sm text-white">{nodeData.details?.destination || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><BookOpen size={12} /> {t('planner.roadmapSubjectContextMenu.program', 'Programa')}</span>
                                                <span className="text-sm text-white">{nodeData.details?.program || '-'}</span>
                                            </div>
                                        </>
                                    )}
                                    {nodeData.type === 'internship' && (
                                        <>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Building2 size={12} /> {t('planner.roadmapSubjectContextMenu.company', 'Empresa')}</span>
                                                <span className="text-sm text-white">{nodeData.details?.company || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={12} /> {t('planner.roadmapSubjectContextMenu.role', 'Rol')}</span>
                                                <span className="text-sm text-white">{nodeData.details?.role || '-'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {!['mobility', 'internship', 'tfg', 'tfm'].includes(nodeData.type) && (
                                <button type="button"
                                    onClick={() => {
                                        if (onOpenDetails) onOpenDetails();
                                        onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative hover:bg-white/5 text-slate-300 hover:text-white border border-transparent`}
                                >
                                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                                        <BookOpen size={14} />
                                    </div>
                                    <span className="relative z-10">{t('planner.roadmapSubjectContextMenu.information', 'Informació')}</span>
                                </button>
                            )}

                            <button type="button"
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('in_progress')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                            ${nodeData.status === 'in_progress' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                            ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                            >
                                {nodeData.status === 'in_progress' && <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 -translate-x-full animate-[shimmer_2s_infinite]" />}
                                <Clock size={16} className={nodeData.status === 'in_progress' ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'} />
                                <span className="relative z-10">{t('planner.roadmapSubjectContextMenu.inProgress', 'En Curs')}</span>
                            </button>

                            <button type="button"
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('passed')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                            ${nodeData.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                            ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                            >
                                <CheckCircle size={16} className={nodeData.status === 'passed' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'} />
                                <span className="relative z-10">
                                    {['mobility', 'internship'].includes(nodeData.type) ? t('planner.roadmapSubjectContextMenu.recognized', 'Reconeguda') : t('planner.roadmapSubjectContextMenu.passed', 'Aprovada')}
                                </span>
                            </button>

                            <AnimatePresence>
                                {nodeData.status === 'passed' && !['mobility', 'internship'].includes(nodeData.type) && (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="w-full flex flex-col gap-2 pt-3 pb-1 border-t border-white/5 overflow-hidden mt-2"
                                    >
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('planner.roadmapSubjectContextMenu.finalGrade', 'Nota Final')}</span>
                                            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                {nodeData.grade !== null && nodeData.grade !== undefined ? nodeData.grade.toFixed(1) : '-.--'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5 mt-1">
                                            {[5.0, 7.0, 9.0, 10.0].map(g => (
                                                <button type="button"
                                                    key={g}
                                                    onClick={() => updateNodeGrade(nodeId, g)}
                                                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${nodeData.grade === g ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-black/40 text-slate-300 border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                                >
                                                    {g.toFixed(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center mt-1 relative">
                                            <input
                                                type="number"
                                                min="5" max="10" step="0.1"
                                                placeholder={t('planner.roadmapSubjectContextMenu.exactGradePlaceholder', 'Nota exacta (ex: 8.4)')}
                                                value={nodeData.grade || ''}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    if (!isNaN(val) && val >= 5 && val <= 10) {
                                                        updateNodeGrade(nodeId, val);
                                                    } else if (e.target.value === '') {
                                                        updateNodeGrade(nodeId, null);
                                                    }
                                                }}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            {/* Small icon indicator inside input */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-slate-400">
                                                <Edit2 size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!['mobility', 'internship'].includes(nodeData.type) && (
                                <>
                                    <button type="button"
                                        disabled={nodeData.status === 'locked'}
                                        onClick={() => handleStatusChange('failed')}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                                    ${nodeData.status === 'failed' ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                                `}
                                    >
                                        <XCircle size={16} className={nodeData.status === 'failed' ? 'text-red-400' : 'text-slate-400 group-hover:text-red-400'} />
                                        <span className="relative z-10">{t('planner.roadmapSubjectContextMenu.failed', 'Suspesa')}</span>
                                    </button>

                                    {nodeData.status === 'failed' && (
                                        <motion.button
                                            layout
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            onClick={() => handleStatusChange('retaking')}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm hover:bg-amber-500 text-amber-500 hover:text-amber-950 transition-all border border-amber-500/30 font-bold group shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] mt-2"
                                        >
                                            <RefreshCw size={14} className="group-hover:animate-spin-slow" />
                                            {t('planner.roadmapSubjectContextMenu.retake', 'Tornar a matricular')}
                                        </motion.button>
                                    )}
                                </>
                            )}

                            {nodeData.type !== 'obligatory' && nodeData.type !== 'basic' && nodeData.type !== 'tfg' && nodeData.type !== 'tfm' && (
                                <button type="button"
                                    onClick={() => {
                                        removeNode(nodeId);
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative hover:bg-white/5 text-red-400 hover:text-red-300 border border-transparent"
                                >
                                    <Trash2 size={16} className="text-red-400 group-hover:text-red-300" />
                                    <span className="relative z-10">{t('planner.roadmapSubjectContextMenu.delete', 'Eliminar')}</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SubjectContextMenu;
