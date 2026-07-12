import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, setHours, setMinutes } from 'date-fns';
import { es, ca, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, ChevronUp, ChevronDown } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, placeholder = "Selecciona data", icon }) => {
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    const locale = preferredLang === 'es' ? es : preferredLang === 'en' ? enUS : ca;
    
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    
    const [currentDate, setCurrentDate] = useState(() => {
        if (!value) return new Date();
        const d = new Date(value);
        return isNaN(d.getTime()) ? new Date() : d;
    });
    
    const [viewDate, setViewDate] = useState(currentDate);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Calculate if there's space below, else show above
            const spaceBelow = window.innerHeight - rect.bottom;
            const popoverHeight = 360; // Estimated height
            
            let top = rect.bottom + 8;
            if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
                top = rect.top - popoverHeight - 8;
            }
            
            setCoords({ top, left: rect.left });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setCurrentDate(d);
                setViewDate(d);
            }
        }
    }, [value]);

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isOpen) {
            updatePosition();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleDayClick = (day: Date) => {
        const newDate = new Date(day);
        newDate.setHours(currentDate.getHours());
        newDate.setMinutes(currentDate.getMinutes());
        setCurrentDate(newDate);
        onChange(newDate.toISOString());
    };

    const incrementTime = (type: 'hours' | 'minutes', amount: number) => {
        let newDate = new Date(currentDate);
        if (type === 'hours') {
            const newHours = (currentDate.getHours() + amount + 24) % 24;
            newDate = setHours(newDate, newHours);
        } else {
            const newMins = (currentDate.getMinutes() + amount + 60) % 60;
            newDate = setMinutes(newDate, newMins);
        }
        setCurrentDate(newDate);
        onChange(newDate.toISOString());
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onChange('');
        setIsOpen(false);
    };

    const prevMonth = (e: React.MouseEvent) => { e.stopPropagation(); setViewDate(subMonths(viewDate, 1)); };
    const nextMonth = (e: React.MouseEvent) => { e.stopPropagation(); setViewDate(addMonths(viewDate, 1)); };

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    });

    return (
        <>
            <button type="button"
                ref={triggerRef}
                onClick={handleOpen}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${
                    isOpen 
                        ? 'bg-primary/20 border-primary/50 text-white' 
                        : value 
                            ? 'bg-slate-800/80 border-white/10 text-slate-200 hover:bg-slate-700' 
                            : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/10'
                }`}
            >
                {icon || <CalendarIcon size={12} />}
                <span className="text-[11px] font-semibold tracking-wide mt-0.5">
                    {value ? format(new Date(value), "d MMM, HH:mm", { locale }) : placeholder}
                </span>
                {value && (
                    <div 
                        onClick={handleClear}
                        className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={10} />
                    </div>
                )}
            </button>

            {isOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                        ref={popoverRef}
                        initial={{ opacity: 0, y: -15, scale: 0.9, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(4px)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                        style={{ top: coords.top, left: coords.left }}
                        className="fixed z-[9999] w-[280px] bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] p-5 flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {/* Header: Month / Year */}
                        <div className="flex items-center justify-between">
                            <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-[14px] font-bold text-white capitalize tracking-wide">
                                {format(viewDate, 'MMMM yyyy', { locale })}
                            </span>
                            <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div>
                            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                                {['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'].map(day => (
                                    <div key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {days.map(day => {
                                    const isSelected = isSameDay(day, currentDate) && !!value;
                                    const isCurrentMonth = isSameMonth(day, viewDate);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <button type="button"
                                            key={day.toISOString()}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                                h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all
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

                        {/* Elegant Time Selector */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={16} />
                                <span className="text-[13px] font-medium tracking-wide">{t('planner.time', 'Hora')}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Hours Control */}
                                <div className="flex flex-col items-center gap-1 group">
                                    <button type="button" onClick={() => incrementTime('hours', 1)} className="text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-0.5">
                                        <ChevronUp size={14} strokeWidth={3} />
                                    </button>
                                    <div className="w-10 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 shadow-inner text-[15px] font-black text-white">
                                        {currentDate.getHours().toString().padStart(2, '0')}
                                    </div>
                                    <button type="button" onClick={() => incrementTime('hours', -1)} className="text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-0.5">
                                        <ChevronDown size={14} strokeWidth={3} />
                                    </button>
                                </div>
                                
                                <span className="text-slate-500 font-bold mb-1">:</span>
                                
                                {/* Minutes Control */}
                                <div className="flex flex-col items-center gap-1 group">
                                    <button type="button" onClick={() => incrementTime('minutes', 1)} className="text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-0.5">
                                        <ChevronUp size={14} strokeWidth={3} />
                                    </button>
                                    <div className="w-10 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 shadow-inner text-[15px] font-black text-white">
                                        {currentDate.getMinutes().toString().padStart(2, '0')}
                                    </div>
                                    <button type="button" onClick={() => incrementTime('minutes', -1)} className="text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-0.5">
                                        <ChevronDown size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
