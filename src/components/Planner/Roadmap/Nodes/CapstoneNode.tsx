import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';

const CapstoneNode = ({ data, selected }: NodeProps<Node<SubjectNodeData>>) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative min-w-[160px] max-w-[200px] p-[1px] rounded-[24px] rounded-br-md transition-all duration-300 ${selected ? 'bg-gradient-to-b from-fuchsia-400 to-fuchsia-600/30 shadow-[0_0_30px_rgba(217,70,239,0.3)] z-50' : 'bg-gradient-to-b from-white/10 to-transparent hover:from-fuchsia-500/50 shadow-xl z-10 hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)] hover:z-40'}`}
        >
            <div className="relative w-full h-full bg-[#0a0f18] rounded-[23px] rounded-br-[5px] overflow-hidden flex flex-col p-4 items-center text-center">
                    
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,70,239,0.15),transparent_70%)] pointer-events-none" />

                    <Handle type="target" position={Position.Top} className="w-6 h-1 !bg-fuchsia-500 !border-0 !rounded-full opacity-0" />

                    <div className="relative w-10 h-10 mb-3 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-md animate-pulse"></div>
                        <div className="absolute inset-0 border border-fuchsia-500/30 rounded-full"></div>
                        <GraduationCap className="absolute text-fuchsia-400 w-5 h-5 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" strokeWidth={1.5} />
                        <Sparkles className="absolute text-fuchsia-200 w-3 h-3 drop-shadow-[0_0_6px_rgba(240,171,252,1)] z-10 -top-1 -right-1" />
                    </div>

                    <span className={`text-sm font-black tracking-tight leading-tight text-white drop-shadow-md font-sans line-clamp-2`}>
                        {data.details?.title || data.label || 'Projecte Final'}
                    </span>
                    
                    <span className="text-[9px] font-black text-fuchsia-400 mt-2 uppercase tracking-[0.15em] bg-fuchsia-500/10 px-2 py-1 rounded-md border border-fuchsia-500/20 line-clamp-1 w-full truncate">
                        {data.type === 'tfg' ? 'GRAU' : 'MÀSTER'}
                    </span>

                    <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-white/[0.05]">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                            {data.credits} ECTS
                        </span>
                        {data.status === 'passed' && (
                            <span className="text-[9px] text-fuchsia-300 font-black drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
                                FET
                            </span>
                        )}
                    </div>

                    <Handle type="source" position={Position.Bottom} className="w-6 h-1 !bg-fuchsia-500 !border-0 !rounded-full opacity-0" />
                </div>
        </motion.div>
    );
};

export default memo(CapstoneNode);
