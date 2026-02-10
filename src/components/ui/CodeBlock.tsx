import {Copy, Check} from 'lucide-react';
import React, {useState, useEffect} from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import {languageNames, type LanguageColors} from '../../utils/languages.ts';
import clsx from 'clsx'

interface CodeBlockProps {
    code: string;
    title?: string;
    language?: keyof typeof languageNames;
}


const languageColorsClass = {
    blue: "bg-blue-600/20 border-blue-300/60 text-blue-300",
    green: "bg-green-600/20 border-green-300/60 text-green-300",
    purple: "bg-purple-600/20 border-purple-300/60 text-purple-300",
    red: "bg-red-600/20 border-red-300/60 text-red-300",
} as const satisfies Record<LanguageColors, string>;


const CopyButton = ({title, handleCopy, copied, className}: {
    title?: string,
    handleCopy: () => void,
    copied: boolean,
    className?: string
}) =>
    <button
        onClick={handleCopy}
        className={clsx(`p-2  rounded-lg text-slate-400 hover:text-white hover:bg-white/10 hover:opacity-80 transition-all z-10`, !!title || 'top-3', className)}
        title="Copiar codi"
    >
        {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
    </button>;

const CodeBlock: React.FC<CodeBlockProps> = ({code, title, language = 'cpp'}) => {
    const [copied, setCopied] = useState(false);
    const codeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };


    return (
        <div
            className="flex flex-col rounded-2xl relative group bg-slate-900/70 border border-white/10 h-full overflow-hidden">

            {title ? (
                    <div
                        className="flex gap-2 rounded-t-2xl items-center justify-between bg-linear-to-r from-blue-800/20 to-slate-800/5 px-4 py-1.5 border-b border-white/10">
                        <span className="text-sm font-medium text-slate-300 font-mono">{title}</span>
                        <span
                            className={`font-mono opacity-80 hover:opacity-100 transition px-1 h-full content-center ml-auto  rounded-md border  ${languageColorsClass[languageNames[language].color]}`}>{languageNames[language].name}</span>

                        <CopyButton title={title}
                                    copied={copied} handleCopy={handleCopy} className={"py-1.5 opacity-60 text-slate-200!"}/>
                    </div>
                ) :

                <CopyButton
                    copied={copied} handleCopy={handleCopy}
                    className={`absolute right-3 p-2 opacity-30`}
                />
            }

            {/* Code Content */}
            <div className={`grow overflow-x-auto custom-scrollbar`}>

                <pre className="!bg-transparent h-full !m-0 font-mono text-md leading-relaxed">
                    {/* Prism posa p-4 al tag code, així que no posem cap padding */}
                    <code ref={codeRef} className={`language-${language}`}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
