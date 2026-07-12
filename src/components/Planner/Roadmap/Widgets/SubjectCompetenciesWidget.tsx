import React from 'react';
import { m as motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface CompetencyItem {
    code: string;
    desc: string;
}

interface SubjectCompetenciesWidgetProps {
    dataString: string;
}

const SubjectCompetenciesWidget: React.FC<SubjectCompetenciesWidgetProps> = ({ dataString }) => {
    let items: CompetencyItem[] = [];
    
    try {
        items = JSON.parse(dataString);
    } catch (e) {
        console.error("Failed to parse competencies data", e);
        return null;
    }

    if (!items || items.length === 0) return null;

    return (
        <div className="my-6 flex flex-col gap-3 w-full">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Target size={16} className="text-sky-400" />
                Competències Clau
            </h4>
            <div className="grid grid-cols-1 gap-3">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-500/30 hover:bg-white/[0.06] transition-all duration-300 shadow-lg group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-shrink-0 mt-0.5">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all tracking-wider">
                                {item.code}
                            </span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SubjectCompetenciesWidget;
