import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { findParentNode } from '@tiptap/core';

interface TableGlobalResizerProps {
    editor: Editor;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const TableGlobalResizer: React.FC<TableGlobalResizerProps> = ({ editor, scrollContainerRef }) => {
    const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const tableNodeInfo = useRef<{ pos: number; node: any } | null>(null);
    const tableDomRef = useRef<HTMLElement | null>(null);
    const initialMouse = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const initialTableSize = useRef<{ width: number, height: number }>({ width: 0, height: 0 });
    const dragMode = useRef<'width' | 'both'>('both');
    const frameReq = useRef<number | null>(null);

    const updateRect = useCallback(() => {
        if (frameReq.current) return;
        frameReq.current = requestAnimationFrame(() => {
            frameReq.current = null;
            if (!editor || isDraggingRef.current) return;
            
            if (!editor.isActive('table')) {
                setRect(prev => prev ? null : prev);
                tableNodeInfo.current = null;
                tableDomRef.current = null;
                return;
            }

            const { state, view } = editor;
            const { selection } = state;
            const match = findParentNode((node) => node.type.name === 'table')(selection);

            if (!match) {
                setRect(prev => prev ? null : prev);
                tableNodeInfo.current = null;
                tableDomRef.current = null;
                return;
            }

            tableNodeInfo.current = { pos: match.pos, node: match.node };

            // For prosemirror-tables, nodeDOM usually returns the tableWrapper. We need the wrapper or table
            const domAtPos = view.nodeDOM(match.pos) as HTMLElement;
            let tableDom = domAtPos;
            if (tableDom && tableDom.classList.contains('tableWrapper')) {
                tableDom = tableDom.querySelector('table') as HTMLElement;
            }
            
            tableDomRef.current = tableDom;

            if (tableDom && tableDom.tagName === 'TABLE' && scrollContainerRef.current) {
                const tableRect = tableDom.getBoundingClientRect();
                const containerRect = scrollContainerRef.current.getBoundingClientRect();

                setRect(prev => {
                    const newRect = {
                        top: tableRect.top - containerRect.top + scrollContainerRef.current!.scrollTop,
                        left: tableRect.left - containerRect.left + scrollContainerRef.current!.scrollLeft,
                        width: tableRect.width,
                        height: tableRect.height,
                    };
                    
                    if (prev && Math.abs(prev.top - newRect.top) < 1 && 
                                Math.abs(prev.left - newRect.left) < 1 && 
                                Math.abs(prev.width - newRect.width) < 1 && 
                                Math.abs(prev.height - newRect.height) < 1) {
                        return prev;
                    }
                    return newRect;
                });
            }
        });
    }, [editor, scrollContainerRef]);

    useEffect(() => {
        if (!editor) return;
        
        editor.on('selectionUpdate', updateRect);
        editor.on('transaction', updateRect);
        window.addEventListener('resize', updateRect);
        
        return () => {
            editor.off('selectionUpdate', updateRect);
            editor.off('transaction', updateRect);
            window.removeEventListener('resize', updateRect);
            if (frameReq.current) {
                cancelAnimationFrame(frameReq.current);
            }
        };
    }, [editor, updateRect]);

    const onMouseDown = (e: React.MouseEvent, mode: 'width' | 'both') => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!tableNodeInfo.current || !tableDomRef.current) return;
        
        setIsDragging(true);
        isDraggingRef.current = true;
        dragMode.current = mode;
        initialMouse.current = { x: e.clientX, y: e.clientY };
        
        // Get current DOM size
        const tableRect = tableDomRef.current.getBoundingClientRect();
        initialTableSize.current = { width: tableRect.width, height: tableRect.height };
        
        // Lock width/height on DOM temporarily
        tableDomRef.current.style.setProperty('--custom-table-width', `${tableRect.width}px`);
        if (mode === 'both') {
            tableDomRef.current.style.setProperty('--custom-table-height', `${tableRect.height}px`);
        }

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!tableDomRef.current) return;
            
            const deltaX = moveEvent.clientX - initialMouse.current.x;
            const deltaY = moveEvent.clientY - initialMouse.current.y;
            
            const newWidth = Math.max(100, initialTableSize.current.width + deltaX);
            
            // Smoothly update DOM for 60fps
            tableDomRef.current.style.setProperty('--custom-table-width', `${newWidth}px`);
            
            if (dragMode.current === 'both') {
                const newHeight = Math.max(50, initialTableSize.current.height + deltaY);
                tableDomRef.current.style.setProperty('--custom-table-height', `${newHeight}px`);
                
                tableDomRef.current.parentElement!.style.setProperty('--custom-table-width', `${newWidth}px`);
                tableDomRef.current.parentElement!.style.setProperty('--custom-table-height', `${newHeight}px`);
                
                // Update resizer outline position
                setRect(prev => prev ? { ...prev, width: newWidth, height: newHeight } : null);
            } else {
                setRect(prev => prev ? { ...prev, width: newWidth } : null);
            }
        };

        const onMouseUp = () => {
            setIsDragging(false);
            isDraggingRef.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            
            if (tableDomRef.current && tableNodeInfo.current) {
                const finalWidth = tableDomRef.current.style.width;
                const finalHeight = tableDomRef.current.style.height;
                
                // Save to schema
                const { tr } = editor.state;
                const pos = tableNodeInfo.current.pos;
                const node = tableNodeInfo.current.node;
                
                tr.setNodeMarkup(pos, null, {
                    ...node.attrs,
                    width: finalWidth,
                    height: finalHeight || 'auto'
                });
                
                editor.view.dispatch(tr);
            }
            updateRect(); 
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    if (!rect) return null;

    return (
        <div 
            className="absolute pointer-events-none z-20"
            style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            }}
        >
            <div className={`absolute inset-0 border-2 border-primary/40 rounded-xl transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            
            <div 
                className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize pointer-events-auto group translate-x-1/2 flex items-center justify-center"
                onMouseDown={(e) => onMouseDown(e, 'width')}
            >
                <div className={`w-1.5 h-[calc(100%-16px)] bg-white border border-slate-300 rounded-full shadow-md transition-all ${isDragging && dragMode.current === 'width' ? 'opacity-100 bg-primary border-primary scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
            </div>
            
            <div 
                className="absolute right-0 bottom-0 w-6 h-6 cursor-nwse-resize pointer-events-auto translate-x-1/2 translate-y-1/2 group flex items-center justify-center"
                onMouseDown={(e) => onMouseDown(e, 'both')}
            >
                <div className={`w-3 h-3 bg-white border-2 border-slate-300 rounded-sm shadow-md transition-colors ${isDragging && dragMode.current === 'both' ? 'border-primary bg-primary/20 scale-125' : 'group-hover:border-primary'}`} />
            </div>
        </div>
    );
};

export default TableGlobalResizer;
