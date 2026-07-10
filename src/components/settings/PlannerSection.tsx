import { motion } from 'framer-motion';
import { LayoutGrid, Calendar, CalendarDays, Route } from 'lucide-react';
import { useSettings, type PlannerViewMode } from '../../contexts/SettingsContext';

export const PlannerSection = () => {
    const { defaultPlannerView, setDefaultPlannerView } = useSettings();
    const plannerViews: { id: PlannerViewMode, icon: any, label: string }[] = [
        { id: 'board', icon: LayoutGrid, label: 'Tauler' },
        { id: 'calendar', icon: Calendar, label: 'Calendari' },
        { id: 'gantt', icon: CalendarDays, label: 'Timeline' },
        { id: 'roadmap', icon: Route, label: 'Roadmap' },
    ];

    return (
        <div id="planner" className="flex flex-col items-start gap-6 w-full pt-6 pb-12 border-b border-white/5">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-1">Vista del Planificador</h2>
                <p className="text-slate-400 text-sm font-medium">Tria la vista per defecte a la pestanya Planificador.</p>
            </div>

            <div className="grid grid-cols-2 sm:flex flex-wrap gap-3 w-full">
                {plannerViews.map(view => {
                    const isActive = defaultPlannerView === view.id;
                    return (
                        <button
                            key={view.id}
                            onClick={() => setDefaultPlannerView(view.id)}
                            className={`relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 border outline-none flex-1 sm:flex-none ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                        >
                            <view.icon size={20} className={`transition-colors duration-300 z-10 relative ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className={`text-sm font-semibold transition-colors duration-300 z-10 relative ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                {view.label}
                            </span>
                            {isActive && (
                                <motion.div layoutId="planner-active-indicator" className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
