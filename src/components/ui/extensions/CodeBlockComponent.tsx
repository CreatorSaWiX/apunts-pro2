import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CodeBlockComponent = ({ node, updateAttributes, extension }: any) => {
    const currentLanguage = node.attrs.language || 'auto';
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { value: 'auto', label: 'AUTO' },
        { value: 'text', label: 'TEXT' },
        { value: 'typescript', label: 'TS' },
        { value: 'javascript', label: 'JS' },
        { value: 'python', label: 'PY' },
        { value: 'java', label: 'JAVA' },
        { value: 'cpp', label: 'C++' },
        { value: 'c', label: 'C' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'sql', label: 'SQL' },
        { value: 'json', label: 'JSON' },
        { value: 'bash', label: 'BASH' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(node.textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLanguageSelect = (langValue: string) => {
        updateAttributes({ language: langValue === 'auto' ? null : langValue });
        setIsOpen(false);
    };

    const currentLabel = languages.find(l => l.value === currentLanguage)?.label || 'AUTO';

    return (
        <NodeViewWrapper className="group relative my-6 first:mt-0 last:mb-0">
            {/* Floating Controls */}
            <div 
                contentEditable={false} 
                className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 transition-opacity duration-200 z-50 select-none ${isOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
            >
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-[11px] font-mono text-white/90 tracking-wider px-2.5 py-1.5 rounded-lg border border-white/10 outline-none hover:bg-white/10 transition-colors h-7"
                        title="Change language"
                        aria-label="Change language">
                        <span>{currentLabel}</span>
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute right-0 top-full mt-2 w-28 bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-[60] py-1"
                            >
                                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.value}
                                            type="button"
                                            onClick={() => handleLanguageSelect(lang.value)}
                                            className={`w-full text-left px-3 py-1.5 text-[11px] font-mono transition-colors flex items-center justify-between ${currentLanguage === lang.value ? 'bg-primary/20 text-primary font-medium' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            {lang.label}
                                            {currentLanguage === lang.value && <Check size={12} className="text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button 
                    type="button"
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition duration-200 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-black/50 backdrop-blur-md text-white/90 hover:bg-white/20 hover:text-white border border-white/10'}`}
                    title="Copy code"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-sm">
                <pre className="!m-0 !bg-transparent p-5 pt-12 custom-scrollbar overflow-x-auto text-[14px] leading-relaxed font-mono">
                    <NodeViewContent as={"code" as any} className={`language-${currentLanguage}`} />
                </pre>
            </div>
        </NodeViewWrapper>
    );
};
