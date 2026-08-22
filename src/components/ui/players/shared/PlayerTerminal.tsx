import { TerminalSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlayerTerminalProps {
    output: string[];
    variables: Record<string, any>;
}

export function PlayerTerminal({ output, variables }: PlayerTerminalProps) {
    const { t } = useTranslation();

    return (
        <div className="flex-1 flex flex-col p-4 sm:p-6 pb-40 relative overflow-hidden">
            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl shadow-inner overflow-hidden flex flex-col backdrop-blur-sm relative">
                <div className="bg-white/5 border-b border-white/5 px-3 py-2 flex items-center gap-2">
                    <TerminalSquare size={12} className="text-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{t('player.terminalOutput')}</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs sm:text-[13px] text-slate-300 flex flex-col gap-1.5 leading-relaxed">
                    {(output || []).map((line: string, i: number) => (
                        <div key={i} className={`${line.startsWith('>') ? 'text-sky-400 font-bold opacity-70' : 'text-slate-200'} transition`}>
                            {t(line, variables as Record<string, string>) as string}
                        </div>
                    ))}
                    <div className="w-2 h-4 bg-slate-500 animate-pulse mt-1"></div>
                </div>
            </div>
        </div>
    );
}
