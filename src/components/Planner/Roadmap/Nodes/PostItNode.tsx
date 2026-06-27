import React, { useRef, useEffect, useState } from 'react';
import { NodeToolbar, Position, NodeResizeControl, type NodeProps } from '@xyflow/react';
import { useRoadmap, type SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { Trash2, Bold, Copy, Type } from 'lucide-react';

const COLORS = ['#fef08a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#e9d5ff', '#fed7aa']; // Pastel colors for post-its


const PostItNode = ({ id, data, selected }: NodeProps<import('@xyflow/react').Node<SubjectNodeData>>) => {
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

    // For post-its, data.color is the background color, we need a separate property for text color,
    // but since we only have one color property in SubjectNodeData currently, let's use data.color for BG 
    // and just use dark text, OR we can add a second property. Let's stick to simple pastel background and dark text.

    return (
        <div 
            className={`relative group w-full h-full p-4 shadow-xl transition-shadow ${selected ? 'ring-2 ring-white/50 shadow-2xl' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
            style={{ 
                backgroundColor: data.color || '#fef08a',
                borderBottomRightRadius: '20px 15px', // Post-it effect
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
            }}
        >
            {selected && (
                <NodeResizeControl minWidth={150} minHeight={100} className="bg-transparent border-none z-50">
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 text-black/20 hover:text-black/50 cursor-se-resize flex items-center justify-center pointer-events-auto">
                        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="21 15 21 21 15 21"></polyline>
                        </svg>
                    </div>
                </NodeResizeControl>
            )}

            {/* Folded corner effect */}
            <div 
                className="absolute bottom-0 right-0 w-[15px] h-[15px] shadow-sm rounded-tl-sm pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 50%)',
                }}
            />

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
                            className={`w-5 h-5 rounded-full border-2 transition-all ${data.color === c ? 'border-white scale-110' : 'border-black/10 hover:scale-110'}`}
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
                    placeholder="Escriu la teva nota..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-black/30 nodrag text-slate-800"
                    style={{
                        fontSize: `${data.fontSize || 16}px`,
                        fontWeight: data.fontWeight || 'normal'
                    }}
                />
            ) : (
                <div 
                    className="w-full h-full bg-transparent overflow-hidden whitespace-pre-wrap break-words cursor-grab active:cursor-grabbing text-slate-800"
                    style={{
                        fontSize: `${data.fontSize || 16}px`,
                        fontWeight: data.fontWeight || 'normal',
                        minHeight: '100px'
                    }}
                >
                    {data.text || 'Escriu la teva nota...'}
                </div>
            )}
        </div>
    );
};

export default PostItNode;
