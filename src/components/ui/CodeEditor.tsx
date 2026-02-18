import { cpp } from '@codemirror/lang-cpp';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ReactCodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { Loader2 } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';

interface CodeEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    height?: string;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    variant?: 'default' | 'minimal';
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(({
    value = '',
    onChange,
    height = '100%',
    placeholder = 'Escriu el teu codi C++ aquí...',
    readOnly = false,
    className = '',
    variant = 'default'
}, ref) => {
    // Lazy loading to improve performance and avoid SSR issues
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isMinimal = variant === 'minimal';

    // Theme extension to override background color for transparent/glassmorphism support
    const transparentTheme = EditorView.theme({
        "&": {
            backgroundColor: "transparent !important",
        },
        ".cm-gutters": {
            backgroundColor: "transparent !important",
            borderRight: "none !important",
        }
    });

    if (!mounted) {
        return (
            <div className={`flex items-center justify-center bg-[#1e1e1e] text-slate-500 ${className}`} style={{ height }}>
                <Loader2 className="animate-spin" size={20} />
            </div>
        );
    }

    return (
        <div ref={ref} className={`overflow-hidden bg-[#1e1e1e] ${isMinimal
                ? '!bg-transparent'
                : 'rounded-xl border border-white/5 shadow-lg shadow-black/20'
            } ${className}`}>
            <ReactCodeMirror
                value={value}
                height={height}
                theme={[vscodeDark, isMinimal ? transparentTheme : []]}
                extensions={[cpp()]}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`text-sm font-mono leading-relaxed ${isMinimal ? '!bg-transparent' : ''}`}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightSpecialChars: true,
                    history: true,
                    foldGutter: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    syntaxHighlighting: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: true,
                    highlightActiveLine: true,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    defaultKeymap: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                }}
            />
        </div>
    );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
