import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../contexts/RoadmapContext';
import { m as motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useTranslation } from 'react-i18next';

const SubjectNode = ({ id, data, selected }: NodeProps<Node<SubjectNodeData>>) => {
    const { t } = useTranslation();

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
        if (data.type === 'tfg' || data.type === 'tfm') return 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]';
        if (data.type === 'mobility') return 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]';
        if (data.type === 'internship') return 'bg-teal-500/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] shadow-[inset_0_0_15px_rgba(20,184,166,0.2)]';
        return 'bg-slate-500/20 border-slate-500/50';
    };

    const containerClasses = data.status === 'passed'
        ? getPassedClasses()
        : `${s.bg} ${s.border} ${s.shadow} ${s.glow}`;

    const getTopBarColor = () => {
        if (data.type === 'specialization') return 'bg-fuchsia-500';
        if (data.type === 'optional') return 'bg-emerald-500';
        if (data.type === 'tfg' || data.type === 'tfm') return 'bg-purple-500';
        if (data.type === 'mobility') return 'bg-amber-500';
        if (data.type === 'internship') return 'bg-teal-500';
        return 'bg-sky-500';
    };

    const getBottomTag = () => {
        if (data.type === 'mobility') return t('planner.roadmapSubjectNode.tags.mobility', 'MOBILITAT');
        if (data.type === 'internship') return t('planner.roadmapSubjectNode.tags.internship', 'PRÀCTIQUES');
        if (data.type === 'tfg') return t('planner.roadmapSubjectNode.tags.tfg', 'TFG');
        if (data.type === 'tfm') return t('planner.roadmapSubjectNode.tags.tfm', 'TFM');
        if (id.startsWith('VALIDATION_')) return t('planner.roadmapSubjectNode.tags.activities', 'ACTIVITATS');
        if (id.startsWith('CFGS_')) return t('planner.roadmapSubjectNode.tags.cfgs', 'CFGS');
        return id;
    };

    return (
        <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={800}
            scale={1.02}
            transitionSpeed={1500}
            gyroscope={false}
            glareEnable={true}
            glareMaxOpacity={0.1}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="8px"
            className="rounded-lg"
        >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            className={`relative min-w-[150px] max-w-[180px] p-0 rounded-lg border-2 transition-colors duration-300 ${containerClasses} ${selected ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-slate-950' : ''}`}
        >
            <Handle type="target" position={Position.Top} className="w-3 h-1 !bg-sky-400 !border-0 !rounded-sm opacity-50" />

            <div className="relative z-10 flex flex-col p-3 items-center text-center overflow-hidden rounded-lg h-full">
                {/* Tech texture pattern overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>

                {/* Type indicator line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${getTopBarColor()} opacity-50`}></div>

                <span className={`text-[13px] font-bold tracking-wide mt-1 leading-tight ${s.text} font-sans`}>
                    {data.label}
                </span>

                <div className="flex items-center justify-between w-full mt-3">
                    <span className="text-[10px] opacity-50 font-mono font-semibold tracking-wider text-slate-300">
                        {getBottomTag()}
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
            {data.attempts > 1 && data.status !== 'passed' && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.6)] border border-amber-300 z-20 flex items-center gap-1 transform rotate-3">
                    <span className="animate-pulse">⚠️</span> {t('planner.roadmapSubjectNode.attempt', 'INTENT')} {data.attempts}
                </div>
            )}

            {/* GRADE BADGE */}
            {data.status === 'passed' && typeof data.grade === 'number' && (
                <div className={`absolute -top-3 -right-3 text-[11px] font-black px-2 py-0.5 rounded-md z-20 flex items-center shadow-lg border transform rotate-6 hover:scale-110 transition-transform cursor-default
                    ${data.grade >= 9.0 ? 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 text-white border-fuchsia-300/50 shadow-[0_0_20px_rgba(217,70,239,0.8)]' :
                        data.grade >= 7.0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-300/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                            'bg-gradient-to-br from-sky-400 to-sky-600 text-white border-sky-300/50 shadow-[0_0_10px_rgba(14,165,233,0.5)]'}
                `}>
                    {data.grade >= 9.0 && <span className="mr-1 drop-shadow-md">⭐</span>}
                    {data.grade.toFixed(1)}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="w-3 h-1 !bg-sky-400 !border-0 !rounded-sm opacity-50" />
        </motion.div>
        </Tilt>
    );
};

export default memo(SubjectNode);
