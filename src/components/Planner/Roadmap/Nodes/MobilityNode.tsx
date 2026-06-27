import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { motion } from 'framer-motion';
import { Globe, Plane } from 'lucide-react';

const MobilityNode = ({ id, data, selected }: NodeProps<Node<SubjectNodeData>>) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative min-w-[160px] max-w-[200px] p-[1px] rounded-[24px] rounded-br-[8px] transition-all duration-300 ${selected ? 'bg-gradient-to-b from-amber-400 to-amber-600/30 shadow-[0_0_30px_rgba(245,158,11,0.3)] z-50' : 'bg-gradient-to-b from-white/10 to-transparent hover:from-amber-500/50 shadow-xl z-10 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] hover:z-40'}`}
        >
            {/* Inner Content Container */}
            <div className="relative w-full h-full bg-[#0a0f18] rounded-[23px] rounded-br-[6px] overflow-hidden flex flex-col p-4 items-center text-center">
                    
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />

                    <Handle type="target" position={Position.Top} className="w-6 h-1 !bg-amber-500 !border-0 !rounded-full opacity-0" />

                    {/* Animated Globe/Plane Icon */}
                    <div className="relative w-10 h-10 mb-3 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse"></div>
                        <div className="absolute inset-0 border border-amber-500/30 rounded-full"></div>
                        <Globe className="absolute text-amber-400 w-5 h-5 animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
                        <Plane className="relative text-amber-200 w-3 h-3 transform -rotate-45 drop-shadow-[0_0_6px_rgba(252,211,77,1)] z-10" />
                    </div>

                    <span className={`text-sm font-black tracking-tight leading-tight text-white drop-shadow-md font-sans line-clamp-2`}>
                        {data.details?.destination || 'Mobilitat'}
                    </span>
                    
                    <span className="text-[9px] font-black text-amber-400 mt-2 uppercase tracking-[0.15em] bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 line-clamp-1 w-full truncate">
                        {data.details?.program || 'Internacional'}
                    </span>

                    <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-white/[0.05]">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                            {data.credits} ECTS
                        </span>
                        {data.status === 'passed' && (
                            <span className="text-[9px] text-amber-300 font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                                FET
                            </span>
                        )}
                    </div>

                    <Handle type="source" position={Position.Bottom} className="w-6 h-1 !bg-amber-500 !border-0 !rounded-full opacity-0" />
                </div>
        </motion.div>
    );
};

export default memo(MobilityNode);
