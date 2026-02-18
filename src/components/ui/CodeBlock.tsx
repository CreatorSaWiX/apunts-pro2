import { Copy, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML

interface LanguageConfig {
    name: string;
    color: string;
}

const LANGUAGES: Record<string, LanguageConfig> = {
    'cpp': { name: 'C++', color: 'text-blue-400' },
    'c++': { name: 'C++', color: 'text-blue-400' },
    'js': { name: 'JavaScript', color: 'text-yellow-400' },
    'javascript': { name: 'JavaScript', color: 'text-yellow-400' },
    'ts': { name: 'TypeScript', color: 'text-blue-400' },
    'typescript': { name: 'TypeScript', color: 'text-blue-400' },
    'css': { name: 'CSS', color: 'text-sky-300' },
    'html': { name: 'HTML', color: 'text-orange-400' },
    'bash': { name: 'Terminal', color: 'text-emerald-400' },
    'sh': { name: 'Terminal', color: 'text-emerald-400' },
    'json': { name: 'JSON', color: 'text-amber-400' },
};

interface CodeBlockProps {
    code: string;
    title?: string;
    language?: string;
    className?: string; // Allow custom classes
    variant?: 'default' | 'minimal'; // Allow styling variants
    showHeader?: boolean; // Toggle header visibility
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    title,
    language = 'text',
    className = '',
    variant = 'default',
    showHeader = true
}) => {
    const [copied, setCopied] = useState(false);
    const codeRef = React.useRef<HTMLElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Normalize language
    const langKey = language.toLowerCase();
    const config = LANGUAGES[langKey] || { name: language, color: 'text-slate-400' };
    const prismLanguage = langKey === 'c++' ? 'cpp' : langKey;

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, prismLanguage]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isMinimal = variant === 'minimal';

    return (
        <div
            ref={containerRef}
            className={`relative group overflow-hidden not-prose ${isMinimal
                ? ''
                : 'bg-slate-900/50 border border-white/10 rounded-xl my-6 backdrop-blur-sm'
                } ${className}`}
        >
            {/* Header: Title + Language + Copy */}
            {showHeader && (
                <div className={`flex items-center justify-between px-4 py-3 ${isMinimal ? '' : 'bg-white/5 border-b border-white/5'
                    }`}>
                    <div className="flex items-center gap-3">
                        {title && (
                            <span className="text-xs font-medium text-slate-400 font-mono">
                                {title}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold ${config.color} uppercase tracking-wider opacity-60`}>
                            {config.name}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                            title="Copiar codi"
                        >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Code Content */}
            <div className={`overflow-x-auto custom-scrollbar ${isMinimal ? 'h-full' : ''}`}>
                <pre className={`!bg-transparent !m-0 !p-4 font-mono text-[13px] leading-relaxed ${isMinimal ? 'h-full' : ''}`}>
                    <code ref={codeRef} className={`language-${prismLanguage}`}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
