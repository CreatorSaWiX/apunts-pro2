import { Copy, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface CodeBlockProps {
    code: string;
    title?: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, title, language = 'cpp' }) => {
    const [copied, setCopied] = useState(false);
    const codeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-[#1e1e1e] my-6 shadow-2xl relative group">

            {title && (
                <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 border-b border-white/5">
                    <span className="text-sm font-medium text-slate-300 font-mono">{title}</span>
                </div>
            )}

            <button
                onClick={handleCopy}
                className={`absolute right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 z-10 ${title ? 'top-1.5' : 'top-3'}`}
                title="Copiar codi"
            >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto custom-scrollbar">
                <pre className="!bg-transparent !m-0 !p-0 font-mono text-sm leading-relaxed">
                    <code ref={codeRef} className={`language-${language}`}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
