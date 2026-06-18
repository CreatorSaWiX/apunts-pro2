import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle, RefreshCw, X } from 'lucide-react';
import type { SubjectNodeData, SubjectStatus } from '../../../contexts/RoadmapContext';
import { useRoadmap } from '../../../contexts/RoadmapContext';

interface SubjectContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    nodeId: string | null;
    nodeData: SubjectNodeData | null;
    position: { x: number; y: number } | null;
}

const SubjectContextMenu: React.FC<SubjectContextMenuProps> = ({ isOpen, onClose, nodeId, nodeData, position }) => {
    const { updateNodeStatus } = useRoadmap();

    if (!isOpen || !nodeId || !nodeData || !position) return null;

    const handleStatusChange = (status: SubjectStatus) => {
        updateNodeStatus(nodeId, status);
        onClose(); // Auto-close context menu after selection
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
                            <h3 className="text-white font-bold tracking-tight leading-tight mb-1 pr-6">{nodeData.label}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">{nodeId}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-medium tracking-wider">{nodeData.credits} ECTS</span>
                            </div>
                            <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-1 relative z-10 px-1 pb-1">
                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('in_progress')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                    ${nodeData.status === 'in_progress' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {nodeData.status === 'in_progress' && <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 -translate-x-full animate-[shimmer_2s_infinite]" />}
                                <Clock size={16} className={nodeData.status === 'in_progress' ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'} />
                                <span className="relative z-10">En Curs</span>
                            </button>

                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('passed')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                    ${nodeData.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <CheckCircle size={16} className={nodeData.status === 'passed' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'} />
                                <span className="relative z-10">Aprovada</span>
                            </button>

                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('failed')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all group overflow-hidden relative
                                    ${nodeData.status === 'failed' ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <XCircle size={16} className={nodeData.status === 'failed' ? 'text-red-400' : 'text-slate-400 group-hover:text-red-400'} />
                                <span className="relative z-10">Suspesa</span>
                            </button>

                            {nodeData.status === 'failed' && (
                                <motion.button 
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                    onClick={() => handleStatusChange('retaking')}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm hover:bg-amber-500 text-amber-500 hover:text-amber-950 transition-all border border-amber-500/30 font-bold group shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                                >
                                    <RefreshCw size={14} className="group-hover:animate-spin-slow" />
                                    Tornar a matricular
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SubjectContextMenu;
