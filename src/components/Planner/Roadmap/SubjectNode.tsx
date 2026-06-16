import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../contexts/RoadmapContext';
import { motion } from 'framer-motion';

const SubjectNode = ({ id, data, selected }: NodeProps<Node<SubjectNodeData>>) => {

    // Hexagonal / Sci-Fi styles
    const getStatusStyles = () => {
        switch (data.status) {
            case 'locked':
                return {
                    bg: 'bg-[#0f1115]/80',
                    border: 'border-slate-800',
                    text: 'text-slate-500',
                    shadow: '',
                    glow: ''
                };
            case 'available':
                return {
                    bg: 'bg-slate-800/90',
                    border: 'border-sky-500/30',
                    text: 'text-slate-200',
                    shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.1)]',
                    glow: ''
                };
            case 'in_progress':
                return {
                    bg: 'bg-slate-900/95',
                    border: 'border-sky-400',
                    text: 'text-white',
                    shadow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]',
                    glow: 'shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]'
                };
            case 'retaking':
                return {
                    bg: 'bg-slate-900/95',
                    border: 'border-amber-400',
                    text: 'text-white',
                    shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
                    glow: 'shadow-[inset_0_0_20px_rgba(251,191,36,0.2)]'
                };
            case 'passed':
                return {
                    bg: '',
                    border: '',
                    text: 'text-white',
                    shadow: '',
                    glow: ''
                };
            case 'failed':
                return {
                    bg: 'bg-red-950/80',
                    border: 'border-red-500/50',
                    text: 'text-red-100',
                    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
                    glow: ''
                };
            default:
                return {
                    bg: 'bg-[#0f1115]/80',
                    border: 'border-white/5',
                    text: 'text-slate-400',
                    shadow: '',
                    glow: ''
                };
        }
    };

    const s = getStatusStyles();

    // Determine specific tailwind classes for passed state dynamically to avoid purge issues
    const getPassedClasses = () => {
        if (data.status !== 'passed') return '';
        if (data.type === 'obligatory') return 'bg-sky-500/20 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)] shadow-[inset_0_0_15px_rgba(14,165,233,0.2)]';
        if (data.type === 'specialization') return 'bg-fuchsia-500/20 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] shadow-[inset_0_0_15px_rgba(217,70,239,0.2)]';
        if (data.type === 'optional') return 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]';
        return 'bg-slate-500/20 border-slate-500/50';
    };

    const containerClasses = data.status === 'passed'
        ? getPassedClasses()
        : `${s.bg} ${s.border} ${s.shadow} ${s.glow}`;

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            className={`relative min-w-[150px] max-w-[180px] p-0 rounded-lg backdrop-blur-xl border-2 transition-colors duration-300 ${containerClasses} ${selected ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-slate-950' : ''}`}
        >
            <Handle type="target" position={Position.Top} className="w-3 h-1 !bg-sky-400 !border-0 !rounded-sm opacity-50" />

            <div className="relative z-10 flex flex-col p-3 items-center text-center overflow-hidden rounded-lg h-full">
                {/* Tech texture pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>

                {/* Type indicator line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${data.type === 'specialization' ? 'bg-fuchsia-500' : data.type === 'optional' ? 'bg-emerald-500' : 'bg-sky-500'} opacity-50`}></div>

                <span className={`text-[13px] font-bold tracking-wide mt-1 leading-tight ${s.text} font-sans`}>
                    {data.label}
                </span>

                <div className="flex items-center justify-between w-full mt-3">
                    <span className="text-[10px] opacity-50 font-mono font-semibold tracking-wider text-slate-300">
                        {id}
                    </span>
                    <span className="text-[10px] opacity-70 font-mono text-sky-200">
                        {data.credits} ECTS
                    </span>
                </div>
            </div>

            {/* Glowing rotating border for in_progress / retaking */}
            {(data.status === 'in_progress' || data.status === 'retaking') && (
                <div className="absolute inset-[-2px] rounded-lg overflow-hidden pointer-events-none z-0 mix-blend-screen">
                    <div className={`absolute inset-[-100%] animate-[spin_3s_linear_infinite] ${data.status === 'retaking' ? 'bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(251,191,36,0.6)_360deg)]' : 'bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.6)_360deg)]'}`} />
                    <div className="absolute inset-[2px] bg-slate-900 rounded-lg" />
                </div>
            )}

            {/* ATTEMPTS BADGE */}
            {data.attempts > 1 && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.6)] border border-amber-300 z-20 flex items-center gap-1 transform rotate-3">
                    <span className="animate-pulse">⚠️</span> INTENT {data.attempts}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="w-3 h-1 !bg-sky-400 !border-0 !rounded-sm opacity-50" />
        </motion.div>
    );
};

export default memo(SubjectNode);
