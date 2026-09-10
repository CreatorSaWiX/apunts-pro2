import React from 'react';
import { NodeResizeControl, type NodeProps, type Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { useAnnotationNode } from './useAnnotationNode';
import { AnnotationToolbar } from './AnnotationToolbar';

const TEXT_COLORS = ['#ffffff', '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#22c55e'];

const TextNode: React.FC<NodeProps<Node<SubjectNodeData>>> = ({ id, data, selected }) => {
    const {
        textareaRef,
        isEditing,
        setIsEditing,
        localText,
        handleTextChange,
        handleBlur,
        handleToggleBold,
        handleSizeChange,
        handleColorChange,
        handleDuplicate,
        handleRemove,
        currentFontSize
    } = useAnnotationNode({ id, data, defaultFontSize: 16 });

    return (
        <div 
            className={`relative group w-full h-full ${selected ? 'ring-1 ring-white/20 rounded bg-white/5' : ''} p-2 transition-colors`}
            onDoubleClick={() => setIsEditing(true)}
        >
            {selected && (
                <NodeResizeControl minWidth={100} minHeight={50} className="bg-transparent border-none">
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 text-white/30 hover:text-white/70 cursor-se-resize bg-[#1e293b] rounded-tl-md flex items-center justify-center pointer-events-auto">
                        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="21 15 21 21 15 21" />
                        </svg>
                    </div>
                </NodeResizeControl>
            )}

            <AnnotationToolbar
                selected={Boolean(selected)}
                fontSize={currentFontSize}
                fontWeight={data.fontWeight}
                currentColor={data.color || '#ffffff'}
                colors={TEXT_COLORS}
                onSizeChange={handleSizeChange}
                onToggleBold={handleToggleBold}
                onColorChange={handleColorChange}
                onDuplicate={handleDuplicate}
                onRemove={handleRemove}
                colorBorderClass="border-transparent"
            />

            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    autoFocus
                    placeholder="Escriu aquí..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-white/20 nodrag"
                    style={{
                        color: data.color || '#ffffff',
                        fontSize: `${currentFontSize}px`,
                        fontWeight: data.fontWeight || 'normal'
                    }}
                />
            ) : (
                <div 
                    className="w-full h-full bg-transparent overflow-hidden whitespace-pre-wrap break-words cursor-grab active:cursor-grabbing"
                    style={{
                        color: data.color || '#ffffff',
                        fontSize: `${currentFontSize}px`,
                        fontWeight: data.fontWeight || 'normal',
                        minHeight: `${currentFontSize * 1.5}px`
                    }}
                >
                    {data.text || 'Escriu aquí...'}
                </div>
            )}
        </div>
    );
};

export default React.memo(TextNode);
