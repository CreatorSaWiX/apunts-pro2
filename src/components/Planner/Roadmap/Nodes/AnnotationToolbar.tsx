import React from 'react';
import { NodeToolbar, Position } from '@xyflow/react';
import { Trash2, Bold, Copy, Type } from 'lucide-react';

export interface AnnotationToolbarProps {
    selected: boolean;
    fontSize?: number;
    fontWeight?: string;
    currentColor?: string;
    colors: string[];
    onSizeChange: (size: number) => void;
    onToggleBold: () => void;
    onColorChange: (color: string) => void;
    onDuplicate: () => void;
    onRemove: () => void;
    colorBorderClass?: string;
}

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = React.memo(({
    selected,
    fontSize = 16,
    fontWeight,
    currentColor,
    colors,
    onSizeChange,
    onToggleBold,
    onColorChange,
    onDuplicate,
    onRemove,
    colorBorderClass = 'border-black/10'
}) => {
    const [inputValue, setInputValue] = React.useState(String(fontSize));

    React.useEffect(() => {
        setInputValue(String(fontSize));
    }, [fontSize]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed) && parsed >= 10 && parsed <= 100) {
            onSizeChange(parsed);
        }
    };

    const handleInputBlur = () => {
        const parsed = parseInt(inputValue, 10);
        if (isNaN(parsed) || parsed < 10) {
            setInputValue('10');
            onSizeChange(10);
        } else if (parsed > 100) {
            setInputValue('100');
            onSizeChange(100);
        } else {
            setInputValue(String(parsed));
            onSizeChange(parsed);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <NodeToolbar
            isVisible={selected}
            position={Position.Top}
            className="flex items-center gap-1 bg-[#1e293b] p-1.5 rounded-lg border border-white/10 shadow-xl mb-2"
        >
            <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 border border-white/20 focus-within:border-sky-500 transition-colors">
                    <Type size={12} className="text-slate-400" />
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        className="w-6 h-7 bg-transparent text-slate-200 text-xs text-center focus:outline-none nodrag [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min={10}
                        max={100}
                        title="Mida de lletra"
                    />
                </div>
                <button
                    type="button"
                    onClick={onToggleBold}
                    className={`p-1.5 rounded transition-colors ${fontWeight === 'bold' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    title="Toggle Bold"
                >
                    <Bold size={14} />
                </button>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-white/10">
                {colors.map((c) => (
                    <button
                        type="button"
                        key={c}
                        onClick={() => onColorChange(c)}
                        className={`w-5 h-5 rounded-full border-2 transition ${currentColor === c ? 'border-white scale-110' : `${colorBorderClass} hover:scale-110`}`}
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
            </div>

            <div className="flex items-center gap-1 pl-2">
                <button
                    type="button"
                    onClick={onDuplicate}
                    className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    title="Duplicar"
                >
                    <Copy size={14} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 hover:bg-red-500/20 rounded text-slate-300 hover:text-red-400 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </NodeToolbar>
    );
});

AnnotationToolbar.displayName = 'AnnotationToolbar';
