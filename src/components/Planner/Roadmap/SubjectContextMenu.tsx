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
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        style={{ left: position.x, top: position.y }}
                        className="fixed z-[110] w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl"
                    >
                        <div className="px-3 pt-2 pb-3 border-b border-white/5 mb-2 relative">
                            <h3 className="text-white font-bold tracking-tight">{nodeData.label}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400 font-mono">{nodeId}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300">{nodeData.credits} ECTS</span>
                            </div>
                            <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('in_progress')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                                    ${nodeData.status === 'in_progress' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'hover:bg-white/5 text-slate-300'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <Clock size={16} />
                                En Curs
                            </button>

                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('passed')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                                    ${nodeData.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'hover:bg-white/5 text-slate-300'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <CheckCircle size={16} />
                                Aprovada
                            </button>

                            <button 
                                disabled={nodeData.status === 'locked'}
                                onClick={() => handleStatusChange('failed')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                                    ${nodeData.status === 'failed' ? 'bg-red-500/20 text-red-400 font-medium' : 'hover:bg-white/5 text-slate-300'}
                                    ${nodeData.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <XCircle size={16} />
                                Suspesa
                            </button>

                            {nodeData.status === 'failed' && (
                                <button 
                                    onClick={() => handleStatusChange('retaking')}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-amber-500/10 text-amber-400 transition-all mt-1 border border-amber-500/20"
                                >
                                    <RefreshCw size={16} />
                                    Tornar a matricular
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
