import { Database, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlayerMemoryProps {
    variables: Record<string, any>;
    isExpanded: boolean;
    onToggle: () => void;
}

export function PlayerMemory({ variables, isExpanded, onToggle }: PlayerMemoryProps) {
    const { t } = useTranslation();

    if (!isExpanded) {
        return (
            <div className="bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] shrink-0">
                <div
                    className="px-4 py-1.5 sm:py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-[#161b22] transition-colors shrink-0"
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-2">
                        <Database size={11} className="text-slate-400" />
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">{t('player.memoryObjects')}</span>
                    </div>
                    <button type="button" className="text-slate-500 hover:text-slate-300">
                        <ChevronUp size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] min-h-0">
            <div
                className="px-4 py-1.5 sm:py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-[#161b22] transition-colors shrink-0"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <Database size={11} className="text-slate-400" />
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">{t('player.memoryObjects')}</span>
                </div>
                <button type="button" className="text-slate-500 hover:text-slate-300">
                    <ChevronDown size={14} />
                </button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-3 flex flex-col gap-1 content-start">
                {Object.entries(variables || {}).map(([k, v]) => (
                    <div key={k} className="flex text-xs group hover:bg-[#2a2d2e] px-2.5 py-1.5 rounded transition-colors duration-200">
                        <span className="text-[#9cdcfe] font-mono font-bold mr-2 shrink-0">{k}:</span>
                        <span className="text-[#b5cea8] font-mono break-all">{String(v)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
