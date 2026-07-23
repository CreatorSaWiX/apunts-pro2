import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../contexts/TasksContext';

interface SubjectPickerProps {
    value: string | null | undefined;
    onChange: (subjectId: string | null) => void;
    placeholder?: string;
    className?: string;
}

const SubjectPicker: React.FC<SubjectPickerProps> = ({ value, onChange, placeholder, className = '' }) => {
    const { t } = useTranslation();
    const { subjects } = useTasks();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const filteredSubjects = useMemo(() => {
        if (!subjects) return [];
        return [...subjects]
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [subjects, searchQuery]);

    const togglePicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setCoords({ top: rect.bottom + 8, left: rect.left });
            }
            setIsOpen(true);
            setSearchQuery('');
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleScrollOrResize = () => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setCoords({ top: rect.bottom + 8, left: rect.left });
            }
        };
        if (isOpen) {
            window.addEventListener('scroll', handleScrollOrResize, true);
            window.addEventListener('resize', handleScrollOrResize);
            return () => {
                window.removeEventListener('scroll', handleScrollOrResize, true);
                window.removeEventListener('resize', handleScrollOrResize);
            };
        }
    }, [isOpen]);

    const currentSubject = value ? subjects?.find(s => s.id === value) : null;

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                onClick={togglePicker}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${currentSubject
                    ? `text-${currentSubject.colorToken.replace('500', '400')} bg-${currentSubject.colorToken}/10 border-${currentSubject.colorToken}/20`
                    : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                    } ${className}`}
            >
                <span className="font-semibold text-[10px] tracking-wider uppercase truncate">
                    {currentSubject ? currentSubject.name : (placeholder || t('planner.popover.noSubject', 'Sense assignatura'))}
                </span>
            </button>

            {isOpen && createPortal(
                <>
                    <div className="fixed inset-0 z-[9998]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                            top: coords.top,
                            left: coords.left,
                            WebkitBackdropFilter: 'blur(24px)'
                        }}
                        className="subject-picker-portal fixed z-[9999] w-[260px] cursor-default flex flex-col gap-2 p-3 !rounded-[24px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                    >
                        <input
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('planner.popover.searchSubject', 'Cerca assignatura...')}
                            className="bg-white/5 border border-white/10 text-slate-200 text-[13px] font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/20 w-full placeholder:text-slate-500 transition-colors"
                        />
                        <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden mt-1">
                            <button type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(null); setIsOpen(false); }}
                                className={`text-left px-4 py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-colors ${!value ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                            >
                                {t('planner.popover.noneSubject', 'Sense assignatura')}
                            </button>
                            {filteredSubjects.map(s => (
                                <button type="button"
                                    key={s.id}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(s.id); setIsOpen(false); }}
                                    className={`text-left px-4 py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-colors flex items-center gap-2 ${value === s.id ? `bg-${s.colorToken}/20 text-${s.colorToken.replace('500', '400')}` : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full bg-${s.colorToken}`}></span>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>,
                document.body
            )}
        </>
    );
};

export default SubjectPicker;
