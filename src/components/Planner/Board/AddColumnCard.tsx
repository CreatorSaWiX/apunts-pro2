import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COLUMN_COLORS, COLOR_THEMES, type ColumnColor } from './boardConstants';

interface AddColumnCardProps {
    onAddColumn: (title: string, color: ColumnColor) => void;
}

export const AddColumnCard: React.FC<AddColumnCardProps> = React.memo(({ onAddColumn }) => {
    const { t } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState<ColumnColor>(COLUMN_COLORS[0]);

    const handleCreate = () => {
        const trimmed = title.trim();
        if (trimmed) {
            onAddColumn(trimmed, color);
            setTitle('');
            setColor(COLUMN_COLORS[0]);
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setColor(COLUMN_COLORS[0]);
        setIsAdding(false);
    };

    return (
        <div className="flex-shrink-0 w-[85vw] max-md:snap-center md:w-87.5 h-full">
            {!isAdding ? (
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="group flex flex-col items-center justify-center gap-3 text-slate-500 bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-white/20 rounded-[32px] w-full h-[100px] transition duration-300 backdrop-blur-md"
                    aria-label="Obrir panell nova llista"
                >
                    <div className="bg-white/5 group-hover:bg-white/10 group-hover:scale-110 group-hover:text-white p-2.5 rounded-full transition duration-300">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold tracking-wide transition-colors group-hover:text-white/80">
                        {t('planner.boardView.addList', 'Afegeix llista')}
                    </span>
                </button>
            ) : (
                <div className="bg-[#13131A]/40 backdrop-blur-xl rounded-2xl p-3 border border-white/10 w-full max-w-[350px] shadow-2xl flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
                            {t('planner.boardView.addList', 'Afegeix llista')}
                        </span>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-slate-500 hover:text-white transition-colors p-1"
                            aria-label="Tancar"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Paleta de selecció de color */}
                    <div className="flex gap-3 items-center justify-center py-2 bg-white/[0.02] rounded-xl border border-white/[0.02]">
                        {COLUMN_COLORS.map(c => {
                            const theme = COLOR_THEMES[c];
                            const isSelected = color === c;
                            return (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-4 h-4 rounded-full transition duration-300 ${theme.bg} ${
                                        isSelected
                                            ? `scale-125 shadow-[0_0_12px_currentColor] ${theme.text} ring-2 ring-current ring-offset-2 ring-offset-[#13131A]`
                                            : 'opacity-50 hover:opacity-100 hover:scale-110'
                                    }`}
                                    aria-label={`Seleccionar color ${c}`}
                                />
                            );
                        })}
                    </div>

                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleCreate();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        placeholder={t('planner.boardView.listName', 'Nom de la llista...')}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition-colors"
                    />

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="mt-1 bg-white/5 hover:bg-white/10 text-white text-[12px] font-semibold tracking-wide py-2.5 rounded-xl transition-colors border border-white/5 hover:border-white/10 w-full shadow-sm"
                        aria-label="Crear llista"
                    >
                        {t('planner.boardView.createList', 'CREAR LLISTA')}
                    </button>
                </div>
            )}
        </div>
    );
});

AddColumnCard.displayName = 'AddColumnCard';
