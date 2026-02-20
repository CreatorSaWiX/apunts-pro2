import React from 'react';
import { Info, AlertTriangle, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';

export type CalloutType = 'note' | 'tip' | 'warning' | 'info' | 'success';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}

const styles = {
    note: {
        container: 'bg-slate-900/40 border-slate-700/30',
        icon: <MessageSquare className="w-5 h-5 text-slate-400" />,
        title: 'text-slate-200'
    },
    tip: {
        container: 'bg-emerald-950/20 border-emerald-500/20',
        icon: <Lightbulb className="w-5 h-5 text-emerald-400/80" />,
        title: 'text-emerald-200/90'
    },
    warning: {
        container: 'bg-amber-950/20 border-amber-500/20',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400/80" />,
        title: 'text-amber-200/90'
    },
    info: {
        container: 'bg-sky-950/20 border-sky-500/20',
        icon: <Info className="w-5 h-5 text-sky-400/80" />,
        title: 'text-sky-200/90'
    },
    success: {
        container: 'bg-green-950/20 border-green-500/20',
        icon: <CheckCircle className="w-5 h-5 text-green-400/80" />,
        title: 'text-green-200/90'
    }
};

const Callout: React.FC<CalloutProps> = ({ type = 'note', title, children }) => {
    const style = styles[type] || styles.note;

    return (
        <div className={`my-8 rounded-lg border ${style.container} p-4 transition-colors`}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5 opacity-90">
                    {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`font-semibold text-sm mb-2 ${style.title} tracking-wide uppercase text-[11px]`}>
                            {title}
                        </h4>
                    )}
                    <div className="text-slate-300 text-base leading-7 font-light [&>p]:mb-2 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Callout;
