import React, { useState, useEffect } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { COLUMN_COLORS, getColumnTheme, COLOR_THEMES, type ColumnColor } from './boardConstants';

interface ColumnHeaderProps {
    column: { id: string; title: string; color?: string };
    taskCount: number;
    onUpdateColumn?: (updates: Partial<{ title: string; color: string }>) => void;
    onOpenClearModal: () => void;
    onOpenDeleteModal: () => void;
    onStartDrafting: () => void;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = React.memo(({
    column,
    taskCount,
    onUpdateColumn,
    onOpenClearModal,
    onOpenDeleteModal,
    onStartDrafting,
    attributes,
    listeners
}) => {
    const { t } = useTranslation();
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [headerTitle, setHeaderTitle] = useState(column.title);

    const theme = getColumnTheme(column);

    useEffect(() => {
        if (!isEditingHeader) {
            setHeaderTitle(column.title);
        }
    }, [column.title, isEditingHeader]);

    const startEditing = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isEditingHeader) return;
        setHeaderTitle(column.title);
        setIsEditingHeader(true);
    };

    const toggleColorPicker = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowColorPicker(prev => !prev);
    };

    const handleSelectColor = (color: ColumnColor, e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateColumn?.({ color });
        setShowColorPicker(false);
    };

    const handleTitleSubmit = () => {
        setIsEditingHeader(false);
        const trimmed = headerTitle.trim();
        if (trimmed && trimmed !== column.title) {
            onUpdateColumn?.({ title: trimmed });
        } else {
            setHeaderTitle(column.title);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            handleTitleSubmit();
        }
        if (e.key === 'Escape') {
            setIsEditingHeader(false);
            setHeaderTitle(column.title);
        }
    };

    return (
        <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-between px-3 py-4 sticky top-0 z-10 group/header cursor-grab active:cursor-grabbing"
        >
            <div
                className="flex items-center gap-2.5 relative z-10 flex-1"
                onDoubleClick={startEditing}
            >
                {/* Indicador i selector de color */}
                <button
                    type="button"
                    onClick={toggleColorPicker}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`w-2.5 h-2.5 rounded-full ${theme.bg} ${theme.text} shadow-[0_0_8px_currentColor] cursor-pointer hover:scale-150 hover:shadow-[0_0_12px_currentColor] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                    title={t('planner.boardView.colorTitle', 'Fes clic per canviar el color')}
                    aria-label={t('planner.boardView.colorTitle', 'Canviar color')}
                />

                <AnimatePresence>
                    {showColorPicker && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColorPicker(false);
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.9, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -5, scale: 0.95, filter: 'blur(4px)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="absolute top-8 left-0 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] p-3 rounded-[20px] flex gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 cursor-default origin-top-left"
                            >
                                {COLUMN_COLORS.map(c => {
                                    const colTheme = COLOR_THEMES[c];
                                    const isSelected = column.color === c;
                                    return (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={(e) => handleSelectColor(c, e)}
                                            className={`w-4 h-4 rounded-full ${colTheme.bg} shadow-[0_0_8px_currentColor] ${colTheme.text} hover:scale-125 transition-transform ${
                                                isSelected
                                                    ? 'ring-2 ring-current ring-offset-2 ring-offset-[#13131A]'
                                                    : 'opacity-70 hover:opacity-100'
                                            }`}
                                        />
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Títol de la columna editable */}
                {isEditingHeader ? (
                    <input
                        autoFocus
                        value={headerTitle}
                        onChange={(e) => setHeaderTitle(e.target.value)}
                        onBlur={handleTitleSubmit}
                        onKeyDown={handleKeyDown}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="font-semibold text-[13px] tracking-widest text-slate-200 uppercase bg-transparent border-b border-white/20 focus:outline-none focus:border-primary flex-1"
                    />
                ) : (
                    <h3
                        className="font-semibold text-[13px] tracking-widest text-slate-200 uppercase cursor-pointer"
                        onClick={(e) => {
                            if (e.detail === 2) startEditing(e);
                        }}
                    >
                        {column.title}
                    </h3>
                )}

                <span className="text-[11px] font-medium text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded-md ml-1">
                    {taskCount}
                </span>
            </div>

            {/* Accions de la capçalera */}
            <div
                className="flex items-center gap-1 max-md:opacity-100 md:opacity-0 md:group-hover/col:opacity-100 transition-opacity"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        startEditing(e);
                    }}
                    className="text-slate-500 hover:text-white transition duration-200 pointer-events-auto p-1"
                    title={t('common.edit', 'Editar títol')}
                    aria-label="Editar títol de la columna"
                >
                    <Pencil size={13} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (taskCount > 0) onOpenClearModal();
                    }}
                    className="text-slate-500 hover:text-amber-400 transition duration-200 pointer-events-auto p-1"
                    title={t('planner.boardView.clearList', 'Buidar llista')}
                >
                    <Trash2 size={14} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenDeleteModal();
                    }}
                    className="text-slate-500 hover:text-red-400 transition duration-200 pointer-events-auto p-1"
                    title={t('planner.boardView.deleteList', 'Eliminar llista')}
                >
                    <X size={16} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onStartDrafting();
                    }}
                    className="text-slate-500 hover:text-white transition duration-200 pointer-events-auto p-1"
                    title={t('planner.boardView.addTask', 'Afegir tasca')}
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
});

ColumnHeader.displayName = 'ColumnHeader';
