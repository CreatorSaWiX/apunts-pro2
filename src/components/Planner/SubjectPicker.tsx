import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../contexts/TasksContext';
import { getSubjectColor } from '../../stores/useSubjectStore';

interface SubjectPickerProps {
    value: string | null | undefined;
    onChange: (subjectId: string | null) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Selector desplegable d'assignatures amb cerca, portal a document.body i animacions suaus
 */
const SubjectPicker: React.FC<SubjectPickerProps> = ({ 
    value, 
    onChange, 
    placeholder, 
    className = '' 
}) => {
    const { t } = useTranslation();
    const subjects = useTasks(state => state.subjects);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    // Ordenació alfabètica de les assignatures un cop canvia l'array, sense re-ordenar a cada pulsació de tecla
    const sortedSubjects = useMemo(() => {
        if (!subjects) return [];
        return [...subjects].sort((a, b) => a.name.localeCompare(b.name));
    }, [subjects]);

    // Filtratge ràpid per cerca sobre la llista ja ordenada
    const filteredSubjects = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return sortedSubjects;
        return sortedSubjects.filter(s => s.name.toLowerCase().includes(query));
    }, [sortedSubjects, searchQuery]);

    // Càlcul precís de la posició del menú emergent dins dels límits del viewport
    const updateCoords = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        let top = rect.bottom + 8;
        let left = rect.left;

        const menuHeight = 300;
        const menuWidth = 260;

        if (top + menuHeight > window.innerHeight) {
            top = Math.max(10, rect.top - menuHeight - 8);
        }

        if (left + menuWidth > window.innerWidth) {
            left = Math.max(10, window.innerWidth - menuWidth - 10);
        }

        setCoords({ top, left });
    }, []);

    const togglePicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            updateCoords();
            setIsOpen(true);
            setSearchQuery('');
        } else {
            setIsOpen(false);
        }
    };

    // Re-posicionament dinàmic en fer scroll o resize, i tancament amb Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                setIsOpen(false);
            }
        };

        const handleScrollOrResize = () => {
            updateCoords();
        };

        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen, updateCoords]);

    const currentSubject = useMemo(() => {
        return value ? subjects?.find(s => s.id === value) : null;
    }, [value, subjects]);

    const currentColor = useMemo(() => {
        return currentSubject ? getSubjectColor(currentSubject.colorToken) : null;
    }, [currentSubject]);

    return (
        <>
            {/* Botó disparador */}
            <button
                type="button"
                ref={triggerRef}
                onClick={togglePicker}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                style={currentColor ? {
                    color: currentColor.accent,
                    backgroundColor: `rgba(${currentColor.primary_rgb}, 0.1)`,
                    borderColor: `rgba(${currentColor.primary_rgb}, 0.2)`
                } : undefined}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors border cursor-pointer select-none text-left ${
                    !currentColor ? 'text-slate-400 bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/15' : ''
                } ${className}`}
            >
                {currentColor && (
                    <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: currentColor.primary }} 
                    />
                )}
                <span className="font-semibold text-[10px] tracking-wider uppercase truncate text-left">
                    {currentSubject ? currentSubject.name : (placeholder || t('planner.popover.noSubject', 'Sense assignatura'))}
                </span>
            </button>

            {/* Menú flotant amb portal a document.body i animació d'obertura/tancament */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop transparent per capturar clics exteriors */}
                            <div 
                                className="fixed inset-0 z-[9998]" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setIsOpen(false); 
                                }} 
                            />

                            <motion.div
                                role="listbox"
                                aria-label={t('planner.popover.subject', 'Assignatura')}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 450, damping: 28 }}
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
                                {/* Input de cerca d'assignatures */}
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('planner.popover.searchSubject', 'Cerca assignatura...')}
                                    className="bg-white/5 border border-white/10 text-slate-200 text-[13px] font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/20 w-full placeholder:text-slate-500 transition-colors"
                                />

                                {/* Llista d'opcions scrollable */}
                                <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden mt-1 [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {/* Opció: Sense assignatura */}
                                    <button 
                                        type="button"
                                        role="option"
                                        aria-selected={!value}
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            onChange(null); 
                                            setIsOpen(false); 
                                        }}
                                        className={`text-left px-4 py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-colors cursor-pointer ${
                                            !value ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                    >
                                        {t('planner.popover.noneSubject', 'Sense assignatura')}
                                    </button>

                                    {/* Llista d'assignatures filtrades */}
                                    {filteredSubjects.map(s => {
                                        const sColor = getSubjectColor(s.colorToken);
                                        const isSelected = value === s.id;
                                        return (
                                            <button 
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                key={s.id}
                                                onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    e.stopPropagation(); 
                                                    onChange(s.id); 
                                                    setIsOpen(false); 
                                                }}
                                                style={isSelected ? {
                                                    backgroundColor: `rgba(${sColor.primary_rgb}, 0.2)`,
                                                    color: sColor.accent
                                                } : undefined}
                                                className={`text-left px-4 py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-colors flex items-center gap-2.5 cursor-pointer ${
                                                    !isSelected ? 'text-slate-400 hover:bg-white/5 hover:text-slate-300' : ''
                                                }`}
                                            >
                                                <span 
                                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                                                    style={{ backgroundColor: sColor.primary }}
                                                />
                                                <span className="truncate">{s.name}</span>
                                            </button>
                                        );
                                    })}

                                    {/* Estat buit si la cerca no troba res */}
                                    {filteredSubjects.length === 0 && searchQuery.trim() !== '' && (
                                        <div className="px-4 py-3 text-xs text-slate-500 italic text-center">
                                            {t('planner.popover.noSubjectsFound', 'Cap assignatura trobada')}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default SubjectPicker;
