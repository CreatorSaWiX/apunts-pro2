import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { Copy, Check } from 'lucide-react';
import Spinner from '../../ui/Spinner';


interface CodeViewerProps {
    url: string;
    filename: string;
}

const getLanguageExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return [javascript({ jsx: true, typescript: ext.includes('ts') })];
        case 'cpp':
        case 'c':
        case 'h':
        case 'hpp':
            return [cpp()];
        case 'css':
            return [css()];
        case 'html':
            return [html()];
        case 'json':
            return [json()];
        default:
            return [];
    }
};

const CodeViewer = ({ url, filename }: CodeViewerProps) => {
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchCode = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch');
                const text = await response.text();
                if (isMounted) {
                    setCode(text);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching code:", err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchCode();
        return () => { isMounted = false; };
    }, [url]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="w-full h-64 bg-[#0d1117] rounded-xl flex items-center justify-center border border-white/10">
                <Spinner size="lg" variant="slate" glow={false} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-center text-sm font-medium">
                No s'ha pogut carregar el codi font de l'arxiu.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="ml-2 text-xs font-mono text-slate-400">{filename}</span>
                </div>
                <button type="button" 
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? 'Copiat' : 'Copiar'}
                </button>
            </div>
            <div className="max-h-[500px] overflow-auto custom-scrollbar text-sm">
                <CodeMirror
                    value={code}
                    theme={vscodeDark}
                    extensions={getLanguageExtension(filename)}
                    editable={false}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: false,
                        highlightActiveLine: false,
                        foldGutter: true
                    }}
                    style={{ fontSize: '13px', fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
                />
            </div>
        </div>
    );
};

export default CodeViewer;
