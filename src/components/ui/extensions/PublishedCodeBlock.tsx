import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import hljs from 'highlight.js/lib/core';
import DOMPurify from 'dompurify';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

interface PublishedCodeBlockProps {
    language: string;
    code: string;
    children?: React.ReactNode;
}

export const PublishedCodeBlock = ({ language, code }: PublishedCodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    
    let displayLanguage = language.replace('language-', '');
    if (!displayLanguage) displayLanguage = 'auto';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    let highlightedCode = code;
    try {
        if (displayLanguage && displayLanguage !== 'text' && displayLanguage !== 'auto' && hljs.getLanguage(displayLanguage)) {
            highlightedCode = hljs.highlight(code, { language: displayLanguage }).value;
        } else {
            const autoResult = hljs.highlightAuto(code);
            highlightedCode = autoResult.value;
            // Update display label to the detected language if confident
            if (autoResult.language) {
                displayLanguage = autoResult.language;
            } else {
                displayLanguage = 'TEXT';
            }
        }
    } catch (e) {
        // Fallback to raw code
    }

    return (
        <div className="group relative my-6 first:mt-0 last:mb-0">
            <div className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                
                {/* Floating Controls */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-200 z-10 select-none">
                    <div className="bg-black/50 backdrop-blur-md text-[11px] font-mono text-white/90 uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-white/10">
                        {displayLanguage.toUpperCase()}
                    </div>

                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition duration-200 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-black/50 backdrop-blur-md text-white/90 hover:bg-white/20 hover:text-white border border-white/10'}`}
                        title="Copy code"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                {/* Code Content */}
                <pre className="!m-0 !bg-transparent p-5 pt-12 custom-scrollbar overflow-x-auto text-[14px] leading-relaxed font-mono">
                    <code className={`language-${displayLanguage}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedCode) }} />
                </pre>
            </div>
        </div>
    );
};
