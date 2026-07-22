import { useEditor, EditorContent } from '@tiptap/react';
import { useShortcut } from '../../hooks/useShortcut';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CustomTable } from './extensions/CustomTable';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { LineHeight } from './extensions/LineHeight';
import TableGlobalResizer from './TableGlobalResizer';
import { CustomCodeBlock } from './extensions/CustomCodeBlock';
import { createLowlight } from 'lowlight';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import c from 'highlight.js/lib/languages/c';

const lowlight = createLowlight({ cpp, java, python, javascript, typescript, sql, xml, html: xml, css, bash, json, c });

import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
    Underline as UnderlineIcon, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, CheckSquare, Table as TableIcon,
    ChevronDown, Type, GripHorizontal, Columns, Rows, Trash2
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    editorRef?: (editor: any) => void;
}

const ToolbarButton = ({ onClick, isActive, disabled = false, icon: Icon, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white hover:bg-white/10'} disabled:opacity-30`}
        title={title}
    >
        <Icon size={16} />
    </button>
);

const EditorDropdown = ({ icon: Icon, label, children, title, isActive = false }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 flex items-center gap-1 rounded-lg transition-colors ${isOpen || isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                title={title}
            >
                {Icon && <Icon size={16} />}
                {label && <span className="text-sm font-medium">{label}</span>}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                    <div onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

const DropdownItem = ({ onClick, isActive, icon: Icon, label }: any) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm transition-colors ${isActive ? 'bg-primary/20 text-primary font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
    >
        {Icon && <Icon size={16} />}
        {label}
    </button>
);

const MenuBar = ({ editor }: { editor: any }) => {
    const { t } = useTranslation();
    const { shortcuts } = useSettings();
    const [, forceUpdate] = useState({});

    useEffect(() => {
        if (!editor) return;
        const update = () => forceUpdate({});
        editor.on('transaction', update);
        return () => {
            editor.off('transaction', update);
        };
    }, [editor]);

    const isMac = useRef(navigator.userAgent.toLowerCase().includes('mac')).current;

    const formatShortcut = useCallback((actionName: string) => {
        const shortcut = shortcuts?.[actionName];
        if (!shortcut) return '';
        const metaStr = shortcut.meta ? (isMac ? '⌘' : 'Ctrl+') : '';
        const key = shortcut.key.toUpperCase();
        return ` (${metaStr}${key})`;
    }, [shortcuts, isMac]);

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/20 shrink-0">
            {/* TEXT FORMAT */}
            <EditorDropdown icon={Type} title={t('editor.typography', 'Tipografia')} isActive={editor.isActive('heading')}>
                <DropdownItem onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} label={t('editor.normalText', 'Text Normal')} />
                <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} label={t('editor.heading1', 'Títol Gran')} />
                <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} label={t('editor.heading2', 'Títol Mitjà')} />
                <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} label={t('editor.heading3', 'Títol Petit')} />
            </EditorDropdown>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* STYLES */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title={t('editor.bold', 'Negreta') + formatShortcut('editorBold')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title={t('editor.italic', 'Cursiva') + formatShortcut('editorItalic')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title={t('editor.underline', 'Subratllat') + formatShortcut('editorUnderline')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title={t('editor.strikethrough', 'Ratllat') + formatShortcut('editorStrikethrough')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} icon={SubscriptIcon} title={t('editor.subscript', 'Subíndex')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} icon={SuperscriptIcon} title={t('editor.superscript', 'Superíndex')} />

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* ALIGNMENT & SPACING */}
            <EditorDropdown icon={AlignLeft} title={t('editor.alignment', 'Alineació')} isActive={editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' }) || editor.isActive({ textAlign: 'justify' })}>
                <DropdownItem onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} label={t('editor.alignLeft', 'Alinear Esquerra') + formatShortcut('editorAlignLeft')} />
                <DropdownItem onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} label={t('editor.alignCenter', 'Alinear Centre') + formatShortcut('editorAlignCenter')} />
                <DropdownItem onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} label={t('editor.alignRight', 'Alinear Dreta') + formatShortcut('editorAlignRight')} />
                <DropdownItem onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} label={t('editor.alignJustify', 'Justificar') + formatShortcut('editorAlignJustify')} />
            </EditorDropdown>

            <EditorDropdown icon={GripHorizontal} title={t('editor.lineSpacing', 'Espaiat de línia')} isActive={false}>
                <DropdownItem onClick={() => editor.chain().focus().setLineHeight('1').run()} isActive={editor.isActive({ lineHeight: '1' })} label={t('editor.spacingSingle', 'Senzill (1.0)')} />
                <DropdownItem onClick={() => editor.chain().focus().setLineHeight('1.15').run()} isActive={editor.isActive({ lineHeight: '1.15' })} label={t('editor.spacingNormal', 'Normal (1.15)')} />
                <DropdownItem onClick={() => editor.chain().focus().setLineHeight('1.5').run()} isActive={editor.isActive({ lineHeight: '1.5' })} label={t('editor.spacingRelaxed', 'Relaxat (1.5)')} />
                <DropdownItem onClick={() => editor.chain().focus().setLineHeight('2').run()} isActive={editor.isActive({ lineHeight: '2' })} label={t('editor.spacingDouble', 'Doble (2.0)')} />
            </EditorDropdown>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* LISTS */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title={t('editor.bulletList', 'Llista de Punts') + formatShortcut('editorListBullet')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title={t('editor.orderedList', 'Llista Numèrica') + formatShortcut('editorListOrdered')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={CheckSquare} title={t('editor.taskList', 'Tasques') + formatShortcut('editorTaskList')} />

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* INSERT */}
            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title={t('editor.link', 'Enllaç') + formatShortcut('editorLink')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title={t('editor.blockquote', 'Cita')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title={t('editor.codeBlock', 'Bloc de Codi')} />


            <ToolbarButton 
                onClick={() => {
                    if (!editor.isActive('table')) {
                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    }
                }} 
                isActive={editor.isActive('table')} 
                icon={TableIcon} 
                title={t('editor.insertTable', 'Inserir Taula') + formatShortcut('editorTable')} 
            />

            <div 
                className={`flex items-center overflow-hidden origin-left transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    editor.isActive('table') ? 'max-w-[500px] opacity-100 scale-100 ml-1' : 'max-w-0 opacity-0 scale-95 ml-0'
                }`}
            >
                <div className="flex items-center gap-1 w-max">
                    <div className="w-px h-6 bg-primary/20 mx-1" />
                    <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()} isActive={false} icon={Rows} title={t('editor.addRowBefore', 'Fila a Dalt')} />
                    <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} isActive={false} icon={Rows} title={t('editor.addRowAfter', 'Fila a Baix')} />
                    <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} isActive={false} icon={Trash2} title={t('editor.deleteRow', 'Eliminar Fila')} />
                    
                    <div className="w-px h-6 bg-primary/20 mx-1" />
                    
                    <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()} isActive={false} icon={Columns} title={t('editor.addColumnBefore', 'Columna a l\'Esquerra')} />
                    <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} isActive={false} icon={Columns} title={t('editor.addColumnAfter', 'Columna a la Dreta')} />
                    <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} isActive={false} icon={Trash2} title={t('editor.deleteColumn', 'Eliminar Columna')} />
                    
                    <div className="w-px h-6 bg-primary/20 mx-1" />
                    
                    <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} isActive={false} icon={Trash2} title={t('editor.deleteTable', 'Eliminar Taula Sencera')} />
                </div>
            </div>

            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={Minus} title={t('editor.horizontalRule', 'Línia Separadora')} />
        </div>
    );
};

