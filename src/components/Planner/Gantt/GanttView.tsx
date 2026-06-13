import React, { useState } from 'react';
import { format, addDays, subDays, eachDayOfInterval, differenceInDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useTasks } from '../../../contexts/TasksContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '../../../types/tasks';

const GanttView: React.FC = () => {
    const { tasks } = useTasks();
    const [startDateWindow, setStartDateWindow] = useState(new Date());

    // Mostrarem 14 dies de visió de línia temporal (Gantt)
    const endDateWindow = addDays(startDateWindow, 14);
    const days = eachDayOfInterval({ start: startDateWindow, end: endDateWindow });

    const handlePrevious = () => setStartDateWindow(prev => subDays(prev, 7));
    const handleNext = () => setStartDateWindow(prev => addDays(prev, 7));

    // Filtra tasques que tenen una startDate o dueDate dintre de la nostra finestra visible
    const scheduledTasks = tasks.filter(t => t.startDate || t.dueDate);

    // Calcular posició i amplada de la barra de tasca
    const calculateBarStyle = (task: Task) => {
        const tStart = task.startDate ? new Date(task.startDate) : (task.dueDate ? new Date(task.dueDate) : new Date());
        const tEnd = task.dueDate ? new Date(task.dueDate) : addDays(tStart, 1); // Minim 1 dia si no té due date

        // Limitar la barra als marges de la nostra finestra de 14 dies
        const startDiff = differenceInDays(tStart, startDateWindow);
        const endDiff = differenceInDays(tEnd, startDateWindow);

        // Si està completament fóra de la finestra
        if (endDiff < 0 || startDiff > 14) return { display: 'none' };

        const leftCol = Math.max(0, startDiff);
        let widthCols = Math.max(1, endDiff - startDiff);

        // Retallar visualment si s'escapa per l'esquerra o per la dreta
        if (startDiff < 0) widthCols = Math.max(1, endDiff);
        if (leftCol + widthCols > 15) widthCols = 15 - leftCol;

        return {
            gridColumnStart: leftCol + 1, // CSS grid-columns are 1-indexed (and we have 1 column for names)
            gridColumnEnd: `span ${widthCols}`,
        };
    };

    const getPriorityColor = (priority: string) => {
        if (priority === 'HIGH') return 'bg-red-500/80 border-red-400';
        if (priority === 'MEDIUM') return 'bg-amber-500/80 border-amber-400';
        return 'bg-blue-500/80 border-blue-400';
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden">
            {/* Header del Gantt */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setStartDateWindow(new Date())}
                        className="text-sm font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-600"
                    >
                        Avui
                    </button>
                    <div className="flex items-center gap-1">
                        <button onClick={handlePrevious} className="p-1 hover:bg-slate-800 rounded-md transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-800 rounded-md transition-colors"><ChevronRight size={20} /></button>
                    </div>
                    <h2 className="text-xl font-bold capitalize">
                        {format(startDateWindow, 'd MMM yyyy', { locale: ca })} - {format(endDateWindow, 'd MMM yyyy', { locale: ca })}
                    </h2>
                </div>
            </div>

            {/* Contingut Gantt */}
            <div className="flex-1 overflow-auto relative">
                {/* CSS Grid per suportar N dies + 1 columna esquerra pels noms */}
                <div 
                    className="min-w-max border-b border-slate-700/50 sticky top-0 z-10 bg-slate-900 grid" 
                    style={{ gridTemplateColumns: `250px repeat(15, minmax(80px, 1fr))` }}
                >
                    <div className="p-3 text-sm font-semibold text-slate-400 uppercase border-r border-slate-700/50 bg-slate-800/50 sticky left-0 z-20">
                        Llista de Tasques
                    </div>
                    {days.map(day => (
                        <div key={day.toISOString()} className="p-2 text-center border-r border-slate-700/30 bg-slate-800/30 text-xs font-medium text-slate-300">
                            <div className="text-slate-500 mb-1">{format(day, 'EEE', { locale: ca })}</div>
                            <div className={format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-primary font-bold' : ''}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="min-w-max relative flex flex-col">
                    {/* Linies verticals de fons */}
                    <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `250px repeat(15, minmax(80px, 1fr))` }}>
                        <div className="border-r border-slate-700/30"></div>
                        {days.map(day => (
                            <div key={`bg-${day.toISOString()}`} className="border-r border-slate-700/30 h-full"></div>
                        ))}
                    </div>

                    {/* Tasques (Files) */}
                    {scheduledTasks.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No hi ha tasques programades en aquesta data.</div>
                    ) : (
                        scheduledTasks.map((task) => (
                            <div 
                                key={task.id} 
                                className="group grid border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors z-10"
                                style={{ gridTemplateColumns: `250px repeat(15, minmax(80px, 1fr))` }}
                            >
                                {/* Nom de la tasca sticky esquerra */}
                                <div className="p-3 border-r border-slate-700/50 bg-slate-900 group-hover:bg-slate-800/50 transition-colors sticky left-0 z-20 flex flex-col justify-center overflow-hidden">
                                    <span className="text-sm text-slate-200 truncate" title={task.title}>{task.title}</span>
                                    <span className="text-[10px] text-slate-500">{task.status}</span>
                                </div>
                                
                                {/* Zona de barres (15 columnes) */}
                                <div className="col-start-2 col-end-[-1] grid py-2 px-1 relative" style={{ gridTemplateColumns: `repeat(15, 1fr)` }}>
                                    <div 
                                        className={`rounded-md p-1.5 border shadow-sm text-xs text-white truncate font-medium flex items-center transition-all hover:brightness-110 cursor-pointer ${getPriorityColor(task.priority)}`}
                                        style={calculateBarStyle(task)}
                                        title={`${task.title} (Prioritat: ${task.priority})`}
                                    >
                                        {task.title}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GanttView;
