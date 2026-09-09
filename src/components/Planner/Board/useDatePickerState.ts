import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    setHours,
    setMinutes,
    addDays,
    format,
    type Locale
} from 'date-fns';

interface UseDatePickerStateProps {
    value: string;
    onChange: (value: string) => void;
    locale: Locale;
}

const POPOVER_HEIGHT = 380;
const POPOVER_WIDTH = 290;

export const useDatePickerState = ({
    value,
    onChange,
    locale
}: UseDatePickerStateProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const [currentDate, setCurrentDate] = useState<Date>(() => {
        if (!value) return new Date();
        const d = new Date(value);
        return isNaN(d.getTime()) ? new Date() : d;
    });

    const [viewDate, setViewDate] = useState<Date>(currentDate);

    // Càlcul de posició intel·ligent per evitar talls de pantalla
    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;

        let top = rect.bottom + 8;
        if (spaceBelow < POPOVER_HEIGHT && rect.top > POPOVER_HEIGHT) {
            top = Math.max(10, rect.top - POPOVER_HEIGHT - 8);
        }

        let left = rect.left;
        if (left + POPOVER_WIDTH > window.innerWidth) {
            left = Math.max(10, window.innerWidth - POPOVER_WIDTH - 10);
        }
        if (left < 10) left = 10;

        setCoords({ top, left });
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setCurrentDate(d);
                setViewDate(d);
            }
        } else {
            const today = new Date();
            setCurrentDate(today);
            setViewDate(today);
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

    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(prev => subMonths(prev, 1));
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(prev => addMonths(prev, 1));
    };

    // Matriu de dies del mes memoitzada
    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 }),
            end: endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
        });
    }, [viewDate]);

    // Dies de la setmana localitzats
    const weekDays = useMemo(() => {
        const refMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => {
            const dayDate = addDays(refMonday, i);
            return format(dayDate, 'EEEEEE', { locale });
        });
    }, [locale]);

    return {
        isOpen,
        setIsOpen,
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
    };
};
