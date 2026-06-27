import React, { useRef, useEffect, useState } from 'react';
import { NodeToolbar, Position, NodeResizeControl, type NodeProps } from '@xyflow/react';
import { useRoadmap, type SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { Trash2, Bold, Copy, Type } from 'lucide-react';

const COLORS = ['#ffffff', '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#22c55e'];

const TextNode = ({ id, data, selected }: NodeProps<import('@xyflow/react').Node<SubjectNodeData>>) => {
    const { updateNodeData, duplicateAnnotation, removeNode } = useRoadmap();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(data.text || '');

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [localText, data.fontSize, data.fontWeight]);

    // Keep localText in sync if changed from outside
    useEffect(() => {
        if (!isEditing) {
            setLocalText(data.text || '');
        }
    }, [data.text, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalText(e.target.value);
        updateNodeData(id, { text: e.target.value });
    };

    const toggleBold = () => {
        updateNodeData(id, { fontWeight: data.fontWeight === 'bold' ? 'normal' : 'bold' });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newSize = parseInt(e.target.value);
        if (isNaN(newSize)) newSize = 16;
        updateNodeData(id, { fontSize: newSize });
    };

    return (
        <div 
            className={`relative group w-full h-full ${selected ? 'ring-1 ring-white/20 rounded bg-white/5' : ''} p-2 transition-colors`}
            onDoubleClick={() => setIsEditing(true)}
        >
            {selected && (
                <NodeResizeControl minWidth={100} minHeight={50} className="bg-transparent border-none">
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 text-white/30 hover:text-white/70 cursor-se-resize bg-[#1e293b] rounded-tl-md flex items-center justify-center pointer-events-auto">
                        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="21 15 21 21 15 21"></polyline>
                        </svg>
                    </div>
                </NodeResizeControl>
            )}

            <NodeToolbar isVisible={selected} position={Position.Top} className="flex items-center gap-1 bg-[#1e293b] p-1.5 rounded-lg border border-white/10 shadow-xl mb-2">
                <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                    <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 border border-white/20 focus-within:border-sky-500 transition-colors">
                        <Type size={12} className="text-slate-400" />
                        <input 
                            type="number" 
                            value={data.fontSize || 16} 
                            onChange={handleSizeChange} 
                            className="w-6 h-7 bg-transparent text-slate-200 text-xs text-center focus:outline-none nodrag [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={10} max={100}
                            title="Mida de lletra"
                        />
                    </div>
                    <button onClick={toggleBold} className={`p-1.5 rounded transition-colors ${data.fontWeight === 'bold' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300'}`} title="Toggle Bold"><Bold size={14} /></button>
                </div>
                <div className="flex items-center gap-1 px-2 border-r border-white/10">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => updateNodeData(id, { color: c })}
                            className={`w-5 h-5 rounded-full border-2 transition-all ${data.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-1 pl-2">
                    <button onClick={() => duplicateAnnotation(id)} className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors" title="Duplicar"><Copy size={14} /></button>
                    <button onClick={() => removeNode(id)} className="p-1.5 hover:bg-red-500/20 rounded text-slate-300 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                </div>
            </NodeToolbar>

            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={handleChange}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    placeholder="Escriu aquí..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-white/20 nodrag"
                    style={{
                        color: data.color || '#ffffff',
                        fontSize: `${data.fontSize || 16}px`,
                        fontWeight: data.fontWeight || 'normal'
                    }}
                />
            ) : (
                <div 
                    className="w-full h-full bg-transparent overflow-hidden whitespace-pre-wrap break-words cursor-grab active:cursor-grabbing"
                    style={{
                        color: data.color || '#ffffff',
                        fontSize: `${data.fontSize || 16}px`,
                        fontWeight: data.fontWeight || 'normal',
                        minHeight: `${(data.fontSize || 16) * 1.5}px`
                    }}
                >
                    {data.text || 'Escriu aquí...'}
                </div>
            )}
        </div>
    );
};

export default TextNode;
