import { Copy, Check, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';

interface LanguageConfig {
    name: string;
    color: string;
    bg: string;
    border: string;
}

const LANGUAGES: Record<string, LanguageConfig> = {
    'cpp': { name: 'C++', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'c++': { name: 'C++', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'js': { name: 'JS', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    'javascript': { name: 'JS', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    'ts': { name: 'TS', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'typescript': { name: 'TS', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'css': { name: 'CSS', color: 'text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    'html': { name: 'HTML', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    'bash': { name: 'Terminal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    'sh': { name: 'Terminal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    'json': { name: 'JSON', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const getLanguageExtension = (langKey: string) => {
    switch (langKey) {
        case 'cpp':
        case 'c++': return cpp();
        case 'js':
        case 'javascript':
        case 'ts':
        case 'typescript': return javascript({ jsx: true, typescript: langKey.includes('ts') });
        case 'css': return css();
        case 'html': return html();
        case 'json': return json();
        default: return [];
    }
};

interface CodeBlockProps {
    code: string;
    title?: string;
    titleHref?: string;
    language?: string;
    className?: string;
    variant?: 'default' | 'minimal';
    showHeader?: boolean;
    headerActions?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    title,
    titleHref,
    language = 'text',
    className = '',
    variant = 'default',
    showHeader = true,
    headerActions,
}) => {
    const [copied, setCopied] = useState(false);
    const langKey = language.toLowerCase();
    const config = LANGUAGES[langKey] || { name: language, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isMinimal = variant === 'minimal';

    // Custom theme matching the approved mockup design
    const codeTheme = EditorView.theme({
        "&": {
            backgroundColor: "transparent !important",
            fontSize: "14px",
            lineHeight: "1.7",
        },
        ".cm-scroller": {
            padding: "16px 20px 16px 0",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            overflow: "auto",
            scrollbarWidth: "none",
        },
        ".cm-scroller::-webkit-scrollbar": {
            display: "none",
        },
        ".cm-gutters": {
            backgroundColor: "transparent !important",
            borderRight: "1px solid rgba(255,255,255,0.06) !important",
            paddingRight: "12px",
            marginRight: "16px",
            paddingLeft: "8px",
        },
        ".cm-lineNumbers .cm-gutterElement": {
            color: "rgba(148, 163, 184, 0.25)",
            minWidth: "2.5em",
            textAlign: "right",
            fontSize: "13px",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
        },
        ".cm-content": {
            padding: "0",
        },
        ".cm-line": {
            padding: "0 16px 0 0",
        },
        ".cm-activeLine": {
            backgroundColor: "transparent !important",
        },
        ".cm-activeLineGutter": {
            backgroundColor: "transparent !important",
        },
        ".cm-cursor, .cm-dropCursor": {
            display: "none !important",
        },
        ".cm-selectionBackground": {
            backgroundColor: "transparent !important",
        },
    });

    return (
        <div
            className={`relative group overflow-hidden not-prose ${isMinimal
                ? ''
                : 'border border-white/[0.07] rounded-2xl my-6'
                } ${className}`}
        >
            {/* Header: filename + language badge + copy */}
            {showHeader && (
                <div className="px-5 py-3 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {title && (
                            titleHref ? (
                                <a href={titleHref} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-slate-400 hover:text-sky-400 hover:underline transition-colors flex items-center gap-1.5" title="Obrir a una nova pestanya">
                                    {title}
                                    <ExternalLink size={13} className="opacity-70" />
                                </a>
                            ) : (
                                <span className="text-sm font-mono text-slate-400">{title}</span>
                            )
                        )}
                        <span className={`text-xs font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded border ${config.border}`}>
                            {config.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {headerActions}
                        <button
                            onClick={handleCopy}
                            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar codi"
                        >
                            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Code Content */}
            <div className={`overflow-hidden flex-1 ${isMinimal ? 'h-full' : ''}`}>
                <ReactCodeMirror
                    value={code}
                    readOnly={true}
                    editable={false}
                    theme={[vscodeDark, codeTheme]}
                    extensions={[getLanguageExtension(langKey)]}
                    className={`!bg-transparent ${isMinimal ? 'h-full' : ''}`}
                    basicSetup={{
                        lineNumbers: !isMinimal,
                        foldGutter: false,
                        highlightActiveLine: false,
                        highlightSelectionMatches: false,
                        syntaxHighlighting: true,
                        drawSelection: false,
                    }}
                />
            </div>
        </div>
    );
};

export default CodeBlock;

