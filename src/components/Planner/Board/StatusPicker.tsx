import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { getColumnTheme, type BoardColumnData } from './boardConstants';

export interface StatusPickerProps {
    value: string;
    onChange: (status: string) => void;
    columns: BoardColumnData[];
    className?: string;
}

const MENU_HEIGHT = 220;
const MENU_WIDTH = 200;

export const StatusPicker: React.FC<StatusPickerProps> = React.memo(({
    value,
    onChange,
    columns,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const updateCoords = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        let top = rect.bottom + 8;
        let left = rect.left;

        if (top + MENU_HEIGHT > window.innerHeight) {
            top = Math.max(10, rect.top - MENU_HEIGHT - 8);
        }

        if (left + MENU_WIDTH > window.innerWidth) {
            left = Math.max(10, window.innerWidth - MENU_WIDTH - 10);
        }
        if (left < 10) left = 10;

        setCoords({ top, left });
    }, []);

    const togglePicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            updateCoords();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleScrollOrResize = () => {
            updateCoords();
        };

        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);
        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen, updateCoords]);

    const currentColumn = columns.find(c => c.id === value);
    const currentTheme = currentColumn ? getColumnTheme(currentColumn) : getColumnTheme({ id: value });

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                onClick={togglePicker}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors border ${currentTheme.text} ${currentTheme.pillBg} ${currentTheme.pillBorder} hover:opacity-80 ${className}`}
                title={currentColumn?.title || value}
            >
                <span className="font-semibold text-[10px] tracking-wider uppercase truncate">
                    {currentColumn ? currentColumn.title : value}
                </span>
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[9998]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                style={{
                                    top: coords.top,
                                    left: coords.left,
                                    WebkitBackdropFilter: 'blur(24px)'
                                }}
                                className="fixed z-[9999] w-[190px] cursor-default flex flex-col gap-1 p-2 !rounded-[20px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {columns.map(c => {
                                    const isSelected = value === c.id;
                                    const theme = getColumnTheme(c);

                                    return (
                                        <button
                                            type="button"
                                            key={c.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onChange(c.id);
                                                setIsOpen(false);
                                            }}
                                            className={`text-left px-3 py-2 rounded-[12px] text-[11px] font-bold tracking-wider transition-colors flex items-center justify-between ${
                                                isSelected
                                                    ? `${theme.pillSelectedBg} ${theme.text}`
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                                            }`}
                                        >
                                            <span className="uppercase truncate mr-2">{c.title}</span>
                                            {isSelected && <Check size={14} className={theme.text} />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
});

StatusPicker.displayName = 'StatusPicker';

export default StatusPicker;
