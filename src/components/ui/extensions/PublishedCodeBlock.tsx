import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface PublishedCodeBlockProps {
    language: string;
    code: string;
    children?: React.ReactNode;
}

export const PublishedCodeBlock = ({ language, code, children }: PublishedCodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    
    const displayLanguage = language.replace('language-', '') || 'text';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative my-6 first:mt-0 last:mb-0">
            <div className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                
                {/* Floating Controls */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-200 z-10 select-none">
                    <div className="bg-black/50 backdrop-blur-md text-[11px] font-mono text-white/90 uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-white/10">
                        {displayLanguage}
                    </div>

                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-black/50 backdrop-blur-md text-white/90 hover:bg-white/20 hover:text-white border border-white/10'}`}
                        title="Copy code"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                {/* Code Content */}
                <pre className="!m-0 !bg-transparent p-5 pt-12 custom-scrollbar overflow-x-auto text-[14px] leading-relaxed font-mono">
                    {children}
                </pre>
            </div>
        </div>
    );
};
