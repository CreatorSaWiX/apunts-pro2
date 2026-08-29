import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface StatusPickerProps {
    value: string;
    onChange: (status: string) => void;
    columns: { id: string; title: string; color?: string }[];
}

const StatusPicker: React.FC<StatusPickerProps> = ({ value, onChange, columns }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const togglePicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                let top = rect.bottom + 8;
                let left = rect.left;
                
                const menuHeight = 200;
                const menuWidth = 200;
                
                if (top + menuHeight > window.innerHeight) {
                    top = rect.top - menuHeight - 8;
                }
                
                if (left + menuWidth > window.innerWidth) {
                    left = window.innerWidth - menuWidth - 10;
                }
                if (left < 10) left = 10;
                
                setCoords({ top, left });
            }
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleScrollOrResize = () => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                let top = rect.bottom + 8;
                let left = rect.left;
                
                const menuHeight = 200;
                const menuWidth = 200;
                
                if (top + menuHeight > window.innerHeight) {
                    top = rect.top - menuHeight - 8;
                }
                
                if (left + menuWidth > window.innerWidth) {
                    left = window.innerWidth - menuWidth - 10;
                }
                if (left < 10) left = 10;
                
                setCoords({ top, left });
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

    const getColumnTheme = (col: {id: string, color?: string}) => {
        if (col.color) {
            switch (col.color) {
                case 'indigo-400': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
                case 'fuchsia-400': return 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20';
                case 'emerald-400': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                case 'amber-400': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                case 'rose-400': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
                case 'cyan-400': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
                default: return `text-${col.color.replace('500', '400')} bg-${col.color}/10 border-${col.color}/20`;
            }
        }
        
        switch (col.id) {
            case 'TODO': return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
            case 'IN_PROGRESS': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'COMPLETE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            default: return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
        }
    };

    const currentColumn = columns.find(c => c.id === value);
    const triggerTheme = currentColumn ? getColumnTheme(currentColumn) : 'text-slate-300 bg-slate-500/10 border-slate-500/20';

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                onClick={togglePicker}
                className={`md:hidden flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors border ${triggerTheme} hover:opacity-80`}
            >
                <span className="font-semibold text-[10px] tracking-wider uppercase truncate">
                    {currentColumn ? currentColumn.title : value}
                </span>
            </button>

            {createPortal(
                <>
                    {isOpen && <div className="fixed inset-0 z-[9998]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                style={{ top: coords.top, left: coords.left, WebkitBackdropFilter: 'blur(24px)' }}
                                className="fixed z-[9999] w-[180px] cursor-default flex flex-col gap-1 p-2 !rounded-[20px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {columns.map(c => {
                                    const isSelected = value === c.id;
                                    const theme = getColumnTheme(c);
                                    // Extract just the text color from theme to use in dropdown, and maybe bg
                                    const textColorMatch = theme.match(/text-\S+/);
                                    const textColor = textColorMatch ? textColorMatch[0] : 'text-white';
                                    const bgColorMatch = theme.match(/bg-\S+/);
                                    const bgColor = bgColorMatch ? bgColorMatch[0].replace('/10', '/20') : 'bg-white/10';
                                    
                                    return (
                                        <button type="button"
                                            key={c.id}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(c.id); setIsOpen(false); }}
                                            className={`text-left px-3 py-2.5 rounded-[12px] text-[11px] font-bold tracking-wider transition-colors flex items-center justify-between ${isSelected ? `${bgColor} ${textColor}` : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                        >
                                            <span className="uppercase">{c.title}</span>
                                            {isSelected && <Check size={14} className={textColor} />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}
        </>
    );
};

export default StatusPicker;
