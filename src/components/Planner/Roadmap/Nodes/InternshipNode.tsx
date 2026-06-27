import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { motion } from 'framer-motion';
import { Briefcase, Building2 } from 'lucide-react';

const InternshipNode = ({ data, selected }: NodeProps<Node<SubjectNodeData>>) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative min-w-[160px] max-w-[200px] p-[1px] rounded-[24px] rounded-br-[8px] transition-all duration-300 ${selected ? 'bg-gradient-to-b from-teal-400 to-teal-600/30 shadow-[0_0_30px_rgba(20,184,166,0.3)] z-50' : 'bg-gradient-to-b from-white/10 to-transparent hover:from-teal-500/50 shadow-xl z-10 hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] hover:z-40'}`}
        >
            <div className="relative w-full h-full bg-[#0a0f18] rounded-[23px] rounded-br-[6px] overflow-hidden flex flex-col p-4 items-center text-center">
                    
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />

                    <Handle type="target" position={Position.Top} className="w-6 h-1 !bg-teal-500 !border-0 !rounded-full opacity-0" />

                    <div className="relative w-10 h-10 mb-3 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-md animate-pulse"></div>
                        <div className="absolute inset-0 border border-teal-500/30 rounded-full"></div>
                        <Building2 className="absolute text-teal-400/40 w-5 h-5 -ml-1 -mt-1" strokeWidth={1.5} />
                        <Briefcase className="relative text-teal-200 w-4 h-4 drop-shadow-[0_0_6px_rgba(94,234,212,1)] z-10" />
                    </div>

                    <span className={`text-sm font-black tracking-tight leading-tight text-white drop-shadow-md font-sans line-clamp-2`}>
                        {data.details?.company || 'Pràctiques'}
                    </span>
                    
                    <span className="text-[9px] font-black text-teal-400 mt-2 uppercase tracking-[0.15em] bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20 line-clamp-1 w-full truncate">
                        {data.details?.role || 'Enginyeria'}
                    </span>

                    <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-white/[0.05]">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                            {data.credits} ECTS
                        </span>
                        {data.status === 'passed' && (
                            <span className="text-[9px] text-teal-300 font-black drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]">
                                FET
                            </span>
                        )}
                    </div>

                    <Handle type="source" position={Position.Bottom} className="w-6 h-1 !bg-teal-500 !border-0 !rounded-full opacity-0" />
                </div>
        </motion.div>
    );
};

export default memo(InternshipNode);