const RichTextEditor = ({ content, onChange, placeholder = 'Comença a escriure...', editorRef }: RichTextEditorProps) => {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: { levels: [1, 2, 3] }
            }),
            Underline,
            Subscript,
            Superscript,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            TaskList,
            TaskItem.configure({ nested: true }),
            CustomTable.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            LineHeight,
            CustomCodeBlock.configure({ lowlight }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-h-[400px] object-contain my-4',
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            updateTimeoutRef.current = setTimeout(() => {
                if (!editor.isDestroyed) {
                    onChange(editor.getHTML());
                }
            }, 300);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[300px] p-6 editor-content-area',
            },
        },
    });

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    useShortcut('editorBold', () => editor?.chain().focus().toggleBold().run());
    useShortcut('editorItalic', () => editor?.chain().focus().toggleItalic().run());
    useShortcut('editorUnderline', () => editor?.chain().focus().toggleUnderline().run());
    useShortcut('editorStrikethrough', () => editor?.chain().focus().toggleStrike().run());
    useShortcut('editorLink', setLink);
    useShortcut('editorAlignLeft', () => editor?.chain().focus().setTextAlign('left').run());
    useShortcut('editorAlignCenter', () => editor?.chain().focus().setTextAlign('center').run());
    useShortcut('editorAlignRight', () => editor?.chain().focus().setTextAlign('right').run());
    useShortcut('editorAlignJustify', () => editor?.chain().focus().setTextAlign('justify').run());
    useShortcut('editorListBullet', () => editor?.chain().focus().toggleBulletList().run());
    useShortcut('editorListOrdered', () => editor?.chain().focus().toggleOrderedList().run());
    useShortcut('editorTaskList', () => editor?.chain().focus().toggleTaskList().run());
    useShortcut('editorTable', () => {
        if (!editor?.isActive('table')) {
            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }
    });

    useEffect(() => {
        if (editorRef && editor) {
            editorRef(editor);
        }
        return () => {
            if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
        };
    }, [editor, editorRef]);

    return (
        <div className="w-full flex flex-col h-full bg-slate-900/30 rounded-2xl border border-white/10 overflow-hidden relative">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative" ref={scrollContainerRef}>
                {editor && <TableGlobalResizer editor={editor} scrollContainerRef={scrollContainerRef} />}

                <EditorContent editor={editor} />
            </div>

            <style>{`
                p.is-editor-empty:first-child::before,
                h1.is-editor-empty:first-child::before,
                h2.is-editor-empty:first-child::before,
                h3.is-editor-empty:first-child::before {
                    color: #475569;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
