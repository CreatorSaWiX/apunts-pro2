import React from 'react';
import { NodeResizeControl, type NodeProps, type Node } from '@xyflow/react';
import type { SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { useAnnotationNode } from './useAnnotationNode';
import { AnnotationToolbar } from './AnnotationToolbar';

const POSTIT_COLORS = ['#fef08a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#e9d5ff', '#fed7aa']; // Pastel colors for post-its

const PostItNode: React.FC<NodeProps<Node<SubjectNodeData>>> = ({ id, data, selected }) => {
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
                            <polyline points="21 15 21 21 15 21" />
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

            <AnnotationToolbar
                selected={Boolean(selected)}
                fontSize={currentFontSize}
                fontWeight={data.fontWeight}
                currentColor={data.color || '#fef08a'}
                colors={POSTIT_COLORS}
                onSizeChange={handleSizeChange}
                onToggleBold={handleToggleBold}
                onColorChange={handleColorChange}
                onDuplicate={handleDuplicate}
                onRemove={handleRemove}
                colorBorderClass="border-black/10"
            />

            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    autoFocus
                    placeholder="Escriu la teva nota..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-black/30 nodrag text-slate-800"
                    style={{
                        fontSize: `${currentFontSize}px`,
                        fontWeight: data.fontWeight || 'normal'
                    }}
                />
            ) : (
                <div 
                    className="w-full h-full bg-transparent overflow-hidden whitespace-pre-wrap break-words cursor-grab active:cursor-grabbing text-slate-800"
                    style={{
                        fontSize: `${currentFontSize}px`,
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

export default React.memo(PostItNode);
