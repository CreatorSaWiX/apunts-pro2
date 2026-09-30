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
import markdown from 'highlight.js/lib/languages/markdown';
import yaml from 'highlight.js/lib/languages/yaml';

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
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

interface PublishedCodeBlockProps {
    language: string;
    code: string;
    children?: React.ReactNode;
}

const unescapeHtml = (str: string): string => {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'");
};

/**
 * Enhances highlighted HTML with:
 * 1. Recognition of commented code lines (e.g. "// T top2() {" or "// }"), preserving syntax colors.
 * 2. Highlighting of formal contract specification tags (Pre:, Post:, Cost:, Inv:, etc.).
 * 3. Consistent styling for common generic template types (T, Stack, etc.).
 */
const enhanceHighlightedHtml = (html: string, lang: string): string => {
    return html.replace(/<span class="hljs-comment">([\s\S]*?)<\/span>/g, (_match, content) => {
        const isCStyle = lang === 'cpp' || lang === 'c' || lang === 'java' || lang === 'typescript' || lang === 'javascript';
        const isPyStyle = lang === 'python' || lang === 'bash' || lang === 'yaml';

        if (isCStyle) {
            // Check if comment line is actually commented code
            const codeMatch = content.match(
                /^(\/\/\s*)([A-Za-z_][A-Za-z0-9_<>*&:\s]*\s+[A-Za-z0-9_]+\s*\(.*|\s*[\{\}]\s*;?|\s*(?:return|if|for|while|template|using|typedef|class|struct)\b.*)$/
            );
            if (codeMatch) {
                const prefix = codeMatch[1];
                const rawCodePart = unescapeHtml(codeMatch[2]);
                try {
                    let codeHl = hljs.highlight(rawCodePart, { language: lang }).value;
                    // Highlight generic template types like T before function titles
                    codeHl = codeHl.replace(
                        /\b([A-Z][A-Za-z0-9_]*)\b(?=\s+<span class="hljs-title")/g,
                        '<span class="hljs-type font-semibold">$1</span>'
                    );
                    return `<span class="hljs-comment opacity-60 font-mono select-none">${prefix}</span>${codeHl}`;
                } catch {
                    // Fallthrough to standard comment formatting
                }
            }
        } else if (isPyStyle) {
            const pyCodeMatch = content.match(/^([#]\s*)(def\s+.*|class\s+.*|return\b.*|if\b.*)$/);
            if (pyCodeMatch) {
                const prefix = pyCodeMatch[1];
                const rawCodePart = unescapeHtml(pyCodeMatch[2]);
                try {
                    const codeHl = hljs.highlight(rawCodePart, { language: lang }).value;
                    return `<span class="hljs-comment opacity-60 font-mono select-none">${prefix}</span>${codeHl}`;
                } catch {
                    // Fallthrough
                }
            }
        }

        // Enhance specification contract tags and standard doc tags inside comments
        let enriched = content
            .replace(
                /\b(Pre|Precondició|Precondition)(\s*:)/gi,
                '<span class="hljs-doctag font-bold text-emerald-400 not-italic">$1</span><span class="text-emerald-400 font-bold">$2</span>'
            )
            .replace(
                /\b(Post|Postcondició|Postcondition)(\s*:)/gi,
                '<span class="hljs-doctag font-bold text-sky-400 not-italic">$1</span><span class="text-sky-400 font-bold">$2</span>'
            )
            .replace(
                /\b(Cost|Complexitat|Complexity)(\s*:)/gi,
                '<span class="hljs-doctag font-bold text-amber-400 not-italic">$1</span><span class="text-amber-400 font-bold">$2</span>'
            )
            .replace(
                /\b(Inv|Invariant)(\s*:)/gi,
                '<span class="hljs-doctag font-bold text-purple-400 not-italic">$1</span><span class="text-purple-400 font-bold">$2</span>'
            )
            .replace(
                /\b(Entrada|Sortida|Input|Output)(\s*:)/gi,
                '<span class="hljs-doctag font-bold text-indigo-400 not-italic">$1</span><span class="text-indigo-400 font-bold">$2</span>'
            );

        return `<span class="hljs-comment">${enriched}</span>`;
    });
};

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
        highlightedCode = enhanceHighlightedHtml(highlightedCode, displayLanguage);
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
                <pre 
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    className="!m-0 !bg-transparent p-5 pt-12 custom-scrollbar overflow-x-auto text-[14px] leading-relaxed font-mono"
                >
                    <code 
                        className={`language-${displayLanguage}`} 
                        dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(highlightedCode, {
                                ADD_TAGS: ['span'],
                                ADD_ATTR: ['class']
                            }) 
                        }} 
                    />
                </pre>
            </div>
        </div>
    );
};
