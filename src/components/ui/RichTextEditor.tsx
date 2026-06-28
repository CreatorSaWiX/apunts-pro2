import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, Minus } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    editorRef?: (editor: any) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
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

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/20">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
                title="Negreta"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
                title="Cursiva"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                icon={Strikethrough}
                title="Ratllat"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon={Heading1}
                title="Títol Gran"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Títol Mitjà"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon={List}
                title="Llista de Punts"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon={ListOrdered}
                title="Llista Numèrica"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon={Quote}
                title="Cita"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                icon={Code}
                title="Bloc de Codi"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                isActive={false}
                icon={Minus}
                title="Línia Separadora"
            />
        </div>
    );
};

const RichTextEditor = ({ content, onChange, placeholder = 'Comença a escriure...', editorRef }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
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
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[300px] p-6',
            },
        },
    });

    useEffect(() => {
        if (editorRef && editor) {
            editorRef(editor);
        }
    }, [editor, editorRef]);

    return (
        <div className="w-full flex flex-col h-full bg-slate-900/30 rounded-2xl border border-white/10 overflow-hidden">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
                <EditorContent editor={editor} />
            </div>
            
            {/* Styles for the placeholder */}
            <style>{`
                .is-editor-empty:first-child::before {
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
