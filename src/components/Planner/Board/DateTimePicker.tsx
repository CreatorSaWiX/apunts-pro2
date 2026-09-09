import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { m as motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDatePickerState } from './useDatePickerState';
import { getDateLocale } from './boardConstants';

export interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = React.memo(({
    value,
    onChange,
    placeholder = 'Selecciona data',
    icon
}) => {
    const { t, i18n } = useTranslation();
    const locale = useMemo(() => getDateLocale(i18n.language), [i18n.language]);

    const {
        isOpen,
        coords,
        triggerRef,
        popoverRef,
        currentDate,
        viewDate,
        handleOpen,
        handleDayClick,
        incrementTime,
        handleClear,
        prevMonth,
        nextMonth,
        days,
        weekDays
    } = useDatePickerState({ value, onChange, locale });

    const formattedDate = useMemo(() => {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        return format(d, 'd MMM, HH:mm', { locale }).replace('.', '');
    }, [value, locale]);

    return (
        <>
            <div
                ref={triggerRef}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${
                    isOpen
                        ? 'bg-primary/20 border-primary/50 text-white'
                        : value
                        ? 'bg-slate-800/80 border-white/10 text-slate-200 hover:bg-slate-700'
                        : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/10'
                }`}
            >
                <button
                    type="button"
                    onClick={handleOpen}
                    className="flex items-center gap-1.5 bg-transparent border-none p-0 text-inherit font-inherit cursor-pointer focus:outline-none"
                >
                    {icon || <CalendarIcon size={12} />}
                    <span className="text-[11px] font-semibold tracking-wide mt-0.5">
                        {formattedDate || placeholder}
                    </span>
                </button>
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors text-inherit border-none cursor-pointer focus:outline-none"
                        title={t('common.clear', 'Netejar')}
                        aria-label={t('common.clear', 'Netejar')}
                    >
                        <X size={10} />
                    </button>
                )}
            </div>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={popoverRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                            style={{
                                top: coords.top,
                                left: coords.left,
                                WebkitBackdropFilter: 'blur(24px)'
                            }}
                            className="fixed z-[9999] w-[280px] flex flex-col gap-4 p-5 !rounded-[24px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            {/* Capçalera: Mes i Any */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                                    aria-label="Mes anterior"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[14px] font-bold text-white capitalize tracking-wide">
                                    {format(viewDate, 'MMMM yyyy', { locale })}
                                </span>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                                    aria-label="Mes següent"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Graella del calendari */}
                            <div>
                                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                                    {weekDays.map(day => (
                                        <div
                                            key={day}
                                            className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {days.map(day => {
                                        const isSelected = isSameDay(day, currentDate) && !!value;
                                        const isCurrentMonth = isSameMonth(day, viewDate);
                                        const isTodayDate = isToday(day);

                                        return (
                                            <button
                                                type="button"
                                                key={day.toISOString()}
                                                onClick={() => handleDayClick(day)}
                                                className={`
                                                    h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition
                                                    ${!isCurrentMonth ? 'text-slate-600' : 'text-slate-300 hover:bg-white/10'}
                                                    ${isSelected ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : ''}
                                                    ${isTodayDate && !isSelected ? 'text-primary ring-1 ring-primary/50' : ''}
                                                `}
                                            >
                                                {format(day, 'd')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selector d'Hora accessible per a mòbil i escriptori */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={16} />
                                    <span className="text-[13px] font-medium tracking-wide">
                                        {t('planner.time', 'Hora')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Control d'Hores */}
                                    <div className="flex flex-col items-center gap-1 group">
                                        <button
                                            type="button"
                                            onClick={() => incrementTime('hours', 1)}
                                            className="text-slate-500 hover:text-primary transition-colors max-md:opacity-100 opacity-60 group-hover:opacity-100 p-0.5"
                                            aria-label="Incrementar hora"
                                        >
                                            <ChevronUp size={14} strokeWidth={3} />
                                        </button>
                                        <div className="w-10 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 shadow-inner text-[15px] font-black text-white">
                                            {currentDate.getHours().toString().padStart(2, '0')}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => incrementTime('hours', -1)}
                                            className="text-slate-500 hover:text-primary transition-colors max-md:opacity-100 opacity-60 group-hover:opacity-100 p-0.5"
                                            aria-label="Decrementar hora"
                                        >
                                            <ChevronDown size={14} strokeWidth={3} />
                                        </button>
                                    </div>

                                    <span className="text-slate-500 font-bold mb-1">:</span>

                                    {/* Control de Minuts */}
                                    <div className="flex flex-col items-center gap-1 group">
                                        <button
                                            type="button"
                                            onClick={() => incrementTime('minutes', 1)}
                                            className="text-slate-500 hover:text-primary transition-colors max-md:opacity-100 opacity-60 group-hover:opacity-100 p-0.5"
                                            aria-label="Incrementar minuts"
                                        >
                                            <ChevronUp size={14} strokeWidth={3} />
                                        </button>
                                        <div className="w-10 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 shadow-inner text-[15px] font-black text-white">
                                            {currentDate.getMinutes().toString().padStart(2, '0')}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => incrementTime('minutes', -1)}
                                            className="text-slate-500 hover:text-primary transition-colors max-md:opacity-100 opacity-60 group-hover:opacity-100 p-0.5"
                                            aria-label="Decrementar minuts"
                                        >
                                            <ChevronDown size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
});

DateTimePicker.displayName = 'DateTimePicker';
